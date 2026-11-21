'use client'
// CardPreview.tsx - Live iPhone-frame preview of the user's public card

import Avatar from '@/components/ui/Avatar'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { resolveCardColors } from '@/lib/themes'
import { Flame, Music, Sparkles } from 'lucide-react'

export interface PreviewProfile {
  username: string | null
  display_name: string
  avatar_url: string | null
  avatar_source: string
  avatar_pose?: string | null
  bio: string | null
  theme_id: string
  accent_color: string | null
  bg_type?: string | null
  streak_count: number
  snap_score: number
  show_streak: boolean
  show_score: boolean
  show_views: boolean
  music_title: string | null
}

export interface PreviewLink {
  id: string
  platform: string
  url: string
  sort_order: number
}

export interface PreviewFriend {
  id: string
  friend_profile_id?: string | null
  profiles: { display_name: string; avatar_url: string | null; username: string | null } | null
}

export default function CardPreview({
  profile,
  links,
  friends,
}: {
  profile: PreviewProfile | null
  links: PreviewLink[]
  friends: PreviewFriend[]
}) {
  if (!profile) return null

  const { bg, accent } = resolveCardColors(profile)
  const hasGlow = profile.bg_type !== 'solid'

  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Subtle ambient glow behind the phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-[56px] opacity-15 blur-3xl transition-colors duration-300"
        style={{ background: accent }}
      />

      {/* iPhone frame */}
      <div className="relative rounded-[40px] border border-white/10 bg-[#0b0b0d] p-2 shadow-2xl shadow-black/70">
        {/* Dynamic Island / notch */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-3.5 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black"
        />

        {/* Screen */}
        <div
          className="relative flex h-[540px] flex-col items-center overflow-y-auto rounded-[32px] px-5 pt-11 pb-5 transition-colors duration-300"
          style={
            {
              backgroundColor: bg,
              '--color-accent': accent,
            } as React.CSSProperties
          }
        >
          {/* Optional top radial glow */}
          {hasGlow && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-60 opacity-[0.22] blur-3xl transition-colors duration-300"
              style={{
                background: `radial-gradient(ellipse at top, ${accent}, transparent 72%)`,
              }}
            />
          )}

          {/* Avatar */}
          <div className="relative z-10 mt-1">
            <Avatar
              avatarUrl={profile.avatar_url}
              avatarSource={profile.avatar_source}
              avatarPose={profile.avatar_pose}
              displayName={profile.display_name}
              accentColor={accent}
              size="preview"
            />
          </div>

          {/* Name & handle */}
          <div className="relative z-10 mt-2 text-center">
            <p className="font-display text-sm font-bold leading-tight text-white">
              {profile.display_name}
            </p>
            <p className="mt-0.5 text-[11px] text-white/50">@{profile.username}</p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="relative z-10 mt-2 max-w-[215px] text-center text-[11px] leading-relaxed text-white/65">
              {profile.bio}
            </p>
          )}

          {/* Stats row */}
          {(profile.show_streak || profile.show_score) && (
            <div className="relative z-10 mt-3.5 flex gap-2">
              {profile.show_streak && (
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-center">
                  <p className="text-[9px] text-white/45">Streak</p>
                  <p
                    className="mt-0.5 flex items-center justify-center gap-1 text-xs font-bold"
                    style={{ color: accent }}
                  >
                    <Flame size={11} aria-hidden="true" />
                    {profile.streak_count}
                  </p>
                </div>
              )}
              {profile.show_score && (
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-1.5 text-center">
                  <p className="text-[9px] text-white/45">Score</p>
                  <p
                    className="mt-0.5 flex items-center justify-center gap-1 text-xs font-bold"
                    style={{ color: accent }}
                  >
                    <Sparkles size={11} aria-hidden="true" />
                    {profile.snap_score.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Links pill */}
          {links.length > 0 && (
            <div className="relative z-10 mt-4 flex max-w-full flex-wrap justify-center gap-2.5 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
              {links.map((l) => (
                <span
                  key={l.id}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white"
                  title={l.platform}
                >
                  <PlatformIcon platform={l.platform} size={14} />
                </span>
              ))}
            </div>
          )}

          {/* Soundtrack bar */}
          {profile.music_title && (
            <div className="relative z-10 mt-3.5 flex w-full max-w-[225px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
              <span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-black"
                style={{ backgroundColor: accent }}
              >
                <Music size={11} aria-hidden="true" />
              </span>
              <p className="truncate text-[10px] text-white/75">{profile.music_title}</p>
            </div>
          )}

          {/* Best friends */}
          {friends.length > 0 && (
            <div className="relative z-10 mt-3.5 flex -space-x-2">
              {friends.slice(0, 3).map((f) =>
                f.profiles?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={f.id}
                    src={f.profiles.avatar_url}
                    alt={f.profiles.display_name}
                    className="h-7 w-7 rounded-full border-2 border-[#080808] object-cover"
                  />
                ) : (
                  <div
                    key={f.id}
                    className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#080808] bg-white/10 text-[9px] font-semibold text-white"
                  >
                    {f.profiles?.display_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )
              )}
            </div>
          )}

          {/* Powered by */}
          <div className="relative z-10 mt-auto pt-4">
            <p className="text-center text-[9px] text-white/25">Powered by Xlay</p>
          </div>
        </div>
      </div>
    </div>
  )
}
