import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Project } from '../../data/site-content'
import { cn } from '../../lib/cn'
import { HugeIcon } from '../ui/huge-icon'
import { Picture } from '../ui/picture'

// Shown until the real number of pages is measured in the browser (9 projects, 3 per page on desktop).
const FIRST_RENDER_PAGES = 3
const AUTOPLAY_MS = 5000
// How long autoplay stays put after the visitor touches, clicks or presses a key in the carousel.
const HOLD_MS = 8000

/** One project: a white logo card lifted over a translucent info card. The whole card links to the case study. */
function WorkSlide({ project, index, total }: { project: Project; index: number; total: number }) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      className="flex w-full shrink-0 snap-start px-3 md:w-1/2 lg:w-1/3"
    >
      <Link to={`/work/${project.slug}`} className="group relative flex w-full flex-col pt-28">
        <div
          className={cn(
            // Same size and the same margin on both sides for every project, so the logo card sits centred on the card below it.
            'absolute inset-x-6 top-0 z-10 flex h-40 items-center justify-center rounded-2xl p-6',
            project.logoTone === 'light' ? 'bg-navy-950 ring-1 ring-white/30' : 'bg-white',
          )}
        >
          <Picture
            name={project.logo}
            alt={`${project.name} logo`}
            sizes="240px"
            className={cn('h-auto max-h-20 w-auto object-contain', project.logo === 'accessum' && 'max-h-14')}
          />
        </div>
        <div className="flex-1 rounded-2xl border border-white/60 bg-white/10 px-6 pt-21 pb-6 text-white transition-colors duration-300 group-hover:bg-white/20">
          <p className="text-base text-white">{project.category}</p>
          <h3 className="mt-1 font-display text-2xl font-medium text-white">{project.name}</h3>
          <p className="mt-3 text-base leading-relaxed text-white">{project.summary}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-base font-medium text-white">
            View case study
            <HugeIcon
              icon={ArrowUpRight01Icon}
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </div>
  )
}

/**
 * The portfolio carousel from v1, rebuilt: a large coloured panel, three project cards per page that
 * overhang it, and dots (no arrow buttons). It is a native scroll-snap track, so it can be swiped, scrolled and tabbed through;
 * it also advances by itself every few seconds (mouse hover does not stop it), holds for a while after a touch, click or
 * key press and while a keyboard user is focused inside it, and never auto-advances for reduced motion.
 */
export function WorkCarousel({ projects }: { projects: readonly Project[] }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(FIRST_RENDER_PAGES)

  const measure = (element: HTMLDivElement) => {
    const width = element.clientWidth
    if (!width) return
    setPages(Math.max(1, Math.ceil(element.scrollWidth / width - 0.05)))
    setPage(Math.round(element.scrollLeft / width))
  }

  const goTo = (target: number) => {
    const element = track.current
    if (!element) return
    const width = element.clientWidth
    const count = Math.max(1, Math.ceil(element.scrollWidth / width - 0.05))
    const wrapped = ((target % count) + count) % count
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    element.scrollTo({ left: Math.min(wrapped * width, element.scrollWidth - width), behavior: reduced ? 'auto' : 'smooth' })
  }

  useEffect(() => {
    const element = track.current
    const wrapper = root.current
    if (!element || !wrapper) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let holdUntil = 0
    let keyboardFocus = false
    let visible = false
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => measure(element))
    }
    // A touch, click or key press holds the autoplay briefly. Hovering does not, and a clicked dot that keeps focus
    // must not freeze it for good, so only keyboard focus (:focus-visible) pauses it for as long as it stays there.
    const hold = () => {
      holdUntil = performance.now() + HOLD_MS
    }
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) keyboardFocus = true
    }
    const onFocusOut = () => {
      keyboardFocus = false
    }

    const resize = new ResizeObserver(() => measure(element))
    const intersect = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
    })
    resize.observe(element)
    intersect.observe(wrapper)
    element.addEventListener('scroll', onScroll, { passive: true })
    for (const name of ['pointerdown', 'touchstart', 'keydown'] as const) wrapper.addEventListener(name, hold, { passive: true })
    wrapper.addEventListener('focusin', onFocusIn)
    wrapper.addEventListener('focusout', onFocusOut)

    const timer = reduced
      ? undefined
      : window.setInterval(() => {
          if (keyboardFocus || performance.now() < holdUntil || !visible || document.hidden) return
          const width = element.clientWidth
          const count = Math.max(1, Math.ceil(element.scrollWidth / width - 0.05))
          const next = (Math.round(element.scrollLeft / width) + 1) % count
          element.scrollTo({ left: Math.min(next * width, element.scrollWidth - width), behavior: 'smooth' })
        }, AUTOPLAY_MS)

    return () => {
      cancelAnimationFrame(frame)
      if (timer !== undefined) window.clearInterval(timer)
      resize.disconnect()
      intersect.disconnect()
      element.removeEventListener('scroll', onScroll)
      for (const name of ['pointerdown', 'touchstart', 'keydown'] as const) wrapper.removeEventListener(name, hold)
      wrapper.removeEventListener('focusin', onFocusIn)
      wrapper.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      className="relative py-16 sm:py-20"
    >
      {/* The coloured panel the cards overhang. */}
      <div aria-hidden="true" className="absolute inset-x-[5%] inset-y-0 rounded-3xl bg-rust lg:inset-x-[14%]" />

      <div className="relative">
        <div ref={track} className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-none">
          {projects.map((project, index) => (
            <WorkSlide key={project.slug} project={project} index={index} total={projects.length} />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show page ${index + 1} of ${pages}`}
              aria-current={index === page}
              onClick={() => goTo(index)}
              className="flex h-6 min-w-6 items-center justify-center px-1"
            >
              <span
                aria-hidden="true"
                className={cn('block h-2 rounded-full transition-all duration-300', index === page ? 'w-10 bg-white' : 'w-2 bg-white/50')}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
