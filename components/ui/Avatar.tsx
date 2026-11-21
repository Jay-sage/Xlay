'use client'
// components/ui/Avatar.tsx - Single Avatar component driven by avatar_source & avatar_pose
// Snap compliance: Bitmoji art is always shown unmodified — rings/glows go around or behind, never on top of the art.

import { getBitmojiPoseUrl, isFullBodyPose } from '@/lib/snap/bitmoji'
import { useState } from 'react'

export interface AvatarProps {
  avatarUrl: string | null | undefined
  avatarSource?: string | null
  avatarPose?: string | null
  displayName?: string | null
  accentColor?: string
  size?: 'sm' | 'md' | 'lg' | 'card' | 'preview'
  forceCircle?: boolean
  className?: string
}

export default function Avatar({
  avatarUrl,
  avatarSource = 'bitmoji',
  avatarPose = '582513516',
  displayName = '?',
  accentColor = 'var(--color-accent)',
  size = 'md',
  forceCircle = false,
  className = '',
}: AvatarProps) {
  const [failed, setFailed] = useState(false)

  const isBitmoji = avatarSource === 'bitmoji' || !avatarSource
  const useFullBody = !forceCircle && isBitmoji && isFullBodyPose(avatarPose)

  const resolvedSrc = failed
    ? avatarUrl
    : isBitmoji && useFullBody
      ? getBitmojiPoseUrl(avatarUrl, avatarPose)
      : avatarUrl

  const initial = displayName?.trim()?.[0]?.toUpperCase() ?? '?'

  // Full-body 3D transparent cutout mode (for card hero & dashboard preview)
  if (useFullBody && resolvedSrc) {
    const dims =
      size === 'card'
        ? 'h-64 w-56 sm:h-72 sm:w-64'
        : size === 'preview'
          ? 'h-44 w-40'
          : size === 'lg'
            ? 'h-48 w-44'
            : 'h-24 w-24'

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Subtle ambient glow behind the Bitmoji (never on top of the art) */}
        <div
          className="absolute inset-4 rounded-full opacity-25 blur-2xl pointer-events-none"
          style={{ background: accentColor }}
          aria-hidden="true"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={displayName ?? 'Bitmoji'}
          onError={() => {
            if (!failed) setFailed(true)
          }}
          className={`relative z-10 ${dims} object-contain select-none`}
        />
      </div>
    )
  }

  // Circular portrait mode (classic headshot, friend avatars, nav bar, or fallback)
  const circleDims =
    size === 'card'
      ? 'h-28 w-28'
      : size === 'preview'
        ? 'h-20 w-20'
        : size === 'lg'
          ? 'h-24 w-24'
          : size === 'sm'
            ? 'h-9 w-9'
            : 'h-12 w-12'

  const showRing = size === 'card' || size === 'preview'

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {showRing && (
        <>
          <div
            className="absolute -inset-1.5 rounded-full pointer-events-none opacity-60 blur-[4px]"
            style={{ background: `conic-gradient(from 0deg, ${accentColor}, transparent, ${accentColor})` }}
            aria-hidden="true"
          />
          <div
            className="absolute -inset-0.5 rounded-full border-2 pointer-events-none"
            style={{ borderColor: accentColor }}
            aria-hidden="true"
          />
        </>
      )}
      {resolvedSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedSrc}
          alt={displayName ?? 'Avatar'}
          onError={() => {
            if (!failed) setFailed(true)
          }}
          className={`relative z-10 ${circleDims} rounded-full object-cover bg-white/5`}
        />
      ) : (
        <div
          className={`relative z-10 ${circleDims} rounded-full bg-white/10 flex items-center justify-center font-display font-bold text-white`}
        >
          {initial}
        </div>
      )}
    </div>
  )
}
