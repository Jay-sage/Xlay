'use client'
// app/dashboard/music/page.tsx
import { createClient } from '@/lib/supabase/client'
import { useEffect, useRef, useState, useTransition } from 'react'

const MAX_MB = 10

export default function MusicPage() {
  const supabase = createClient()
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [currentTitle, setCurrentTitle] = useState('')
  const [title, setTitle] = useState('')
  const [rightsChecked, setRightsChecked] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('music_url,music_title').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setCurrentUrl(data.music_url)
            setCurrentTitle(data.music_title ?? '')
            setTitle(data.music_title ?? '')
          }
        })
    })
  }, [])

  async function handleUpload() {
    setError('')
    const file = fileRef.current?.files?.[0]
    if (!file) { setError('Select an MP3 file first.'); return }
    if (!rightsChecked) { setError('Please confirm you own the rights to this track.'); return }
    if (!title.trim()) { setError('Enter a title for the track.'); return }
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File must be under ${MAX_MB} MB.`); return }
    if (!file.type.startsWith('audio/')) { setError('Only audio files are allowed.'); return }

    setUploading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Not signed in.'); setUploading(false); return }

    const ext = file.name.split('.').pop() ?? 'mp3'
    const path = `${user.id}/track.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('music')
      .upload(path, file, { upsert: true, contentType: 'audio/mpeg' })

    if (uploadError) { setError('Upload failed: ' + uploadError.message); setUploading(false); return }

    const { data: urlData } = supabase.storage.from('music').getPublicUrl(path)
    const publicUrl = urlData.publicUrl

    await supabase.from('profiles').update({ music_url: publicUrl, music_title: title.trim() }).eq('id', user.id)
    setCurrentUrl(publicUrl)
    setCurrentTitle(title.trim())
    setUploading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleRemove() {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('profiles').update({ music_url: null, music_title: null }).eq('id', user.id)
      await supabase.storage.from('music').remove([`${user.id}/track.mp3`, `${user.id}/track.m4a`])
      setCurrentUrl(null)
      setCurrentTitle('')
      setTitle('')
    })
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Music</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Upload a track that plays when visitors tap your card. Max {MAX_MB} MB, MP3 only.
        </p>
      </div>

      {currentUrl && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">🎵 Current track</p>
          <p className="text-sm text-[var(--color-text-secondary)]">{currentTitle}</p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio ref={audioRef} controls src={currentUrl} className="w-full h-10 rounded-lg" />
          <button onClick={handleRemove} className="text-xs text-red-400 underline">Remove track</button>
        </div>
      )}

      <div className="glass rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
          {currentUrl ? 'Replace track' : 'Upload a track'}
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs text-[var(--color-text-secondary)]">Track title</label>
          <input
            type="text" value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Calm Down — Rema"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50"
          />
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-[var(--color-accent)]/30 transition-colors"
        >
          <p className="text-2xl mb-2">🎵</p>
          <p className="text-sm text-[var(--color-text-secondary)]">Click to select MP3</p>
          <input ref={fileRef} type="file" accept="audio/mpeg,audio/mp3" className="hidden" />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={rightsChecked} onChange={e => setRightsChecked(e.target.checked)}
            className="mt-0.5 accent-[var(--color-accent)]"
          />
          <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
            I confirm I own or have the right to use this track on my Xlay card.
          </span>
        </label>

        {error && <p className="text-red-400 text-xs">{error}</p>}
        {saved && <p className="text-green-400 text-xs">Track saved!</p>}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : 'Upload track'}
        </button>

        <p className="text-xs text-center text-[var(--color-text-secondary)]">
          Using music you don't own?{' '}
          <a href="mailto:abuse@xlay.me" className="underline">Report a track</a>
        </p>
      </div>
    </div>
  )
}
