import type { ComponentProps, ReactNode } from 'react'
import { ArrowRight02Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from './huge-icon'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

/**
 * Buttons are rectangles with an 8px radius and a 2px border. On hover a solid colour sweeps in from the
 * left (a pseudo-element, so it stays on the compositor) and the label flips colour. With `arrow`, a small
 * square chip carries an arrow that starts tilted and straightens on hover. No shadows, no gradients.
 */
const variants = {
  /** Context-aware: royal blue on light surfaces, orange on dark ones (see --cta tokens). */
  primary: 'border-cta bg-cta text-cta-ink before:bg-ink hover:text-surface',
  accent: 'border-orange-400 bg-orange-400 text-navy-950 before:bg-white hover:text-navy-950',
  secondary: 'border-ink bg-transparent text-ink before:bg-ink hover:text-surface',
  ghost: 'border-transparent text-ink before:bg-ink/10',
  /** Outline for navy backgrounds. */
  glass: 'border-white/70 bg-transparent text-white before:bg-white hover:text-navy-950',
} as const

const sizes = {
  sm: 'min-h-11 gap-2 px-4 text-sm',
  md: 'min-h-12 gap-2.5 px-5 text-base',
  lg: 'min-h-14 gap-3 px-6 text-base',
} as const

interface BaseProps {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Trailing arrow chip. */
  arrow?: boolean
  icon?: ReactNode
  fullWidth?: boolean
  className?: string
  children: ReactNode
}

type AsButton = BaseProps & Omit<ComponentProps<'button'>, keyof BaseProps> & { to?: undefined; href?: undefined }
type AsAnchor = BaseProps & Omit<ComponentProps<'a'>, keyof BaseProps> & { href: string; to?: undefined }
type AsLink = BaseProps & Omit<ComponentProps<typeof Link>, keyof BaseProps | 'to'> & { to: string; href?: undefined }

export type ButtonProps = AsButton | AsAnchor | AsLink

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', arrow = false, icon, fullWidth = false, className, children, ...rest } = props

  const classes = cn(
    'group relative isolate inline-flex items-center justify-center overflow-hidden rounded-lg border font-medium whitespace-nowrap',
    'transition-colors duration-300 active:translate-y-px disabled:pointer-events-none disabled:opacity-60',
    'before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100',
    variants[variant],
    sizes[size],
    arrow && 'pr-2',
    fullWidth && 'w-full',
    className,
  )

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="inline-flex size-8 items-center justify-center rounded-md bg-current/15">
          <HugeIcon icon={ArrowRight02Icon} size={18} className="-rotate-45 transition-transform duration-300 group-hover:rotate-0" />
        </span>
      )}
    </>
  )

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest as Omit<AsLink, keyof BaseProps> & { to: string }
    return (
      <Link to={to} className={classes} {...linkRest}>
        {content}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    const anchorRest = rest as Omit<AsAnchor, keyof BaseProps>
    const external = /^https?:/.test(anchorRest.href)
    return (
      <a
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...anchorRest}
      >
        {content}
      </a>
    )
  }

  const buttonRest = rest as Omit<AsButton, keyof BaseProps>
  return (
    <button type="button" className={classes} {...buttonRest}>
      {content}
    </button>
  )
}
