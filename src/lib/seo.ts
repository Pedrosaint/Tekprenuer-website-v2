/**
 * Pure SEO helpers shared by the app (runtime <Seo/>) and the build plugin
 * (plugins/seo-plugin.ts). No browser or Vite-only APIs in this file.
 */
import { about, faqs, legalDocs, posts, projects, services, site } from '../data/site-content.ts'
import type { Faq, Project, Service } from '../data/site-content.ts'
import { isPlaceholder } from './placeholder.ts'

export type JsonLd = Record<string, unknown>

export interface RouteMeta {
  path: string
  title: string
  description: string
  noindex?: boolean
  priority: number
  jsonLd: JsonLd[]
}

export const SITE_URL = site.url.replace(/\/$/, '')
export const OG_IMAGE = `${SITE_URL}/og-default.png`

export const absoluteUrl = (path: string): string => `${SITE_URL}${path === '/' ? '/' : path.replace(/\/$/, '')}`

export const organizationJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: site.name,
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  email: site.contact.email,
  telephone: site.contact.phone,
  description: site.description,
  address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
  areaServed: 'NG',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: site.contact.email,
    telephone: site.contact.phone,
    availableLanguage: 'English',
  },
  sameAs: site.socials.filter((s) => !isPlaceholder(s.url)).map((s) => s.url),
})

export const websiteJsonLd = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: site.name,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-NG',
})

export const faqJsonLd = (items: readonly Faq[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})

export const serviceJsonLd = (service: Service): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.title,
  description: service.summary,
  url: absoluteUrl(`/services/${service.slug}`),
  serviceType: service.title,
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: 'NG',
})

export const breadcrumbJsonLd = (trail: { name: string; path: string }[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
})

const projectMeta = (project: Project): RouteMeta => ({
  path: `/work/${project.slug}`,
  title: `${project.name}: ${project.category} | ${site.name}`,
  description: `${project.name} is a ${project.category.toLowerCase()} built with ${site.name}. ${project.summary}`,
  priority: 0.6,
  jsonLd: [
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/work' },
      { name: project.name, path: `/work/${project.slug}` },
    ]),
  ],
})

const serviceMeta = (service: Service): RouteMeta => ({
  path: `/services/${service.slug}`,
  title: `${service.title} | ${site.name}`,
  description: `${service.summary} ${service.overview[0] ?? ''}`.slice(0, 158),
  priority: 0.8,
  jsonLd: [
    serviceJsonLd(service),
    faqJsonLd(service.faqs),
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
  ],
})

const publishedPosts = posts.filter((post) => post.status === 'published' && !isPlaceholder(post.title))

/** Every indexable route, in sitemap order. */
export const routeMetas = (): RouteMeta[] => [
  {
    path: '/',
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    priority: 1,
    jsonLd: [faqJsonLd(faqs.filter((f) => f.preview))],
  },
  {
    path: '/about',
    title: `About ${site.name} | Technology meets entrepreneurship`,
    description: about.story.join(' ').slice(0, 158),
    priority: 0.7,
    jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  },
  {
    path: '/services',
    title: `Services: web, apps, software, design & AI | ${site.name}`,
    description:
      'AI solutions, web and app development, UI/UX design, software development, branding, project management, eCommerce and digital marketing for startups.',
    priority: 0.9,
    jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])],
  },
  ...services.map(serviceMeta),
  {
    path: '/work',
    title: `Our work: platforms we have built | ${site.name}`,
    description: 'Selected projects across education, healthcare, eCommerce, property, utilities and startups.',
    priority: 0.8,
    jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Work', path: '/work' }])],
  },
  ...projects.map(projectMeta),
  {
    path: '/process',
    title: `How we work: Design, Development, Launch, Growth | ${site.name}`,
    description: 'Our four-phase process: what happens in each phase, what you get and indicative timelines.',
    priority: 0.7,
    jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Process', path: '/process' }])],
  },
  {
    path: '/pricing',
    title: `Engagement packages: Starter, Growth, Custom | ${site.name}`,
    description: 'Starter, Growth and Custom engagement packages. Every project is scoped individually: request a quote.',
    priority: 0.7,
    jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }])],
  },
  {
    path: '/insights',
    title: `Insights and resources | ${site.name}`,
    description: 'Articles and resources for founders building with technology.',
    // A "coming soon" page is thin content: keep it out of search results until there are real posts.
    noindex: publishedPosts.length === 0,
    priority: 0.5,
    jsonLd: [],
  },
  ...publishedPosts.map(
    (post): RouteMeta => ({
      path: `/insights/${post.slug}`,
      title: `${post.title} | ${site.name}`,
      description: post.excerpt.slice(0, 158),
      priority: 0.5,
      jsonLd: [],
    }),
  ),
  {
    path: '/faq',
    title: `Frequently asked questions | ${site.name}`,
    description: 'Answers about costs, timelines, support and how we work with founders.',
    priority: 0.6,
    jsonLd: [faqJsonLd(faqs), breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }])],
  },
  {
    path: '/contact',
    title: `Contact ${site.name} | Start your project`,
    description: `Tell us about your project. Email ${site.contact.email}, message us on WhatsApp, or send a project brief.`,
    priority: 0.9,
    jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])],
  },
  ...legalDocs.map(
    (doc): RouteMeta => ({
      path: `/${doc.slug}`,
      title: `${doc.title} | ${site.name}`,
      description: doc.description,
      priority: 0.2,
      jsonLd: [],
    }),
  ),
]

export const notFoundMeta: RouteMeta = {
  path: '/404',
  title: `Page not found | ${site.name}`,
  description: 'The page you are looking for does not exist.',
  noindex: true,
  priority: 0,
  jsonLd: [],
}

export const findRouteMeta = (pathname: string): RouteMeta | undefined => {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  return routeMetas().find((meta) => meta.path === clean)
}

const escapeAttr = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const escapeJson = (value: string): string => value.replace(/</g, '\\u003c')

/** Static head markup for one route (used at build time). */
export const renderHead = (meta: RouteMeta): string => {
  const url = absoluteUrl(meta.path === '/404' ? '/' : meta.path)
  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${site.name}" />`,
    `<meta property="og:locale" content="${site.locale}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${site.name}: ${escapeAttr(site.tagline)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
  const blocks = [organizationJsonLd(), websiteJsonLd(), ...meta.jsonLd]
  for (const block of blocks) {
    tags.push(`<script type="application/ld+json" data-seo>${escapeJson(JSON.stringify(block))}</script>`)
  }
  return tags.map((tag) => `    ${tag}`).join('\n')
}
