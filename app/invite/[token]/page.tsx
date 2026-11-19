// app/invite/[token]/page.tsx - Best friend invite accept page
import { createServerClient } from '@/lib/supabase/server'
import InviteClient from './InviteClient'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: Promise<{ token: string }> }

export const metadata: Metadata = { title: 'You got invited — Xlay', robots: { index: false } }

export default async function InvitePage({ params }: Props) {
  const { token } = await params
  const supabase = await createServerClient()

  const { data: invite } = await supabase
    .from('best_friend_invites')
    .select(`
      id, status, owner_id,
      owner:profiles!owner_id(display_name, avatar_url, username)
    `)
    .eq('token', token)
    .single()

  if (!invite) notFound()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  let currentProfile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('id, username, display_name, avatar_url').eq('id', user.id).single()
    currentProfile = data
  }

  return (
    <InviteClient
      invite={invite as unknown as {
        id: string
        status: string
        owner_id: string
        owner: { display_name: string; avatar_url: string | null; username: string | null } | null
      }}
      token={token}
      currentProfile={currentProfile as { id: string; username: string | null; display_name: string; avatar_url: string | null } | null}
    />
  )
}
