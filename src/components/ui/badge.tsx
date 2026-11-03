import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

const tones = {
  brand: 'bg-royal-700/10 text-brand ring-1 ring-inset ring-royal-700/20 dark:bg-royal-300/10 dark:ring-royal-300/25',
  accent: 'bg-orange-400/15 text-accent-ink ring-1 ring-inset ring-orange-400/40',
  outline: 'text-ink-muted ring-1 ring-inset ring-line',
  glass: 'bg-white/10 text-white ring-1 ring-inset ring-white/25',
} as const

interface BadgeProps extends ComponentProps<'span'> {
  tone?: keyof typeof tones
}

export function Badge({ tone = 'brand', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
