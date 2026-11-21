// app/api/links/route.ts - Create / update links (server-side URL validation)
//
// Link URLs are normalised on the SERVER. The client is never trusted: a hostile
// or buggy client cannot store `javascript:`, `data:` or a bare domain that
// would render as a relative URL on the public card.
//
// This route also logs link clicks when called with a linkId and no write action.
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@/lib/supabase/server'
import { normalizeUrl } from '@/lib/url'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type LinkAction = 'create' | 'update' | 'click'

interface LinkRequestBody {
  action?: LinkAction
  linkId?: string
  url?: string
  platform?: string
  ref?: string
}

/**
 * Resolve the owning profile for the authenticated user, from the session cookie.
 * Links are always scoped to the caller's own profile id.
 */
async function getOwnProfileId(): Promise<string | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) return null
  return data.user.id
}

export async function POST(request: NextRequest) {
  let body: LinkRequestBody
  try {
    body = (await request.json()) as LinkRequestBody
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 })
  }

  const action = body.action ?? (body.linkId ? 'click' : 'create')

  // ---- Click logging (no auth required) -------------------------------
  if (action === 'click') {
    try {
      if (body.linkId) {
        const admin = createAdminClient()
        await admin.from('link_clicks').insert({
          link_id: body.linkId,
          source: body.ref ?? 'direct',
        })
      }
    } catch {
      // Never fail the client's navigation because of logging.
    }
    return NextResponse.json({ ok: true })
  }

  // ---- Create / update ----------------------------------------------
  const ownerId = await getOwnProfileId()
  if (!ownerId) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const normalised = normalizeUrl(body.url)
  if (!normalised.ok) {
    return NextResponse.json(
      { ok: false, error: normalised.error, message: normalised.message },
      { status: 400 }
    )
  }

  const platform = (body.platform ?? 'custom').trim() || 'custom'
  const admin = createAdminClient()

  if (action === 'update') {
    if (!body.linkId) {
      return NextResponse.json({ ok: false, error: 'missing_linkId' }, { status: 400 })
    }

    // Scoped to the owner — a caller cannot edit someone else's link.
    const { data, error } = await admin
      .from('links')
      .update({ url: normalised.url, platform })
      .eq('id', body.linkId)
      .eq('profile_id', ownerId)
      .select('id, platform, url, sort_order, is_active')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ ok: false, error: 'update_failed' }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, link: data })
  }

  // create
  const { data: existing } = await admin
    .from('links')
    .select('sort_order')
    .eq('profile_id', ownerId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1

  const { data, error } = await admin
    .from('links')
    .insert({
      profile_id: ownerId,
      url: normalised.url,
      platform,
      sort_order: nextSortOrder,
      is_active: true,
    })
    .select('id, platform, url, sort_order, is_active')
    .single()

  if (error) {
    return NextResponse.json({ ok: false, error: 'create_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, link: data }, { status: 201 })
}
