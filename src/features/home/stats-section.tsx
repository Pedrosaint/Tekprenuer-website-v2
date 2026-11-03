import { stats } from '../../data/site-content'
import { CountUp } from '../../components/ui/count-up'
import { Reveal } from '../../components/ui/reveal'
import { Section } from '../../components/ui/section'

/** Impact numbers. They count up once when scrolled into view. 24/7 is a label, not a counter. */
export function StatsSection() {
  return (
    <Section tone="dark" spacing="md" aria-label="Impact in numbers">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 0.08} className="flex flex-col items-center gap-2 text-center">
            <dt className="order-2 text-base font-medium text-ink-muted">{stat.label}</dt>
            <dd className="order-1 font-display text-4xl font-medium text-white sm:text-5xl">
              {stat.display ? <span>{stat.display}</span> : <CountUp to={stat.value} suffix={stat.suffix} />}
            </dd>
            {stat.note && <dd className="order-3 text-sm text-ink-muted">{stat.note}</dd>}
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
