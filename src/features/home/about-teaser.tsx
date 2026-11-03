import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { Link } from 'react-router-dom'
import { about } from '../../data/site-content'
import type { IconKey } from '../../data/site-content'
import { Badge } from '../../components/ui/badge'
import { Heading } from '../../components/ui/heading'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section } from '../../components/ui/section'
import { TiltCard } from '../../components/ui/tilt-card'

const tiles: { name: IconKey; label: string }[] = [
  { name: 'design', label: 'Design' },
  { name: 'development', label: 'Development' },
  { name: 'launch', label: 'Launch' },
  { name: 'growth', label: 'Growth' },
]

/** Who-we-are teaser. The paragraph copy is the client's verbatim text. */
export function AboutTeaser() {
  return (
    <Section tone="light" aria-labelledby="about-title">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col items-start gap-5">
          <Badge>Who we are</Badge>
          <Heading id="about-title" level={2}>
            {about.teaserTitle}
          </Heading>
          <p className="text-lead text-ink-muted">{about.teaserBody}</p>
          <p className="text-lead">
            <span className="font-medium text-ink">Our focus is simple</span>
            <span className="text-ink-muted">: {about.teaserFocus}</span>
          </p>
          <Link
            to="/about"
            className="group inline-flex min-h-11 items-center gap-2 text-lg font-medium text-brand underline-offset-4 hover:underline"
          >
            More about Tekprenuers
            <HugeIcon icon={ArrowRight01Icon} size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal delay={0.1}>
          <TiltCard className="rounded-xl" max={4}>
            <ul className="grid grid-cols-2 gap-3 rounded-xl border border-line bg-surface-alt p-3 sm:gap-4 sm:p-4">
              {tiles.map((tile, index) => (
                <li
                  key={tile.name}
                  className="flex aspect-square flex-col justify-between rounded-lg border border-line bg-raised p-4 sm:p-5"
                >
                  <span aria-hidden="true" className="font-display text-base text-ink-muted">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex justify-center text-brand">
                    <Icon name={tile.name} size={96} className="size-20 sm:size-24 lg:size-28" />
                  </span>
                  <span className="text-center font-display text-xl text-ink">{tile.label}</span>
                </li>
              ))}
            </ul>
          </TiltCard>
        </Reveal>
      </div>
    </Section>
  )
}
