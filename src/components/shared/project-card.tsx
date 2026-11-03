import { Link } from 'react-router-dom'
import { ArrowUpRight01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import type { Project } from '../../data/site-content'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/badge'
import { Picture } from '../ui/picture'
import { TiltCard } from '../ui/tilt-card'

/** Logo on a tile that always keeps enough contrast: white tile for dark logos, navy tile for white ones. */
export function LogoTile({ project, className }: { project: Project; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-lg p-6',
        project.logoTone === 'light' ? 'bg-navy-950' : 'bg-white',
        className,
      )}
    >
      <Picture
        name={project.logo}
        alt={`${project.name} logo`}
        sizes="240px"
        className={cn('h-auto max-h-16 w-auto object-contain', project.logo === 'accessum' && 'max-h-12')}
      />
    </div>
  )
}

/** Portfolio card: logo tile, category, one-line outcome and a link to the case study. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full rounded-xl" max={4}>
      <Link
        to={`/work/${project.slug}`}
        className="group flex h-full flex-col gap-5 rounded-xl border border-line bg-raised p-4 transition-colors duration-300 hover:border-ink/50"
      >
        <LogoTile project={project} className="h-36 ring-1 ring-line" />
        <div className="flex flex-1 flex-col gap-3 px-2 pb-2">
          <Badge tone="brand" className="self-start">
            {project.category}
          </Badge>
          <h3 className="font-display text-xl font-medium text-ink">{project.name}</h3>
          <p className="flex-1 text-ink-muted">{project.summary}</p>
          <span className="inline-flex items-center gap-1 text-base font-medium text-brand">
            View case study
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
