import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { ArrowLeft01Icon, ArrowRight01Icon, QuoteDownIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { useEffect, useState } from 'react'
import { realTestimonials } from '../../lib/content'
import { cn } from '../../lib/cn'
import { Section, SectionHeader } from '../ui/section'

/** Testimonial carousel. Renders only when real, approved testimonials exist in site-content.ts. */
export function Testimonials() {
  const items = realTestimonials
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (items.length < 2 || paused || reduced) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), 7000)
    return () => window.clearInterval(timer)
  }, [items.length, paused, reduced])

  if (items.length === 0) return null
  const current = items[index % items.length]
  if (!current) return null
  const step = (delta: number) => setIndex((value) => (value + delta + items.length) % items.length)

  return (
    <Section tone="alt" aria-labelledby="testimonials-title">
      <SectionHeader id="testimonials-title" eyebrow="Testimonials" title="What our clients say" />
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="mx-auto flex w-full flex-col items-center gap-8 lg:w-3/4"
      >
        <div aria-live={paused ? 'polite' : 'off'} className="min-h-56 w-full">
          <AnimatePresence mode="wait">
            <m.figure
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(index % items.length) + 1} of ${items.length}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <HugeIcon icon={QuoteDownIcon} size={36} className="text-accent-ink" />
              <blockquote className="font-display text-xl leading-relaxed text-ink sm:text-2xl">{current.quote}</blockquote>
              <figcaption className="text-ink-muted">
                <span className="font-medium text-ink">{current.name}</span>, {current.role}, {current.company}
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => step(-1)}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-raised"
            >
              <HugeIcon icon={ArrowLeft01Icon} size={20} />
            </button>
            <div className="flex gap-2">
              {items.map((item, dot) => (
                <button
                  key={item.name}
                  type="button"
                  aria-label={`Show testimonial ${dot + 1}`}
                  aria-current={dot === index % items.length}
                  onClick={() => setIndex(dot)}
                  className="group flex size-8 items-center justify-center"
                >
                  <span className={cn('h-1.5 rounded-sm transition-all', dot === index % items.length ? 'w-8 bg-brand' : 'w-4 bg-line group-hover:bg-ink/40')} />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => step(1)}
              className="inline-flex size-11 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-raised"
            >
              <HugeIcon icon={ArrowRight01Icon} size={20} />
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}
