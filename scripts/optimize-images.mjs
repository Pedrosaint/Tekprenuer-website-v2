// Converts the originals in /assets-src to AVIF + WebP at responsive widths and
// writes src/assets/images/manifest.json (name -> intrinsic size + available widths).
// Run with: npm run images
import { mkdir, readdir, readFile, copyFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'assets-src')
const outDir = path.join(root, 'src/assets/images')

// name -> { file, widths, trim?, gray?, avif?, webp? }
//  - empty widths = original size only; widths larger than the original are skipped
//  - trim: crop the transparent margin so icons fill the box they are placed in
//  - gray: convert to monochrome (page-header photos sit under a navy layer, so colour is wasted bytes)
//  - erase: transparent rectangles [left, top, width, height] cut out of the source (removes stray artwork)
const photo = (file, extra = {}) => ({ file: `photos/${file}.jpg`, widths: [640, 1024, 1600], gray: true, avif: 38, webp: 58, ...extra })

const jobs = {
  logo: { file: 'logo.png', widths: [320, 640] },
  'logo-white': { file: 'logo1.png', widths: [] },
  ecolex: { file: 'ecolex.png', widths: [] },
  headerfy: { file: 'headerfy.png', widths: [] },
  weestore: { file: 'weestore.png', widths: [] },
  launchconnect: { file: 'Launchconnect.png', widths: [] },
  perch: { file: 'perch.png', widths: [] },
  nuvile: { file: 'nuville.png', widths: [] },
  softtouch: { file: 'softtouch.png', widths: [320] },
  // Page-header photos (monochrome) and the About page photo (colour)
  'hero-about': photo('hero-about'),
  'hero-services': photo('hero-services'),
  'hero-work': photo('hero-work'),
  'hero-process': photo('hero-process'),
  'hero-pricing': photo('hero-pricing'),
  'hero-insights': photo('hero-insights'),
  'hero-faq': photo('hero-faq'),
  'hero-contact': photo('hero-contact'),
  'hero-legal': photo('hero-legal'),
  'hero-case': photo('hero-case'),
  'hero-svc-ai': photo('hero-svc-ai'),
  'hero-svc-web': photo('hero-svc-web'),
  'hero-svc-uiux': photo('hero-svc-uiux'),
  'hero-svc-software': photo('hero-svc-software'),
  'hero-svc-branding': photo('hero-svc-branding'),
  'hero-svc-pm': photo('hero-svc-pm'),
  'hero-svc-ecommerce': photo('hero-svc-ecommerce'),
  'hero-svc-marketing': photo('hero-svc-marketing'),
  'about-story': { file: 'photos/about-story.jpg', widths: [640, 1024], avif: 50, webp: 74 },
}
// SVG logos are copied as-is.
const svgs = { accessum: 'accessum-full-logo-white.svg', getelectric: 'getelectric.svg' }


await rm(outDir, { recursive: true, force: true })
await mkdir(outDir, { recursive: true })
const manifest = {}

for (const [name, job] of Object.entries(jobs)) {
  const { file, widths, trim = false, gray = false, erase = [], avif = 55, webp = 82 } = job
  let source = path.join(srcDir, file)
  if (trim) source = await sharp(source).trim().toBuffer()
  if (erase.length > 0) {
    const cuts = erase.map(([left, top, width, height]) => ({
      input: { create: { width, height, channels: 4, background: '#ffffff' } },
      left,
      top,
      blend: 'dest-out',
    }))
    source = await sharp(source).ensureAlpha().composite(cuts).png().toBuffer()
  }
  const meta = await sharp(source).metadata()
  const w = meta.width
  const h = meta.height
  const fitting = widths.filter((x) => x <= w)
  const targets = fitting.length ? fitting : [w]
  for (const tw of targets) {
    let pipeline = sharp(source).resize({ width: tw, withoutEnlargement: true })
    if (gray) pipeline = pipeline.grayscale()
    await pipeline.clone().webp({ quality: webp, alphaQuality: 90, effort: 5 }).toFile(path.join(outDir, `${name}-${tw}.webp`))
    await pipeline.clone().avif({ quality: avif, effort: 5 }).toFile(path.join(outDir, `${name}-${tw}.avif`))
  }
  manifest[name] = { width: w, height: h, widths: targets }
}

const files = await readdir(srcDir)
for (const [name, file] of Object.entries(svgs)) {
  if (!files.includes(file)) throw new Error(`missing ${file}`)
  const from = path.join(srcDir, file)
  const to = path.join(outDir, `${name}.svg`)
  const svg = await readFile(from, 'utf8')
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  // Crop SVGs that sit inside a much larger empty canvas (e.g. the Accessum logo).
  if (vb && Number(vb[1]) === Number(vb[2])) {
    const scale = 4
    const { info } = await sharp(from, { density: 72 * scale }).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
    const x = Math.max(0, -info.trimOffsetLeft / scale)
    const y = Math.max(0, -info.trimOffsetTop / scale)
    const w = info.width / scale
    const h = info.height / scale
    const cropped = svg
      .replace(/viewBox="[^"]+"/, `viewBox="${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}"`)
      .replace(/width="[^"]+"/, `width="${Math.round(w)}"`)
      .replace(/height="[^"]+"/, `height="${Math.round(h)}"`)
    await writeFile(to, cropped)
    manifest[name] = { width: Math.round(w), height: Math.round(h), widths: [] }
  } else {
    await copyFile(from, to)
    const dims = svg.match(/width="([\d.]+)"[^>]*height="([\d.]+)"/)
    manifest[name] = { width: Math.round(Number(dims?.[1] ?? 0)), height: Math.round(Number(dims?.[2] ?? 0)), widths: [] }
  }
}

await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`Optimised ${Object.keys(manifest).length} images -> src/assets/images`)
