'use client'
// app/dashboard/links/page.tsx - Full-color brand icon grid + Add Custom URL + active links

import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { Switch } from '@/components/ui/switch'
import {
  detectPlatform,
  getPlatformLabel,
  PLATFORM_CATEGORIES,
  PLATFORMS,
  type PlatformCategory,
} from '@/lib/platforms'
import { createClient } from '@/lib/supabase/client'
import { normalizeUrl } from '@/lib/url'
import {
  ArrowDown,
  ArrowUp,
  Globe,
  Link2,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'

type LinkRow = {
  id: string
  platform: string
  url: string
  sort_order: number
  is_active: boolean
}

export default function LinksPage() {
  const supabase = useMemo(() => createClient(), [])
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [newUrl, setNewUrl] = useState('')
  const [category, setCategory] = useState<PlatformCategory | 'all'>('all')
  const [iconQuery, setIconQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const urlInputRef = useRef<HTMLInputElement>(null)

  const fetchLinks = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('profile_id', user.id)
      .order('sort_order')
    setLinks(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const brandPlatforms = useMemo(() => {
    const q = iconQuery.trim().toLowerCase()
    return PLATFORMS.filter((p) => {
      if (p.id === 'custom') return false
      const catMatch = category === 'all' || p.category === category
      const qMatch = !q || p.label.toLowerCase().includes(q) || p.id.includes(q)
      return catMatch && qMatch
    })
  }, [category, iconQuery])

  const selectedDef = selectedPlatform
    ? (PLATFORMS.find((p) => p.id === selectedPlatform) ?? PLATFORMS[PLATFORMS.length - 1])
    : null

  function openPlatform(id: string) {
    setSelectedPlatform(id)
    setError('')
    setTimeout(() => urlInputRef.current?.focus(), 40)
  }

  async function addLink() {
    setError('')

    const normalised = normalizeUrl(newUrl)
    if (!normalised.ok) {
      setError(normalised.message)
      return
    }

    const platform =
      selectedPlatform && selectedPlatform !== 'custom'
        ? selectedPlatform
        : detectPlatform(normalised.url)

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', url: newUrl, platform }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.message ?? 'Could not add link.')
      return
    }

    setNewUrl('')
    setSelectedPlatform(null)
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
    const idx = links.findIndex((l) => l.id === id)
    if (idx < 0) return
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= links.length) return
    const a = links[idx]
    const b = links[swap]
    await supabase.from('links').update({ sort_order: b.sort_order }).eq('id', a.id)
    await supabase.from('links').update({ sort_order: a.sort_order }).eq('id', b.id)
    fetchLinks()
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-10">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 md:p-10">
      {/* Main social picker card */}
      <BlurFade delay={0.03}>
        <Card className="rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none">
          <CardContent className="space-y-6 p-6 sm:p-8">
            {/* Header + filter row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  <Link2 size={20} className="text-[var(--color-accent)]" aria-hidden="true" />
                  Link your social media profiles.
                </h1>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">
                  Pick a social media or app icon to add to your Xlay card.
                </p>
              </div>

              <div className="relative sm:w-48">
                <Search
                  size={13}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  aria-hidden="true"
                />
                <Input
                  type="text"
                  value={iconQuery}
                  onChange={(e) => setIconQuery(e.target.value)}
                  placeholder="Filter apps…"
                  className="h-9 rounded-xl border-white/[0.08] bg-[#141418] pl-8 text-xs"
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {PLATFORM_CATEGORIES.filter((c) => c.id !== 'other').map((cat) => {
                const active = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-[var(--color-accent)] text-black font-semibold'
                        : 'bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {/* Slide-in URL bar when a platform tile is tapped */}
            {selectedDef && (
              <div className="rounded-2xl border border-[var(--color-accent)]/35 bg-[#131318] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
                      <PlatformIcon platform={selectedDef.id} size={18} colored />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Add {selectedDef.label}</p>
                      <p className="text-[11px] text-white/45">
                        Paste your profile link below
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(null)
                      setError('')
                    }}
                    className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Input
                    ref={urlInputRef}
                    type="url"
                    value={newUrl}
                    onChange={(e) => {
                      setNewUrl(e.target.value)
                      if (error) setError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && startTransition(addLink)}
                    placeholder={selectedDef.placeholder}
                    className="min-h-[44px] flex-1 rounded-xl border-white/10 bg-[#0a0a0d]"
                  />
                  <Button
                    type="button"
                    onClick={() => startTransition(addLink)}
                    disabled={isPending}
                    className="min-h-[44px] rounded-xl px-5 font-semibold"
                  >
                    <Plus size={15} aria-hidden="true" />
                    Add
                  </Button>
                </div>
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
              </div>
            )}

            {/* Full-color brand icon tiles grid */}
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9">
              {brandPlatforms.map((p) => {
                const isSelected = selectedPlatform === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openPlatform(p.id)}
                    title={p.label}
                    aria-label={`Add ${p.label}`}
                    className={`group flex aspect-square flex-col items-center justify-center rounded-2xl border transition-all duration-150 hover:-translate-y-0.5 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 ring-2 ring-[var(--color-accent)]/30'
                        : 'border-white/[0.06] bg-[#151519] hover:border-white/15 hover:bg-[#1b1b21]'
                    }`}
                  >
                    <PlatformIcon
                      platform={p.id}
                      size={24}
                      colored
                      className="transition-transform duration-150 group-hover:scale-110"
                    />
                  </button>
                )
              })}
            </div>

            {/* Dedicated Add Custom URL card (matches reference bottom tile) */}
            <button
              type="button"
              onClick={() => openPlatform('custom')}
              className={`flex w-full max-w-md items-center gap-4 rounded-2xl border p-4 text-left transition-colors cursor-pointer ${
                selectedPlatform === 'custom'
                  ? 'border-[var(--color-accent)]/60 bg-[var(--color-accent)]/10'
                  : 'border-white/[0.08] bg-[#141418] hover:border-white/20 hover:bg-[#19191f]'
              }`}
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/80">
                <Globe size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Add Custom URL</p>
                <p className="text-xs text-white/45">
                  Use your own website or portfolio link.
                </p>
              </div>
            </button>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Active links list */}
      <BlurFade delay={0.08} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-sm font-bold text-white">
            Your active links ({links.length})
          </h2>
        </div>

        {links.length === 0 && (
          <Card className="rounded-2xl border-dashed border-white/[0.08] bg-[#0e0e11]/60 py-0 shadow-none">
            <CardContent className="py-10 text-center text-sm text-white/45">
              No links yet. Tap any icon above to add your first profile.
            </CardContent>
          </Card>
        )}

        {links.map((link, i) => (
          <Card
            key={link.id}
            className={`rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none transition-opacity ${
              !link.is_active ? 'opacity-50' : ''
            }`}
          >
            <CardContent className="flex items-center gap-3.5 p-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#16161b]">
                <PlatformIcon platform={link.platform} size={19} colored />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">
                  {getPlatformLabel(link.platform)}
                </p>
                <p className="truncate text-xs text-white/45">{link.url}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveLink(link.id, 'up')}
                  disabled={i === 0}
                  aria-label="Move up"
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => moveLink(link.id, 'down')}
                  disabled={i === links.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown size={14} />
                </Button>
                <Switch
                  checked={link.is_active}
                  onCheckedChange={() => toggleLink(link.id, link.is_active)}
                  aria-label={`Toggle ${link.platform}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => deleteLink(link.id)}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  aria-label={`Delete ${link.platform}`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </BlurFade>
    </div>
  )
}
