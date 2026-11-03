import { AnimatePresence, LazyMotion, m } from 'framer-motion'
import { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { projects } from '../../data/site-content'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { ProjectCard } from '../../components/shared/project-card'
import { Heading } from '../../components/ui/heading'
import { Section } from '../../components/ui/section'
import { sectors } from '../../lib/content'
import { cn } from '../../lib/cn'

const loadLayoutFeatures = () => import('../../lib/motion-layout-features').then((module) => module.default)

export function Component() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('sector') ?? 'All'
  const active = sectors.includes(requested) ? requested : 'All'
  const visible = active === 'All' ? projects : projects.filter((project) => project.sector === active)

  const choose = (sector: string) => setParams(sector === 'All' ? {} : { sector }, { replace: true, preventScrollReset: true })

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Platforms built with founders across Nigeria"
        lead="Education, healthcare, utilities, property and more. Filter by sector and open any project for its case study."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Work' }]}
      />
      <LazyMotion features={loadLayoutFeatures} strict>
      <Suspense fallback={null}>
      <Section tone="light" aria-labelledby="portfolio-title">
        <Heading id="portfolio-title" level={2} className="sr-only">
          Projects
        </Heading>
        <div role="group" aria-label="Filter projects by sector" className="mb-10 flex flex-wrap justify-center gap-2">
          {sectors.map((sector) => (
            <button
              key={sector}
              type="button"
              aria-pressed={sector === active}
              onClick={() => choose(sector)}
              className={cn(
                'inline-flex min-h-11 items-center rounded-lg border-2 px-5 text-base font-medium transition-colors',
                sector === active
                  ? 'border-cta bg-cta text-cta-ink'
                  : 'border-line bg-raised text-ink hover:border-ink',
              )}
            >
              {sector}
            </button>
          ))}
        </div>
        <p role="status" className="sr-only">
          Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          {active === 'All' ? '' : ` in ${active}`}
        </p>

        <div className="@container">
          <m.ul layout className="grid gap-5 @xl:grid-cols-2 @4xl:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <m.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={project} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
        </div>
      </Section>
      </Suspense>
      </LazyMotion>
      <Suspense fallback={null}>
      <CtaBand />
      </Suspense>
    </>
  )
}
