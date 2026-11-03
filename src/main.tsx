import { LazyMotion, MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { routes } from './routes'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')
const root = container

// Framer Motion's animation features load as a separate chunk after first paint; components use the
// lightweight `m` API (strict mode makes the full `motion` component an error).
const loadFeatures = () => import('./lib/motion-features').then((module) => module.default)

const router = createBrowserRouter(routes)

/** Resolves once the current route's lazy chunk has loaded. */
const routeReady = (): Promise<void> =>
  router.state.initialized
    ? Promise.resolve()
    : new Promise((resolve) => {
        const unsubscribe = router.subscribe((state) => {
          if (!state.initialized) return
          unsubscribe()
          resolve()
        })
      })

// Every route is prerendered to static HTML at build time. Keep that HTML on screen until the route's
// code has loaded, then hydrate it: React adopts the existing DOM nodes, so the early paint (including the
// hero image, the LCP element) is kept. In `npm run dev` there is no prerendered HTML, so it renders normally.
void routeReady().then(() => {
  const app = (
    <StrictMode>
      {/* reducedMotion="user": transform and layout animations are skipped for prefers-reduced-motion. */}
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadFeatures} strict>
          <RouterProvider router={router} />
        </LazyMotion>
      </MotionConfig>
    </StrictMode>
  )
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
})
