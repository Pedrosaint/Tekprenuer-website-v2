import { useCallback, useRef, useState } from 'react'
import { Calendar03Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { NavLink } from 'react-router-dom'
import { nav } from '../../data/site-content'
import { bookingTarget } from '../../lib/contact'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { Container } from '../ui/container'
import { Logo } from './logo'
import { MobileDrawer } from './mobile-drawer'
import { ThemeToggle } from './theme-toggle'

/** Sticky header with route highlighting and a persistent booking CTA. White in light mode, navy in dark mode. */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const booking = bookingTarget()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface dark:bg-navy-950">
      <Container className="flex h-16 items-center justify-between gap-3 sm:gap-6 lg:h-20">
        <Logo />

        <nav aria-label="Primary" className="hidden h-full xl:block">
          <ul className="flex h-full items-stretch gap-2">
            {nav.map((item) => (
              <li key={item.to} className="flex">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-flex items-center px-4 text-base font-medium transition-colors',
                      'after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:origin-left after:bg-orange-400 after:transition-transform after:duration-300',
                      isActive ? 'text-ink after:scale-x-100' : 'text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <div className="hidden xl:block">
            <Button {...booking} size="sm">
              Book a free consultation
            </Button>
          </div>
          {/* Below xl: a compact button that says what it does. Its full name is read out by assistive technology. */}
          <Button
            {...booking}
            size="sm"
            icon={<HugeIcon icon={Calendar03Icon} size={20} />}
            className="gap-1.5! px-3! xl:hidden"
          >
            Book<span className="sr-only"> a free consultation</span>
          </Button>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
            className="inline-flex size-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-ink/10 xl:hidden"
          >
            <HugeIcon icon={Menu01Icon} size={24} />
          </button>
        </div>
      </Container>

      <MobileDrawer open={open} onClose={close} returnFocusTo={menuButton} />
    </header>
  )
}
