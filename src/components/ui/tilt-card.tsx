import { useRef } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface TiltCardProps {
  children: ReactNode
  className?: string
  /** Maximum tilt in degrees. */
  max?: number
}

const initial = { '--rx': '0deg', '--ry': '0deg' } as CSSProperties

/**
 * CSS-3D tilt that follows the mouse. It only writes two CSS custom properties (see .tilt in index.css),
 * so idle cards cost nothing. Touch, keyboard and reduced-motion users get the static card.
 */
export function TiltCard({ children, className, max = 7 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element || event.pointerType !== 'mouse') return
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    element.style.setProperty('--rx', `${((0.5 - y) * 2 * max).toFixed(2)}deg`)
    element.style.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`)
    element.setAttribute('data-tilting', '')
  }

  const onLeave = () => ref.current?.removeAttribute('data-tilting')

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={cn('tilt', className)} style={initial}>
      {children}
    </div>
  )
}
