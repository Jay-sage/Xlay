// components/illustrations/StandInAvatar.tsx
// A neutral, illustrated stand-in avatar for MARKETING visuals only.
//
// Snap does not allow Bitmoji artwork in marketing visuals (real screenshots
// of the working integration are the only exception), so the homepage hero
// preview uses this geometric stand-in instead of any Snap avatar art.

export default function StandInAvatar({
  className = '',
  size = 160,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Illustrated profile silhouette"
    >
      <defs>
        <linearGradient id="xlayStandInBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a42" />
          <stop offset="100%" stopColor="#26262c" />
        </linearGradient>
        <linearGradient id="xlayStandInHead" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4a54" />
          <stop offset="100%" stopColor="#32323a" />
        </linearGradient>
      </defs>

      {/* Shoulders */}
      <path
        d="M40 200c0-38 27-62 60-62s60 24 60 62z"
        fill="url(#xlayStandInBody)"
      />
      {/* Neck */}
      <rect x="86" y="118" width="28" height="30" rx="14" fill="#32323a" />
      {/* Head */}
      <circle cx="100" cy="78" r="44" fill="url(#xlayStandInHead)" />
      {/* Accent hair shape */}
      <path
        d="M56 72c0-24 20-42 44-42s44 18 44 42c0-12-16-20-44-20s-44 8-44 20z"
        fill="#22222a"
      />
      {/* Accent collar detail */}
      <path d="M84 146l16 18 16-18" fill="none" stroke="#E8FF47" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
