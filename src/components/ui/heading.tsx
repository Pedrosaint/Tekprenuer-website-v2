import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

const sizes = {
  display: 'text-display font-medium',
  h1: 'text-h1 font-medium',
  h2: 'text-h2 font-medium',
  h3: 'text-h3 font-medium',
  h4: 'text-lg font-medium',
} as const

interface HeadingProps extends ComponentProps<'h2'> {
  /** Semantic level (the document outline). */
  level?: 1 | 2 | 3 | 4
  /** Visual size, independent of the semantic level. */
  size?: keyof typeof sizes
}

const defaultSize = { 1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4' } as const

export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as const
  return <Tag className={cn('text-ink', sizes[size ?? defaultSize[level]], className)} {...props} />
}
