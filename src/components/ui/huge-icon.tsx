import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

interface HugeIconProps {
  icon: IconSvgElement
  size?: number
  strokeWidth?: number
  className?: string
}

/** The one place icons are rendered: Hugeicons (stroke-rounded set), decorative by default. */
export function HugeIcon({ icon, size = 24, strokeWidth = 1.5, className }: HugeIconProps) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}
