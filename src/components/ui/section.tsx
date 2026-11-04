import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Badge } from './badge'
import { Container } from './container'
import { Heading } from './heading'

const tones = {
  light: 'bg-surface text-ink',
  alt: 'bg-surface-alt text-ink',
  /** A band: navy in dark mode, a pale brand tint in light mode (see .tone-band in index.css). */
  band: 'tone-band relative isolate overflow-hidden',
} as const

const spacing = {
  md: 'py-16 sm:py-20',
  lg: 'py-20 sm:py-24 lg:py-28',
  none: '',
} as const

interface SectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  tone?: keyof typeof tones
  spacing?: keyof typeof spacing
  /** Decorative layers rendered behind the content (blurs, 3D scenes). */
  backdrop?: ReactNode
  /** Set on the first, above-the-fold section. All others skip rendering work until they are near the viewport. */
  eager?: boolean
}

export function Section({
  tone = 'light',
  spacing: space = 'lg',
  backdrop,
  eager = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(tones[tone], spacing[space], !eager && 'defer-render', className)} {...props}>
      {backdrop}
      <Container className="relative z-10">
        {children}
      </Container>
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  level?: 1 | 2
  id?: string
  className?: string
}

/** Eyebrow + heading + lead paragraph, used at the top of most sections. */
export function SectionHeader({ eyebrow, title, lead, align = 'center', level = 2, id, className }: SectionHeaderProps) {
  const centered = align === 'center'
  return (
    <div className={cn('mb-12 flex w-full flex-col gap-4 sm:mb-16 lg:w-3/4', centered ? 'mx-auto items-center text-center' : 'items-start', className)}>
      {eyebrow && <Badge tone="brand">{eyebrow}</Badge>}
      <Heading level={level} size={level === 1 ? 'h1' : 'h2'} id={id}>
        {title}
      </Heading>
      {lead && <p className="text-lead text-ink-muted">{lead}</p>}
    </div>
  )
}
