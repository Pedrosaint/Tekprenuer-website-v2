import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface ControlProps {
  id: string
  name: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
  className: string
}

interface FormFieldProps {
  label: string
  name: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  /** Receives the props to spread onto the input, select or textarea. */
  children: (control: ControlProps) => ReactNode
}

export const controlClass =
  'min-h-12 w-full rounded-control border bg-surface px-4 py-3 text-ink placeholder:text-ink-muted/80 transition-colors'

/** Label + control + hint + inline error, wired together with ids and aria attributes. */
export function FormField({ label, name, error, hint, required, className, children }: FormFieldProps) {
  const base = useId()
  const id = `${base}-${name}`
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-red-600 dark:text-red-300">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-ink-muted">(optional)</span>
        )}
      </label>
      {children({
        id,
        name,
        'aria-invalid': Boolean(error),
        'aria-describedby': describedBy,
        className: cn(controlClass, error ? 'border-red-600 dark:border-red-400' : 'border-line hover:border-ink/40'),
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}
