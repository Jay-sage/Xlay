'use client'
// app/[username]/PublicCard.tsx - Full-screen card with tap-to-enter
import { useEffect, useRef, useState } from 'react'

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸', tiktok: '🎵', twitter: '𝕏', snapchat: '👻',
  youtube: '▶️', spotify: '🎧', soundcloud: '☁️', custom: '🔗',
}

interface Profile {
  id: string
  username: string | null
  display_name: string
  avatar_url: string | null
  avatar_source: string
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

interface Link { id: string; platform: string; url: string; sort_order: number }
interface Friend { id: string; profiles: { display_name: string; avatar_url: string | null; username: string | null } | null }

interface Props {
  profile: Profile
  links: Link[]
  friends: Friend[]
  viewCount: number | null
  refSource: string | null
}

const THEME_BG: Record<string, string> = {
  midnight: '#080808',
  phantom: '#0a0812',
  lagoon: '#060f10',
  ember: '#0f0a08',
}

const THEME_ACCENT: Record<string, string> = {
  midnight: '#E8FF47',
  phantom: '#E8E0FF',
  lagoon: '#00e5ff',
  ember: '#ff6b2b',
}

export default function PublicCard({ profile, links, friends, viewCount, refSource }: Props) {
  const [entered, setEntered] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const viewLogged = useRef(false)

  const bg = profile.bg_type === 'image' && profile.bg_url ? undefined : (THEME_BG[profile.theme_id] ?? '#080808')
  const accent = profile.accent_color ?? THEME_ACCENT[profile.theme_id] ?? '#E8FF47'

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
      audioRef.current.volume = volume
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  function handleVolumeChange(v: number) {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center overflow-hidden"
      style={{
        background: bg,
        backgroundImage: profile.bg_type === 'image' && profile.bg_url ? `url(${profile.bg_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '--color-accent': accent,
      } as React.CSSProperties}
    >
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url(/noise.png)', backgroundRepeat: 'repeat' }} />

      {/* Audio */}
      {profile.music_url && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} src={profile.music_url} loop preload="none" />
      )}

      {/* Tap-to-enter overlay */}
      {!entered && (
        <button
          onClick={handleEnter}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-black/60 backdrop-blur-sm"
          aria-label="Enter card"
        >
          {profile.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.display_name} className="h-24 w-24 rounded-full object-cover ring-2 ring-white/20" />
          )}
          <div className="text-center space-y-1">
            <p className="font-display text-2xl font-bold text-white">{profile.display_name}</p>
            <p className="text-sm text-white/50">@{profile.username}</p>
          </div>
          <div className="flex items-center gap-2 glass px-5 py-3 rounded-full">
            {profile.music_url && <span className="text-sm animate-pulse">🎵</span>}
            <span className="text-sm font-semibold text-white">Tap to enter</span>
          </div>
        </button>
      )}

      {/* Card content */}
      <main className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center pt-16 pb-20 px-6 gap-5 min-h-screen">
        {/* Avatar */}
        <div className="relative">
          <div
            className="absolute -inset-1.5 rounded-full"
            style={{ background: `conic-gradient(from 0deg, ${accent}, transparent, ${accent})`, filter: 'blur(4px)' }}
          />
          <div className="absolute -inset-0.5 rounded-full border-2" style={{ borderColor: accent }} />
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="relative h-28 w-28 rounded-full object-cover bg-white/5"
              style={{ imageRendering: 'auto' }}
            />
          ) : (
            <div className="relative h-28 w-28 rounded-full bg-white/10 flex items-center justify-center font-display text-4xl font-bold text-white">
              {profile.display_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
        </div>

        {/* Name + handle */}
        <div className="text-center space-y-1">
          <h1 className="font-display text-2xl font-bold text-white leading-tight">{profile.display_name}</h1>
          <p className="text-sm text-white/50">@{profile.username}</p>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-white/70 text-center leading-relaxed max-w-[260px]">{profile.bio}</p>
        )}

        {/* Stats */}
        {(profile.show_streak || profile.show_score || profile.show_views) && (
          <div className="flex gap-3 flex-wrap justify-center">
            {profile.show_streak && (
              <div className="glass rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-white/40">Streak</p>
                <p className="text-sm font-bold" style={{ color: accent }}>🔥 {profile.streak_count}</p>
              </div>
            )}
            {profile.show_score && (
              <div className="glass rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-white/40">Score</p>
                <p className="text-sm font-bold" style={{ color: accent }}>{profile.snap_score.toLocaleString()}</p>
              </div>
            )}
            {profile.show_views && viewCount !== null && (
              <div className="glass rounded-xl px-4 py-2 text-center">
                <p className="text-xs text-white/40">Views</p>
                <p className="text-sm font-bold" style={{ color: accent }}>{viewCount.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}

        {/* Links pill */}
        {links.length > 0 && (
          <div className="glass rounded-full px-6 py-3 flex gap-5 flex-wrap justify-center">
            {links.map(l => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ linkId: l.id, ref: refSource }) })}
                className="text-2xl hover:scale-110 transition-transform"
                title={l.platform}
              >
                {PLATFORM_ICONS[l.platform] ?? PLATFORM_ICONS.custom}
              </a>
            ))}
          </div>
        )}

        {/* Music bar */}
        {profile.music_url && entered && (
          <div className="glass rounded-full px-4 py-2.5 flex items-center gap-3 w-full max-w-[260px]">
            <button onClick={togglePlay} className="text-sm flex-shrink-0">
              {playing ? '⏸' : '▶️'}
            </button>
            <p className="text-xs text-white/60 flex-1 truncate">{profile.music_title ?? 'Track'}</p>
            <input
              type="range" min={0} max={1} step={0.05} value={volume}
              onChange={e => handleVolumeChange(Number(e.target.value))}
              className="w-16 accent-current flex-shrink-0"
              style={{ accentColor: accent }}
              aria-label="Volume"
            />
          </div>
        )}

        {/* Best friends */}
        {friends.length > 0 && (
          <div className="text-center space-y-2">
            <p className="text-xs text-white/30 uppercase tracking-widest">Best friends</p>
            <div className="flex justify-center -space-x-3">
              {friends.map(f => (
                f.profiles?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={f.id}
                    src={f.profiles.avatar_url}
                    alt={f.profiles.display_name}
                    title={f.profiles.display_name}
                    className="h-11 w-11 rounded-full border-2 border-[#080808] object-cover"
                  />
                ) : (
                  <div
                    key={f.id}
                    className="h-11 w-11 rounded-full border-2 border-[#080808] bg-white/10 flex items-center justify-center text-xs text-white font-semibold"
                    title={f.profiles?.display_name}
                  >
                    {f.profiles?.display_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-20 flex items-center justify-center py-3">
        <a
          href="https://xlay.me"
          className="text-[10px] text-white/20 hover:text-white/40 transition-colors"
        >
          Powered by Xlay
        </a>
      </footer>
    </div>
  )
}
