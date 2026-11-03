import { pageHeroImages, services } from '../data/site-content.ts'

/** The page-header photo for a pathname, or undefined. Pure: used by <PageHero/> and by the build plugin. */
export const heroImageFor = (pathname: string): string | undefined => {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
  const direct = pageHeroImages[clean]
  if (direct) return direct
  const service = services.find((item) => clean === `/services/${item.slug}`)
  if (service) return service.heroImage
  if (clean.startsWith('/work/')) return pageHeroImages['/work/:slug']
  if (clean.startsWith('/insights/')) return pageHeroImages['/insights']
  return undefined
}
