import { AnimatePresence, m } from 'framer-motion'
import { Calendar03Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { nav } from '../../data/site-content'
import { bookingTarget } from '../../lib/contact'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { Logo } from './logo'
import { ThemeToggle } from './theme-toggle'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  /** The button that opened the drawer; focus returns to it on close. */
  returnFocusTo: RefObject<HTMLButtonElement | null>
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Slide-in navigation for < lg screens: modal dialog with focus trap, Esc to close and scroll lock. */
export function MobileDrawer({ open, onClose, returnFocusTo }: MobileDrawerProps) {
  const panel = useRef<HTMLDivElement>(null)
  const booking = bookingTarget()

  useEffect(() => {
    if (!open) return
    const trigger = returnFocusTo.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel.current) return
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      trigger?.focus()
    }
  }, [open, onClose, returnFocusTo])

  if (typeof document === 'undefined') return null

  // Portalled to <body>: the sticky header's backdrop-filter would otherwise become the containing
  // block for this fixed overlay and clip it to the header's height.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] xl:hidden">
          <m.div
            className="absolute inset-0 bg-navy-950/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="tone-band absolute inset-y-0 right-0 flex w-full flex-col sm:w-96 gap-8 overflow-y-auto border-l border-line px-6 py-5"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="inline-flex size-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-ink/10"
                >
                  <HugeIcon icon={Cancel01Icon} size={22} />
                </button>
              </div>
            </div>

            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {nav.map((item, index) => (
                  <m.li
                    key={item.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.04 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex min-h-14 items-center justify-between border-b border-line font-display text-xl font-medium transition-colors',
                          isActive ? 'text-accent-ink' : 'text-ink hover:text-accent-ink',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </m.li>
                ))}
              </ul>
            </nav>

            <Button
              {...booking}
              onClick={onClose}
              size="lg"
              fullWidth
              icon={<HugeIcon icon={Calendar03Icon} size={20} />}
              className="mt-auto"
            >
              Book a free consultation
            </Button>
          </m.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
