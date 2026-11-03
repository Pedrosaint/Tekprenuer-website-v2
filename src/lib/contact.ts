import { site } from '../data/site-content'
import { isPlaceholder } from './placeholder'

export interface BriefValues {
  name: string
  email: string
  phone: string
  company: string
  service: string
  budget: string
  timeline: string
  message: string
  /** Honeypot: real visitors never see or fill this. */
  website: string
}

export type BriefErrors = Partial<Record<keyof BriefValues, string>>

export const emptyBrief: BriefValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  message: '',
  website: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[0-9()\s-]{7,20}$/

export const validateBrief = (values: BriefValues): BriefErrors => {
  const errors: BriefErrors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!EMAIL.test(values.email.trim())) errors.email = 'Enter a valid email, like name@company.com.'
  if (values.phone.trim() && !PHONE.test(values.phone.trim())) errors.phone = 'Enter a valid phone number, e.g. +234 801 234 5678.'
  if (!values.service) errors.service = 'Please choose what you are interested in.'
  if (values.message.trim().length < 20) errors.message = 'Tell us a little more (at least 20 characters).'
  return errors
}

export type SubmitResult = 'sent' | 'fallback'

const MIN_FILL_MS = 1000

/**
 * Sends the brief to VITE_CONTACT_ENDPOINT. Resolves 'fallback' when no endpoint is configured or the
 * request fails, so the UI can offer the mailto / WhatsApp routes instead of losing the enquiry.
 */
export async function submitBrief(values: BriefValues, openedAt: number): Promise<SubmitResult> {
  // Bots fill the honeypot or submit instantly. Pretend success so they learn nothing.
  if (values.website.trim() || Date.now() - openedAt < MIN_FILL_MS) return 'sent'

  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT
  if (!endpoint) return 'fallback'

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 10_000)
  try {
    const { name, email, phone, company, service, budget, timeline, message } = values
    const fields = { name, email, phone, company, service, budget, timeline, message }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...fields, source: site.url, sentAt: new Date().toISOString() }),
      signal: controller.signal,
    })
    return response.ok ? 'sent' : 'fallback'
  } catch {
    return 'fallback'
  } finally {
    window.clearTimeout(timeout)
  }
}

export const briefToText = (values: BriefValues): string => {
  const optional = (label: string, value: string): string[] => (value.trim() ? [`${label}: ${value.trim()}`] : [])
  return [
    'New project brief (tekprenuers.com)',
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    ...optional('Phone', values.phone),
    ...optional('Company', values.company),
    `Interested in: ${values.service}`,
    ...optional('Budget', values.budget),
    ...optional('Timeline', values.timeline),
    '',
    values.message.trim(),
  ].join('\n')
}

export const mailtoHref = (values: BriefValues): string =>
  `mailto:${site.contact.email}?subject=${encodeURIComponent(`Project enquiry from ${values.name}`)}&body=${encodeURIComponent(briefToText(values))}`

export const whatsappHref = (text: string): string => `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`

/** Booking link when the client has supplied one, otherwise the contact form pre-set to a consultation. */
export const bookingTarget = (): { href: string } | { to: string } =>
  isPlaceholder(site.contact.bookingUrl) ? { to: '/contact?topic=consultation' } : { href: site.contact.bookingUrl }
