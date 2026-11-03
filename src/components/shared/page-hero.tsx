import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { heroImageFor } from '../../lib/hero-images'
import { Badge } from '../ui/badge'
import { Heading } from '../ui/heading'
import { Picture } from '../ui/picture'
import { Section } from '../ui/section'

interface Crumb {
  label: string
  to?: string
}

interface PageHeroProps {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  crumbs?: Crumb[]
  /** Buttons or other actions under the lead. */
  actions?: ReactNode
  /** Extra content shown beside the text on large screens (e.g. a logo tile). */
  aside?: ReactNode
}

/** A monochrome photo under a solid navy layer: every page gets its own header image, no gradients. */
function HeroPhoto({ name }: { name: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <Picture name={name} alt="" priority sizes="100vw" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-navy-950/70" />
    </div>
  )
}

/** Navy hero band used at the top of every inner page. Renders the page's single h1. */
export function PageHero({ eyebrow, title, lead, crumbs, actions, aside }: PageHeroProps) {
  const { pathname } = useLocation()
  const image = heroImageFor(pathname)

  return (
    <Section
      tone="dark"
      spacing="md"
      eager
      className="pt-14 pb-16 sm:pt-20 sm:pb-24"
      backdrop={image ? <HeroPhoto name={image} /> : undefined}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
        <div className="flex w-full flex-col gap-5 lg:w-4/5">
          {crumbs && (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                {crumbs.map((crumb, index) => (
                  <li key={crumb.label} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {crumb.to ? (
                      <Link to={crumb.to} className="transition-colors hover:text-white">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <Badge tone="glass" className="self-start">
              {eyebrow}
            </Badge>
          )}
          <Heading level={1} size="h1" className="text-white">
            {title}
          </Heading>
          {lead && <p className="text-lead text-ink-muted">{lead}</p>}
          {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside}
      </div>
    </Section>
  )
}
