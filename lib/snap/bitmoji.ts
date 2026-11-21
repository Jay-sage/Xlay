// lib/snap/bitmoji.ts - 3D & Full-Body Bitmoji pose utilities

export interface BitmojiPose {
  id: string
  label: string
  description: string
  isFullBody: boolean
}

export const BITMOJI_POSES: BitmojiPose[] = [
  {
    id: '10219858',
    label: 'Standing',
    description: 'Clean upright full-body 3D pose',
    isFullBody: true,
  },
  {
    id: '10226022',
    label: 'Neutral 3D',
    description: 'Simple neutral 3D cutout',
    isFullBody: true,
  },
  {
    id: '10222123',
    label: 'Chilling',
    description: 'Relaxed full-body 3D pose',
    isFullBody: true,
  },
  {
    id: '10223291',
    label: 'Shades',
    description: '3D portrait with sunglasses',
    isFullBody: true,
  },
  {
    id: '10218954',
    label: 'Breakdance',
    description: 'Full-body 3D with boombox',
    isFullBody: true,
  },
  {
    id: 'headshot',
    label: 'Classic Circle',
    description: 'Standard Snapchat portrait',
    isFullBody: false,
  },
]

export const DEFAULT_BITMOJI_POSE = '10219858'

/**
 * Extracts the opaque Bitmoji avatar ID from a Snap Login Kit URL.
 * Example input:
 *   https://sdk.bitmoji.com/3d/render/10226021-sTc0T_w5TXkof4i~_jI23nhNS5FbakLXiYj6vSeZfp2XBjcP2kclbg-v1.png?trim=circle&ua=2
 *   https://sdk.bitmoji.com/render/panel/10226021-<avatarId>-v1.png?...
 */
export function extractBitmojiAvatarId(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null
  const match = avatarUrl.match(
    /sdk\.bitmoji\.com\/(?:3d\/render|render\/panel)\/\d+-([^-]+)-v\d+\.png/
  )
  return match?.[1] ?? null
}

/**
 * Builds the 3D render URL for a chosen Bitmoji pose.
 * Falls back cleanly to the original avatarUrl if pose is 'headshot' or URL isn't a Snap SDK Bitmoji URL.
 */
export function getBitmojiPoseUrl(
  avatarUrl: string | null | undefined,
  poseId: string | null | undefined
): string | null {
  if (!avatarUrl) return null
  if (!poseId || poseId === 'headshot') return avatarUrl

  const avatarId = extractBitmojiAvatarId(avatarUrl)
  if (!avatarId) return avatarUrl

  return `https://sdk.bitmoji.com/3d/render/${poseId}-${avatarId}-v1.png?transparent=1&ua=2`
}

export function isFullBodyPose(poseId: string | null | undefined): boolean {
  if (!poseId || poseId === 'headshot') return false
  const found = BITMOJI_POSES.find((p) => p.id === poseId)
  return found ? found.isFullBody : true
}
