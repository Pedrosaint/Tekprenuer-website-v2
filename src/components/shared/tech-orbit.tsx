import {
  ApiIcon, CloudServerIcon, CodeIcon, CreditCardIcon, DatabaseIcon, FigmaIcon, PythonIcon, ReactIcon, ServerStackIcon,
  SmartPhone01Icon, TailwindcssIcon, TypescriptIcon, WhatsappIcon,
} from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { useEffect, useRef } from 'react'
import type { IconKey } from '../../data/site-content'
import { cn } from '../../lib/cn'
import { HugeIcon } from '../ui/huge-icon'
import { Icon } from '../ui/icon'

const techIcons: Record<string, IconSvgElement> = {
  React: ReactIcon,
  TypeScript: TypescriptIcon,
  'Node.js': ServerStackIcon,
  'Tailwind CSS': TailwindcssIcon,
  'React Native': SmartPhone01Icon,
  PostgreSQL: DatabaseIcon,
  Python: PythonIcon,
  Figma: FigmaIcon,
  Docker: CloudServerIcon,
  'REST & GraphQL': ApiIcon,
  'Payment gateways': CreditCardIcon,
  'WhatsApp API': WhatsappIcon,
}

type Ring = 'outer' | 'inner'

interface TechOrbitProps {
  technologies: readonly string[]
  industries: readonly { label: string; icon: IconKey }[]
  className?: string
}

/* ------------------------------------------------------------------ *
 * Geometry. Two tilted elliptical orbits are projected to 2D: depth (cos) drives size, fade and
 * stacking, so chips sweep from the back (small, faint) to the front (full size) around a centre hub.
 * ------------------------------------------------------------------ */
// Used for the very first (prerendered) layout; the real size is measured after mount.
const FALLBACK = { width: 1100, height: 400 }

const geometry = (ring: Ring, width: number, height: number) => {
  // On narrow screens the chips are icon-only, so the ring can use nearly the full width.
  const outerRx = Math.min(width * 0.4, 520)
  const outerRy = height * 0.3
  return ring === 'outer' ? { rx: outerRx, ry: outerRy } : { rx: outerRx * 0.5, ry: outerRy * 0.55 }
}

