import { Logo } from './logo'

/** Branded placeholder shown while the first route's code chunk loads. */
export function PageLoader() {
  return (
    <div role="status" aria-live="polite" className="tone-band flex min-h-screen flex-col items-center justify-center gap-6">
      <Logo />
      <span aria-hidden="true" className="size-8 animate-spin rounded-full border-2 border-line border-t-orange-400" />
      <span className="sr-only">Loading</span>
    </div>
  )
}
