import { useInView } from 'framer-motion'
import { lazy, Suspense, useRef, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { canRender3D, useAfterIdle } from './capability'

// three.js and react-three-fiber live in these lazy chunks, so they never block first paint.
const CityScene = lazy(() => import('./city-scene'))
const OrbitScene = lazy(() => import('./orbit-scene'))

interface SceneHostProps {
  variant: 'city' | 'orbit'
  /** Optional stand-in, shown until the first 3D frame has drawn and kept when 3D is unavailable. */
  fallback?: ReactNode
  className?: string
}

const noSubscription = () => () => {}

/**
 * Mounts a WebGL scene only when it is supported, the page has loaded and is idle, and the host has been
 * scrolled near the viewport. The scene pauses its render loop when scrolled out of view. Any fallback fades out
 * once the first 3D frame has been drawn; without one the host stays empty until then. When 3D can never run
 * the host sets `data-scene="off"`, so the layout can reclaim the space.
 */
export function SceneHost({ variant, fallback, className }: SceneHostProps) {
  const ref = useRef<HTMLDivElement>(null)
  const idle = useAfterIdle()
  const nearViewport = useInView(ref, { margin: '200px 0px' })
  // Never download or start a scene the visitor has not scrolled near (e.g. the CTA band at the foot of a page).
  const everNear = useInView(ref, { margin: '200px 0px', once: true })
  // The prerendered page assumes 3D is available (so the space is reserved); the real answer replaces it after hydration.
  const supported = useSyncExternalStore(noSubscription, canRender3D, () => true)
  const [drawn, setDrawn] = useState(false)

  const Scene = variant === 'city' ? CityScene : OrbitScene

  return (
    <div ref={ref} className={className} data-scene={supported ? undefined : 'off'}>
      {fallback && (
        <div className={cn('transition-opacity duration-1000', drawn && 'opacity-0')} aria-hidden={drawn}>
          {fallback}
        </div>
      )}
      {supported && idle && everNear && (
        <div
          className={cn('absolute inset-0 transition-opacity duration-1000', drawn ? 'opacity-100' : 'opacity-0')}
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <Scene active={nearViewport} onReady={() => setDrawn(true)} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
