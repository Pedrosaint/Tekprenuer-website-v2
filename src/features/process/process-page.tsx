import { m, useScroll, useSpring } from 'framer-motion'
import { Clock01Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Suspense } from 'react'
import { useRef } from 'react'
import { process, site } from '../../data/site-content'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { Badge } from '../../components/ui/badge'
import { Heading } from '../../components/ui/heading'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section } from '../../components/ui/section'
import { TiltCard } from '../../components/ui/tilt-card'
import { cn } from '../../lib/cn'

function Checklist({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Heading level={3} size="h4" className="text-ink">
        {title}
      </Heading>
      <ul className="flex flex-col gap-2.5">
        {items.map((entry) => (
          <li key={entry} className="flex items-start gap-3 text-ink-muted">
            <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-orange-400/20 text-accent-ink">
              <HugeIcon icon={Tick02Icon} size={12} strokeWidth={3} />
            </span>
            {entry}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Component() {
  const track = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 70%', 'end 70%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <>
      <PageHero
        eyebrow="How we work"
        title="Design, Development, Launch, Growth"
        lead="A clear four-phase process. Here is what happens in each phase, what you get and how long it typically takes."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Process' }]}
      />

      <Suspense fallback={null}>
      <Section tone="light" aria-label="Process phases">
        <ol ref={track} className="relative flex flex-col gap-16 lg:gap-24">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-6 hidden w-px bg-line lg:left-1/2 lg:block" />
          <m.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute top-0 bottom-0 left-6 hidden w-px origin-top bg-orange-400 lg:left-1/2 lg:block"
          />
          {process.map((phase, index) => {
            const flip = index % 2 === 1
            return (
              <li key={phase.slug} className="relative">
                <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-24">
                  <div className={cn('flex justify-center', flip && 'lg:order-2')}>
                    <TiltCard className="rounded-panel" max={10}>
                      <div className="relative flex size-64 items-center justify-center rounded-xl border border-line bg-surface-alt sm:size-72">
                        <Icon name={phase.icon} size={120} className="text-brand" />
                        <span className="absolute top-4 left-4 font-display text-4xl text-ink-muted">
                          {String(phase.step).padStart(2, '0')}
                        </span>
                      </div>
                    </TiltCard>
                  </div>
                  <div className={cn('flex flex-col gap-5', flip && 'lg:order-1')}>
                    <Badge tone="accent" className="self-start">
                      <HugeIcon icon={Clock01Icon} size={14} />
                      {phase.timeline}
                    </Badge>
                    <Heading level={2}>{phase.title}</Heading>
                    <p className="text-lead text-ink-muted">{phase.summary}</p>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Checklist title="What happens" items={phase.happens} />
                      <Checklist title="What you get" items={phase.youGet} />
                    </div>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ol>
        <p className="mx-auto mt-16 text-center lg:w-3/5 text-sm text-ink-muted">
          Timelines are indicative and depend on scope and how quickly feedback comes back. You will get a project-specific plan
          in your proposal. {site.support.policy}
        </p>
      </Section>
      </Suspense>
      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
