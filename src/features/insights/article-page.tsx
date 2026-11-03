import { useParams } from 'react-router-dom'
import { CtaBand } from '../../components/shared/cta-band'
import { PageHero } from '../../components/shared/page-hero'
import { Section } from '../../components/ui/section'
import { publishedPosts } from '../../lib/content'
import { NotFoundContent } from '../not-found/not-found-page'

export function Component() {
  const { slug } = useParams()
  const post = publishedPosts.find((item) => item.slug === slug)
  if (!post) return <NotFoundContent />

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={post.title}
        lead={post.excerpt}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Insights', to: '/insights' }, { label: post.title }]}
      />
      <Section tone="light" aria-label="Article">
        <article className="mx-auto flex flex-col gap-5 text-lead text-ink-muted lg:w-2/3">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </Section>
      <CtaBand />
    </>
  )
}
