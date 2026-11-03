import { faqs, site } from '../../data/site-content'
import { Suspense } from 'react'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { Accordion } from '../../components/ui/accordion'
import { Button } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import { Section } from '../../components/ui/section'

const items = faqs.map(({ question, answer }) => ({ question, answer }))

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        lead="Quick answers about costs, timelines, support and how we work with founders."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
      />
      <Suspense fallback={null}>
      <Section tone="light" aria-label="Questions and answers">
        <div className="mx-auto lg:w-2/3">
          <Accordion items={items} headingLevel={2} allowMultiple defaultOpen={0} />
          <div className="mt-12 flex flex-col items-center gap-4 rounded-card border border-line bg-surface-alt p-8 text-center">
            <Heading level={2} size="h3">
              Still have a question?
            </Heading>
            <p className="text-ink-muted">Email {site.contact.email} or send us a message and we will get back to you.</p>
            <Button to="/contact" arrow>
              Contact us
            </Button>
          </div>
        </div>
      </Section>
      </Suspense>
      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
