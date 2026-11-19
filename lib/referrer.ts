// lib/referrer.ts - Referrer / source normalisation for view logging

export type ViewSource =
  | 'snapchat'
  | 'whatsapp'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'facebook'
  | 'direct'
  | 'other'

/** Known link-preview / crawler bot UA fragments — views from these are ignored */
export const BOT_UA_PATTERNS = [
  'twitterbot',
  'facebookexternalhit',
  'facebot',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'linkedinbot',
  'discordbot',
  'googlebot',
  'bingbot',
  'baiduspider',
  'yandexbot',
  'duckduckbot',
  'applebot',
  'developers.google.com/+/web/snippet',
  'screenshotapi',
  'embedly',
  'quora link preview',
  'rogerbot',
  'vkshare',
  'ia_archiver',
]

export function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return BOT_UA_PATTERNS.some(p => ua.includes(p))
}

/** Map a ?ref= param, Referer header, or in-app-browser UA to a ViewSource */
export function normaliseSource(params: {
  refParam?: string | null
  referer?: string | null
  userAgent?: string | null
}): ViewSource {
  const { refParam, referer, userAgent } = params

  // 1. Explicit ?ref= param takes priority
  if (refParam) {
    const ref = refParam.toLowerCase()
    if (ref === 'snapchat') return 'snapchat'
    if (ref === 'whatsapp') return 'whatsapp'
    if (ref === 'instagram') return 'instagram'
    if (ref === 'tiktok') return 'tiktok'
    if (ref === 'twitter') return 'twitter'
    if (ref === 'facebook') return 'facebook'
  }

  // 2. In-app browser UA sniffing
  if (userAgent) {
    const ua = userAgent.toLowerCase()
    if (ua.includes('snapchat')) return 'snapchat'
    if (ua.includes('instagram')) return 'instagram'
    if (ua.includes('tiktok') || ua.includes('musically')) return 'tiktok'
    if (ua.includes('twitter')) return 'twitter'
    if (ua.includes('fban') || ua.includes('fbios') || ua.includes('fbav')) return 'facebook'
  }

  // 3. Referer header
  if (referer) {
    try {
      const hostname = new URL(referer).hostname.toLowerCase()
      if (hostname.includes('snapchat.com')) return 'snapchat'
      if (hostname.includes('wa.me') || hostname.includes('whatsapp.com')) return 'whatsapp'
      if (hostname.includes('instagram.com')) return 'instagram'
      if (hostname.includes('tiktok.com')) return 'tiktok'
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter'
      if (hostname.includes('facebook.com') || hostname.includes('fb.com')) return 'facebook'
      return 'other'
    } catch {
      // ignore malformed referer
    }
  }

  return 'direct'
}

/** Parse device type from UA */
export function parseDevice(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  const ua = userAgent.toLowerCase()
  if (ua.includes('tablet') || ua.includes('ipad')) return 'tablet'
  if (
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone') ||
    ua.includes('ipod')
  )
    return 'mobile'
  return 'desktop'
}

/**
 * Compute a daily-salted visitor hash.
 * Input: IP + UA. Output: hex SHA-256. The IP is NEVER stored.
 */
export async function visitorHash(ip: string, ua: string): Promise<string> {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const raw = `${today}:${ip}:${ua}`
  const enc = new TextEncoder().encode(raw)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
