import { Suspense } from 'react'
import { Call02Icon, Mail01Icon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { site } from '../../data/site-content'
import type { IconKey } from '../../data/site-content'
import { PageHero } from '../../components/shared/page-hero'
import { SocialLinks } from '../../components/shared/social-links'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { Section } from '../../components/ui/section'
import { hasBookingUrl, realSocials } from '../../lib/content'
import { whatsappHref } from '../../lib/contact'
import { BriefForm } from './brief-form'

function InfoCard({ icon, title, children }: { icon: IconKey; title: string; children: React.ReactNode }) {
  return (
    <Card className="flex items-start gap-5">
      <span className="inline-flex size-28 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-alt">
        <Icon name={icon} size={56} className="text-brand" />
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
        {children}
      </div>
    </Card>
  )
}

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        lead="We are here to help with questions, project briefs and partnership opportunities. Reach out to Tekprenuers and we will get back to you."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        actions={
          hasBookingUrl ? (
            <Button href={site.contact.bookingUrl} size="lg" arrow>
              Book a free consultation
            </Button>
          ) : undefined
        }
      />

      <Suspense fallback={null}>
      <Section tone="light" aria-label="Contact options and project brief">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
          <Reveal className="flex flex-col gap-5">
            <InfoCard icon="support" title="Customer Support">
              <ul className="flex flex-col gap-2 text-ink-muted">
                <li className="flex items-center gap-2">
                  <HugeIcon icon={Mail01Icon} size={16} className="shrink-0" />
                  <a href={`mailto:${site.contact.email}`} className="break-all hover:text-brand hover:underline">
                    {site.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <HugeIcon icon={Call02Icon} size={16} className="shrink-0" />
                  <a href={`tel:${site.contact.phone}`} className="hover:text-brand hover:underline">
                    {site.contact.phoneDisplay}
                  </a>
                </li>
              </ul>
              <p className="text-sm text-ink-muted">{site.support.policy}</p>
            </InfoCard>

            <InfoCard icon="message" title={realSocials.length > 0 ? 'WhatsApp & Socials' : 'WhatsApp'}>
              <p className="flex items-center gap-2 text-ink-muted">
                <HugeIcon icon={WhatsappIcon} size={16} className="shrink-0" />
                <a
                  href={whatsappHref(site.contact.whatsappWelcome)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand hover:underline"
                >
                  {site.contact.phoneDisplay}
                </a>
              </p>
              {realSocials.length > 0 && (
                <>
                  <p className="text-sm text-ink-muted">Follow us on social media</p>
                  <SocialLinks />
                </>
              )}
            </InfoCard>

            <InfoCard icon="location" title="Office">
              <p className="text-ink-muted">{site.contact.office}</p>
            </InfoCard>
          </Reveal>

          <Reveal delay={0.1}>
            <Card padding="lg" className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Heading level={2} size="h2">
                  Send us a project brief
                </Heading>
                <p className="text-ink-muted">The more you share, the more useful our first reply will be. Fields marked * are required.</p>
              </div>
              <BriefForm />
            </Card>
          </Reveal>
        </div>
      </Section>
      </Suspense>
    </>
  )
}
