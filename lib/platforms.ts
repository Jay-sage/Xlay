// lib/platforms.ts - Comprehensive catalog of social, music, messaging, creator & gaming platforms

export type PlatformCategory =
  | 'social'
  | 'music'
  | 'messaging'
  | 'creator'
  | 'gaming'
  | 'other'

export interface PlatformDef {
  id: string
  label: string
  category: PlatformCategory
  placeholder: string
  domains: string[]
  /** Optional template to turn a bare handle (e.g. "@sage") into a full profile URL. */
  urlTemplate?: string
  /** Optional prefix shown in UI when accepting a bare handle. */
  handlePrefix?: string
  /** Whether to show leading "@" when formatting the short display handle. */
  displayAt?: boolean
}

export const PLATFORM_CATEGORIES: Array<{ id: PlatformCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'social', label: 'Social' },
  { id: 'music', label: 'Music' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'creator', label: 'Creator' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'other', label: 'Other' },
]

export const PLATFORMS: PlatformDef[] = [
  // Social
  {
    id: 'snapchat',
    label: 'Snapchat',
    category: 'social',
    placeholder: '@username or snapchat.com/add/username',
    domains: ['snapchat.com'],
    urlTemplate: 'https://www.snapchat.com/add/{handle}',
    handlePrefix: 'snapchat.com/add/',
    displayAt: true,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    category: 'social',
    placeholder: '@channel or youtube.com/@channel',
    domains: ['youtube.com', 'youtu.be'],
    urlTemplate: 'https://youtube.com/@{handle}',
    handlePrefix: 'youtube.com/@',
    displayAt: true,
  },
  {
    id: 'discord',
    label: 'Discord',
    category: 'messaging',
    placeholder: 'invite code or discord.gg/invite',
    domains: ['discord.gg', 'discord.com'],
    urlTemplate: 'https://discord.gg/{handle}',
    handlePrefix: 'discord.gg/',
  },
  {
    id: 'spotify',
    label: 'Spotify',
    category: 'music',
    placeholder: 'open.spotify.com/artist/...',
    domains: ['spotify.com', 'spoti.fi'],
  },
  {
    id: 'instagram',
    label: 'Instagram',
    category: 'social',
    placeholder: '@username or instagram.com/username',
    domains: ['instagram.com', 'instagr.am'],
    urlTemplate: 'https://instagram.com/{handle}',
    handlePrefix: 'instagram.com/',
    displayAt: true,
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    category: 'social',
    placeholder: '@username or x.com/username',
    domains: ['x.com', 'twitter.com'],
    urlTemplate: 'https://x.com/{handle}',
    handlePrefix: 'x.com/',
    displayAt: true,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    category: 'social',
    placeholder: '@username or tiktok.com/@username',
    domains: ['tiktok.com'],
    urlTemplate: 'https://www.tiktok.com/@{handle}',
    handlePrefix: 'tiktok.com/@',
    displayAt: true,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    category: 'messaging',
    placeholder: '@username or t.me/username',
    domains: ['t.me', 'telegram.me', 'telegram.org'],
    urlTemplate: 'https://t.me/{handle}',
    handlePrefix: 't.me/',
    displayAt: true,
  },
  {
    id: 'soundcloud',
    label: 'SoundCloud',
    category: 'music',
    placeholder: 'username or soundcloud.com/username',
    domains: ['soundcloud.com'],
    urlTemplate: 'https://soundcloud.com/{handle}',
    handlePrefix: 'soundcloud.com/',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    category: 'creator',
    placeholder: 'username or paypal.me/username',
    domains: ['paypal.me', 'paypal.com'],
    urlTemplate: 'https://paypal.me/{handle}',
    handlePrefix: 'paypal.me/',
  },
  {
    id: 'github',
    label: 'GitHub',
    category: 'creator',
    placeholder: 'username or github.com/username',
    domains: ['github.com'],
    urlTemplate: 'https://github.com/{handle}',
    handlePrefix: 'github.com/',
  },
  {
    id: 'roblox',
    label: 'Roblox',
    category: 'gaming',
    placeholder: 'roblox.com/users/...',
    domains: ['roblox.com'],
  },
  {
    id: 'cashapp',
    label: 'Cash App',
    category: 'creator',
    placeholder: '$cashtag or cash.app/$tag',
    domains: ['cash.app'],
    urlTemplate: 'https://cash.app/${handle}',
    handlePrefix: 'cash.app/$',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    category: 'messaging',
    placeholder: '2348012345678 or wa.me/234...',
    domains: ['wa.me', 'whatsapp.com'],
    urlTemplate: 'https://wa.me/{handle}',
    handlePrefix: 'wa.me/',
  },
  {
    id: 'playstation',
    label: 'PlayStation',
    category: 'gaming',
    placeholder: 'psn ID or psnprofiles.com/username',
    domains: ['playstation.com', 'psnprofiles.com'],
    urlTemplate: 'https://psnprofiles.com/{handle}',
    handlePrefix: 'psnprofiles.com/',
  },
  {
    id: 'applemusic',
    label: 'Apple Music',
    category: 'music',
    placeholder: 'music.apple.com/artist/...',
    domains: ['music.apple.com'],
  },
  {
    id: 'audiomack',
    label: 'Audiomack',
    category: 'music',
    placeholder: 'artist or audiomack.com/artist',
    domains: ['audiomack.com'],
    urlTemplate: 'https://audiomack.com/{handle}',
    handlePrefix: 'audiomack.com/',
  },
  {
    id: 'twitch',
    label: 'Twitch',
    category: 'gaming',
    placeholder: 'username or twitch.tv/username',
    domains: ['twitch.tv'],
    urlTemplate: 'https://twitch.tv/{handle}',
    handlePrefix: 'twitch.tv/',
  },
  {
    id: 'reddit',
    label: 'Reddit',
    category: 'social',
    placeholder: 'username or reddit.com/u/username',
    domains: ['reddit.com'],
    urlTemplate: 'https://reddit.com/u/{handle}',
    handlePrefix: 'reddit.com/u/',
  },
  {
    id: 'bluesky',
    label: 'Bluesky',
    category: 'social',
    placeholder: 'handle.bsky.social or bsky.app/profile/...',
    domains: ['bsky.app'],
    urlTemplate: 'https://bsky.app/profile/{handle}',
    handlePrefix: 'bsky.app/profile/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    category: 'social',
    placeholder: 'username or linkedin.com/in/username',
    domains: ['linkedin.com'],
    urlTemplate: 'https://linkedin.com/in/{handle}',
    handlePrefix: 'linkedin.com/in/',
  },
  {
    id: 'steam',
    label: 'Steam',
    category: 'gaming',
    placeholder: 'steam ID or steamcommunity.com/id/...',
    domains: ['steamcommunity.com', 'steampowered.com'],
    urlTemplate: 'https://steamcommunity.com/id/{handle}',
    handlePrefix: 'steamcommunity.com/id/',
  },
  {
    id: 'kick',
    label: 'Kick',
    category: 'gaming',
    placeholder: 'username or kick.com/username',
    domains: ['kick.com'],
    urlTemplate: 'https://kick.com/{handle}',
    handlePrefix: 'kick.com/',
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    category: 'social',
    placeholder: 'username or pinterest.com/username',
    domains: ['pinterest.com', 'pin.it'],
    urlTemplate: 'https://pinterest.com/{handle}',
    handlePrefix: 'pinterest.com/',
  },
  {
    id: 'buymeacoffee',
    label: 'Buy Me a Coffee',
    category: 'creator',
    placeholder: 'username or buymeacoffee.com/username',
    domains: ['buymeacoffee.com'],
    urlTemplate: 'https://buymeacoffee.com/{handle}',
    handlePrefix: 'buymeacoffee.com/',
  },
  {
    id: 'kofi',
    label: 'Ko-fi',
    category: 'creator',
    placeholder: 'username or ko-fi.com/username',
    domains: ['ko-fi.com'],
    urlTemplate: 'https://ko-fi.com/{handle}',
    handlePrefix: 'ko-fi.com/',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    category: 'social',
    placeholder: 'username or facebook.com/username',
    domains: ['facebook.com', 'fb.com'],
    urlTemplate: 'https://facebook.com/{handle}',
    handlePrefix: 'facebook.com/',
  },
  {
    id: 'threads',
    label: 'Threads',
    category: 'social',
    placeholder: '@username or threads.net/@username',
    domains: ['threads.net', 'threads.com'],
    urlTemplate: 'https://threads.net/@{handle}',
    handlePrefix: 'threads.net/@',
    displayAt: true,
  },
  {
    id: 'patreon',
    label: 'Patreon',
    category: 'creator',
    placeholder: 'username or patreon.com/username',
    domains: ['patreon.com'],
    urlTemplate: 'https://patreon.com/{handle}',
    handlePrefix: 'patreon.com/',
  },
  {
    id: 'signal',
    label: 'Signal',
    category: 'messaging',
    placeholder: 'signal.me/#p/...',
    domains: ['signal.me', 'signal.org'],
  },
  {
    id: 'youtubemusic',
    label: 'YouTube Music',
    category: 'music',
    placeholder: 'music.youtube.com/channel/...',
    domains: ['music.youtube.com'],
  },
  {
    id: 'tidal',
    label: 'Tidal',
    category: 'music',
    placeholder: 'tidal.com/artist/...',
    domains: ['tidal.com'],
  },
  {
    id: 'bandcamp',
    label: 'Bandcamp',
    category: 'music',
    placeholder: 'artist.bandcamp.com',
    domains: ['bandcamp.com'],
  },
  {
    id: 'shazam',
    label: 'Shazam',
    category: 'music',
    placeholder: 'shazam.com/artist/...',
    domains: ['shazam.com'],
  },
  {
    id: 'behance',
    label: 'Behance',
    category: 'creator',
    placeholder: 'username or behance.net/username',
    domains: ['behance.net'],
    urlTemplate: 'https://behance.net/{handle}',
    handlePrefix: 'behance.net/',
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    category: 'creator',
    placeholder: 'username or dribbble.com/username',
    domains: ['dribbble.com'],
    urlTemplate: 'https://dribbble.com/{handle}',
    handlePrefix: 'dribbble.com/',
  },
  {
    id: 'figma',
    label: 'Figma',
    category: 'creator',
    placeholder: '@username or figma.com/@username',
    domains: ['figma.com'],
    urlTemplate: 'https://figma.com/@{handle}',
    handlePrefix: 'figma.com/@',
    displayAt: true,
  },
  {
    id: 'notion',
    label: 'Notion',
    category: 'creator',
    placeholder: 'notion.site/...',
    domains: ['notion.site', 'notion.so'],
  },
  {
    id: 'medium',
    label: 'Medium',
    category: 'creator',
    placeholder: '@username or medium.com/@username',
    domains: ['medium.com'],
    urlTemplate: 'https://medium.com/@{handle}',
    handlePrefix: 'medium.com/@',
    displayAt: true,
  },
  {
    id: 'substack',
    label: 'Substack',
    category: 'creator',
    placeholder: 'name.substack.com',
    domains: ['substack.com'],
  },
  {
    id: 'vimeo',
    label: 'Vimeo',
    category: 'creator',
    placeholder: 'username or vimeo.com/username',
    domains: ['vimeo.com'],
    urlTemplate: 'https://vimeo.com/{handle}',
    handlePrefix: 'vimeo.com/',
  },
  {
    id: 'tumblr',
    label: 'Tumblr',
    category: 'social',
    placeholder: 'username.tumblr.com',
    domains: ['tumblr.com'],
  },
  {
    id: 'vsco',
    label: 'VSCO',
    category: 'social',
    placeholder: 'username or vsco.co/username',
    domains: ['vsco.co'],
    urlTemplate: 'https://vsco.co/{handle}',
    handlePrefix: 'vsco.co/',
  },
  {
    id: 'letterboxd',
    label: 'Letterboxd',
    category: 'social',
    placeholder: 'username or letterboxd.com/username',
    domains: ['letterboxd.com'],
    urlTemplate: 'https://letterboxd.com/{handle}',
    handlePrefix: 'letterboxd.com/',
  },
  {
    id: 'epicgames',
    label: 'Epic Games',
    category: 'gaming',
    placeholder: 'store.epicgames.com/...',
    domains: ['epicgames.com'],
  },
  {
    id: 'riotgames',
    label: 'Riot Games',
    category: 'gaming',
    placeholder: 'riotgames.com/...',
    domains: ['riotgames.com'],
  },

  // Other
  {
    id: 'custom',
    label: 'Website / Link',
    category: 'other',
    placeholder: 'https://yoursite.com',
    domains: [],
  },
]

