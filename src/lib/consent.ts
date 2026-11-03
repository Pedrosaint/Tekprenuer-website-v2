import { useSyncExternalStore } from 'react'

/**
 * Cookie consent. Analytics/advertising (the Google tag in index.html) is only fetched after the
 * visitor accepts: `window.tekLoadAnalytics` is defined in index.html and is called from here.
 */
export type ConsentChoice = 'granted' | 'denied'

interface ConsentState {
  choice: ConsentChoice | null
  /** True while the visitor has re-opened the banner from "Cookie settings". */
  reopened: boolean
}

interface AnalyticsWindow {
  tekLoadAnalytics?: () => void
  tekAnalyticsLoaded?: boolean
  gtag?: (...args: unknown[]) => void
}

const KEY = 'tek-consent'
const listeners = new Set<() => void>()

const read = (): ConsentChoice | null => {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

let state: ConsentState = { choice: read(), reopened: false }
// During the build-time prerender there is no visitor yet: render no banner.
const serverState: ConsentState = { choice: 'denied', reopened: false }

const update = (next: ConsentState) => {
  state = next
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const choose = (choice: ConsentChoice) => {
  try {
    localStorage.setItem(KEY, choice)
  } catch {
    // Storage can be blocked; the choice still applies for this page view.
  }
  const win = window as unknown as AnalyticsWindow
  if (choice === 'granted') {
    win.tekLoadAnalytics?.()
  } else if (win.tekAnalyticsLoaded) {
    win.gtag?.('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }
  update({ choice, reopened: false })
}

export const openCookieSettings = () => update({ ...state, reopened: true })

export function useConsent() {
  const snapshot = useSyncExternalStore(subscribe, () => state, () => serverState)
  return {
    choice: snapshot.choice,
    bannerVisible: snapshot.choice === null || snapshot.reopened,
    accept: () => choose('granted'),
    decline: () => choose('denied'),
  }
}
