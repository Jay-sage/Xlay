// app/api/views/route.ts - Log card views (rate-limited, bot-filtered, hashed)
import { isBot, normaliseSource, parseDevice, visitorHash } from '@/lib/referrer'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// In-memory rate limit: profile+hash → last logged timestamp
// (Resets on cold start — for production use Upstash KV)
const rateLimitMap = new Map<string, number>()
const RATE_WINDOW_MS = 5 * 60 * 1000 // 5 minutes

export async function POST(request: NextRequest) {
  try {
    const ua = request.headers.get('user-agent') ?? ''

    // Drop bot requests
    if (isBot(ua)) {
      return NextResponse.json({ ok: true })
    }

    const body = await request.json() as { profileId?: string; ref?: string }
    const profileId = body?.profileId
    if (!profileId || typeof profileId !== 'string') {
      return NextResponse.json({ error: 'missing profileId' }, { status: 400 })
    }

    // Get IP from CF header or fallback
    const ip =
      request.headers.get('cf-connecting-ip') ??
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown'

    const country = request.headers.get('cf-ipcountry') ?? undefined

    // Compute visitor hash (IP never stored)
    const hash = await visitorHash(ip, ua)

    // Rate limit: 1 view per visitor per profile per 5 min
    const rlKey = `${profileId}:${hash}`
    const lastLogged = rateLimitMap.get(rlKey) ?? 0
    if (Date.now() - lastLogged < RATE_WINDOW_MS) {
      return NextResponse.json({ ok: true, deduplicated: true })
    }
    rateLimitMap.set(rlKey, Date.now())

    const source = normaliseSource({
      refParam: body.ref ?? null,
      referer: request.headers.get('referer'),
      userAgent: ua,
    })

    const device = parseDevice(ua)

    const admin = createAdminClient()
    await admin.from('card_views').insert({
      profile_id: profileId,
      source,
      device,
      country: country ?? null,
      visitor_hash: hash,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/views]', err)
    return NextResponse.json({ ok: true }) // never error to the client
  }
}
