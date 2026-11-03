import { hero, trust } from '../../data/site-content'
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { SceneHost } from '../../components/three/scene-host'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import { Magnetic } from '../../components/ui/magnetic'
import { Section } from '../../components/ui/section'
import { bookingTarget } from '../../lib/contact'
import { CityPlaceholder } from './city-placeholder'
import { PillarCards } from './pillars-section'

/**
 * The hero is part of the prerendered HTML and its heading is the page's LCP, so nothing in it starts hidden
 * or animates in: it must be visible from the first paint.
 */
export function HeroSection() {
  return (
    <Section
      tone="dark"
      eager
      spacing="none"
      className="pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24"
      aria-labelledby="hero-title"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:has-data-[scene=off]:grid-cols-1">
        <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
          <Badge tone="glass">{hero.eyebrow}</Badge>

          <Heading id="hero-title" level={1} size="display" className="text-white">
            Promote Your Business With <span className="text-orange-400">Tech</span>
          </Heading>

          <p className="text-lead text-ink-muted lg:w-4/5">{hero.subcopy}</p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Magnetic className="block sm:inline-block">
              <Button to="/services" size="lg" arrow fullWidth>
                {hero.primaryCta}
              </Button>
            </Magnetic>
            <Button
              {...bookingTarget()}
              variant="glass"
              size="lg"
              icon={<HugeIcon icon={Calendar03Icon} size={20} />}
            >
              {hero.secondaryCta}
            </Button>
          </div>

          <p className="flex items-center gap-3 text-base font-medium text-white">
            <span aria-hidden="true" className="h-0.5 w-8 bg-orange-400" />
            {trust.clientCount ? `Trusted by ${trust.clientCount}+ businesses` : trust.headline}
          </p>
        </div>

        {/* No picture: a flat placeholder holds this space (so nothing jumps) until the live 3D city has drawn. */}
        <SceneHost variant="city" className="relative w-full data-[scene=off]:hidden" fallback={<CityPlaceholder />} />
      </div>

      <PillarCards />
    </Section>
  )
}
