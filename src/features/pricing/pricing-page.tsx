import { Suspense } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { faqs, pricing, pricingNotes } from '../../data/site-content'
import { Comparison } from '../../components/shared/comparison'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { Accordion } from '../../components/ui/accordion'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'
import { TiltCard } from '../../components/ui/tilt-card'
import { cn } from '../../lib/cn'

const pricingFaqs = faqs
  .filter((faq) => /cost|long|support/i.test(faq.question))
  .map(({ question, answer }) => ({ question, answer }))

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Engagement packages shaped around your stage"
        lead="Starter, Growth or Custom. Every project is scoped individually, so tell us what you need and we will send a clear written quote."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Pricing' }]}
      />

      <Suspense fallback={null}>
      <Section tone="light" aria-label="Packages">
        <div className="@container">
          <ul className="grid gap-6 @3xl:grid-cols-3">
            {pricing.map((pack, index) => (
              <li key={pack.id}>
                <Reveal delay={index * 0.1} className="h-full">
                  <TiltCard className="h-full rounded-card" max={5}>
                    <div
                      className={cn(
                        'flex h-full flex-col gap-6 rounded-xl border bg-raised p-7 sm:p-8',
                        pack.highlighted ? 'border-orange-400 ring-2 ring-orange-400' : 'border-line',
                      )}
                    >
                      <div className="flex flex-col gap-3">
                        {pack.highlighted && (
                          <Badge tone="accent" className="self-start">
                            Built for scaling teams
                          </Badge>
                        )}
                        <Heading level={2} size="h2">
                          {pack.name}
                        </Heading>
                        <p className="font-medium text-ink">{pack.audience}</p>
                        <p className="text-ink-muted">{pack.summary}</p>
                      </div>
                      <ul className="flex flex-1 flex-col gap-3">
                        {pack.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-ink-muted">
                            <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-orange-400/20 text-accent-ink">
                              <HugeIcon icon={Tick02Icon} size={12} strokeWidth={3} />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        to={`/contact?topic=quote&package=${pack.id}`}
                        variant={pack.highlighted ? 'primary' : 'secondary'}
                        size="lg"
                        fullWidth
                        arrow
                      >
                        {pack.cta}
                      </Button>
                    </div>
                  </TiltCard>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
        <ul className="mx-auto mt-10 flex w-full flex-col gap-2 text-center text-sm text-ink-muted lg:w-3/5">
          {pricingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <Comparison />
      </Suspense>

      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="pricing-faq-title">
        <SectionHeader id="pricing-faq-title" eyebrow="FAQ" title="Questions about working with us" />
        <div className="mx-auto lg:w-2/3">
          <Accordion items={pricingFaqs} defaultOpen={null} />
        </div>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <CtaBand title="Ready for a quote?" lead="Share a few details about your project and we will come back with a clear, written proposal." />
      </Suspense>
    </>
  )
}
