/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** POST endpoint for the project-brief form (e.g. Formspree, Getform or your own API). Optional. */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** POST endpoint for the newsletter signup. The signup stays hidden while this is empty. */
  readonly VITE_NEWSLETTER_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
