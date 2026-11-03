import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

interface CardProps extends ComponentProps<'div'> {
  /** Adds hover lift. Use for cards that are (or contain) links. */
  interactive?: boolean
  padding?: 'none' | 'md' | 'lg'
}

const paddings = { none: '', md: 'p-6', lg: 'p-6 sm:p-8' } as const

export function Card({ interactive = false, padding = 'md', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-raised',
        paddings[padding],
        interactive && 'transition-colors duration-300 hover:border-ink/50',
        className,
      )}
      {...props}
    />
  )
}
