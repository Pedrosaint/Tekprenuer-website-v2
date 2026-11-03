/**
 * Build-time SEO for a client-rendered app.
 *
 * - Injects the home route's <head> tags into index.html (dev and build).
 * - After the build, writes a copy of index.html per route (dist/about/index.html, ...) with that
 *   route's own title, description, canonical, Open Graph/Twitter tags and JSON-LD, so crawlers and
 *   link-preview scrapers that do not run JavaScript still get correct metadata.
 * - Prerenders every route to static HTML (a nested SSR build of src/entry-server.tsx), so content paints
 *   without waiting for JavaScript and crawlers see the real page. The browser bundle then takes over.
 * - Emits sitemap.xml, robots.txt and a noindex 404.html.
 *
 * Route metadata comes from src/lib/seo.ts, which is driven by src/data/site-content.ts.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import react from '@vitejs/plugin-react'
import { build as viteBuild } from 'vite'
import type { Plugin, ResolvedConfig } from 'vite'
import { heroImageFor } from '../src/lib/hero-images.ts'
import { absoluteUrl, notFoundMeta, renderHead, routeMetas, SITE_URL } from '../src/lib/seo.ts'

const MARKER = '<!--seo-head-->'
const START = '<!--seo:start-->'
const END = '<!--seo:end-->'

type Renderer = (path: string) => Promise<string>

/** Builds src/entry-server.tsx for Node (hashed asset URLs match the client build) and loads its render(). */
async function loadRenderer(config: ResolvedConfig): Promise<{ render: Renderer; cleanup: () => Promise<void> }> {
  const outDir = path.resolve(config.root, 'node_modules/.tekprenuers-ssr')
  await viteBuild({
    root: config.root,
    base: config.base,
    mode: config.mode,
    configFile: false,
    logLevel: 'warn',
    plugins: [react()],
    ssr: { noExternal: true },
    build: { ssr: 'src/entry-server.tsx', outDir, emptyOutDir: true, minify: false, assetsInlineLimit: config.build.assetsInlineLimit },
  })
  const entry = (await readdir(outDir)).find((file) => /^entry-server\.m?js$/.test(file))
  if (!entry) throw new Error('seo-plugin: SSR entry was not emitted')
  const module = (await import(pathToFileURL(path.join(outDir, entry)).href)) as { render: Renderer }
  return { render: module.render, cleanup: () => rm(outDir, { recursive: true, force: true }) }
}

const MODULE_SCRIPT = /<script type="module"[^>]*\ssrc="([^"]+)"[^>]*><\/script>\s*/
const MODULE_PRELOAD = /<link rel="modulepreload"[^>]*\shref="([^"]+)"[^>]*>\s*/g

/**
 * Prerendered pages are fully visible without JavaScript, so the app bundle should not compete with first
 * paint. Replace the eager module script and modulepreload links with a tiny loader that fetches the same
 * files once the page has loaded and painted. Until then every link is a normal navigation to a prerendered page.
 */
const deferAppScripts = (html: string): string => {
  const entry = MODULE_SCRIPT.exec(html)?.[1]
  if (!entry) throw new Error('seo-plugin: module script not found in dist/index.html')
  const deps = [...html.matchAll(MODULE_PRELOAD)].map((match) => match[1])
  // Waits for the window `load` event AND the first largest-contentful-paint entry (the page has painted),
  // then starts the app. A 4s timeout covers browsers without the LCP API and background tabs.
  const loader = `<script>(function(){var deps=${JSON.stringify(deps)},entry=${JSON.stringify(entry)},started=false,loaded=document.readyState==='complete',painted=false;function start(){if(started)return;started=true;deps.forEach(function(href){var l=document.createElement('link');l.rel='modulepreload';l.href=href;document.head.appendChild(l)});var s=document.createElement('script');s.type='module';s.src=entry;document.head.appendChild(s)}function check(){if(loaded&&painted)requestAnimationFrame(function(){setTimeout(start,0)})}if(!loaded)addEventListener('load',function(){loaded=true;check()});try{new PerformanceObserver(function(list,observer){if(list.getEntries().length){painted=true;observer.disconnect();check()}}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){painted=true}setTimeout(function(){loaded=painted=true;check()},4000);check()})()</script>`
  return html.replace(MODULE_SCRIPT, '').replace(MODULE_PRELOAD, '').replace('</head>', `    ${loader}\n  </head>`)
}

