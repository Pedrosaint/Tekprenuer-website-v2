import { about, site } from '../../data/site-content'
import { Suspense } from 'react'
import { Comparison } from '../../components/shared/comparison'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { Badge } from '../../components/ui/badge'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Icon } from '../../components/ui/icon'
import { Picture } from '../../components/ui/picture'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'
import { realTeam, visibleValues } from '../../lib/content'

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title={about.teaserTitle}
        lead={about.teaserBody}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="story-title">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <Badge className="self-start">Our story</Badge>
            <Heading id="story-title" level={2}>
              Technology, built around entrepreneurs
            </Heading>
            {about.story.map((paragraph) => (
              <p key={paragraph} className="text-lead text-ink-muted">
                {paragraph}
              </p>
            ))}
            <p className="rounded-card border border-line bg-surface-alt p-5 text-ink">
              <span className="font-medium">Our mission: </span>
              {about.mission}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-xl border border-line">
              <Picture
                name="about-story"
                skeleton
                alt="Two colleagues celebrating a win at a shared desk"
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="aspect-4/3 w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <Section tone="alt" aria-labelledby="principles-title">
        <SectionHeader id="principles-title" eyebrow="How we think" title="Principles we work by" />
        <ul className="grid gap-5 md:grid-cols-3">
          {about.principles.map((principle, index) => (
            <li key={principle.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <Card interactive className="flex h-full flex-col gap-3">
                  <span className="font-display text-3xl text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-xl font-medium text-ink">{principle.title}</h3>
                  <p className="text-ink-muted">{principle.text}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="values-title">
        <SectionHeader id="values-title" eyebrow="Our values" title="What drives every project" />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
          {visibleValues.map((value, index) => (
            <li key={value.title}>
              <Reveal delay={index * 0.08} className="h-full">
                <Card className="flex h-full flex-col gap-4">
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
      </Section>
      </Suspense>

      {realTeam.length > 0 && (
        <Section tone="alt" aria-labelledby="team-title">
          <SectionHeader id="team-title" eyebrow="Team" title="The people behind Tekprenuers" />
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {realTeam.map((member) => (
              <li key={member.name}>
                <Card className="flex flex-col gap-2">
                  <h3 className="font-display text-lg font-medium text-ink">{member.name}</h3>
                  <p className="font-medium text-accent-ink">{member.role}</p>
                  <p className="text-ink-muted">{member.bio}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Suspense fallback={null}>
      <Comparison />
      </Suspense>

      <Suspense fallback={null}>
      <Section tone="light" spacing="md" aria-label="Where we work">
        <p className="mx-auto text-center text-lead text-ink-muted lg:w-3/5">
          {site.name} is remote-first and based in Lagos, Nigeria. We work with founders and businesses wherever they are.
        </p>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
