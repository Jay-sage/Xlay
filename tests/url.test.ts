// tests/url.test.ts - Unit tests for the shared outbound link normaliser
//
// Run with: node --test tests/url.test.ts
import { test, describe } from 'node:test'
import assert from 'node:assert/strict'

import { getLinkHostname, normalizeUrl, normalizeUrlOrNull } from '../lib/url.ts'

describe('normalizeUrl — bare domains', () => {
  test('prepends https:// to a bare domain', () => {
    const result = normalizeUrl('Sage.com')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://sage.com/')
    assert.equal(result.hostname, 'sage.com')
  })

  test('prepends https:// to a bare domain with a path', () => {
    const result = normalizeUrl('example.com/about')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://example.com/about')
  })

  test('prepends https:// to a www domain', () => {
    const result = normalizeUrl('www.example.com')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://www.example.com/')
    assert.equal(result.hostname, 'www.example.com')
  })

  test('prepends https:// to a www domain with a path and query', () => {
    const result = normalizeUrl('www.example.com/a/b?c=d')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://www.example.com/a/b?c=d')
  })
})

describe('normalizeUrl — explicit schemes', () => {
  test('keeps an https:// URL', () => {
    const result = normalizeUrl('https://example.com')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://example.com/')
  })

  test('keeps an http:// URL', () => {
    const result = normalizeUrl('http://example.com')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'http://example.com/')
    assert.equal(result.hostname, 'example.com')
  })

  test('preserves the path, query and hash of a full URL', () => {
    const result = normalizeUrl('https://example.com/a/b?c=d#e')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://example.com/a/b?c=d#e')
  })

  test('normalises an uppercase scheme', () => {
    const result = normalizeUrl('HTTPS://EXAMPLE.COM')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://example.com/')
  })

  test('normalises a mixed-case scheme', () => {
    const result = normalizeUrl('Http://Example.com')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'http://example.com/')
  })
})

describe('normalizeUrl — whitespace', () => {
  test('trims surrounding whitespace from a bare domain', () => {
    const result = normalizeUrl('  sage.com  ')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://sage.com/')
  })

  test('trims surrounding whitespace from a full URL', () => {
    const result = normalizeUrl('\n\t https://example.com \n')
    assert.equal(result.ok, true)
    if (!result.ok) return
    assert.equal(result.url, 'https://example.com/')
  })

  test('trims whitespace around a rejected scheme', () => {
    const result = normalizeUrl('   javascript:alert(1)   ')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
  })
})

describe('normalizeUrl — rejected schemes', () => {
  test('rejects javascript:', () => {
    const result = normalizeUrl('javascript:alert(1)')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
    assert.match(result.message, /http/i)
  })

  test('rejects javascript: with a leading // comment style', () => {
    const result = normalizeUrl('javascript:void(0)')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
  })

  test('rejects data:', () => {
    const result = normalizeUrl('data:text/html;base64,PHNjcmlwdD4=')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
  })

  test('rejects mailto:', () => {
    const result = normalizeUrl('mailto:someone@example.com')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
  })

  test('rejects file:', () => {
    const result = normalizeUrl('file:///etc/passwd')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
  })

  test('rejects ftp:', () => {
    const result = normalizeUrl('ftp://example.com/file')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_scheme')
  })
})

describe('normalizeUrl — empty and malformed input', () => {
  test('rejects an empty string', () => {
    const result = normalizeUrl('')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'empty')
  })

  test('rejects a whitespace-only string', () => {
    const result = normalizeUrl('   ')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'empty')
  })

  test('rejects null and undefined', () => {
    assert.equal(normalizeUrl(null).ok, false)
    assert.equal(normalizeUrl(undefined).ok, false)
  })
})

describe('normalizeUrl — hostname validation', () => {
  test('rejects a hostname with no dot', () => {
    const result = normalizeUrl('notadomain')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'no_hostname')
  })

  test('rejects localhost', () => {
    const result = normalizeUrl('localhost')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'no_hostname')
  })

  test('rejects http://localhost', () => {
    const result = normalizeUrl('http://localhost')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'no_hostname')
  })

  test('rejects a scheme with no host', () => {
    const result = normalizeUrl('https://')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_url')
  })

  test('rejects a protocol-relative URL', () => {
    const result = normalizeUrl('//example.com')
    assert.equal(result.ok, false)
    if (result.ok) return
    assert.equal(result.error, 'invalid_url')
  })
})

describe('normalizeUrlOrNull', () => {
  test('returns the normalised URL for valid input', () => {
    assert.equal(normalizeUrlOrNull('Sage.com'), 'https://sage.com/')
  })

  test('returns null for invalid input', () => {
    assert.equal(normalizeUrlOrNull('javascript:alert(1)'), null)
    assert.equal(normalizeUrlOrNull(''), null)
    assert.equal(normalizeUrlOrNull('notadomain'), null)
  })
})

describe('getLinkHostname', () => {
  test('returns the lowercased hostname', () => {
    assert.equal(getLinkHostname('https://Sage.com/about'), 'sage.com')
  })

  test('returns null for an unparseable URL', () => {
    assert.equal(getLinkHostname('not a url'), null)
    assert.equal(getLinkHostname(null), null)
  })
})
