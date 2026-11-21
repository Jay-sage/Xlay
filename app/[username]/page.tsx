// app/[username]/page.tsx - Public card
import { Card, CardContent } from '@/components/ui/card'
import { createServerClient } from '@/lib/supabase/server'
import { Lock } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicCard from './PublicCard'

interface Props {
  params: Promise<{ username: string }>
  searchParams: Promise<{ ref?: string }>
}

/** Generic metadata for unclaimed or private cards — no personal data leaks. */
const PRIVATE_METADATA: Metadata = {
  title: 'Xlay — Show Up.',
  description: 'Xlay is the Snapchat-native link-in-bio for Nigerian creators, students and event-goers.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://xlay.me' },
  openGraph: {
    title: 'Xlay — Show Up.',
    description: 'Xlay is the Snapchat-native link-in-bio for Nigerian creators, students and event-goers.',
    url: 'https://xlay.me',
    siteName: 'Xlay',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Xlay — Show Up.',
    description: 'Xlay is the Snapchat-native link-in-bio for Nigerian creators, students and event-goers.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('profiles')
    .select('display_name, bio, avatar_url, is_private')
    .eq('username', username.toLowerCase())
    .single()

  // Unclaimed username, or a private card — generic metadata, no personal data.
  if (!data || data.is_private) {
    return PRIVATE_METADATA
  }

  const displayName = data.display_name
  const title = `${displayName} (@${username}) on Xlay`
  const description =
    data.bio?.trim() || `${displayName} is on Xlay. Show up.`
  const url = `https://xlay.me/${username}`

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Xlay',
      type: 'profile',
      // The opengraph-image route for this segment provides the image.
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm rounded-2xl border-border bg-card py-0 text-center shadow-none">
          <CardContent className="space-y-4 p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white/[0.04] text-primary">
              <Lock size={20} aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-display text-xl font-extrabold text-foreground">
                This card is private
              </h1>
              <p className="text-sm text-muted-foreground">
                {profile.display_name} has set their card to private.
              </p>
            </div>
          </CardContent>
        </Card>
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
