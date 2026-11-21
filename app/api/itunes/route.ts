// app/api/itunes/route.ts - Search iTunes / Apple Music preview clips
import { NextRequest, NextResponse } from 'next/server'

interface ITunesTrack {
  trackId?: number
  trackName?: string
  artistName?: string
  previewUrl?: string
  artworkUrl100?: string
  artworkUrl60?: string
  trackViewUrl?: string
}

interface ITunesSearchResponse {
  results?: ITunesTrack[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get('term')

  if (!term || term.trim().length === 0) {
    return NextResponse.json({ results: [] })
  }

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
      term.trim()
    )}&media=music&entity=song&limit=15`

    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      return NextResponse.json({ results: [] })
    }

    const data = (await res.json()) as ITunesSearchResponse
    // Map to clean format
    const results = (data.results || []).map((item: ITunesTrack) => ({
      trackId: item.trackId,
      trackName: item.trackName,
      artistName: item.artistName,
      previewUrl: item.previewUrl,
      artworkUrl: item.artworkUrl100 || item.artworkUrl60,
      trackViewUrl: item.trackViewUrl,
    }))

    return NextResponse.json({ results })
  } catch (err) {
    console.error('iTunes search error:', err)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
