'use client'
// app/dashboard/music/page.tsx - Apple Music search & selection
import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef, useState, useTransition } from 'react'

interface iTunesTrack {
  trackId: number
  trackName: string
  artistName: string
  previewUrl: string
  artworkUrl: string
  trackViewUrl: string
}

export default function MusicPage() {
  const supabase = createClient()
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<iTunesTrack[]>([])
  const [searching, setSearching] = useState(false)
  const [playingPreview, setPlayingPreview] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('profiles')
        .select('music_url,music_title')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setCurrentUrl(data.music_url)
            setCurrentTitle(data.music_title ?? '')
          }
        })
    })
  }, [supabase])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchTerm.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`/api/itunes?term=${encodeURIComponent(searchTerm.trim())}`)
      const data = await res.json()
      setResults(data.results || [])
    } catch (err) {
      console.error(err)
    } finally {
      setSearching(false)
    }
  }

  function togglePreview(url: string) {
    if (playingPreview === url) {
      audioPreviewRef.current?.pause()
      setPlayingPreview(null)
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause()
      }
      const audio = new Audio(url)
      audioPreviewRef.current = audio
      audio.play()
      audio.onended = () => setPlayingPreview(null)
      setPlayingPreview(url)
    }
  }

  function selectSong(track: iTunesTrack) {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const title = `${track.trackName} — ${track.artistName}`
      await supabase
        .from('profiles')
        .update({ music_url: track.previewUrl, music_title: title })
        .eq('id', user.id)

      setCurrentUrl(track.previewUrl)
      setCurrentTitle(title)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  function removeTrack() {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('profiles')
        .update({ music_url: null, music_title: null })
        .eq('id', user.id)

      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause()
      }
      setCurrentUrl(null)
      setCurrentTitle('')
      setPlayingPreview(null)
    })
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
          Soundtrack (Apple Music)
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Pick any song on Apple Music. Visitors hear the official 30-second preview when entering your card. Zero copyright hassle!
        </p>
      </div>

      {currentUrl && (
        <div className="glass rounded-2xl p-5 space-y-3 border border-[var(--color-accent)]/30">
          <p className="text-xs uppercase tracking-wider font-semibold text-[var(--color-accent)]">
            Active on your card
          </p>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                {currentTitle}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">Apple Music 30s preview</p>
            </div>
            <button
              onClick={removeTrack}
              disabled={isPending}
              className="text-xs text-red-400 hover:underline flex-shrink-0"
            >
              Remove
            </button>
          </div>
          <audio controls src={currentUrl} className="w-full h-8 mt-2" />
        </div>
      )}

      {/* Search Bar */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Search songs, artists, or albums
        </h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="e.g. Asake, Rema, Burna Boy, Drake..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50"
          />
          <button
            type="submit"
            disabled={searching}
            className="btn-primary px-5 py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </form>

        {saved && <p className="text-xs text-green-400 font-semibold">✓ Saved to your card!</p>}

        {/* Results */}
        <div className="space-y-2 mt-4 max-h-[420px] overflow-y-auto pr-1">
          {results.map((track) => (
            <div
              key={track.trackId}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={track.artworkUrl}
                alt={track.trackName}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                  {track.trackName}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {track.artistName}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => togglePreview(track.previewUrl)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-white font-medium"
                >
                  {playingPreview === track.previewUrl ? '⏸ Pause' : '▶ Preview'}
                </button>
                <button
                  type="button"
                  onClick={() => selectSong(track)}
                  disabled={isPending}
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  Choose
                </button>
              </div>
            </div>
          ))}
          {results.length === 0 && !searching && searchTerm && (
            <p className="text-xs text-[var(--color-text-secondary)] text-center py-4">
              No matching songs found. Try a different search term.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
