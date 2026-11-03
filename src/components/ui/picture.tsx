import { useState } from 'react'
import manifest from '../../assets/images/manifest.json'
import { cn } from '../../lib/cn'

interface ManifestEntry {
  width: number
  height: number
  widths: number[]
}

const entries: Record<string, ManifestEntry> = manifest
const files = import.meta.glob('../../assets/images/*.{avif,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const urlFor = (file: string): string | undefined => files[`../../assets/images/${file}`]

export type ImageName = keyof typeof manifest

interface PictureProps {
  name: ImageName | (string & {})
  alt: string
  className?: string
  /** CSS `sizes` hint for responsive sources. */
  sizes?: string
  /** Above-the-fold image: loads eagerly with high fetch priority. */
  priority?: boolean
  /**
   * Placeholder colour until the image has loaded. Opaque photos only: the placeholder is part of the prerendered
   * HTML and clears after hydration, so on a transparent logo or icon it would show as a grey box.
   */
  skeleton?: boolean
}

/**
 * Responsive, optimised image: AVIF + WebP sources from `npm run images`, intrinsic width/height
 * (no layout shift), lazy loading and an optional placeholder colour (opaque photos only).
 */
export function Picture({ name, alt, className, sizes = '100vw', priority = false, skeleton = false }: PictureProps) {
  const [loaded, setLoaded] = useState(false)
  const entry = entries[name]
  if (!entry) return null

  const common = {
    alt,
    width: entry.width,
    height: entry.height,
    decoding: 'async' as const,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    className: cn(skeleton && !loaded && 'skeleton', className),
    onLoad: () => setLoaded(true),
    ref: (el: HTMLImageElement | null) => {
      if (el?.complete) setLoaded(true)
    },
  }

  const svg = urlFor(`${name}.svg`)
  if (entry.widths.length === 0 && svg) return <img src={svg} {...common} />

  // With `w` descriptors the browser sizes an auto-width image to the `sizes` slot, which would stretch a small
  // single-size logo. Images that exist at one size are therefore shown at that size.
  const slot = entry.widths.length === 1 ? `${entry.widths[0]}px` : sizes
  const srcSet = (ext: 'avif' | 'webp') =>
    entry.widths.map((w) => `${urlFor(`${name}-${w}.${ext}`)} ${w}w`).join(', ')
  const largest = entry.widths[entry.widths.length - 1]
  const fallback = urlFor(`${name}-${largest}.webp`)

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={slot} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={slot} />
      <img src={fallback} {...common} />
    </picture>
  )
}
