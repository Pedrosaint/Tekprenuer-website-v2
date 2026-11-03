import { industries, technologies } from '../../data/site-content'
import { TechOrbit } from '../../components/shared/tech-orbit'
import { Heading } from '../../components/ui/heading'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'

/** Technologies (3D ring) and industries served (derived from the portfolio). */
export function TechIndustries() {
  return (
    <Section tone="alt" aria-labelledby="tech-title">
      <SectionHeader
        id="tech-title"
        eyebrow="Technologies & industries"
        title="Modern tools, applied across real industries"
        lead="We choose technology to fit your goals, not the other way round."
      />
      <Reveal>
        <TechOrbit technologies={technologies} industries={industries} />
      </Reveal>

      <div className="mt-16">
        <Heading level={3} className="mb-8 text-center">
          Industries we serve
        </Heading>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {industries.map((industry, index) => (
            <li key={industry.label}>
              <Reveal delay={index * 0.05} y={16} className="h-full">
                <div className="flex h-full items-center gap-4 rounded-card border border-line bg-raised p-4 sm:p-5">
                  <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon name={industry.icon} size={30} />
                  </span>
                  <span className="font-medium text-ink">{industry.label}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
