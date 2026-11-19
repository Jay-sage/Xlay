// Snap Login Kit OAuth helper
// Docs: https://docs.snap.com/snap-kit/login-kit/Tutorials/oauth2

export const SNAP_AUTH_URL = 'https://accounts.snapchat.com/accounts/oauth2/auth'
export const SNAP_TOKEN_URL = 'https://accounts.snapchat.com/accounts/oauth2/token'
export const SNAP_ME_URL = 'https://kit.snapchat.com/v1/me'

export const SNAP_SCOPES = [
  'https://auth.snapchat.com/oauth2/api/user.display_name',
  'https://auth.snapchat.com/oauth2/api/user.bitmoji.avatar',
  'https://auth.snapchat.com/oauth2/api/user.external_id',
].join(' ')

export interface SnapUser {
  externalId: string
  displayName: string
  bitmojiUrl: string | null
}

/** Generate a PKCE code verifier (43-128 chars, URL-safe) */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(48)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}

/** Derive a PKCE code challenge from a verifier */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64urlEncode(new Uint8Array(digest))
}

/** Generate a random state string */
export function generateState(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}

function base64urlEncode(arr: Uint8Array): string {
  return btoa(String.fromCharCode(...arr))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/** Build the Snapchat authorization URL */
export function buildSnapAuthUrl(params: {
  clientId: string
  redirectUri: string
  state: string
  codeChallenge: string
}): string {
  const url = new URL(SNAP_AUTH_URL)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', params.clientId)
  url.searchParams.set('redirect_uri', params.redirectUri)
  url.searchParams.set('scope', SNAP_SCOPES)
  url.searchParams.set('state', params.state)
  url.searchParams.set('code_challenge', params.codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  return url.toString()
}

/** Exchange authorization code for access token */
export async function exchangeCode(params: {
  code: string
  codeVerifier: string
  clientId: string
  clientSecret: string
  redirectUri: string
}): Promise<{ accessToken: string }> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: params.code,
    redirect_uri: params.redirectUri,
    client_id: params.clientId,
    client_secret: params.clientSecret,
    code_verifier: params.codeVerifier,
  })

  const res = await fetch(SNAP_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Snap token exchange failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  return { accessToken: data.access_token }
}

/** Fetch user info from Snap Kit API */
export async function fetchSnapUser(accessToken: string): Promise<SnapUser> {
  const res = await fetch(SNAP_ME_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Snap user fetch failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  const me = data.data?.me

  if (!me) {
    throw new Error('Invalid Snap API response: missing data.me')
  }

  return {
    externalId: me.externalId,
    displayName: me.displayName ?? '',
    bitmojiUrl: me.bitmoji?.avatar ?? null,
  }
}
