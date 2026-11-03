import { site } from '../../data/site-content'
import { Calendar03Icon, Call02Icon, Mail01Icon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { bookingTarget, whatsappHref } from '../../lib/contact'
import { OrbitFallback } from '../three/orbit-fallback'
import { SceneHost } from '../three/scene-host'
import { Button } from '../ui/button'
import { Heading } from '../ui/heading'
import { Reveal } from '../ui/reveal'
import { Section } from '../ui/section'

interface CtaBandProps {
  title?: string
  lead?: string
}

/** Final conversion band: headline, booking CTA and direct phone / email / WhatsApp buttons, over a live 3D orbit scene. */
export function CtaBand({
  title = "Let's build something that grows your business",
  lead = 'Tell us what you are working on. We will reply with clear next steps, not a sales script.',
}: CtaBandProps) {
  return (
    <Section
      tone="dark"
      aria-labelledby="cta-title"
      backdrop={
        <SceneHost
          variant="orbit"
          fallback={<div className="h-full w-full"><OrbitFallback /></div>}
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full opacity-50 sm:w-3/5 sm:opacity-90 lg:w-1/2"
        />
      }
    >
      <Reveal className="flex w-full flex-col gap-6 lg:w-3/5">
        <Heading id="cta-title" level={2} size="h1" className="text-white">
          {title}
        </Heading>
        <p className="text-lead text-ink-muted">{lead}</p>
        <div className="flex flex-wrap gap-3">
          <Button {...bookingTarget()} size="lg" icon={<HugeIcon icon={Calendar03Icon} size={20} />}>
            Book a free consultation
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={`tel:${site.contact.phone}`} variant="glass" icon={<HugeIcon icon={Call02Icon} size={18} />}>
            {site.contact.phoneDisplay}
          </Button>
          <Button href={`mailto:${site.contact.email}`} variant="glass" icon={<HugeIcon icon={Mail01Icon} size={18} />}>
            Email us
          </Button>
          <Button
            href={whatsappHref(site.contact.whatsappWelcome)}
            variant="glass"
            icon={<HugeIcon icon={WhatsappIcon} size={18} />}
          >
            WhatsApp
          </Button>
        </div>
        <p className="text-sm text-ink-muted">{site.support.policy}</p>
      </Reveal>
    </Section>
  )
}
