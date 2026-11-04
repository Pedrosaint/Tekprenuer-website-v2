import { Link } from 'react-router-dom'
import { site } from '../../data/site-content'
import { Container } from '../ui/container'

/** A real announcement from site-content.ts. Renders nothing while `site.announcement` is null. */
export function AnnouncementBar() {
  const announcement = site.announcement
  if (!announcement) return null
  const { message, href, cta } = announcement
  const isInternal = href?.startsWith('/')

  return (
    <div className="tone-band border-b border-line py-2 text-center text-sm">
      <Container>
        <p className="text-ink">
          {message}{' '}
          {href && cta && (
            isInternal ? (
              <Link to={href} className="font-medium text-accent-ink underline underline-offset-4">
                {cta}
              </Link>
            ) : (
              <a href={href} className="font-medium text-accent-ink underline underline-offset-4">
                {cta}
              </a>
            )
          )}
        </p>
      </Container>
    </div>
  )
}