const block = (head: string): string => `${START}\n${head}\n    ${END}`

export function seoPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'tekprenuers-seo',
    configResolved(resolved) {
      config = resolved
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const home = routeMetas()[0]
        return home ? html.replace(MARKER, block(renderHead(home))) : html
      },
    },
    async closeBundle() {
      if (config.command !== 'build') return
      const outDir = path.resolve(config.root, config.build.outDir)
      const template = deferAppScripts(await readFile(path.join(outDir, 'index.html'), 'utf8'))
      const pattern = new RegExp(`${START}[\\s\\S]*?${END}`)
      if (!pattern.test(template)) throw new Error('seo-plugin: head markers not found in dist/index.html')

      // Critical resources are only known after bundling (hashed file names), so preload links are added here.
      const assets = await readdir(path.join(outDir, 'assets'))
      const href = (file: string) => `${config.base}assets/${file}`
      const fonts = [/^outfit-latin-wght-normal-.*\.woff2$/, /^ubuntu-latin-700-normal-.*\.woff2$/]
        .map((rule) => assets.find((file) => rule.test(file)))
        .filter((file): file is string => file !== undefined)
      const fontPreloads = fonts.map(
        (file) => `    <link rel="preload" as="font" type="font/woff2" href="${href(file)}" crossorigin />`,
      )

      const { render, cleanup } = await loadRenderer(config)
      const EMPTY_ROOT = '<div id="root"></div>'
      if (!template.includes(EMPTY_ROOT)) throw new Error('seo-plugin: empty #root not found in dist/index.html')

      /** Preload for a page's header photo (the LCP element on inner pages), matching <Picture>'s AVIF srcset. */
      const photoPreload = (route: string): string[] => {
        const key = heroImageFor(route)
        if (!key) return []
        // Files are named `<key>-<width>-<hash>.avif`; parse the width that follows the key.
        const prefix = `${key}-`
        const candidates = assets
          .filter((file) => file.startsWith(prefix) && file.endsWith('.avif'))
          .map((file) => ({ file, width: Number.parseInt(file.slice(prefix.length), 10) }))
          .filter((entry) => Number.isFinite(entry.width))
          .sort((a, b) => a.width - b.width)
        if (candidates.length === 0) return []
        const srcset = candidates.map((c) => `${href(c.file)} ${c.width}w`).join(', ')
        return [`    <link rel="preload" as="image" type="image/avif" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high" />`]
      }

      const page = async (route: string, head: string, preloads: string[] = []): Promise<string> => {
        const body = await render(route)
        return template
          .replace(pattern, () => [...preloads, block(head)].join('\n'))
          .replace(EMPTY_ROOT, () => `<div id="root">${body}</div>`)
      }

      const metas = routeMetas()
      const home = metas.find((meta) => meta.path === '/')
      if (home) await writeFile(path.join(outDir, 'index.html'), await page('/', renderHead(home), fontPreloads))
      for (const meta of metas) {
        if (meta.path === '/') continue
        const dir = path.join(outDir, meta.path)
        await mkdir(dir, { recursive: true })
        await writeFile(path.join(dir, 'index.html'), await page(meta.path, renderHead(meta), [...fontPreloads, ...photoPreload(meta.path)]))
      }
      await writeFile(path.join(outDir, '404.html'), await page('/page-not-found', renderHead(notFoundMeta), fontPreloads))
      await cleanup()

      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = metas
        .filter((meta) => !meta.noindex)
        .map(
          (meta) =>
            `  <url><loc>${absoluteUrl(meta.path)}</loc><lastmod>${lastmod}</lastmod><priority>${meta.priority.toFixed(1)}</priority></url>`,
        )
        .join('\n')
      await writeFile(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      )
      await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      config.logger.info(`seo-plugin: prerendered ${metas.length} routes + 404.html, wrote sitemap.xml and robots.txt`)
    },
  }
}
