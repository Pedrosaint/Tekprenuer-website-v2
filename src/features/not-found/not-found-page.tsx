import { Button } from '../../components/ui/button'
import { Compass01Icon, Home01Icon, Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Heading } from '../../components/ui/heading'
import { Section } from '../../components/ui/section'
import { OrbitFallback } from '../../components/three/orbit-fallback'
import { SceneHost } from '../../components/three/scene-host'

/** Branded 404. Also rendered by detail pages when a slug does not exist. */
export function NotFoundContent() {
  return (
    <Section
      tone="band"
      eager
      className="flex min-h-[70vh] items-center"
      aria-labelledby="not-found-title"
      backdrop={
        <SceneHost
          variant="orbit"
          fallback={<div className="h-full w-full"><OrbitFallback /></div>}
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        />
      }
    >
      <div className="flex w-full flex-col items-start gap-6 lg:w-3/5">
        <p className="font-display text-7xl font-medium text-accent-ink sm:text-8xl" aria-hidden="true">
          404
        </p>
        <Heading id="not-found-title" level={1} size="h1" className="text-ink">
          This page drifted out of orbit
        </Heading>
        <p className="text-lead text-ink-muted">
          The page you are looking for does not exist or has moved. Let us get you back on course.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button to="/" size="lg" icon={<HugeIcon icon={Home01Icon} size={20} />}>
            Back to home
          </Button>
          <Button to="/services" variant="secondary" size="lg" icon={<HugeIcon icon={Compass01Icon} size={20} />}>
            Explore services
          </Button>
          <Button to="/contact" variant="secondary" size="lg" icon={<HugeIcon icon={Mail01Icon} size={20} />}>
            Contact us
          </Button>
        </div>
      </div>
    </Section>
  )
}

export const Component = NotFoundContent
