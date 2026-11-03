import { WorkCarousel } from '../../components/shared/work-carousel'
import { Button } from '../../components/ui/button'
import { Section, SectionHeader } from '../../components/ui/section'
import { projects } from '../../data/site-content'

/** Our work: the carousel from v1 (panel, overhanging cards, dots), cycling through every project. */
export function FeaturedWorkSection() {
  return (
    <Section tone="dark" aria-labelledby="work-title">
      <SectionHeader
        id="work-title"
        eyebrow="Our work"
        title="Platforms we have helped bring to life"
        lead="A selection of products built with founders across education, healthcare, utilities and property."
      />
      <WorkCarousel projects={projects} />
      <div className="mt-6 flex justify-center">
        <Button to="/work" variant="glass" arrow>
          See all work
        </Button>
      </div>
    </Section>
  )
}
