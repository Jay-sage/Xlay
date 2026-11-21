// lib/url.ts - Shared outbound link URL normalisation
//
// Links are stored by users as free text ("Sage.com"), which renders as a
// relative URL and breaks on the public card. Everything that accepts a link
// must run it through `normalizeUrl` first, server-side, so a hostile client
// can never store `javascript:` or `data:` in the links table.

export type UrlErrorCode =
  | 'empty'
  | 'invalid_scheme'
  | 'invalid_url'
  | 'no_hostname'

export const URL_ERROR_MESSAGES: Record<UrlErrorCode, string> = {
  empty: 'Enter a link.',
  invalid_scheme: 'Links must start with http:// or https://.',
  invalid_url: 'That does not look like a valid link.',
  no_hostname: 'Enter a full website address, like example.com.',
}

export type NormalizeUrlResult =
  | { ok: true; url: string; hostname: string }
  | { ok: false; error: UrlErrorCode; message: string }

/** Schemes we allow for outbound links. Everything else is rejected. */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

/**
 * Normalise a user-entered link into an absolute http(s) URL.
 *
 * - trims surrounding whitespace
 * - prepends "https://" when no scheme is present
 * - accepts only http and https (rejects javascript:, data:, mailto:, ...)
 * - requires a hostname containing a dot (so "localhost" and "foo" are refused)
 *
 * Never throws — returns a discriminated result so callers can surface a
 * friendly message in the form.
 */
export function normalizeUrl(input: string | null | undefined): NormalizeUrlResult {
  const trimmed = (input ?? '').trim()

  if (trimmed.length === 0) {
    return { ok: false, error: 'empty', message: URL_ERROR_MESSAGES.empty }
  }

  // A protocol-relative URL ("//example.com") is ambiguous — reject it rather
  // than letting the https:// prefix silently resolve it.
  if (trimmed.startsWith('//')) {
    return { ok: false, error: 'invalid_url', message: URL_ERROR_MESSAGES.invalid_url }
  }

  // Detect a scheme. A scheme is letters/digits/+/-/. followed by ":".
  // Anything else (including "//host" and "javascript:") is treated as schemeless
  // and will be rejected below rather than silently reinterpreted.
  const schemeMatch = trimmed.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/)
  const hasScheme = schemeMatch !== null
  const scheme = hasScheme ? `${schemeMatch![1].toLowerCase()}:` : null

  if (hasScheme && !ALLOWED_PROTOCOLS.has(scheme!)) {
    return {
      ok: false,
      error: 'invalid_scheme',
      message: URL_ERROR_MESSAGES.invalid_scheme,
    }
  }

  const candidate = hasScheme ? trimmed : `https://${trimmed}`

  let parsed: URL
  try {
    parsed = new URL(candidate)
  } catch {
    return { ok: false, error: 'invalid_url', message: URL_ERROR_MESSAGES.invalid_url }
  }

  if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
    return {
      ok: false,
      error: 'invalid_scheme',
      message: URL_ERROR_MESSAGES.invalid_scheme,
    }
  }

  // Require a real hostname with a dot — rejects "", "localhost", "foo".
  const hostname = parsed.hostname.toLowerCase()
  if (!hostname || !hostname.includes('.')) {
    return { ok: false, error: 'no_hostname', message: URL_ERROR_MESSAGES.no_hostname }
  }

  // Strip the default port so "https://example.com:443/" normalises cleanly.
  parsed.hostname = hostname

  return { ok: true, url: parsed.toString(), hostname }
}

/**
 * Convenience wrapper for callers that only need the URL string.
 * Returns null when the input is not a valid link.
 */
export function normalizeUrlOrNull(input: string | null | undefined): string | null {
  const result = normalizeUrl(input)
  return result.ok ? result.url : null
}

/**
 * Extract a display hostname ("sage.com") from a stored link, for use as the
 * accessible name and tooltip on custom links.
 */
export function getLinkHostname(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).hostname.toLowerCase()
  } catch {
    return null
  }
}
