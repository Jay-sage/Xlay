'use client'
// app/dashboard/links/page.tsx - Manage links
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useTransition } from 'react'

type Link = { id: string; platform: string; url: string; sort_order: number; is_active: boolean }

const PLATFORMS = [
  'instagram','tiktok','twitter','snapchat','youtube','spotify','soundcloud','custom'
]

function detectPlatform(url: string): string {
  if (!url) return 'custom'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  if (url.includes('snapchat.com')) return 'snapchat'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('spotify.com')) return 'spotify'
  if (url.includes('soundcloud.com')) return 'soundcloud'
  return 'custom'
}

export default function LinksPage() {
  const supabase = createClient()
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  async function fetchLinks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', user.id)
      .order('sort_order')
    setLinks(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  async function addLink() {
    if (!newUrl.trim()) return
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const platform = detectPlatform(newUrl)
    const { error } = await supabase.from('links').insert({
      profile_id: user.id,
      url: newUrl.trim(),
      platform,
      sort_order: links.length,
      is_active: true,
    })
    if (error) { setError('Could not add link.'); return }
    setNewUrl('')
    fetchLinks()
  }

  async function toggleLink(id: string, current: boolean) {
    await supabase.from('links').update({ is_active: !current }).eq('id', id)
    fetchLinks()
  }

  async function deleteLink(id: string) {
    await supabase.from('links').delete().eq('id', id)
    fetchLinks()
  }

  async function moveLink(id: string, dir: 'up' | 'down') {
    const idx = links.findIndex(l => l.id === id)
    if (idx < 0) return
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= links.length) return
    const a = links[idx], b = links[swap]
    await supabase.from('links').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('links').update({ sort_order: a.sort_order }).eq('id', b.id)
    fetchLinks()
  }

  if (loading) return <div className="p-10 text-[var(--color-text-secondary)]">Loading…</div>

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Links</h1>

      {/* Add link */}
      <div className="glass rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Add a link</h2>
        <div className="flex gap-2">
          <input
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addLink()}
            placeholder="https://instagram.com/yourname"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50"
          />
          <button onClick={() => startTransition(addLink)} disabled={isPending}
            className="btn-primary px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50">
            Add
          </button>
        </div>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Link list */}
      <div className="space-y-2">
        {links.length === 0 && (
          <p className="text-sm text-[var(--color-text-secondary)] text-center py-8">
            No links yet. Add your first one above.
          </p>
        )}
        {links.map((link, i) => (
          <div key={link.id} className={`glass rounded-2xl p-4 flex items-center gap-3 ${!link.is_active ? 'opacity-50' : ''}`}>
            <span className="text-lg flex-shrink-0">
              {link.platform === 'instagram' ? '📸' : link.platform === 'tiktok' ? '🎵' : link.platform === 'twitter' ? '𝕏' : link.platform === 'snapchat' ? '👻' : link.platform === 'youtube' ? '▶️' : link.platform === 'spotify' ? '🎧' : link.platform === 'soundcloud' ? '☁️' : '🔗'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--color-text-primary)] capitalize">{link.platform}</p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">{link.url}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => moveLink(link.id, 'up')} disabled={i === 0}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-20 text-sm">↑</button>
              <button onClick={() => moveLink(link.id, 'down')} disabled={i === links.length - 1}
                className="p-1.5 rounded-lg hover:bg-white/5 disabled:opacity-20 text-sm">↓</button>
              <button onClick={() => toggleLink(link.id, link.is_active)}
                className={`px-2 py-1 rounded-lg text-xs font-medium ${link.is_active ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-[var(--color-text-secondary)]'}`}>
                {link.is_active ? 'On' : 'Off'}
              </button>
              <button onClick={() => deleteLink(link.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 text-sm">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
