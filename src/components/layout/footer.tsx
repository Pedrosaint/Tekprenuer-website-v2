import { Link } from 'react-router-dom'
import { Call02Icon, Location01Icon, Mail01Icon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { legalNav, services, site } from '../../data/site-content'
import { publishedPosts } from '../../lib/content'
import { whatsappHref } from '../../lib/contact'
import { openCookieSettings } from '../../lib/consent'
import { NewsletterForm } from '../shared/newsletter-form'
import { SocialLinks } from '../shared/social-links'
import { Container } from '../ui/container'
import { Logo } from './logo'

const sitemap = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
  { label: 'Process', to: '/process' },
  { label: 'Pricing', to: '/pricing' },
  ...(publishedPosts.length > 0 ? [{ label: 'Insights', to: '/insights' }] : []),
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

const linkClass = 'inline-flex min-h-8 items-center text-ink-muted transition-colors hover:text-white'

export function Footer() {
  return (
    <footer className="tone-dark border-t border-white/10 pt-16 pb-8">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1fr_1.1fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="text-ink-muted">{site.description}</p>
            <p className="text-sm text-ink-muted">{site.support.policy}</p>
            <SocialLinks />
            <NewsletterForm />
          </div>

          <nav aria-label="Sitemap">
            <h2 className="mb-4 font-sans text-base font-medium text-white">Sitemap</h2>
            <ul className="flex flex-col">
              {sitemap.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="mb-4 font-sans text-base font-medium text-white">Services</h2>
            <ul className="flex flex-col">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/services/${service.slug}`} className={linkClass}>
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 font-sans text-base font-medium text-white">Contact</h2>
            <ul className="flex flex-col gap-3 text-ink-muted">
              <li className="flex items-start gap-3">
                <HugeIcon icon={Mail01Icon} size={18} className="mt-1 shrink-0 text-orange-400" />
                <a href={`mailto:${site.contact.email}`} className="transition-colors hover:text-white">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HugeIcon icon={Call02Icon} size={18} className="mt-1 shrink-0 text-orange-400" />
                <a href={`tel:${site.contact.phone}`} className="transition-colors hover:text-white">
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HugeIcon icon={WhatsappIcon} size={18} className="mt-1 shrink-0 text-orange-400" />
                <a
                  href={whatsappHref(site.contact.whatsappWelcome)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Message us on WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HugeIcon icon={Location01Icon} size={18} className="mt-1 shrink-0 text-orange-400" />
                <span>
                  {site.contact.office}
                  <br />
                  <span className="text-sm">Office hours: {site.support.hours}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}.{' '}
            <a href={site.url} className="transition-colors hover:text-white">
              www.tekprenuers.com
            </a>
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 md:pr-20">
            {legalNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={openCookieSettings} className={linkClass}>
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  )
}
