import { AnimatePresence, m } from 'framer-motion'
import { Suspense, useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { RouteSeo } from '../shared/route-seo'
import { AnnouncementBar } from './announcement-bar'
import { BackToTop } from './back-to-top'
import { CookieBanner } from './cookie-banner'
import { Footer } from './footer'
import { Header } from './header'
import { ScrollProgress } from './scroll-progress'
import { WhatsAppWidget } from './whatsapp-widget'

/** Site shell: landmarks, skip link, route transitions, focus and scroll management. */
export function Layout() {
  const { pathname, hash } = useLocation()
  const main = useRef<HTMLElement>(null)
  const announcer = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
      return
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    main.current?.focus({ preventScroll: true })
    const timer = window.setTimeout(() => {
      if (announcer.current) announcer.current.textContent = document.title
    }, 150)
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-orange-400 focus:px-5 focus:py-3 focus:font-medium focus:text-navy-950"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <AnimatePresence initial={false}>
          <m.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Outlet />
          </m.div>
        </AnimatePresence>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppWidget />
        <BackToTop />
        <CookieBanner />
        <RouteSeo />
      </Suspense>
      <div ref={announcer} role="status" aria-live="polite" className="sr-only" />
    </>
  )
}
