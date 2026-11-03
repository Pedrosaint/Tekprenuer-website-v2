import { useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'

interface MagneticProps {
  children: ReactNode
  /** Fraction of the pointer offset the element follows. */
  strength?: number
  className?: string
}

/** Pulls its child slightly toward the mouse pointer. No effect on touch or with reduced motion (see .magnetic in index.css). */
export function Magnetic({ children, strength = 0.25, className = 'inline-block' }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const element = ref.current
    if (!element || event.pointerType !== 'mouse') return
    const rect = element.getBoundingClientRect()
    element.style.setProperty('--mx', `${((event.clientX - (rect.left + rect.width / 2)) * strength).toFixed(1)}px`)
    element.style.setProperty('--my', `${((event.clientY - (rect.top + rect.height / 2)) * strength).toFixed(1)}px`)
  }
  const onLeave = () => {
    ref.current?.style.setProperty('--mx', '0px')
    ref.current?.style.setProperty('--my', '0px')
  }

  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`magnetic ${className}`}>
      {children}
    </span>
  )
}
