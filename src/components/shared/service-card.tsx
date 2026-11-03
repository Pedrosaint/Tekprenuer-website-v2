import { Link } from 'react-router-dom'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import type { Service } from '../../data/site-content'
import { Icon } from '../ui/icon'
import { TiltCard } from '../ui/tilt-card'

/** Service card: a solid block with a very large icon, then the copy. One link to the detail page. */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <TiltCard className="h-full rounded-xl" max={5}>
      <Link
        to={`/services/${service.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-raised transition-colors duration-300 hover:border-ink/50"
      >
        <div className="flex h-40 items-center justify-between bg-brand/10 px-6 text-brand">
          <Icon name={service.icon} size={88} className="transition-transform duration-300 group-hover:scale-110" />
          <span aria-hidden="true" className="font-display text-3xl text-ink-muted">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-display text-xl font-medium text-ink">{service.title}</h3>
          <p className="flex-1 text-ink-muted">{service.summary}</p>
          <span className="inline-flex items-center gap-1 text-base font-medium text-brand">
            Learn more
            <HugeIcon icon={ArrowUpRight01Icon}
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </TiltCard>
  )
}
