import { useRef, useState } from 'react'
import { Alert02Icon, CheckmarkCircle02Icon, Mail01Icon, WhatsappIcon } from '@hugeicons/core-free-icons'
import { HugeIcon } from '../../components/ui/huge-icon'
import type { ChangeEvent, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { budgetRanges, pricing, services, timelines } from '../../data/site-content'
import { useHydrated } from '../../lib/use-hydrated'
import { Button } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import {
  briefToText,
  emptyBrief,
  mailtoHref,
  submitBrief,
  validateBrief,
  whatsappHref,
} from '../../lib/contact'
import type { BriefErrors, BriefValues } from '../../lib/contact'
import { FormField } from './form-field'

type Status = 'idle' | 'sending' | 'sent' | 'fallback'

const serviceOptions = ['Free consultation', ...services.map((service) => service.title), 'Something else']

/** The interest named by ?topic= (a service slug or "consultation"), or '' when there is none. */
const serviceForTopic = (topic: string | null): string =>
  topic === 'consultation' ? 'Free consultation' : (services.find((item) => item.slug === topic)?.title ?? '')

const messageForPackage = (id: string | null): string => {
  const pack = pricing.find((item) => item.id === id)
  return pack ? `I would like a quote for the ${pack.name} package.\n\n` : ''
}

const fieldOrder: (keyof BriefValues)[] = ['name', 'email', 'phone', 'company', 'service', 'budget', 'timeline', 'message']

export function BriefForm() {
  const [params] = useSearchParams()
  const hydrated = useHydrated()
  const topic = params.get('topic')
  const packageId = params.get('package')

  // What the visitor has typed or chosen. The URL (?topic=, ?package=) only supplies the starting point behind it. It is
  // applied once the page has hydrated: the prerendered HTML has no URL parameters, and React would otherwise keep the
  // server's empty selection after hydration.
  const [edits, setEdits] = useState<Partial<BriefValues>>({})
  const values: BriefValues = {
    ...emptyBrief,
    ...(hydrated ? { service: serviceForTopic(topic), message: messageForPackage(packageId) } : {}),
    ...edits,
  }

  // A different ?topic= (the header "Book" button pressed while this form is open) replaces an earlier choice of interest.
  const [seenTopic, setSeenTopic] = useState(topic)
  if (topic !== seenTopic) {
    setSeenTopic(topic)
    setEdits((current) => {
      const next = { ...current }
      delete next.service
      return next
    })
  }
  const [errors, setErrors] = useState<BriefErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [openedAt] = useState(() => Date.now())
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const set = (name: keyof BriefValues) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.value
    setEdits((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const validateField = (name: keyof BriefValues) => () => {
    const message = validateBrief(values)[name]
    setErrors((current) => ({ ...current, [name]: message }))
  }

  const focusResult = () => window.setTimeout(() => resultRef.current?.focus(), 50)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const found = validateBrief(values)
    setErrors(found)
    const firstInvalid = fieldOrder.find((name) => found[name])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    setStatus('sending')
    const result = await submitBrief(values, openedAt)
    setStatus(result)
    focusResult()
  }

  if (status === 'sent') {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="flex flex-col items-start gap-4 rounded-card border border-line bg-raised p-8 outline-none"
      >
        <HugeIcon icon={CheckmarkCircle02Icon} size={40} className="text-green-600 dark:text-green-400" />
        <Heading level={2} size="h3">
          Thank you, {values.name.split(' ')[0]}. Your brief is in.
        </Heading>
        <p className="text-ink-muted">
          We will reply to {values.email} within one working day (office hours 9am–5pm, Monday to Saturday).
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setEdits({})
            setStatus('idle')
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  if (status === 'fallback') {
    const text = briefToText(values)
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="alert"
        className="flex flex-col items-start gap-4 rounded-card border border-orange-400/60 bg-orange-400/10 p-8 outline-none"
      >
        <HugeIcon icon={Alert02Icon} size={36} className="text-accent-ink" />
        <Heading level={2} size="h3">
          One more step to send your brief
        </Heading>
        <p className="text-ink-muted">
          We could not send your message automatically from this page. Your details are saved below. Send them using email or
          WhatsApp and we will pick it up from there.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href={mailtoHref(values)} icon={<HugeIcon icon={Mail01Icon} size={18} />}>
            Send by email
          </Button>
          <Button href={whatsappHref(text)} variant="secondary" icon={<HugeIcon icon={WhatsappIcon} size={18} />}>
            Send on WhatsApp
          </Button>
        </div>
        <Button variant="ghost" onClick={() => setStatus('idle')}>
          Edit my message
        </Button>
      </div>
    )
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-5" aria-label="Project brief">
      {errorCount > 0 && (
        <p role="alert" className="rounded-control border border-red-600/50 bg-red-600/10 p-3 text-sm font-medium text-red-800 dark:text-red-200">
          Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} below.
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" name="name" required error={errors.name}>
          {(control) => (
            <input
              {...control}
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={set('name')}
              onBlur={validateField('name')}
            />
          )}
        </FormField>
        <FormField label="Email" name="email" required error={errors.email}>
          {(control) => (
            <input
              {...control}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={set('email')}
              onBlur={validateField('email')}
            />
          )}
        </FormField>
        <FormField label="Phone / WhatsApp" name="phone" error={errors.phone} hint="Include your country code, e.g. +234.">
          {(control) => (
            <input
              {...control}
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={values.phone}
              onChange={set('phone')}
              onBlur={validateField('phone')}
            />
          )}
        </FormField>
        <FormField label="Company" name="company" error={errors.company}>
          {(control) => (
            <input {...control} type="text" autoComplete="organization" value={values.company} onChange={set('company')} />
          )}
        </FormField>
        <FormField label="I am interested in" name="service" required error={errors.service} className="sm:col-span-2">
          {(control) => (
            <select {...control} value={values.service} onChange={set('service')} onBlur={validateField('service')}>
              <option value="">Choose an option…</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField label="Budget range" name="budget" error={errors.budget}>
          {(control) => (
            <select {...control} value={values.budget} onChange={set('budget')}>
              <option value="">Select a range…</option>
              {budgetRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField label="Timeline" name="timeline" error={errors.timeline}>
          {(control) => (
            <select {...control} value={values.timeline} onChange={set('timeline')}>
              <option value="">Select a timeline…</option>
              {timelines.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField
          label="Tell us about your project"
          name="message"
          required
          error={errors.message}
          hint="What are you building, who is it for, and what does success look like?"
          className="sm:col-span-2"
        >
          {(control) => (
            <textarea
              {...control}
              rows={6}
              value={values.message}
              onChange={set('message')}
              onBlur={validateField('message')}
              className={`${control.className} resize-y`}
            />
          )}
        </FormField>
      </div>

      {/* Honeypot: hidden from people and assistive tech. Bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set('website')} />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-muted">
          By sending this you agree to our handling of your details as described in the Privacy Policy.
        </p>
        <Button type="submit" size="lg" disabled={status === 'sending'} arrow>
          {status === 'sending' ? 'Sending…' : 'Send project brief'}
        </Button>
      </div>
    </form>
  )
}
