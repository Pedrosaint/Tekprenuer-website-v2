import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { Picture } from '../ui/picture'

interface LogoProps {
  className?: string
}

/** The artwork is blue: shown as is in light mode and turned white (a CSS filter) in dark mode. */
export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" aria-label="Tekprenuers home" className={cn('inline-flex shrink-0 items-center', className)}>
      <Picture
        name="logo"
        alt="Tekprenuers"
        priority
        sizes="160px"
        className="h-7 w-auto min-[400px]:h-8 sm:h-9 dark:brightness-0 dark:invert"
      />
    </Link>
  )
}
