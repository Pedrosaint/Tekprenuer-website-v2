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

/** Sticky, always-navy header with route highlighting and a persistent booking CTA. */
export function Header() {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const close = useCallback(() => setOpen(false), [])
  const booking = bookingTarget()

  return (
    <header className="tone-dark sticky top-0 z-50 border-b border-white/10 bg-navy-950">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-20">
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
                      isActive ? 'text-white after:scale-x-100' : 'text-slate-300 after:scale-x-0 hover:text-white hover:after:scale-x-100',
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
          <Button
            {...booking}
            variant="accent"
            size="sm"
            icon={<HugeIcon icon={Calendar03Icon} size={20} />}
            iconOnly
            className="size-11 min-h-11! px-0! xl:hidden"
          >
            Book a free consultation
          </Button>
          <button
            ref={menuButton}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
            className="inline-flex size-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            <HugeIcon icon={Menu01Icon} size={24} />
          </button>
        </div>
      </Container>

      <MobileDrawer open={open} onClose={close} returnFocusTo={menuButton} />
    </header>
  )
}
