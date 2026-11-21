// app/api/account/delete/route.ts - Server-side permanent account & data deletion
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Remove any user-owned files in Storage (ignore missing-file errors)
  await Promise.allSettled([
    admin.storage.from('music').remove([`${user.id}/track.mp3`, `${user.id}/track.m4a`]),
    admin.storage.from('avatars').remove([`${user.id}/avatar`]),
  ])

  // Delete the Supabase Auth user — cascades to profiles, links, invites, views, clicks
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return NextResponse.json({ ok: false, error: 'delete_failed' }, { status: 500 })
  }

  // Clear session cookies
  await supabase.auth.signOut()

  return NextResponse.json({ ok: true })
}
