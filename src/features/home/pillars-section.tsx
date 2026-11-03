import { pillars } from '../../data/site-content'
import { Icon } from '../../components/ui/icon'
import { Reveal } from '../../components/ui/reveal'
import { TiltCard } from '../../components/ui/tilt-card'

/** The three pillars, shown under the hero on the same navy band. */
export function PillarCards() {
  return (
    <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
      {pillars.map((pillar, index) => (
        <li key={pillar.title} className={index === 2 ? 'sm:col-span-2 lg:col-span-1' : undefined}>
          <Reveal delay={index * 0.1} className="h-full">
            <TiltCard className="h-full rounded-card">
              <div className="flex h-full flex-col gap-4 rounded-xl border border-line bg-raised p-7">
                <span className="inline-flex size-20 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-white/15">
                  <Icon name={pillar.icon} size={48} />
                </span>
                <h2 className="font-display text-xl font-medium text-ink">{pillar.title}</h2>
                <p className="leading-relaxed text-ink-muted">{pillar.text}</p>
              </div>
            </TiltCard>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
