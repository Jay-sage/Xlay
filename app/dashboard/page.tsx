// app/dashboard/page.tsx - Xlay Dashboard Overview: metrics, Card Readiness, quick edit & live preview
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createServerClient } from '@/lib/supabase/server'
import {
  ArrowUpRight,
  AtSign,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  Link2,
  Music,
  Palette,
  Settings,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import CardPreview from './CardPreview'

const QUICK_ACTIONS = [
  {
    href: '/dashboard/themes',
    Icon: Palette,
    title: 'Customize Card',
    desc: 'Theme preset, accent glow & 3D Bitmoji pose',
  },
  {
    href: '/dashboard/links',
    Icon: Link2,
    title: 'Social Links',
    desc: 'Add handles or custom URLs & drag to reorder',
  },
  {
    href: '/dashboard/music',
    Icon: Music,
    title: 'Soundtrack',
    desc: 'Pick an Apple Music 30s track that plays on tap',
  },
  {
    href: '/dashboard/friends',
    Icon: Users,
    title: 'Best Friends',
    desc: 'Feature up to 3 Snap friends on your card',
  },
  {
    href: '/dashboard/share',
    Icon: Share2,
    title: 'Share Card',
    desc: 'Copy tagged links for Snap, WhatsApp & TikTok',
  },
  {
    href: '/dashboard/settings',
    Icon: Settings,
    title: 'Account & Bio',
    desc: 'Edit your display name, bio, or @handle',
  },
]

function getSevenDaysAgoIso() {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
}

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const sevenDaysAgo = getSevenDaysAgoIso()

  const [
    { data: profile },
    { data: links },
    { data: friends },
    { count: totalViews },
    { count: weeklyViews },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase
      .from('links')
      .select('*')
      .eq('profile_id', user!.id)
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('best_friend_invites')
      .select(
        `
      id,
      friend_profile_id,
      profiles!friend_profile_id (
        display_name,
        avatar_url,
        username
      )
    `
      )
      .eq('owner_id', user!.id)
      .eq('status', 'accepted'),
    supabase
      .from('card_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user!.id),
    supabase
      .from('card_views')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', user!.id)
      .gte('viewed_at', sevenDaysAgo),
  ])

  const normalisedFriends = (friends ?? []).map((f) => ({
    id: f.id,
    friend_profile_id: f.friend_profile_id,
    profiles: Array.isArray(f.profiles) ? (f.profiles[0] ?? null) : f.profiles,
  }))

  const activeLinksCount = links?.length ?? 0
  const friendsCount = normalisedFriends.length
  const viewsCount = totalViews ?? 0
  const recentViewsCount = weeklyViews ?? 0

  // 5-step Xlay Card Readiness checklist (20% each)
  const checklist = [
    {
      id: 'bio',
      label: 'Add a short bio',
      href: '/dashboard/settings',
      Icon: FileText,
      done: Boolean(profile?.bio?.trim()),
    },
    {
      id: 'links',
      label: 'Add a social link',
      href: '/dashboard/links',
      Icon: Link2,
      done: activeLinksCount > 0,
    },
    {
      id: 'theme',
      label: 'Customize theme or 3D pose',
      href: '/dashboard/themes',
      Icon: Palette,
      done: Boolean(
        (profile?.theme_id && profile.theme_id !== 'midnight') ||
          profile?.accent_color ||
          (profile?.avatar_pose && profile.avatar_pose !== '30415970')
      ),
    },
    {
      id: 'music',
      label: 'Set a 30s soundtrack',
      href: '/dashboard/music',
      Icon: Music,
      done: Boolean(profile?.music_url),
    },
    {
      id: 'friends',
      label: 'Invite a Best Friend',
      href: '/dashboard/friends',
      Icon: Users,
      done: friendsCount > 0,
    },
  ]

  const completedSteps = checklist.filter((s) => s.done).length
  const completionPct = Math.round((completedSteps / checklist.length) * 100)

  return (
    <div className="mx-auto max-w-6xl space-y-7 p-5 sm:p-6 md:p-8">
      {/* Header */}
      <BlurFade delay={0.02}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Overview
            </h1>
            <p className="mt-1 text-xs text-white/50 sm:text-sm">
              Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''} — your card is
              live at{' '}
              <span className="font-medium text-white/85">xlay.me/{profile?.username}</span>
            </p>
          </div>

          {profile?.username && (
            <Button asChild size="default" className="rounded-xl font-semibold">
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                View live card
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            </Button>
          )}
        </div>
      </BlurFade>

      {/* Top 3 Xlay-native metric cards (no UID, no aliases) */}
      <BlurFade delay={0.05}>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {/* Handle */}
          <Link href="/dashboard/settings" className="group block">
            <Card className="h-full rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none transition-colors group-hover:border-white/[0.14]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Your Handle</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-white/55 transition-colors group-hover:text-[var(--color-accent)]">
                    <AtSign size={14} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 truncate font-display text-xl font-extrabold tracking-tight text-white">
                  {profile?.username ?? '—'}
                </p>
                <p className="mt-1 text-[11px] text-white/40">
                  xlay.me/{profile?.username ?? 'username'}
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Card Views */}
          <Link href="/dashboard/stats" className="group block">
            <Card className="h-full rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none transition-colors group-hover:border-white/[0.14]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Card Views</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-white/55 transition-colors group-hover:text-[var(--color-accent)]">
                    <Eye size={14} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 font-display text-xl font-extrabold tracking-tight text-white">
                  {viewsCount.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-white/40">
                  +{recentViewsCount.toLocaleString()} in the last 7 days
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Active Links & Best Friends */}
          <Link href="/dashboard/links" className="group block">
            <Card className="h-full rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none transition-colors group-hover:border-white/[0.14]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/50">Card Activity</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-white/55 transition-colors group-hover:text-[var(--color-accent)]">
                    <Link2 size={14} aria-hidden="true" />
                  </span>
                </div>
                <p className="mt-3 font-display text-xl font-extrabold tracking-tight text-white">
                  {activeLinksCount} {activeLinksCount === 1 ? 'link' : 'links'}
                </p>
                <p className="mt-1 text-[11px] text-white/40">
                  {friendsCount}/3 Best Friends · {profile?.music_url ? 'Soundtrack on' : 'No soundtrack'}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </BlurFade>

      {/* Main 2-column layout: Card Readiness + Quick Edit | Live Card Preview */}
      <div className="grid items-start gap-7 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Card Readiness (Profile Completion) */}
          <BlurFade delay={0.09}>
            <Card className="rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none">
              <CardContent className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-sm font-bold text-white sm:text-base">
                      Card Readiness
                    </h2>
                    <p className="mt-0.5 text-xs text-white/45">
                      {completionPct === 100
                        ? 'Your Xlay card is 100% set up and ready to drop on Snap.'
                        : `${completedSteps} of ${checklist.length} steps complete — finish these to make your card stand out.`}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
                    {completionPct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>

                {completionPct === 100 ? (
                  <div className="flex flex-col gap-3 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles
                        size={16}
                        className="shrink-0 text-[var(--color-accent)]"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-medium text-white/85">
                        Looking sharp. Drop your link on your Snapchat Story to start tracking
                        views.
                      </p>
                    </div>
                    <Button asChild size="sm" className="shrink-0 rounded-xl font-semibold">
                      <Link href="/dashboard/share">Share Card</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {checklist.map(({ id, label, href, Icon, done }) => (
                      <Link
                        key={id}
                        href={href}
                        className={`group flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-colors ${
                          done
                            ? 'border-emerald-500/20 bg-emerald-500/[0.05] text-white/60'
                            : 'border-white/[0.06] bg-[#141418] text-white/85 hover:border-white/20 hover:bg-[#191920]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          {done ? (
                            <CheckCircle2
                              size={15}
                              className="shrink-0 text-emerald-400"
                              aria-hidden="true"
                            />
                          ) : (
                            <Icon
                              size={14}
                              className="shrink-0 text-white/45 group-hover:text-[var(--color-accent)]"
                              aria-hidden="true"
                            />
                          )}
                          <span className={`truncate ${done ? 'line-through decoration-white/30' : ''}`}>
                            {label}
                          </span>
                        </span>
                        {!done && (
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-white/70"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>

          {/* Quick-edit tiles */}
          <BlurFade delay={0.13}>
            <div className="grid gap-3 sm:grid-cols-2">
              {QUICK_ACTIONS.map(({ href, Icon, title, desc }) => (
                <Link key={href} href={href} className="group block">
                  <Card className="h-full rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none transition-colors group-hover:border-[var(--color-accent)]/35">
                    <CardContent className="flex h-full flex-col justify-between p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-[var(--color-accent)]">
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-accent)]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-4">
                        <p className="font-display text-sm font-bold text-white">{title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-white/45">{desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </BlurFade>
        </div>

        {/* Live interactive Xlay Card Preview */}
        <BlurFade delay={0.16} className="lg:sticky lg:top-6">
          <CardPreview profile={profile} links={links ?? []} friends={normalisedFriends} />
        </BlurFade>
      </div>
    </div>
  )
}
