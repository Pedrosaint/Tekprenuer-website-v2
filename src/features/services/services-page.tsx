import { services } from '../../data/site-content'
import { Suspense } from 'react'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { ServiceCard } from '../../components/shared/service-card'
import { Heading } from '../../components/ui/heading'
import { Reveal } from '../../components/ui/reveal'
import { Section } from '../../components/ui/section'
import { TechIndustries } from './tech-industries'

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything you need to build, scale and lead with technology"
        lead="Eight services, one team. Pick what you need today and add more as you grow."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />
      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="all-services-title">
        <Heading id="all-services-title" level={2} className="sr-only">
          All services
        </Heading>
        <div className="@container">
          <ul className="grid gap-5 @lg:grid-cols-2 @4xl:grid-cols-4">
            {services.map((service, index) => (
              <li key={service.slug}>
                <Reveal delay={(index % 4) * 0.07} className="h-full">
                  <ServiceCard service={service} index={index} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      </Suspense>
      <Suspense fallback={null}>
      <TechIndustries />
      </Suspense>
      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
