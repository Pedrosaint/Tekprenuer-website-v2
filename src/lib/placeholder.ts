// Anything the client has not supplied is stored as a `TODO(client): ...` string in
// src/data/site-content.ts. The UI uses these helpers to hide placeholder-only content.
export const PLACEHOLDER_TAG = 'TODO(client)'

export const todo = (note: string): string => `${PLACEHOLDER_TAG}: ${note}`

export const isPlaceholder = (value: string | null | undefined): boolean =>
  value == null || value.trim() === '' || value.trim().startsWith(PLACEHOLDER_TAG)

/** Keeps only entries that carry real content. */
export const real = (values: readonly string[]): string[] =>
  values.filter((value) => !isPlaceholder(value))
