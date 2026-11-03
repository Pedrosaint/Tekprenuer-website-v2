import { services } from '../../data/site-content'
import { ServiceCard } from '../../components/shared/service-card'
import { Button } from '../../components/ui/button'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'

export function ServicesSection() {
  return (
    <Section tone="light" aria-labelledby="services-title">
      <SectionHeader
        id="services-title"
        eyebrow="What we do"
        title="Services built for founders who want to grow"
        lead="From first idea to a product people love, everything you need under one roof."
      />
      {/* Container query: columns respond to the width of this block, not the viewport. */}
      <div className="@container">
        <ul className="grid gap-5 @md:grid-cols-2 @4xl:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={(index % 4) * 0.07} className="h-full">
                <ServiceCard service={service} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-12 flex justify-center">
        <Button to="/services" variant="secondary" arrow>
          All services
        </Button>
      </div>
    </Section>
  )
}
