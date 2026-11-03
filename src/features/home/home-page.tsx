import { Suspense } from 'react'
import { CtaBand } from '../../components/shared/cta-band'
import { Testimonials } from '../../components/shared/testimonials'
import { AboutTeaser } from './about-teaser'
import { FaqPreview } from './faq-preview'
import { FeaturedWorkSection } from './featured-work-section'
import { HeroSection } from './hero-section'
import { ProcessStrip } from './process-strip'
import { ServicesSection } from './services-section'
import { StatsSection } from './stats-section'
import { WhyChooseUs } from './why-choose-us'

/**
 * Everything below the hero sits in <Suspense> boundaries. Nothing suspends, but React hydrates each
 * boundary as its own low-priority, time-sliced unit, so hydrating a long page never blocks the main thread.
 */
export function HomePage() {
  return (
    <>
      <HeroSection />
      <Suspense fallback={null}>
        <AboutTeaser />
        <StatsSection />
      </Suspense>
      <Suspense fallback={null}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={null}>
        <FeaturedWorkSection />
        <ProcessStrip />
      </Suspense>
      <Suspense fallback={null}>
        <WhyChooseUs />
        <Testimonials />
      </Suspense>
      <Suspense fallback={null}>
        <FaqPreview />
        <CtaBand />
      </Suspense>
    </>
  )
}
