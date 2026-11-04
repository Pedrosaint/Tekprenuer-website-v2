import { AnimatePresence, m } from 'framer-motion'
import { CookieIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Link } from 'react-router-dom'
import { useConsent } from '../../lib/consent'
import { Button } from '../ui/button'

/**
 * Cookie consent. "Accept" and "Decline" carry equal weight. Nothing from the Google tag is fetched
 * until the visitor accepts (see index.html and lib/consent.ts).
 */
export function CookieBanner() {
  const { bannerVisible, accept, decline } = useConsent()

  return (
    <AnimatePresence>
      {bannerVisible && (
        <m.section
          role="region"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="tone-band fixed inset-x-3 bottom-3 z-[90] rounded-xl border border-line p-5 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[26rem]"
        >
          <div className="flex items-start gap-3">
            <HugeIcon icon={CookieIcon} size={22} className="mt-0.5 shrink-0 text-accent-ink" />
            <div className="flex flex-col gap-1">
              <h2 className="font-sans text-base font-medium text-ink">Cookies on Tekprenuers</h2>
              <p className="text-sm leading-relaxed text-ink-muted">
                We use analytics and advertising cookies only if you accept. Essential storage (your theme and this choice) is
                always on. See our{' '}
                <Link to="/cookies" className="font-medium text-ink underline underline-offset-4">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm" onClick={decline}>
              Decline
            </Button>
            <Button variant="accent" size="sm" onClick={accept}>
              Accept
            </Button>
          </div>
        </m.section>
      )}
    </AnimatePresence>
  )
}
