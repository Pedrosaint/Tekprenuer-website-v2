import { useLocation } from 'react-router-dom'
import { InformationCircleIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { legalDocs, legalReviewed } from '../../data/site-content'
import { PageHero } from '../../components/shared/page-hero'
import { Heading } from '../../components/ui/heading'
import { Section } from '../../components/ui/section'
import { NotFoundContent } from '../not-found/not-found-page'

/** Privacy, Terms and Cookies. One template, three routes. */
export function Component() {
  const { pathname } = useLocation()
  const doc = legalDocs.find((item) => `/${item.slug}` === pathname)
  if (!doc) return <NotFoundContent />

  return (
    <>
      <PageHero
        title={doc.title}
        lead={`Last updated ${new Date(doc.updated).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}`}
        crumbs={[{ label: 'Home', to: '/' }, { label: doc.title }]}
      />
      <Section tone="light" aria-label={doc.title}>
        <div className="mx-auto lg:w-2/3">
        {!legalReviewed && (
          <p className="mb-10 flex items-start gap-3 rounded-card border border-orange-400/50 bg-orange-400/10 p-4 text-sm text-ink">
            <HugeIcon icon={InformationCircleIcon} size={18} className="mt-0.5 shrink-0 text-accent-ink" />
            <span>This is template text pending review by a qualified legal professional.</span>
          </p>
        )}
        <div className="flex flex-col gap-10">
          {doc.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-3">
              <Heading level={2} size="h3">
                {section.heading}
              </Heading>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-ink-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        </div>
      </Section>
    </>
  )
}
