import { Suspense } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Link, useParams } from 'react-router-dom'
import { services } from '../../data/site-content'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { ProjectCard } from '../../components/shared/project-card'
import { Accordion } from '../../components/ui/accordion'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'
import { getService, projectsForService } from '../../lib/content'
import { NotFoundContent } from '../not-found/not-found-page'

export function Component() {
  const { slug } = useParams()
  const service = getService(slug)
  if (!service) return <NotFoundContent />

  const projects = projectsForService(service)
  const others = services.filter((item) => item.slug !== service.slug)

  return (
    <>
      <PageHero
        eyebrow="Service"
        title={service.title}
        lead={service.summary}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]}
        actions={
          <>
            <Button to={`/contact?topic=${service.slug}`} size="lg" arrow>
              Request a quote
            </Button>
            <Button to="/contact?topic=consultation" variant="glass" size="lg">
              Book a free consultation
            </Button>
          </>
        }
        aside={
          <span className="hidden size-56 items-center justify-center rounded-xl bg-white/5 text-white ring-1 ring-white/15 lg:inline-flex">
            <Icon name={service.icon} size={128} />
          </span>
        }
      />

      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="overview-title">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal className="flex flex-col gap-5">
            <Badge className="self-start">Overview</Badge>
            <Heading id="overview-title" level={2}>
              How we help
            </Heading>
            {service.overview.map((paragraph) => (
              <p key={paragraph} className="text-lead text-ink-muted">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.1}>
            <Card padding="lg" className="flex flex-col gap-4">
              <Heading level={3}>What&apos;s included</Heading>
              <ul className="flex flex-col gap-3">
                {service.included.map((entry) => (
                  <li key={entry} className="flex items-start gap-3 text-ink-muted">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-orange-400/20 text-accent-ink">
                      <HugeIcon icon={Tick02Icon} size={14} strokeWidth={3} />
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <Section tone="alt" aria-labelledby="deliverables-title">
        <SectionHeader id="deliverables-title" eyebrow="Deliverables" title="What you can expect to receive" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.deliverables.map((deliverable, index) => (
            <li key={deliverable}>
              <Reveal delay={index * 0.06} y={16} className="h-full">
                <Card className="flex h-full items-start gap-4">
                  <span className="font-display text-3xl text-ink-muted">{String(index + 1).padStart(2, '0')}</span>
                  <p className="pt-1 font-medium text-ink">{deliverable}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <Heading level={3}>Technology we typically use</Heading>
          <ul className="flex flex-wrap justify-center gap-2">
            {service.tech.map((tech) => (
              <li key={tech}>
                <Badge tone="outline" className="px-4 py-2 text-sm">
                  {tech}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      </Suspense>

      {projects.length > 0 && (
        <Section tone="light" aria-labelledby="projects-title">
          <SectionHeader id="projects-title" eyebrow="Relevant work" title={`${service.title} in practice`} />
          <div className="@container">
            <ul className="grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-3">
              {projects.map((project) => (
                <li key={project.slug}>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Suspense fallback={null}>
      <Section tone={projects.length > 0 ? 'alt' : 'light'} aria-labelledby="service-faq-title">
        <SectionHeader id="service-faq-title" eyebrow="FAQ" title={`${service.title}: common questions`} />
        <div className="mx-auto lg:w-2/3">
          <Accordion items={service.faqs} />
        </div>
        <nav aria-label="Other services" className="mt-16">
          <Heading level={3} className="mb-6 text-center">
            Explore other services
          </Heading>
          <ul className="flex flex-wrap justify-center gap-2">
            {others.map((other) => (
              <li key={other.slug}>
                <Link
                  to={`/services/${other.slug}`}
                  className="inline-flex min-h-11 items-center rounded-lg border border-line bg-raised px-5 text-base font-medium text-ink transition hover:border-orange-400"
                >
                  {other.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
