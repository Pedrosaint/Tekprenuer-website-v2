import { useSyncExternalStore } from 'react'

const noSubscription = () => () => {}

/**
 * False for the prerendered HTML and for the hydration pass, true afterwards (and always true when the page is
 * rendered on the client only). Use it to apply things the server could not know, such as URL parameters, without
 * disagreeing with the server HTML.
 */
export const useHydrated = (): boolean => useSyncExternalStore(noSubscription, () => true, () => false)
