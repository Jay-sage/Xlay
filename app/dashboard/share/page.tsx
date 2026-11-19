'use client'
// app/dashboard/share/page.tsx
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const SHARE_PLATFORMS = [
  { id: 'snapchat', label: 'Snapchat', icon: '👻', color: '#FFFC00', ref: 'snapchat' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', color: '#25D366', ref: 'whatsapp' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#ff0050', ref: 'tiktok' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E1306C', ref: 'instagram' },
]

export default function SharePage() {
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('username').eq('id', user.id).single()
        .then(({ data }) => setUsername(data?.username ?? ''))
    })
  }, [])

  const baseUrl = `https://xlay.me/${username}`

  function copyLink() {
    navigator.clipboard.writeText(baseUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareUrl(ref: string) {
    return `${baseUrl}?ref=${ref}`
  }

  function getShareHref(platform: string, ref: string): string {
    const url = encodeURIComponent(shareUrl(ref))
    const text = encodeURIComponent(`Check out my Xlay card 👇`)
    switch (platform) {
      case 'whatsapp': return `https://wa.me/?text=${text}%20${url}`
      case 'tiktok': return '#' // TikTok doesn't support web share; just copy
      case 'twitter': return `https://twitter.com/intent/tweet?url=${url}&text=${text}`
      default: return '#'
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Share</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Share your Xlay card and track where your visitors come from.
        </p>
      </div>

      {/* Copy link */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Your link</h2>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
          <span className="flex-1 text-sm text-[var(--color-text-primary)] truncate">{baseUrl}</span>
          <button
            onClick={copyLink}
            className="text-xs font-semibold text-[var(--color-accent)] flex-shrink-0 px-2 py-1 rounded-lg bg-[var(--color-accent)]/10"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Platform share buttons */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Share to</h2>
        <div className="grid grid-cols-2 gap-3">
          {SHARE_PLATFORMS.map(p => (
            <a
              key={p.id}
              href={getShareHref(p.id, p.ref)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => {
                if (p.id === 'snapchat' || p.id === 'tiktok') {
                  e.preventDefault()
                  navigator.clipboard.writeText(shareUrl(p.ref))
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }
              }}
              className="glass rounded-xl p-4 flex items-center gap-3 hover:ring-1 hover:ring-white/20 transition-all"
            >
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{p.label}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {p.id === 'snapchat' || p.id === 'tiktok' ? 'Copy link' : 'Open app'}
                </p>
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Each link includes a <code className="text-[var(--color-accent)]">?ref=</code> tag so you can see where visitors come from in Stats.
        </p>
      </div>
    </div>
  )
}
