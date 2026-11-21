import { Globe, Link2 } from 'lucide-react'
import {
  siApplemusic,
  siAudiomack,
  siBandcamp,
  siBehance,
  siBluesky,
  siBuymeacoffee,
  siCashapp,
  siDiscord,
  siDribbble,
  siEpicgames,
  siFacebook,
  siFigma,
  siGithub,
  siInstagram,
  siKick,
  siKofi,
  siLetterboxd,
  siMedium,
  siNotion,
  siPatreon,
  siPaypal,
  siPinterest,
  siPlaystation,
  siReddit,
  siRiotgames,
  siRoblox,
  siShazam,
  siSignal,
  siSnapchat,
  siSoundcloud,
  siSpotify,
  siSteam,
  siSubstack,
  siTelegram,
  siThreads,
  siTidal,
  siTiktok,
  siTumblr,
  siTwitch,
  siVimeo,
  siVsco,
  siWhatsapp,
  siX,
  siYoutube,
  siYoutubemusic,
  type SimpleIcon,
} from 'simple-icons'

const ICON_MAP: Record<string, SimpleIcon> = {
  instagram: siInstagram,
  tiktok: siTiktok,
  twitter: siX,
  x: siX,
  snapchat: siSnapchat,
  threads: siThreads,
  youtube: siYoutube,
  facebook: siFacebook,
  pinterest: siPinterest,
  reddit: siReddit,
  bluesky: siBluesky,
  tumblr: siTumblr,
  vsco: siVsco,
  letterboxd: siLetterboxd,
  spotify: siSpotify,
  applemusic: siApplemusic,
  audiomack: siAudiomack,
  soundcloud: siSoundcloud,
  youtubemusic: siYoutubemusic,
  tidal: siTidal,
  bandcamp: siBandcamp,
  shazam: siShazam,
  whatsapp: siWhatsapp,
  telegram: siTelegram,
  discord: siDiscord,
  signal: siSignal,
  github: siGithub,
  behance: siBehance,
  dribbble: siDribbble,
  figma: siFigma,
  notion: siNotion,
  medium: siMedium,
  substack: siSubstack,
  vimeo: siVimeo,
  patreon: siPatreon,
  buymeacoffee: siBuymeacoffee,
  kofi: siKofi,
  paypal: siPaypal,
  cashapp: siCashapp,
  twitch: siTwitch,
  kick: siKick,
  steam: siSteam,
  playstation: siPlaystation,
  roblox: siRoblox,
  epicgames: siEpicgames,
  riotgames: siRiotgames,
}

// Brand colors that are pure black/near-black in simple-icons — render white on dark tiles
const LIGHT_ON_DARK = new Set([
  'x',
  'twitter',
  'tiktok',
  'threads',
  'github',
  'notion',
  'medium',
  'tidal',
  'vsco',
  'epicgames',
  'steam',
  'roblox',
  'tumblr',
])

export function getPlatformBrandColor(platform: string): string {
  const key = platform.toLowerCase()
  if (key === 'linkedin') return '#0A66C2'
  if (key === 'snapchat') return '#FFFC00'
  if (key === 'custom') return '#A1A1AA'
  if (LIGHT_ON_DARK.has(key)) return '#FFFFFF'
  const icon = ICON_MAP[key]
  return icon ? `#${icon.hex}` : '#FFFFFF'
}

export function PlatformIcon({
  platform,
  size = 16,
  colored = false,
  className = '',
}: {
  platform: string
  size?: number
  colored?: boolean
  className?: string
}) {
  const key = platform.toLowerCase()
  const fill = colored ? getPlatformBrandColor(key) : 'currentColor'

  if (key === 'linkedin') {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={fill}
        className={className}
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  }

  if (key === 'custom') {
    return colored ? (
      <Globe size={size} className={className} aria-hidden="true" />
    ) : (
      <Link2 size={size} className={className} aria-hidden="true" />
    )
  }

  const icon = ICON_MAP[key]
  if (!icon) {
    return <Link2 size={size} className={className} aria-hidden="true" />
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      className={className}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  )
}
