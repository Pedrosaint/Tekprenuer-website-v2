import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { m, useScroll, useSpring, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { process } from '../../data/site-content'
import { Button } from '../../components/ui/button'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'

/**
 * The link from one step to the next. It lives only in the gap between two tiles (never across them):
 * a dashed track for the road ahead that turns into a solid orange line as the strip scrolls into view,
 * ending in an arrow chip that points at the next step.
 */
function Connector({ index, steps, progress }: { index: number; steps: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [index / (steps - 1), (index + 1) / (steps - 1)], [0, 1], { clamp: true })

  return (
    <span
      aria-hidden="true"
      // Tiles are 9rem wide and centred in their column: start 0.75rem after this tile, stop 0.75rem before the next.
      className="absolute top-18 left-[calc(50%+5.25rem)] hidden h-7 w-[calc(100%-9rem)] -translate-y-1/2 lg:block"
    >
      <span className="absolute inset-x-0 top-[calc(50%-1px)] border-t-2 border-dashed border-ink/25" />
      <m.span style={{ scaleX: fill }} className="absolute inset-x-0 top-[calc(50%-1px)] h-0.5 origin-left bg-orange-400" />
      <span className="absolute top-0 right-0 inline-flex size-7 items-center justify-center rounded-md bg-orange-400 text-navy-950">
        <HugeIcon icon={ArrowRight01Icon} size={18} strokeWidth={2} />
      </span>
    </span>
  )
}

/** Design → Development → Launch → Growth, joined by connectors that fill as the strip scrolls through the viewport. */
export function ProcessStrip() {
  const track = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 85%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <Section tone="alt" aria-labelledby="process-title">
      <SectionHeader
        id="process-title"
        eyebrow="How we work"
        title="From design to growth, in four steps"
        lead="A clear path with regular demos, so you always know where your project stands."
      />
      <ol ref={track} className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {process.map((phase, index) => (
          <li key={phase.slug} className="relative">
            {index < process.length - 1 && <Connector index={index} steps={process.length} progress={progress} />}
            <Reveal delay={index * 0.1} className="flex flex-col items-center gap-4 text-center">
              <span className="relative flex size-36 items-center justify-center rounded-xl bg-brand/10">
                <Icon name={phase.icon} size={72} className="text-brand" />
                <span className="absolute -top-2 -right-2 inline-flex size-8 items-center justify-center rounded-md bg-orange-400 text-sm font-medium text-navy-950">
                  {phase.step}
                </span>
              </span>
              <h3 className="font-display text-xl font-medium text-ink">{phase.title}</h3>
              <p className="text-ink-muted">{phase.summary}</p>
            </Reveal>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex justify-center">
        <Button to="/process" variant="secondary" arrow>
          See our full process
        </Button>
      </div>
    </Section>
  )
}