const place = (ring: Ring, index: number, total: number, angle: number, width: number, height: number) => {
  const { rx, ry } = geometry(ring, width, height)
  // The inner ring turns the other way, a little faster, and is offset so chips never line up with the outer ring.
  const turn = ring === 'outer' ? angle : -angle * 1.4 + 30
  const theta = ((turn + (index * 360) / total) * Math.PI) / 180
  const depth = Math.cos(theta)
  const near = (depth + 1) / 2
  const scale = 0.78 + 0.22 * near
  return {
    transform: `translate(-50%, -50%) translate3d(${(Math.sin(theta) * rx).toFixed(1)}px, ${(depth * ry).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
    // Depth is shown mainly by size and stacking; the fade is kept mild so text stays readable (WCAG contrast).
    opacity: Number((0.82 + 0.18 * near).toFixed(3)),
    zIndex: Math.round(100 + depth * 90),
    depth,
  }
}

const BASE_SPEED = 9 // degrees per second
const HOVER_SPEED = 3
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

/**
 * Interactive 3D-style orbit of the technologies we use (outer ring) and the industries we serve (inner ring).
 * Drag or swipe to spin it; it eases back to a slow drift, slows on hover and stops drifting for reduced motion.
 * Only one requestAnimationFrame loop exists, and only while the orbit is on screen.
 * It is decorative: the same technologies are listed for assistive tech, and industries are listed on the page.
 */
export function TechOrbit({ technologies, industries, className }: TechOrbitProps) {
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = stage.current
    if (!element) return
    const chips = Array.from(element.querySelectorAll<HTMLElement>('[data-chip]'))
    const guides = Array.from(element.querySelectorAll<HTMLElement>('[data-guide]'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = element.clientWidth
    let height = element.clientHeight
    let angle = 0
    let boost = 0
    let dragging = false
    let hovering = false
    let visible = false
    let frame = 0
    let last = 0
    let lastX = 0
    let lastMove = 0

    const layout = () => {
      let front: HTMLElement | undefined
      let nearest = -2
      for (const chip of chips) {
        const ring = chip.dataset.ring as Ring
        const placed = place(ring, Number(chip.dataset.index), Number(chip.dataset.total), angle, width, height)
        chip.style.transform = placed.transform
        chip.style.opacity = String(placed.opacity)
        chip.style.zIndex = String(placed.zIndex)
        if (ring === 'outer' && placed.depth > nearest) {
          nearest = placed.depth
          front = chip
        }
      }
      // Exactly one technology is "in front" at a time: it is highlighted (and, on phones, shows its name).
      for (const chip of chips) {
        if (chip === front) chip.setAttribute('data-front', '')
        else chip.removeAttribute('data-front')
      }
    }

    const sizeGuides = () => {
      for (const guide of guides) {
        const { rx, ry } = geometry(guide.dataset.ring as Ring, width, height)
        guide.style.width = `${rx * 2}px`
        guide.style.height = `${ry * 2}px`
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragging) {
        const drift = reduced ? 0 : hovering ? HOVER_SPEED : BASE_SPEED
        angle += (drift + boost) * dt
        boost *= 0.04 ** dt // inertia fades to ~4% each second
      }
      layout()
      const settled = reduced && !dragging && Math.abs(boost) < 0.05
      frame = visible && !settled ? requestAnimationFrame(tick) : 0
    }

    const run = () => {
      if (frame || !visible) return
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      dragging = true
      boost = 0
      lastX = event.clientX
      lastMove = performance.now()
      element.setPointerCapture(event.pointerId)
      run()
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging) return
      const now = performance.now()
      const step = (event.clientX - lastX) * 0.4
      angle += step
      boost = clamp((step / Math.max(8, now - lastMove)) * 1000, 400)
      lastX = event.clientX
      lastMove = now
      layout()
    }
    const onUp = () => {
      dragging = false
      run()
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovering = true
    }
    const onLeave = () => {
      hovering = false
    }

    const resize = new ResizeObserver(() => {
      width = element.clientWidth
      height = element.clientHeight
      sizeGuides()
      layout()
    })
    const intersect = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      if (visible) run()
    })

    sizeGuides()
    layout()
    resize.observe(element)
    intersect.observe(element)
    element.addEventListener('pointerdown', onDown)
    element.addEventListener('pointermove', onMove)
    element.addEventListener('pointerup', onUp)
    element.addEventListener('pointercancel', onUp)
    element.addEventListener('pointerenter', onEnter)
    element.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      intersect.disconnect()
      element.removeEventListener('pointerdown', onDown)
      element.removeEventListener('pointermove', onMove)
      element.removeEventListener('pointerup', onUp)
      element.removeEventListener('pointercancel', onUp)
      element.removeEventListener('pointerenter', onEnter)
      element.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const initial = (ring: Ring, index: number, total: number) => {
    const { transform, opacity, zIndex } = place(ring, index, total, 0, FALLBACK.width, FALLBACK.height)
    return { transform, opacity, zIndex }
  }
  const guideSize = (ring: Ring) => {
    const { rx, ry } = geometry(ring, FALLBACK.width, FALLBACK.height)
    return { width: rx * 2, height: ry * 2 }
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <ul className="sr-only">
        {technologies.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div
        ref={stage}
        aria-hidden="true"
        className="relative isolate h-88 w-full cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing sm:h-100"
      >
        {(['outer', 'inner'] as const).map((ring) => (
          <div
            key={ring}
            data-guide
            data-ring={ring}
            style={guideSize(ring)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-dashed border-ink/20"
          />
        ))}

        <img
          src="/icon-192.png"
          alt=""
          width={192}
          height={192}
          className="absolute top-1/2 left-1/2 z-100 size-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-line sm:size-24"
        />

        {technologies.map((name, index) => (
          <span
            key={name}
            data-chip
            data-ring="outer"
            data-index={index}
            data-total={technologies.length}
            style={initial('outer', index, technologies.length)}
            className="group absolute top-1/2 left-1/2 inline-flex items-center gap-2 rounded-lg border border-line bg-raised px-2.5 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition-colors duration-300 data-front:border-brand data-front:text-brand sm:gap-2.5 sm:px-4 sm:text-base"
          >
            <HugeIcon icon={techIcons[name] ?? CodeIcon} size={20} className="shrink-0 text-brand" />
            <span className="max-sm:hidden max-sm:group-data-front:inline">{name}</span>
          </span>
        ))}

        {industries.map((industry, index) => (
          <span
            key={industry.label}
            data-chip
            data-ring="inner"
            data-index={index}
            data-total={industries.length}
            style={initial('inner', index, industries.length)}
            className="absolute top-1/2 left-1/2 inline-flex items-center gap-2 rounded-lg border border-line bg-surface-alt px-2.5 py-2 text-sm font-medium whitespace-nowrap text-ink sm:px-3"
          >
            <Icon name={industry.icon} size={20} className="shrink-0 text-ink" />
            <span className="max-sm:sr-only">{industry.label}</span>
          </span>
        ))}
      </div>

      <p aria-hidden="true" className="text-sm text-ink-muted">
        Drag to spin<span className="max-sm:hidden"> · outer ring: technologies · inner ring: industries</span>
      </p>
    </div>
  )
}
