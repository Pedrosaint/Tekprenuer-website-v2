import { comparison } from '../../data/site-content'
import { AlertCircleIcon, ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import { Reveal } from '../ui/reveal'
import { Section, SectionHeader } from '../ui/section'

/** "Why founders choose us": common frustrations on the left, how we work on the right. */
export function Comparison() {
  return (
    <Section tone="alt" aria-labelledby="comparison-title">
      <SectionHeader id="comparison-title" eyebrow="Why founders choose us" title={comparison.title} lead={comparison.intro} />
      <ul className="mx-auto flex w-full flex-col gap-4 lg:w-5/6">
        {comparison.rows.map((row, index) => (
          <li key={row.pain}>
            <Reveal delay={index * 0.06} y={16}>
              <div className="grid items-stretch overflow-hidden rounded-card border border-line bg-raised md:grid-cols-[1fr_auto_1fr]">
                <div className="flex items-start gap-3 p-5 sm:p-6">
                  <HugeIcon icon={AlertCircleIcon} size={20} className="mt-0.5 shrink-0 text-ink-muted" />
                  <p className="text-ink-muted">
                    <span className="sr-only">Common frustration: </span>
                    {row.pain}
                  </p>
                </div>
                <div className="hidden items-center px-2 text-accent-ink md:flex">
                  <HugeIcon icon={ArrowRight01Icon} size={22} />
                </div>
                <div className="flex items-start gap-3 bg-royal-700/5 p-5 sm:p-6 dark:bg-royal-300/5">
                  <span className="mt-1 inline-block size-2.5 shrink-0 rounded-sm bg-orange-400" aria-hidden="true" />
                  <p className="font-medium text-ink">
                    <span className="sr-only">With Tekprenuers: </span>
                    {row.answer}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
