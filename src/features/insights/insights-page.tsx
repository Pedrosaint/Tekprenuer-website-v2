import { Link } from 'react-router-dom'
import { NewsletterForm } from '../../components/shared/newsletter-form'
import { PageHero } from '../../components/shared/page-hero'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Heading } from '../../components/ui/heading'
import { Section } from '../../components/ui/section'
import { publishedPosts } from '../../lib/content'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Resources for founders building with technology"
        lead="Practical notes on building, launching and growing digital products."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Insights' }]}
      />
      <Section tone="light" aria-label="Articles">
        {publishedPosts.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publishedPosts.map((post) => (
              <li key={post.slug}>
                <Card interactive className="flex h-full flex-col gap-3">
                  <time dateTime={post.date} className="text-sm text-ink-muted">
                    {formatDate(post.date)}
                  </time>
                  <h2 className="font-display text-xl font-medium text-ink">
                    <Link to={`/insights/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-ink-muted">{post.excerpt}</p>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-auto flex w-full flex-col items-center gap-6 text-center lg:w-1/2">
            <Heading level={2}>Our first articles are on the way</Heading>
            <p className="text-lead text-ink-muted">
              We are preparing practical guides for founders. In the meantime, see how we work or tell us about your project.
            </p>
            <NewsletterForm />
            <div className="flex flex-wrap justify-center gap-3">
              <Button to="/process" variant="secondary">
                How we work
              </Button>
              <Button to="/contact" arrow>
                Contact us
              </Button>
            </div>
          </div>
        )}
      </Section>
    </>
  )
}
