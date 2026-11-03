import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../ui/button'

type Status = 'idle' | 'sending' | 'done' | 'error'

function NewsletterFormInner({ endpoint }: { endpoint: string }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setStatus('error')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'tekprenuers.com' }),
      })
      setStatus(response.ok ? 'done' : 'error')
      if (response.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3" aria-labelledby={`${id}-label`}>
      <label id={`${id}-label`} htmlFor={`${id}-email`} className="text-sm font-medium text-ink">
        Get occasional insights for founders
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={status === 'error'}
          aria-describedby={`${id}-status`}
          className="min-h-12 flex-1 rounded-lg border border-line bg-raised px-5 text-ink placeholder:text-ink-muted"
        />
        <Button type="submit" size="md" disabled={status === 'sending'}>
          {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </div>
      <p id={`${id}-status`} role="status" className="min-h-5 text-sm text-ink-muted">
        {status === 'done' && 'Thanks, you are subscribed.'}
        {status === 'error' && 'Please enter a valid email and try again.'}
      </p>
    </form>
  )
}

/** Newsletter signup. Stays hidden until VITE_NEWSLETTER_ENDPOINT is configured. */
export function NewsletterForm() {
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT
  if (!endpoint) return null
  return <NewsletterFormInner endpoint={endpoint} />
}
