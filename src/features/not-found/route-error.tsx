import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Logo } from '../../components/layout/logo'
import { Button } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import { Section } from '../../components/ui/section'
import { site } from '../../data/site-content'

/** Shown if a route throws (for example a lazy chunk fails to load on a flaky connection). */
export function RouteError() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <Section tone="dark" eager className="flex min-h-screen items-center" aria-labelledby="route-error-title">
      <div className="flex w-full flex-col items-start gap-6 lg:w-1/2">
        <Logo />
        <Heading id="route-error-title" level={1} size="h1" className="text-white">
          {notFound ? 'Page not found' : 'Something went wrong'}
        </Heading>
        <p className="text-lead text-ink-muted">
          {notFound
            ? 'The page you are looking for does not exist.'
            : `The page could not be loaded. Check your connection and try again, or email ${site.contact.email}.`}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => window.location.reload()}>Reload the page</Button>
          <Button href="/" variant="glass">
            Go to the home page
          </Button>
        </div>
      </div>
    </Section>
  )
}
