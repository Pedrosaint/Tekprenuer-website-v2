import { Linkedin01Icon, NewTwitterIcon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { realSocials } from '../../lib/content'
import { cn } from '../../lib/cn'
import { HugeIcon } from '../ui/huge-icon'

const icons: Record<string, IconSvgElement> = { linkedin: Linkedin01Icon, x: NewTwitterIcon }

/** Social icons for the profiles in site-content.ts that have a real URL. Renders nothing when there are none. */
export function SocialLinks({ className }: { className?: string }) {
  if (realSocials.length === 0) return null
  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {realSocials.map((social) => {
        const glyph = icons[social.id]
        return (
          <li key={social.id}>
            <a
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${social.label} (opens in a new tab)`}
              className="inline-flex size-11 items-center justify-center rounded-xl border border-line text-ink transition-colors hover:border-ink/50"
            >
              {glyph && <HugeIcon icon={glyph} size={20} />}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
