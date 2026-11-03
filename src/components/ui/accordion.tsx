import { useId, useRef, useState } from 'react'
import { Add01Icon } from '@hugeicons/core-free-icons'
import { HugeIcon } from './huge-icon'
import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface AccordionItem {
  question: string
  answer: ReactNode
}

interface AccordionProps {
  items: readonly AccordionItem[]
  /** Heading level for each question, so the page outline stays valid. */
  headingLevel?: 2 | 3 | 4
  allowMultiple?: boolean
  defaultOpen?: number | null
  className?: string
}

/**
 * Accessible accordion (WAI-ARIA pattern): each trigger is a button inside a heading with
 * aria-expanded / aria-controls, closed panels are `inert`, and Up/Down/Home/End move between triggers.
 */
export function Accordion({ items, headingLevel = 3, allowMultiple = false, defaultOpen = 0, className }: AccordionProps) {
  const baseId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set(defaultOpen === null ? [] : [defaultOpen]))
  const Heading = `h${headingLevel}` as const

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(allowMultiple ? current : [])
      if (current.has(index)) next.delete(index)
      else next.add(index)
      return next
    })

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const triggers = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]') ?? [])
    const current = triggers.indexOf(event.currentTarget)
    const moves: Record<string, number> = {
      ArrowDown: (current + 1) % triggers.length,
      ArrowUp: (current - 1 + triggers.length) % triggers.length,
      Home: 0,
      End: triggers.length - 1,
    }
    const target = moves[event.key]
    if (target === undefined) return
    event.preventDefault()
    triggers[target]?.focus()
  }

  return (
    <div ref={listRef} className={cn('flex flex-col gap-3', className)}>
      {items.map((item, index) => {
        const expanded = open.has(index)
        const triggerId = `${baseId}-trigger-${index}`
        const panelId = `${baseId}-panel-${index}`
        return (
          <div
            key={item.question}
            className={cn(
              'rounded-xl border bg-raised transition-colors duration-200',
              expanded ? 'border-ink/50' : 'border-line',
            )}
          >
            <Heading className="font-sans text-base font-medium text-ink sm:text-lg">
              <button
                id={triggerId}
                type="button"
                data-accordion-trigger
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={onKeyDown}
                className="flex min-h-14 w-full items-center justify-between gap-4 rounded-card px-5 py-4 text-left sm:px-6"
              >
                <span>{item.question}</span>
                <HugeIcon icon={Add01Icon}
                  size={20}
                  className={cn('shrink-0 text-brand transition-transform duration-300', expanded && 'rotate-45')}
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!expanded}
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="px-5 pb-5 leading-relaxed text-ink-muted sm:px-6 sm:pb-6">{item.answer}</div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
