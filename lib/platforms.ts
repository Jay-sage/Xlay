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
  { id: 'instagram', label: 'Instagram', category: 'social', placeholder: 'instagram.com/username', domains: ['instagram.com', 'instagr.am'] },
  { id: 'tiktok', label: 'TikTok', category: 'social', placeholder: 'tiktok.com/@username', domains: ['tiktok.com'] },
  { id: 'snapchat', label: 'Snapchat', category: 'social', placeholder: 'snapchat.com/add/username', domains: ['snapchat.com'] },
  { id: 'twitter', label: 'X / Twitter', category: 'social', placeholder: 'x.com/username', domains: ['x.com', 'twitter.com'] },
  { id: 'threads', label: 'Threads', category: 'social', placeholder: 'threads.net/@username', domains: ['threads.net', 'threads.com'] },
  { id: 'youtube', label: 'YouTube', category: 'social', placeholder: 'youtube.com/@channel', domains: ['youtube.com', 'youtu.be'] },
  { id: 'facebook', label: 'Facebook', category: 'social', placeholder: 'facebook.com/username', domains: ['facebook.com', 'fb.com'] },
  { id: 'linkedin', label: 'LinkedIn', category: 'social', placeholder: 'linkedin.com/in/username', domains: ['linkedin.com'] },
  { id: 'pinterest', label: 'Pinterest', category: 'social', placeholder: 'pinterest.com/username', domains: ['pinterest.com', 'pin.it'] },
  { id: 'reddit', label: 'Reddit', category: 'social', placeholder: 'reddit.com/u/username', domains: ['reddit.com'] },
  { id: 'bluesky', label: 'Bluesky', category: 'social', placeholder: 'bsky.app/profile/handle', domains: ['bsky.app'] },
  { id: 'tumblr', label: 'Tumblr', category: 'social', placeholder: 'username.tumblr.com', domains: ['tumblr.com'] },
  { id: 'vsco', label: 'VSCO', category: 'social', placeholder: 'vsco.co/username', domains: ['vsco.co'] },
  { id: 'letterboxd', label: 'Letterboxd', category: 'social', placeholder: 'letterboxd.com/username', domains: ['letterboxd.com'] },

  // Music (including Audiomack & Apple Music)
  { id: 'spotify', label: 'Spotify', category: 'music', placeholder: 'open.spotify.com/artist/...', domains: ['spotify.com', 'spoti.fi'] },
  { id: 'applemusic', label: 'Apple Music', category: 'music', placeholder: 'music.apple.com/artist/...', domains: ['music.apple.com'] },
  { id: 'audiomack', label: 'Audiomack', category: 'music', placeholder: 'audiomack.com/artist', domains: ['audiomack.com'] },
  { id: 'soundcloud', label: 'SoundCloud', category: 'music', placeholder: 'soundcloud.com/username', domains: ['soundcloud.com'] },
  { id: 'youtubemusic', label: 'YouTube Music', category: 'music', placeholder: 'music.youtube.com/channel/...', domains: ['music.youtube.com'] },
  { id: 'tidal', label: 'Tidal', category: 'music', placeholder: 'tidal.com/artist/...', domains: ['tidal.com'] },
  { id: 'bandcamp', label: 'Bandcamp', category: 'music', placeholder: 'artist.bandcamp.com', domains: ['bandcamp.com'] },
  { id: 'shazam', label: 'Shazam', category: 'music', placeholder: 'shazam.com/artist/...', domains: ['shazam.com'] },

  // Messaging
  { id: 'whatsapp', label: 'WhatsApp', category: 'messaging', placeholder: 'wa.me/234...', domains: ['wa.me', 'whatsapp.com'] },
  { id: 'telegram', label: 'Telegram', category: 'messaging', placeholder: 't.me/username', domains: ['t.me', 'telegram.me', 'telegram.org'] },
  { id: 'discord', label: 'Discord', category: 'messaging', placeholder: 'discord.gg/invite', domains: ['discord.gg', 'discord.com'] },
  { id: 'signal', label: 'Signal', category: 'messaging', placeholder: 'signal.me/#p/...', domains: ['signal.me', 'signal.org'] },

  // Creator, Portfolio & Support
  { id: 'github', label: 'GitHub', category: 'creator', placeholder: 'github.com/username', domains: ['github.com'] },
  { id: 'behance', label: 'Behance', category: 'creator', placeholder: 'behance.net/username', domains: ['behance.net'] },
  { id: 'dribbble', label: 'Dribbble', category: 'creator', placeholder: 'dribbble.com/username', domains: ['dribbble.com'] },
  { id: 'figma', label: 'Figma', category: 'creator', placeholder: 'figma.com/@username', domains: ['figma.com'] },
  { id: 'notion', label: 'Notion', category: 'creator', placeholder: 'notion.site/...', domains: ['notion.site', 'notion.so'] },
  { id: 'medium', label: 'Medium', category: 'creator', placeholder: 'medium.com/@username', domains: ['medium.com'] },
  { id: 'substack', label: 'Substack', category: 'creator', placeholder: 'name.substack.com', domains: ['substack.com'] },
  { id: 'vimeo', label: 'Vimeo', category: 'creator', placeholder: 'vimeo.com/username', domains: ['vimeo.com'] },
  { id: 'patreon', label: 'Patreon', category: 'creator', placeholder: 'patreon.com/username', domains: ['patreon.com'] },
  { id: 'buymeacoffee', label: 'Buy Me a Coffee', category: 'creator', placeholder: 'buymeacoffee.com/username', domains: ['buymeacoffee.com'] },
  { id: 'kofi', label: 'Ko-fi', category: 'creator', placeholder: 'ko-fi.com/username', domains: ['ko-fi.com'] },
  { id: 'paypal', label: 'PayPal', category: 'creator', placeholder: 'paypal.me/username', domains: ['paypal.me', 'paypal.com'] },
  { id: 'cashapp', label: 'Cash App', category: 'creator', placeholder: 'cash.app/$tag', domains: ['cash.app'] },

  // Gaming & Streaming
  { id: 'twitch', label: 'Twitch', category: 'gaming', placeholder: 'twitch.tv/username', domains: ['twitch.tv'] },
  { id: 'kick', label: 'Kick', category: 'gaming', placeholder: 'kick.com/username', domains: ['kick.com'] },
  { id: 'steam', label: 'Steam', category: 'gaming', placeholder: 'steamcommunity.com/id/...', domains: ['steamcommunity.com', 'steampowered.com'] },
  { id: 'playstation', label: 'PlayStation', category: 'gaming', placeholder: 'psnprofiles.com/username', domains: ['playstation.com', 'psnprofiles.com'] },
  { id: 'roblox', label: 'Roblox', category: 'gaming', placeholder: 'roblox.com/users/...', domains: ['roblox.com'] },
  { id: 'epicgames', label: 'Epic Games', category: 'gaming', placeholder: 'store.epicgames.com/...', domains: ['epicgames.com'] },
  { id: 'riotgames', label: 'Riot Games', category: 'gaming', placeholder: 'riotgames.com/...', domains: ['riotgames.com'] },

  // Other
  { id: 'custom', label: 'Website / Link', category: 'other', placeholder: 'yoursite.com', domains: [] },
]

export function detectPlatform(url: string): string {
  const lower = url.toLowerCase().trim()
  if (!lower) return 'custom'

  // Check more specific subdomains first (e.g. music.youtube.com before youtube.com)
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
