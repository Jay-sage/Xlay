'use client'
// CardPreview.tsx - iPhone-frame mock of the public card

interface Profile {
  username: string | null
  display_name: string
  avatar_url: string | null
  avatar_source: string
  bio: string | null
  theme_id: string
  accent_color: string | null
  streak_count: number
  snap_score: number
  show_streak: boolean
  show_score: boolean
  show_views: boolean
  music_title: string | null
}

interface Link {
  id: string
  platform: string
  url: string
  sort_order: number
}

interface Friend {
  id: string
  friend_profile_id: string | null
  profiles: { display_name: string; avatar_url: string | null; username: string | null } | null
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  tiktok: '🎵',
  twitter: '𝕏',
  snapchat: '👻',
  youtube: '▶️',
  spotify: '🎧',
  soundcloud: '☁️',
  custom: '🔗',
}

export default function CardPreview({
  profile,
  links,
  friends,
}: {
  profile: Profile | null
  links: Link[]
  friends: Friend[]
}) {
  if (!profile) return null

  return (
    <div className="flex justify-center">
      {/* iPhone frame */}
      <div className="relative w-[280px] h-[560px] rounded-[36px] border-[6px] border-white/10 overflow-hidden shadow-2xl bg-[#080808]">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-24 bg-black rounded-full z-10" />

        {/* Card content */}
        <div
          className="w-full h-full flex flex-col items-center pt-10 pb-4 px-4 overflow-y-auto"
          style={
            profile.accent_color
              ? ({ '--color-accent': profile.accent_color } as React.CSSProperties)
              : undefined
          }
        >
          {/* Avatar */}
          <div className="relative mt-4">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)] scale-110" />
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="relative h-20 w-20 rounded-full object-cover bg-white/5"
              />
            ) : (
              <div className="relative h-20 w-20 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-2xl">
                {profile.display_name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>

          {/* Name & handle */}
          <div className="mt-3 text-center">
            <p className="font-display text-sm font-bold text-white leading-tight">
              {profile.display_name}
            </p>
            <p className="text-[10px] text-white/50 mt-0.5">@{profile.username}</p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-[10px] text-white/60 text-center mt-2 leading-relaxed max-w-[200px]">
              {profile.bio}
            </p>
          )}

          {/* Stats row */}
          {(profile.show_streak || profile.show_score) && (
            <div className="flex gap-3 mt-3">
              {profile.show_streak && (
                <div className="glass rounded-xl px-3 py-1.5 text-center">
                  <p className="text-[9px] text-white/50">Streak</p>
                  <p className="text-xs font-bold text-[var(--color-accent)]">🔥 {profile.streak_count}</p>
                </div>
              )}
              {profile.show_score && (
                <div className="glass rounded-xl px-3 py-1.5 text-center">
                  <p className="text-[9px] text-white/50">Score</p>
                  <p className="text-xs font-bold text-[var(--color-accent)]">{profile.snap_score.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {/* Links pill */}
          {links.length > 0 && (
            <div className="glass mt-4 flex gap-2 px-4 py-2.5 rounded-full flex-wrap justify-center max-w-full">
              {links.map(l => (
                <span key={l.id} className="text-sm" title={l.platform}>
                  {PLATFORM_ICONS[l.platform] ?? PLATFORM_ICONS.custom}
                </span>
              ))}
            </div>
          )}

          {/* Music */}
          {profile.music_title && (
            <div className="mt-3 glass rounded-full px-3 py-1.5 flex items-center gap-2 max-w-full overflow-hidden">
              <span className="text-[10px]">🎵</span>
              <p className="text-[9px] text-white/70 truncate">{profile.music_title}</p>
            </div>
          )}

          {/* Best friends */}
          {friends.length > 0 && (
            <div className="mt-3 flex -space-x-2">
              {friends.slice(0, 3).map(f => (
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
                    className="h-7 w-7 rounded-full border-2 border-[#080808] bg-white/10 flex items-center justify-center text-[8px] text-white"
                  >
                    {f.profiles?.display_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Powered by */}
          <div className="mt-auto pt-4">
            <p className="text-[8px] text-white/20 text-center">Powered by Xlay</p>
          </div>
        </div>
      </div>
    </div>
  )
}
