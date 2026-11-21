// app/dashboard/page.tsx - Dashboard Home with live iPhone preview + quick actions
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createServerClient } from '@/lib/supabase/server'
import { ArrowUpRight, ExternalLink, Link2, Music, Palette, Share2, Users } from 'lucide-react'
import Link from 'next/link'
import CardPreview from './CardPreview'

const QUICK_ACTIONS = [
  {
    href: '/dashboard/themes',
    Icon: Palette,
    title: 'Theme Editor',
    desc: 'Switch preset, accent color, glow & 3D Bitmoji pose',
  },
  {
    href: '/dashboard/links',
    Icon: Link2,
    title: 'Manage Links',
    desc: 'Add, reorder, or toggle your social & web links',
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
    desc: 'Invite up to 3 Snap friends onto your card',
  },
  {
    href: '/dashboard/share',
    Icon: Share2,
    title: 'Share Card',
    desc: 'Grab tagged links for Snap, WhatsApp & TikTok',
  },
]

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: links }, { data: friends }] = await Promise.all([
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
  ])

  const normalisedFriends = (friends ?? []).map((f) => ({
    id: f.id,
    friend_profile_id: f.friend_profile_id,
    profiles: Array.isArray(f.profiles) ? (f.profiles[0] ?? null) : f.profiles,
  }))

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      <BlurFade delay={0.03}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Your Xlay Card
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Live preview of{' '}
              <span className="font-medium text-foreground">xlay.me/{profile?.username}</span>
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

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[320px_1fr]">
        {/* Phone preview */}
        <BlurFade delay={0.08}>
          <CardPreview profile={profile} links={links ?? []} friends={normalisedFriends} />
        </BlurFade>

        {/* Quick-edit tiles */}
        <BlurFade delay={0.14} className="grid gap-3 sm:grid-cols-2">
          {QUICK_ACTIONS.map(({ href, Icon, title, desc }) => (
            <Link key={href} href={href} className="group block">
              <Card className="h-full rounded-2xl border-border bg-card py-0 shadow-none transition-colors group-hover:border-primary/40">
                <CardContent className="flex h-full flex-col justify-between p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-primary">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-5">
                    <p className="font-display text-sm font-bold text-foreground">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </BlurFade>
      </div>
    </div>
  )
}
