import type { ComponentProps } from 'react'
import { cn } from '../../lib/cn'

/** The site container: Tailwind's `container` (centred, stepped widths) with the gutter from index.css. */
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('container', className)} {...props} />
}