export function detectPlatform(url: string): string {
  const lower = url.toLowerCase().trim()
  if (!lower) return 'custom'

  const ordered = [...PLATFORMS].sort((a, b) => {
    const aMax = Math.max(0, ...a.domains.map((d) => d.length))
    const bMax = Math.max(0, ...b.domains.map((d) => d.length))
    return bMax - aMax
  })

  for (const p of ordered) {
    if (p.domains.some((d) => lower.includes(d))) {
      return p.id
    }
  }

  return 'custom'
}

export function getPlatformLabel(id: string): string {
  return PLATFORMS.find((p) => p.id === id.toLowerCase())?.label ?? id
}

/**
 * Turns a bare handle like "@judeeee" or "watchsage" into a full profile URL
 * when a known platform is selected. Full URLs or domains pass through untouched.
 */
export function resolvePlatformInput(platformId: string | null, rawInput: string): string {
  const trimmed = rawInput.trim()
  if (!trimmed) return ''

  // Already a full URL with scheme
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed
  }

  const def = platformId ? PLATFORMS.find((p) => p.id === platformId) : undefined
  if (!def?.urlTemplate) {
    return trimmed
  }

  // Already includes one of the platform's domains or looks like a domain/path
  const lower = trimmed.toLowerCase()
  if (
    def.domains.some((d) => lower.includes(d)) ||
    (trimmed.includes('.') && trimmed.includes('/'))
  ) {
    return trimmed
  }

  // Strip leading @, $, +, and spaces for handles
  let handle = trimmed.replace(/^[@$]+/, '').trim()
  if (def.id === 'whatsapp') {
    handle = handle.replace(/[\s+\-()]/g, '')
  }

  if (!handle) return trimmed
  return def.urlTemplate.replace('{handle}', encodeURIComponent(handle))
}

/**
 * Formats a stored link URL into a compact handle for dashboard link cards
 * (e.g. "https://www.snapchat.com/add/judeeee" -> "@judeeee",
 *       "https://twitch.tv/watchsage" -> "watchsage").
 */
export function formatLinkDisplay(platformId: string, rawUrl: string): string {
  const def = PLATFORMS.find((p) => p.id === platformId.toLowerCase())
  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`)
    const segments = parsed.pathname.split('/').filter(Boolean)

    if (def?.urlTemplate && segments.length > 0) {
      // For paths like /add/judeeee, /in/username, /u/username, /id/steamid, /profile/handle
      const last = decodeURIComponent(segments[segments.length - 1])
      if (last) {
        if (def.id === 'cashapp') {
          return last.startsWith('$') ? last : `$${last}`
        }
        if (def.displayAt) {
          return last.startsWith('@') ? last : `@${last}`
        }
        return last
      }
    }

    const host = parsed.hostname.replace(/^www\./, '')
    const path = parsed.pathname === '/' ? '' : parsed.pathname
    return `${host}${path}`
  } catch {
    return rawUrl.replace(/^https?:\/\/(www\.)?/, '')
  }
}
