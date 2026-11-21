import { Link2 } from 'lucide-react'
import {
  siInstagram,
  siSnapchat,
  siSoundcloud,
  siSpotify,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
  type SimpleIcon,
} from 'simple-icons'

const ICON_MAP: Record<string, SimpleIcon> = {
  instagram: siInstagram,
  tiktok: siTiktok,
  twitter: siX,
  x: siX,
  snapchat: siSnapchat,
  youtube: siYoutube,
  spotify: siSpotify,
  soundcloud: siSoundcloud,
  whatsapp: siWhatsapp,
}

export function PlatformIcon({
  platform,
  size = 16,
  className = '',
}: {
  platform: string
  size?: number
  className?: string
}) {
  const icon = ICON_MAP[platform.toLowerCase()]
  if (!icon) {
    return <Link2 size={size} className={className} aria-hidden="true" />
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  )
}
