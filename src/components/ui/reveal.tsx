import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  /** Initial vertical offset in px. */
  y?: number
  className?: string
}

type RevealStyle = CSSProperties & { '--reveal-delay': string; '--reveal-y': string }

// One shared observer for every Reveal on the page (cheap compared to one per element).
let observer: IntersectionObserver | undefined
const getObserver = (): IntersectionObserver => {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.setAttribute('data-revealed', '')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  )
  return observer
}

/**
 * Fades and lifts content into view once, using a CSS transition (see [data-reveal] in index.css).
 * Prerendered HTML is fully visible: elements only start hidden (data-pending) once JavaScript is running,
 * so no-JS visitors, crawlers and slow first loads still see everything. Disabled for prefers-reduced-motion.
 */
export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    // Content already on screen when the app takes over stays exactly as prerendered (no flicker).
    if (element.getBoundingClientRect().top < window.innerHeight) {
      element.setAttribute('data-revealed', '')
      return
    }
    // Content further down is hidden now and animates in when scrolled to.
    element.setAttribute('data-pending', '')
    const io = getObserver()
    io.observe(element)
    return () => io.unobserve(element)
  }, [])

  const style: RevealStyle = { '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` }
  return (
    <div ref={ref} data-reveal="" style={style} className={className}>
      {children}
    </div>
  )
}
