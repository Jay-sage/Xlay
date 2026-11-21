// app/opengraph-image.tsx - Landing page social share image
//
// Static 1200x630 image with the Xlay wordmark and "Show Up."
// No Bitmoji artwork is used here — Snap does not allow Bitmoji in
// marketing visuals (real screenshots of the working integration only).
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Xlay — Show Up.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const syne = readFile(join(process.cwd(), 'assets/fonts/Syne-800.ttf'))
const dmSans = readFile(join(process.cwd(), 'assets/fonts/DMSans-500.ttf'))

const ACCENT = '#E8FF47'
const BASE_BG = '#080808'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: BASE_BG,
          color: '#f5f5f5',
          fontFamily: 'DM Sans',
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: 'Syne',
            fontSize: 120,
            fontWeight: 800,
            color: ACCENT,
            display: 'flex',
            letterSpacing: -2,
          }}
        >
          Xlay
        </div>

        <div
          style={{
            fontFamily: 'Syne',
            fontSize: 72,
            fontWeight: 700,
            display: 'flex',
            letterSpacing: -1,
          }}
        >
          Show Up.
        </div>

        <div
          style={{
            fontSize: 30,
            color: '#a1a1aa',
            display: 'flex',
            marginTop: 12,
          }}
        >
          Your Bitmoji. Your links. One card.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Syne', data: await syne, style: 'normal', weight: 800 },
        { name: 'DM Sans', data: await dmSans, style: 'normal', weight: 500 },
      ],
    }
  )
}
