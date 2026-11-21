// app/auth/snap/route.ts - Initiate Snap Login Kit OAuth with PKCE
import { buildSnapAuthUrl, generateCodeChallenge, generateCodeVerifier, generateState } from '@/lib/snap'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const clientId = process.env.SNAP_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Snap OAuth not configured' }, { status: 503 })
  }

  const redirectUri =
    process.env.NODE_ENV === 'production'
      ? 'https://xlay.me/auth/callback'
      : 'http://localhost:3000/auth/callback'

  const { searchParams } = new URL(request.url)
  const claim = searchParams.get('claim')?.trim() ?? ''
  const next = searchParams.get('next')?.trim() ?? ''

  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const url = buildSnapAuthUrl({ clientId, redirectUri, state, codeChallenge })

  const response = NextResponse.redirect(url)

  // Store state + verifier in short-lived httpOnly cookies (5 min TTL)
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 300, // 5 minutes
    path: '/',
  }
  response.cookies.set('snap_oauth_state', state, cookieOpts)
  response.cookies.set('snap_code_verifier', codeVerifier, cookieOpts)

  if (claim && /^[a-zA-Z0-9_]{1,20}$/.test(claim)) {
    response.cookies.set('snap_claim_username', claim, cookieOpts)
  }
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    response.cookies.set('snap_oauth_next', next, cookieOpts)
  }

  return response
}
