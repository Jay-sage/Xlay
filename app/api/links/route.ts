// app/api/links/route.ts - Log link clicks
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { linkId?: string; ref?: string }
    if (!body?.linkId) return NextResponse.json({ ok: true })

    const admin = createAdminClient()
    await admin.from('link_clicks').insert({
      link_id: body.linkId,
      source: body.ref ?? 'direct',
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
