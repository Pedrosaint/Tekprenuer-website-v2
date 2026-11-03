import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Picture } from '../ui/picture'

interface LogoProps {
  /** Render the blue logo as white, for navy backgrounds. */
  onDark?: boolean
  className?: string
}

export function Logo({ onDark = true, className }: LogoProps) {
  return (
    <Link to="/" aria-label="Tekprenuers home" className={cn('inline-flex shrink-0 items-center', className)}>
      <Picture
        name="logo"
        alt="Tekprenuers"
        priority
        sizes="160px"
        className={cn('h-8 w-auto sm:h-9', onDark && 'brightness-0 invert')}
      />
    </Link>
  )
}
