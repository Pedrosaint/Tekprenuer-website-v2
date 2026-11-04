import { Suspense } from 'react'
import { LinkSquare02Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Link, useParams } from 'react-router-dom'
import { projects } from '../../data/site-content'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { LogoTile, ProjectCard } from '../../components/shared/project-card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Reveal } from '../../components/ui/reveal'
import { Section, SectionHeader } from '../../components/ui/section'
import { caseStudyContent, getProject, servicesForProject } from '../../lib/content'
import { NotFoundContent } from '../not-found/not-found-page'

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm font-medium text-ink-muted">{label}</dt>
      <dd className="font-medium text-ink">{children}</dd>
    </div>
  )
}

export function Component() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFoundContent />

  const study = caseStudyContent(project)
  const relatedServices = servicesForProject(project)
  const others = projects.filter((item) => item.slug !== project.slug).slice(0, 3)
  const narrative = [
    { title: 'The challenge', body: study.problem },
    { title: 'Our solution', body: study.solution },
    { title: 'The outcome', body: study.outcome },
  ].filter((block): block is { title: string; body: string } => block.body !== null)

  return (
    <>
      <PageHero
        eyebrow={project.category}
        title={project.name}
        lead={project.summary}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Work', to: '/work' }, { label: project.name }]}
        actions={
          <>
            <Button to={`/contact?topic=${relatedServices[0]?.slug ?? 'quote'}`} size="lg" arrow>
              Start a similar project
            </Button>
            {study.liveUrl && (
              <Button href={study.liveUrl} variant="secondary" size="lg" icon={<HugeIcon icon={LinkSquare02Icon} size={18} />}>
                Visit live site
              </Button>
            )}
          </>
        }
        aside={<LogoTile project={project} className="hidden h-44 w-72 lg:flex" />}
      />

      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="overview-title">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <Card padding="lg" className="flex flex-col gap-6">
              <Heading id="overview-title" level={2} size="h3">
                Project overview
              </Heading>
              <dl className="grid gap-5">
                <Fact label="Client">{project.caseStudy.client}</Fact>
                <Fact label="Category">{project.category}</Fact>
                <Fact label="Sector">{project.sector}</Fact>
                {relatedServices.length > 0 && (
                  <Fact label="Services">
                    <ul className="flex flex-wrap gap-2 pt-1">
                      {relatedServices.map((service) => (
                        <li key={service.slug}>
                          <Link
                            to={`/services/${service.slug}`}
                            className="inline-flex min-h-8 items-center rounded-md bg-royal-700/10 px-3 text-sm font-medium text-brand hover:underline dark:bg-royal-300/10"
                          >
                            {service.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Fact>
                )}
                {study.stack.length > 0 && (
                  <Fact label="Tech stack">
                    <ul className="flex flex-wrap gap-2 pt-1">
                      {study.stack.map((tech) => (
                        <li key={tech}>
                          <Badge tone="outline">{tech}</Badge>
                        </li>
                      ))}
                    </ul>
                  </Fact>
                )}
              </dl>
            </Card>
          </Reveal>

          <div className="flex flex-col gap-8">
            <Reveal delay={0.1}>
              <p className="text-lead text-ink-muted">
                <strong className="font-medium text-ink">{project.name}</strong> is a {project.category.toLowerCase()}.{' '}
                {project.summary}
              </p>
            </Reveal>
            {narrative.map((block, index) => (
              <Reveal key={block.title} delay={0.1 + index * 0.05} className="flex flex-col gap-3">
                <Heading level={3}>{block.title}</Heading>
                <p className="text-ink-muted">{block.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      </Suspense>

      {study.screenshots.length > 0 && (
        <Section tone="alt" aria-labelledby="screens-title">
          <SectionHeader id="screens-title" eyebrow="Screens" title="A closer look" />
          <ul className="grid gap-5 sm:grid-cols-2">
            {study.screenshots.map((shot) => (
              <li key={shot}>
                <img src={shot} alt={`${project.name} screenshot`} loading="lazy" className="w-full rounded-card border border-line" />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Suspense fallback={null}>
      <Section tone={study.screenshots.length > 0 ? 'light' : 'alt'} aria-labelledby="more-title">
        <SectionHeader id="more-title" eyebrow="More work" title="Other projects" />
        <div className="@container">
          <ul className="grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-3">
            {others.map((item) => (
              <li key={item.slug}>
                <ProjectCard project={item} />
              </li>
            ))}
          </ul>
        </div>
      </Section>
      </Suspense>

      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
