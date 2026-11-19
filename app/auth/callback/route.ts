// app/auth/callback/route.ts - Handle Snap OAuth callback
import { exchangeCode, fetchSnapUser } from '@/lib/snap'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://xlay.me'
    : 'http://localhost:3000'

const REDIRECT_URI = `${BASE_URL}/auth/callback`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // User denied consent
  if (error === 'access_denied') {
    return NextResponse.redirect(`${BASE_URL}/auth/denied`)
  }

  if (error) {
    console.error('[auth/callback] Snap error:', error)
    return NextResponse.redirect(`${BASE_URL}/auth/error?reason=snap_error`)
  }

  if (!code || !state) {
    return NextResponse.redirect(`${BASE_URL}/auth/error?reason=missing_params`)
  }

  // Validate PKCE state and retrieve code_verifier
  const cookieStore = await cookies()
  const savedState = cookieStore.get('snap_oauth_state')?.value
  const codeVerifier = cookieStore.get('snap_code_verifier')?.value

  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${BASE_URL}/auth/error?reason=state_mismatch`)
  }

  if (!codeVerifier) {
    return NextResponse.redirect(`${BASE_URL}/auth/error?reason=missing_verifier`)
  }

  const clientId = process.env.SNAP_CLIENT_ID!
  const clientSecret = process.env.SNAP_CLIENT_SECRET!

  try {
    // 1. Exchange code for access token
    const { accessToken } = await exchangeCode({
      code,
      codeVerifier,
      clientId,
      clientSecret,
      redirectUri: REDIRECT_URI,
    })

    // 2. Fetch Snap user info
    const snapUser = await fetchSnapUser(accessToken)

    // 3. Admin Supabase client (server-only)
    const admin = createAdminClient()

    // 4. Look up existing user by snap_external_id
    const { data: existingProfile } = await admin
      .from('profiles')
      .select('id, username')
      .eq('snap_external_id', snapUser.externalId)
      .single()

    let userId: string
    let isNewUser = false

    if (existingProfile) {
      userId = existingProfile.id

      // Update display name and bitmoji if changed
      await admin
        .from('profiles')
        .update({
          display_name: snapUser.displayName,
          avatar_url: snapUser.bitmojiUrl ?? undefined,
          avatar_source: snapUser.bitmojiUrl ? 'bitmoji' : undefined,
        })
        .eq('id', userId)
    } else {
      isNewUser = true

      // Create Supabase auth user
      const { data: authUser, error: authError } = await admin.auth.admin.createUser({
        email: `snap_${snapUser.externalId}@snap.xlay.me`,
        email_confirm: true,
        user_metadata: {
          snap_external_id: snapUser.externalId,
          display_name: snapUser.displayName,
          avatar_url: snapUser.bitmojiUrl,
        },
      })

      if (authError || !authUser.user) {
        console.error('[auth/callback] Create user error:', authError)
        return NextResponse.redirect(`${BASE_URL}/auth/error?reason=create_user_failed`)
      }

      userId = authUser.user.id

      // Insert profile row
      const { error: profileError } = await admin.from('profiles').insert({
        id: userId,
        snap_external_id: snapUser.externalId,
        display_name: snapUser.displayName,
        avatar_url: snapUser.bitmojiUrl,
        avatar_source: snapUser.bitmojiUrl ? 'bitmoji' : 'xlay_avatar',
      })

      if (profileError) {
        console.error('[auth/callback] Insert profile error:', profileError)
        // Clean up orphan auth user
        await admin.auth.admin.deleteUser(userId)
        return NextResponse.redirect(`${BASE_URL}/auth/error?reason=profile_create_failed`)
      }
    }

    // 5. Create a Supabase session via magic link (server-side session)
    const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: `snap_${snapUser.externalId}@snap.xlay.me`,
      options: { redirectTo: isNewUser ? `${BASE_URL}/onboarding` : `${BASE_URL}/dashboard` },
    })

    if (linkError || !linkData.properties?.hashed_token) {
      console.error('[auth/callback] Generate link error:', linkError)
      return NextResponse.redirect(`${BASE_URL}/auth/error?reason=session_failed`)
    }

    // 6. Exchange the OTP token for a session and set cookies
    const response = NextResponse.redirect(
      isNewUser ? `${BASE_URL}/onboarding` : `${BASE_URL}/dashboard`
    )

    // Set session via @supabase/ssr using the OTP token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return [] },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error: verifyError } = await supabase.auth.verifyOtp({
      type: 'magiclink',
      token_hash: linkData.properties.hashed_token,
    })

    if (verifyError) {
      console.error('[auth/callback] Verify OTP error:', verifyError)
      return NextResponse.redirect(`${BASE_URL}/auth/error?reason=session_failed`)
    }

    // Clear PKCE cookies
    response.cookies.delete('snap_oauth_state')
    response.cookies.delete('snap_code_verifier')

    return response
  } catch (err) {
    console.error('[auth/callback] Unexpected error:', err)
    return NextResponse.redirect(`${BASE_URL}/auth/error?reason=unexpected`)
  }
}
