// Builds favicon / app icons into /public from the "T" mark of assets-src/logo.png.
// Run with: node scripts/make-icons.mjs
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logo = path.join(root, 'assets-src/logo.png')
const out = path.join(root, 'public')
await mkdir(out, { recursive: true })

const NAVY = '#010a36'

// Isolate the "T". Its top-right node overlaps the "e" horizontally, so a plain column crop is not
// enough: take the left 21% of the wordmark and erase the "e" (lower right) from it.
const meta = await sharp(logo).metadata()
const wide = Math.round(meta.width * 0.21)
const eraser = await sharp({
  create: { width: wide, height: Math.round(meta.height * 0.62), channels: 4, background: '#000000' },
})
  .png()
  .toBuffer()
const crop = await sharp(logo)
  .extract({ left: 0, top: 0, width: wide, height: meta.height })
  .composite([{ input: eraser, left: Math.round(meta.width * 0.168), top: Math.round(meta.height * 0.38), blend: 'dest-out' }])
  .trim()
  .toBuffer()
const cropMeta = await sharp(crop).metadata()

// Recolour the mark to white while keeping its alpha.
const alpha = await sharp(crop).ensureAlpha().extractChannel('alpha').toBuffer()
const whiteMark = await sharp({
  create: { width: cropMeta.width, height: cropMeta.height, channels: 3, background: '#ffffff' },
})
  .joinChannel(alpha)
  .png()
  .toBuffer()

const icon = async (size, file, { rounded = true, pad = 0.24 } = {}) => {
  const inner = Math.round(size * (1 - pad * 2))
  const mark = await sharp(whiteMark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer()
  const bg = rounded
    ? Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${Math.round(size * 0.22)}" fill="${NAVY}"/></svg>`)
    : Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${NAVY}"/></svg>`)
  await sharp(bg).composite([{ input: mark, gravity: 'center' }]).png().toFile(path.join(out, file))
}

await icon(32, 'favicon-32.png', { pad: 0.16 })
await icon(180, 'apple-touch-icon.png', { rounded: false })
await icon(192, 'icon-192.png')
await icon(512, 'icon-512.png')
console.log('Icons written to /public')
