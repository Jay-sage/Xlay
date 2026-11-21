'use client'
// app/[username]/PublicCard.tsx - Full-screen public card with tap-to-enter reveal

import Avatar from '@/components/ui/Avatar'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { resolveCardColors } from '@/lib/themes'
import { getLinkHostname, normalizeUrlOrNull } from '@/lib/url'
import { Eye, Flame, Music, Pause, Play, Sparkles, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

interface Profile {
  id: string
  username: string | null
  display_name: string
  avatar_url: string | null
  avatar_source: string
  avatar_pose?: string | null
  bio: string | null
  theme_id: string
  accent_color: string | null
  bg_type: string
  bg_url: string | null
  music_url: string | null
  music_title: string | null
  streak_count: number
  snap_score: number
  show_streak: boolean
  show_score: boolean
  show_views: boolean
}

interface CardLink {
  id: string
  platform: string
  url: string
  sort_order: number
}

interface Friend {
  id: string
  profiles: { display_name: string; avatar_url: string | null; username: string | null } | null
}

interface Props {
  profile: Profile
  links: CardLink[]
  friends: Friend[]
  viewCount: number | null
  refSource: string | null
}

export default function PublicCard({ profile, links, friends, viewCount, refSource }: Props) {
  const [entered, setEntered] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [muted, setMuted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const viewLogged = useRef(false)

  const { bg, accent } = resolveCardColors(profile)
  const isImageBg = profile.bg_type === 'image' && Boolean(profile.bg_url)
  const hasGlow = !isImageBg && profile.bg_type !== 'solid'

  // Log view once
  useEffect(() => {
    if (viewLogged.current) return
    viewLogged.current = true
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: profile.id, ref: refSource }),
    }).catch(() => {})
  }, [profile.id, refSource])

  function handleEnter() {
    setEntered(true)
    if (profile.music_url && audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {})
    }
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function toggleMute() {
    const nextMuted = !muted
    setMuted(nextMuted)
    if (audioRef.current) {
      audioRef.current.volume = nextMuted ? 0 : volume
    }
  }

  function handleVolumeChange(v: number) {
    setVolume(v)
    if (v > 0 && muted) setMuted(false)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center overflow-hidden"
      style={
        {
          backgroundColor: isImageBg ? undefined : bg,
          backgroundImage: isImageBg && profile.bg_url ? `url(${profile.bg_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '--color-accent': accent,
        } as React.CSSProperties
      }
    >
      {/* Top radial glow atmosphere */}
      {hasGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-6%] h-[420px] opacity-[0.22] blur-[110px]"
          style={{
            background: `radial-gradient(ellipse at top, ${accent}, transparent 72%)`,
          }}
        />
      )}

      {/* Audio element (starts only after user tap) */}
      {profile.music_url && <audio ref={audioRef} src={profile.music_url} loop preload="none" />}

      {/* Tap-to-enter stage */}
      {!entered && (
        <button
          type="button"
          onClick={handleEnter}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/75 px-6 backdrop-blur-md transition-opacity cursor-pointer"
          aria-label={`Enter ${profile.display_name}'s Xlay card`}
        >
          <Avatar
            avatarUrl={profile.avatar_url}
            avatarSource={profile.avatar_source}
            avatarPose={profile.avatar_pose}
            displayName={profile.display_name}
            accentColor={accent}
            size="lg"
          />
          <div className="space-y-1 text-center">
            <p className="font-display text-2xl font-extrabold tracking-tight text-white">
              {profile.display_name}
            </p>
            <p className="text-sm text-white/50">@{profile.username}</p>
          </div>
          <div className="glass relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-6 py-3">
            {profile.music_url && (
              <Music size={15} style={{ color: accent }} className="animate-pulse" aria-hidden="true" />
            )}
            <span className="text-sm font-semibold text-white">Tap to enter</span>
            <BorderBeam
              size={64}
              duration={6}
              colorFrom={accent}
              colorTo="rgba(255,255,255,0.25)"
              borderWidth={1}
            />
          </div>
        </button>
      )}

      {/* Main full-screen card */}
      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-sm flex-col items-center gap-5 px-6 pt-12 pb-20">
        {/* Avatar (unmodified 3D Bitmoji or Classic Circle) */}
        <BlurFade delay={0.02}>
          <Avatar
            avatarUrl={profile.avatar_url}
            avatarSource={profile.avatar_source}
            avatarPose={profile.avatar_pose}
            displayName={profile.display_name}
            accentColor={accent}
            size="card"
          />
        </BlurFade>

        {/* Name + handle + bio */}
        <BlurFade delay={0.08} className="space-y-2 text-center">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {profile.display_name}
            </h1>
            <p className="mt-0.5 text-sm text-white/50">@{profile.username}</p>
          </div>
          {profile.bio && (
            <p className="mx-auto max-w-[280px] text-sm leading-relaxed text-white/70">
              {profile.bio}
            </p>
          )}
        </BlurFade>

        {/* Ambient stats */}
        {(profile.show_streak || profile.show_score || (profile.show_views && viewCount !== null)) && (
          <BlurFade delay={0.14} className="flex flex-wrap justify-center gap-2.5">
            {profile.show_streak && (
              <div className="glass rounded-2xl px-4 py-2 text-center">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Streak
                </p>
                <p
                  className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold"
                  style={{ color: accent }}
                >
                  <Flame size={13} aria-hidden="true" />
                  {profile.streak_count.toLocaleString()}
                </p>
              </div>
            )}
            {profile.show_score && (
              <div className="glass rounded-2xl px-4 py-2 text-center">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Score
                </p>
                <p
                  className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold"
                  style={{ color: accent }}
                >
                  <Sparkles size={13} aria-hidden="true" />
                  {profile.snap_score.toLocaleString()}
                </p>
              </div>
            )}
            {profile.show_views && viewCount !== null && (
              <div className="glass rounded-2xl px-4 py-2 text-center">
                <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Views
                </p>
                <p
                  className="mt-0.5 flex items-center justify-center gap-1 text-sm font-bold"
                  style={{ color: accent }}
                >
                  <Eye size={13} aria-hidden="true" />
                  {viewCount.toLocaleString()}
                </p>
              </div>
            )}
          </BlurFade>
        )}

        {/* Icon-only links in one glass pill */}
        {links.length > 0 && (
          <BlurFade delay={0.2}>
            <div className="glass flex flex-wrap justify-center gap-3 rounded-full px-5 py-2.5">
              {links.map((l) => {
                const href = normalizeUrlOrNull(l.url) ?? l.url
                const hostname = getLinkHostname(l.url)
                const isCustom = l.platform === 'custom'
                const accessibleName = isCustom ? (hostname ?? l.url) : l.platform

                return (
                  <a
                    key={l.id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer nofollow ugc"
                    onClick={() =>
                      fetch('/api/links', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          action: 'click',
                          linkId: l.id,
                          ref: refSource,
                        }),
                      }).catch(() => {})
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.08] text-white transition-transform duration-150 hover:scale-110 hover:bg-white/15 active:scale-95"
                    title={accessibleName}
                    aria-label={accessibleName}
                  >
                    <PlatformIcon platform={l.platform} size={18} />
                  </a>
                )
              })}
            </div>
          </BlurFade>
        )}

        {/* Soundtrack player bar */}
        {profile.music_url && entered && (
          <BlurFade delay={0.24} className="w-full max-w-[280px]">
            <div className="glass flex items-center gap-2.5 rounded-full px-3 py-2">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-black transition-transform active:scale-95 cursor-pointer"
                style={{ backgroundColor: accent }}
                aria-label={playing ? 'Pause track' : 'Play track'}
              >
                {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
              </button>

              <p className="min-w-0 flex-1 truncate text-xs font-medium text-white/80">
                {profile.music_title ?? 'Track'}
              </p>

              <button
                type="button"
                onClick={toggleMute}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/60 transition-colors hover:text-white cursor-pointer"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-14 flex-shrink-0 cursor-pointer"
                style={{ accentColor: accent }}
                aria-label="Volume"
              />
            </div>
          </BlurFade>
        )}

        {/* Best friends cluster */}
        {friends.length > 0 && (
          <BlurFade delay={0.28} className="space-y-2.5 pt-1 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Best friends
            </p>
            <div className="flex justify-center -space-x-2.5">
              {friends.map((f) => {
                const avatarEl = (
                  <Avatar
                    avatarUrl={f.profiles?.avatar_url}
                    displayName={f.profiles?.display_name}
                    size="sm"
                    forceCircle
                    className="rounded-full ring-2 ring-[#080808] transition-transform hover:z-10 hover:scale-110"
                  />
                )
                return f.profiles?.username ? (
                  <Link
                    key={f.id}
                    href={`/${f.profiles.username}`}
                    title={f.profiles.display_name}
                    aria-label={f.profiles.display_name}
                  >
                    {avatarEl}
                  </Link>
                ) : (
                  <div key={f.id} title={f.profiles?.display_name}>
                    {avatarEl}
                  </div>
                )
              })}
            </div>
          </BlurFade>
        )}
      </main>

      {/* Subtle footer */}
      <footer className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center py-3">
        <a
          href="https://xlay.me"
          className="text-[11px] font-medium text-white/25 transition-colors hover:text-white/50"
        >
          Powered by Xlay
        </a>
      </footer>
    </div>
  )
}
