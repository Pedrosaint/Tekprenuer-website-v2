import { site, supportPromise } from '../../data/site-content'
import { Call02Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'
import { visibleValues } from '../../lib/content'

export function WhyChooseUs() {
  return (
    <Section tone="light" aria-labelledby="why-title">
      <SectionHeader
        id="why-title"
        eyebrow="Why choose us"
        title="Technology partners who care about your outcome"
        lead="The values behind every project we take on."
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {visibleValues.map((value, index) => (
          <li key={value.title}>
            <Reveal delay={index * 0.08} className="h-full">
              <Card interactive className="flex h-full flex-col gap-4">
                <span className="inline-flex size-16 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon name={value.icon} size={36} />
                </span>
                <h3 className="font-display text-lg font-medium text-ink">{value.title}</h3>
                <p className="text-ink-muted">{value.text}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-8">
        <div className="tone-dark relative overflow-hidden rounded-xl p-8 sm:p-12">
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="flex flex-col gap-4">
              <Heading level={3} size="h2" className="text-white">
                {supportPromise.title}
              </Heading>
              <p className="text-lead text-ink-muted lg:w-4/5">{supportPromise.text}</p>
              <p className="font-medium text-white lg:w-4/5">{site.support.policy}</p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Button href={`tel:${site.contact.phone}`} size="lg" icon={<HugeIcon icon={Call02Icon} size={20} />}>
                Call {site.contact.phoneDisplay}
              </Button>
              <Button to="/faq" variant="glass">
                Browse common questions
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
