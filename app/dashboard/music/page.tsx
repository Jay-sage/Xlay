'use client'
// app/dashboard/music/page.tsx - Apple Music search & 30s preview selection
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { Check, Loader2, Music, Pause, Play, Search, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

interface ITunesTrack {
  trackId: number
  trackName: string
  artistName: string
  previewUrl: string
  artworkUrl: string
  trackViewUrl: string
}

export default function MusicPage() {
  const supabase = useMemo(() => createClient(), [])
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<ITunesTrack[]>([])
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

  function selectSong(track: ITunesTrack) {
    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('profiles')
        .update({ music_url: null, music_title: null })
        .eq('id', user.id)

      audioPreviewRef.current?.pause()
      setCurrentUrl(null)
      setCurrentTitle('')
      setPlayingPreview(null)
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 md:p-10">
      <BlurFade delay={0.03}>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Soundtrack
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search Apple Music for any track. Visitors hear the official 30-second preview when they
          tap into your card.
        </p>
      </BlurFade>

      {currentUrl && (
        <BlurFade delay={0.07}>
          <Card className="rounded-2xl border-primary/30 bg-card py-0 shadow-none">
            <CardContent className="space-y-3 p-6">
              <div className="flex items-center justify-between gap-3">
                <Badge className="gap-1.5 rounded-full bg-primary/15 text-primary hover:bg-primary/15">
                  <Music size={12} aria-hidden="true" />
                  Active on your card
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={removeTrack}
                  disabled={isPending}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={12} aria-hidden="true" />
                  Remove
                </Button>
              </div>
              <p className="text-sm font-semibold text-foreground">{currentTitle}</p>
              <audio controls src={currentUrl} className="h-9 w-full" />
            </CardContent>
          </Card>
        </BlurFade>
      )}

      <BlurFade delay={0.11}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-sm font-bold text-foreground">
              Search Apple Music
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Asake, Rema, Burna Boy, Wizkid…"
                className="min-h-[46px] flex-1 rounded-xl"
              />
              <Button
                type="submit"
                disabled={searching}
                className="min-h-[46px] rounded-xl px-5 font-semibold"
              >
                {searching ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Search size={15} aria-hidden="true" />
                )}
                Search
              </Button>
            </form>

            {saved && (
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Check size={13} aria-hidden="true" />
                Saved to your card
              </p>
            )}

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {results.map((track) => {
                const isPlaying = playingPreview === track.previewUrl
                return (
                  <div
                    key={track.trackId}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 transition-colors hover:bg-white/[0.04]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.artworkUrl}
                      alt={track.trackName}
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {track.trackName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{track.artistName}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon-sm"
                        onClick={() => togglePreview(track.previewUrl)}
                        aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => selectSong(track)}
                        disabled={isPending}
                        className="rounded-lg font-semibold"
                      >
                        Choose
                      </Button>
                    </div>
                  </div>
                )
              })}
              {results.length === 0 && !searching && searchTerm && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  No matching tracks found. Try another search.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
