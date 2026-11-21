'use client'
// app/dashboard/links/page.tsx - Manage links with full 47-platform icon picker

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
import { ArrowDown, ArrowUp, Loader2, Plus, Search, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'

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
  const [newUrl, setNewUrl] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [category, setCategory] = useState<PlatformCategory | 'all'>('all')
  const [iconQuery, setIconQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

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

  const activePlatform = selectedPlatform ?? (newUrl.trim() ? detectPlatform(newUrl) : 'instagram')
  const activePlatformDef = PLATFORMS.find((p) => p.id === activePlatform) ?? PLATFORMS[0]

  const filteredPlatforms = useMemo(() => {
    const q = iconQuery.trim().toLowerCase()
    return PLATFORMS.filter((p) => {
      const catMatch = category === 'all' || p.category === category
      const qMatch = !q || p.label.toLowerCase().includes(q) || p.id.includes(q)
      return catMatch && qMatch
    })
  }, [category, iconQuery])

  async function addLink() {
    setError('')

    const normalised = normalizeUrl(newUrl)
    if (!normalised.ok) {
      setError(normalised.message)
      return
    }

    const platform = selectedPlatform ?? detectPlatform(normalised.url)

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
    <div className="mx-auto max-w-3xl space-y-6 p-6 md:p-10">
      <BlurFade delay={0.03}>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Links
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick any social, music, messaging, or creator app icon — or paste a link and Xlay detects
          it automatically.
        </p>
      </BlurFade>

      {/* Add link + Full Platform Icon Picker */}
      <BlurFade delay={0.07}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-5 p-6">
            {/* URL input row */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-bold text-foreground">Add a link</h2>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <PlatformIcon platform={activePlatform} size={13} className="text-primary" />
                  {activePlatformDef.label}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <PlatformIcon platform={activePlatform} size={16} />
                  </span>
                  <Input
                    type="url"
                    value={newUrl}
                    onChange={(e) => {
                      setNewUrl(e.target.value)
                      if (error) setError('')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && startTransition(addLink)}
                    placeholder={activePlatformDef.placeholder}
                    className="min-h-[46px] rounded-xl pl-10"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => startTransition(addLink)}
                  disabled={isPending}
                  className="min-h-[46px] rounded-xl px-4 font-semibold"
                >
                  <Plus size={16} aria-hidden="true" />
                  Add
                </Button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            {/* Platform picker header + search */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_CATEGORIES.map((cat) => {
                    const active = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground'
                        }`}
                      >
                        {cat.label}
                      </button>
                    )
                  })}
                </div>

                <div className="relative sm:w-44">
                  <Search
                    size={13}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    type="text"
                    value={iconQuery}
                    onChange={(e) => setIconQuery(e.target.value)}
                    placeholder="Filter apps…"
                    className="h-8 rounded-lg pl-8 text-xs"
                  />
                </div>
              </div>

              {/* Icon grid */}
              <div className="grid max-h-[220px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-5 md:grid-cols-6">
                {filteredPlatforms.map((p) => {
                  const isSelected = activePlatform === p.id
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-primary/60 bg-primary/10 text-primary'
                          : 'border-border bg-background/60 text-muted-foreground hover:border-white/20 hover:text-foreground'
                      }`}
                    >
                      <PlatformIcon platform={p.id} size={18} />
                      <span className="w-full truncate text-[10px] font-medium">{p.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Active links list */}
      <BlurFade delay={0.11} className="space-y-2.5">
        {links.length === 0 && (
          <Card className="rounded-2xl border-dashed border-border bg-card/50 py-0 shadow-none">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No links yet. Pick an app icon above and paste your link.
            </CardContent>
          </Card>
        )}

        {links.map((link, i) => (
          <Card
            key={link.id}
            className={`rounded-2xl border-border bg-card py-0 shadow-none transition-opacity ${
              !link.is_active ? 'opacity-50' : ''
            }`}
          >
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-foreground">
                <PlatformIcon platform={link.platform} size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {getPlatformLabel(link.platform)}
                </p>
                <p className="truncate text-xs text-muted-foreground">{link.url}</p>
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
