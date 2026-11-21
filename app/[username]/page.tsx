// app/[username]/page.tsx - Public card
import type { Metadata } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicCard from './PublicCard'

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url, is_private')
    .eq('username', username.toLowerCase())
    .single()

  if (!data || data.is_private) {
    return { title: 'Xlay', robots: { index: false } }
  }

  return {
    title: `${data.display_name} — Xlay`,
    description: data.bio ?? `${data.display_name}'s Xlay card. Show Up.`,
    openGraph: {
      title: `${data.display_name} (@${username})`,
      description: data.bio ?? `Check out ${data.display_name}'s Xlay card.`,
      images: data.avatar_url ? [{ url: data.avatar_url, width: 400, height: 400 }] : [],
      url: `https://xlay.me/${username}`,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${data.display_name} — Xlay`,
      description: data.bio ?? `Check out ${data.display_name}'s card at xlay.me/${username}`,
    },
  }
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { username } = await params
  const { ref } = await searchParams

  const supabase = await createServerClient()

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, avatar_source, avatar_pose, bio, theme_id, accent_color, bg_type, bg_url, music_url, music_title, streak_count, snap_score, show_streak, show_score, show_views, is_private')
    .eq('username', username.toLowerCase())
    .single()

  if (!profile) notFound()

  if (profile.is_private) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-4">
          <div className="text-4xl">🔒</div>
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            This card is private
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {profile.display_name} has set their card to private.
          </p>
        </div>
      </main>
    )
  }

  // Fetch links and best friends
  const [{ data: links }, { data: friends }] = await Promise.all([
    supabase.from('links').select('id, platform, url, sort_order').eq('profile_id', profile.id).eq('is_active', true).order('sort_order'),
    supabase.from('best_friend_invites')
      .select(`id, friend_profile_id, profiles!friend_profile_id(display_name, avatar_url, username)`)
      .eq('owner_id', profile.id)
      .eq('status', 'accepted'),
  ])

  // Fetch view count (if owner wants to show it)
  let viewCount: number | null = null
  if (profile.show_views) {
    const { count } = await supabase.from('card_views').select('id', { count: 'exact', head: true }).eq('profile_id', profile.id)
    viewCount = count
  }

  return (
    <PublicCard
      profile={profile}
      links={links ?? []}
      friends={(friends ?? []) as unknown as Array<{ id: string; profiles: { display_name: string; avatar_url: string | null; username: string | null } | null }>}
      viewCount={viewCount}
      refSource={ref ?? null}
    />
  )
}
