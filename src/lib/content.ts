import { posts, projects, services, testimonials, values, about, site } from '../data/site-content'
import type { Project, Service } from '../data/site-content'
import { isPlaceholder, real } from './placeholder'

/**
 * Derived views of src/data/site-content.ts. Anything that is empty or placeholder-only is
 * filtered out here, so pages can render these lists and hide a section when they are empty.
 */
export const publishedPosts = posts.filter((post) => post.status === 'published' && !isPlaceholder(post.title))

export const visibleValues = values.filter((value) => value.confirmed)

export const realTestimonials = testimonials.filter(
  (item) => !isPlaceholder(item.quote) && !isPlaceholder(item.name),
)

export const realTeam = about.team.filter((member) => !isPlaceholder(member.name))

export const featuredProjects = projects.filter((project) => project.featured)

export const sectors = ['All', ...Array.from(new Set(projects.map((project) => project.sector)))]

export const getService = (slug: string | undefined): Service | undefined => services.find((service) => service.slug === slug)

export const getProject = (slug: string | undefined): Project | undefined => projects.find((project) => project.slug === slug)

export const projectsForService = (service: Service): Project[] =>
  service.projectSlugs.map((slug) => getProject(slug)).filter((project): project is Project => project !== undefined)

export const servicesForProject = (project: Project): Service[] =>
  project.serviceSlugs.map((slug) => getService(slug)).filter((service): service is Service => service !== undefined)

/** Case-study fields with any TODO(client) placeholders removed. */
export const caseStudyContent = (project: Project) => {
  const { problem, solution, outcome, stack, screenshots, liveUrl } = project.caseStudy
  return {
    problem: isPlaceholder(problem) ? null : problem,
    solution: isPlaceholder(solution) ? null : solution,
    outcome: isPlaceholder(outcome) ? null : outcome,
    stack: real(stack),
    screenshots: real(screenshots),
    liveUrl: isPlaceholder(liveUrl) ? null : liveUrl,
  }
}

export const realSocials = site.socials.filter((social) => !isPlaceholder(social.url))

export const hasBookingUrl = !isPlaceholder(site.contact.bookingUrl)
