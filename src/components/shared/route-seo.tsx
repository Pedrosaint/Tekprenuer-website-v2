import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { OG_IMAGE, absoluteUrl, findRouteMeta, notFoundMeta, organizationJsonLd, websiteJsonLd } from '../../lib/seo'
import type { JsonLd } from '../../lib/seo'

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attr, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const replaceJsonLd = (blocks: JsonLd[]) => {
  document.head.querySelectorAll('script[data-seo]').forEach((node) => node.remove())
  for (const block of blocks) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.seo = ''
    script.textContent = JSON.stringify(block).replace(/</g, '\\u003c')
    document.head.appendChild(script)
  }
}

/**
 * Keeps <head> in sync with the current route: unique title and description, canonical URL,
 * Open Graph / Twitter tags and JSON-LD. The same data is baked into each route's static HTML at
 * build time (plugins/seo-plugin.ts) for crawlers that do not run JavaScript.
 */
export function RouteSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = findRouteMeta(pathname) ?? notFoundMeta
    const url = absoluteUrl(meta === notFoundMeta ? '/' : meta.path)

    document.title = meta.title
    upsertMeta('name', 'description', meta.description)
    upsertMeta('name', 'robots', meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    upsertCanonical(url)
    upsertMeta('property', 'og:title', meta.title)
    upsertMeta('property', 'og:description', meta.description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', OG_IMAGE)
    upsertMeta('name', 'twitter:title', meta.title)
    upsertMeta('name', 'twitter:description', meta.description)
    upsertMeta('name', 'twitter:image', OG_IMAGE)
    replaceJsonLd([organizationJsonLd(), websiteJsonLd(), ...meta.jsonLd])
  }, [pathname])

  return null
}
