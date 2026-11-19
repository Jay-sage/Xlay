// lib/username.ts - Username validation utilities

const RESERVED = new Set([
  'events','admin','superadmin','api','privacy','terms','login',
  'dashboard','auth','invite','upgrade','go','support','about',
  'contact','data-deletion',
])

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/

export type UsernameError =
  | 'too_short'
  | 'too_long'
  | 'invalid_chars'
  | 'reserved'

export function validateUsername(raw: string): UsernameError | null {
  if (raw.length < 3) return 'too_short'
  if (raw.length > 20) return 'too_long'
  if (!USERNAME_RE.test(raw)) return 'invalid_chars'
  if (RESERVED.has(raw.toLowerCase())) return 'reserved'
  return null
}

export const USERNAME_ERROR_MESSAGES: Record<UsernameError, string> = {
  too_short: 'Username must be at least 3 characters.',
  too_long: 'Username must be 20 characters or fewer.',
  invalid_chars: 'Only letters, numbers, and underscores are allowed.',
  reserved: 'That username is reserved.',
}
