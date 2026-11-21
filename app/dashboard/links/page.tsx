'use client'
// app/dashboard/links/page.tsx - Dense full-color brand icon grid + inline Custom URL + 3-column link cards

import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import {
  detectPlatform,
  formatLinkDisplay,
  getPlatformLabel,
  PLATFORM_CATEGORIES,
  PLATFORMS,
  resolvePlatformInput,
  type PlatformCategory,
} from '@/lib/platforms'
import { createClient } from '@/lib/supabase/client'
import { normalizeUrl } from '@/lib/url'
import {
  Check,
  Eye,
  EyeOff,
  Globe,
  GripVertical,
  Link2,
  Loader2,
  Pencil,
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
  const [newInput, setNewInput] = useState('')
  const [category, setCategory] = useState<PlatformCategory | 'all'>('all')
  const [iconQuery, setIconQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editError, setEditError] = useState('')

  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

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

  const resolvedPreview = useMemo(() => {
    if (!selectedPlatform || !newInput.trim()) return null
    const resolved = resolvePlatformInput(selectedPlatform, newInput)
    if (resolved === newInput.trim()) return null
    const check = normalizeUrl(resolved)
    return check.ok ? check.url : null
  }, [selectedPlatform, newInput])

  function openPlatform(id: string) {
    setSelectedPlatform(id)
    setNewInput('')
    setError('')
    setTimeout(() => urlInputRef.current?.focus(), 40)
  }

  async function addLink() {
    setError('')

    const resolved = resolvePlatformInput(selectedPlatform, newInput)
    const normalised = normalizeUrl(resolved)
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
      body: JSON.stringify({ action: 'create', url: normalised.url, platform }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.message ?? 'Could not add link.')
      return
    }

    setNewInput('')
    setSelectedPlatform(null)
    fetchLinks()
  }

  function startEditing(link: LinkRow) {
    setEditingId(link.id)
    setEditValue(formatLinkDisplay(link.platform, link.url))
    setEditError('')
  }

  async function saveEdit(link: LinkRow) {
    setEditError('')
    const resolved = resolvePlatformInput(link.platform, editValue)
    const normalised = normalizeUrl(resolved)
    if (!normalised.ok) {
      setEditError(normalised.message)
      return
    }

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        linkId: link.id,
        url: normalised.url,
        platform: link.platform,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setEditError(data?.message ?? 'Could not update link.')
      return
    }

    setEditingId(null)
    setEditValue('')
    fetchLinks()
  }

  async function toggleLink(id: string, current: boolean) {
    // Optimistic update
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: !current } : l)))
    await supabase.from('links').update({ is_active: !current }).eq('id', id)
  }

  async function deleteLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id))
    await supabase.from('links').delete().eq('id', id)
  }

  async function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const fromIdx = links.findIndex((l) => l.id === draggedId)
    const toIdx = links.findIndex((l) => l.id === targetId)
    if (fromIdx < 0 || toIdx < 0) return

    const reordered = [...links]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved)

    const updated = reordered.map((item, idx) => ({ ...item, sort_order: idx }))
    setLinks(updated)
    setDraggedId(null)
    setDragOverId(null)

    await Promise.all(
      updated.map((item) =>
        supabase.from('links').update({ sort_order: item.sort_order }).eq('id', item.id)
      )
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-10">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-5 sm:p-6 md:p-8">
      {/* Main social picker card */}
      <BlurFade delay={0.03}>
        <Card className="rounded-2xl border-white/[0.06] bg-[#0e0e11] py-0 shadow-none">
          <CardContent className="space-y-5 p-5 sm:p-7">
            {/* Header + filter row */}
            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="flex items-center gap-2.5 font-display text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  <Link2 size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
                  Link your social media profiles.
                </h1>
                <p className="mt-1 text-xs text-white/50">
                  Pick a social media to add to your profile — just type your handle or paste a URL.
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

            {/* Compact category pills */}
            <div className="flex flex-wrap gap-1.5">
              {PLATFORM_CATEGORIES.filter((c) => c.id !== 'other').map((cat) => {
                const active = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
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

            {/* Slide-in handle/URL bar when a platform tile is tapped */}
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
                        {selectedDef.urlTemplate
                          ? `Enter your ${selectedDef.label} username or paste a full link`
                          : 'Paste your profile or website URL'}
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

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex min-h-[44px] flex-1 items-center overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0d] focus-within:border-[var(--color-accent)]/60">
                    {selectedDef.handlePrefix && (
                      <span className="hidden select-none border-r border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-xs text-white/40 sm:inline">
                        {selectedDef.handlePrefix}
                      </span>
                    )}
                    <input
                      ref={urlInputRef}
                      type="text"
                      value={newInput}
                      onChange={(e) => {
                        setNewInput(e.target.value)
                        if (error) setError('')
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && startTransition(addLink)}
                      placeholder={selectedDef.placeholder}
                      className="h-full w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => startTransition(addLink)}
                    disabled={isPending}
                    className="min-h-[44px] rounded-xl px-5 font-semibold"
                  >
                    {isPending ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Plus size={15} />
                    )}
                    Add Link
                  </Button>
                </div>

                {resolvedPreview && !error && (
                  <p className="mt-2 text-[11px] text-white/45">
                    Links to:{' '}
                    <span className="font-mono text-[var(--color-accent)]/85">
                      {resolvedPreview}
                    </span>
                  </p>
                )}

                {error && (
                  <p className="mt-2 text-xs text-red-400" role="alert">
                    {error}
                  </p>
                )}
              </div>
            )}

            {/* Dense full-color brand icon tile grid with inline Add Custom URL */}
            <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-[repeat(14,minmax(0,1fr))]">
              {brandPlatforms.map((p) => {
                const isSelected = selectedPlatform === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openPlatform(p.id)}
                    title={p.label}
                    aria-label={`Add ${p.label}`}
                    className={`group relative flex h-12 w-full items-center justify-center rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/12 scale-[1.03]'
                        : 'border-white/[0.04] bg-[#151519] hover:border-white/15 hover:bg-[#1b1b21] hover:-translate-y-0.5'
                    }`}
                  >
                    <PlatformIcon
                      platform={p.id}
                      size={22}
                      colored
                      className="transition-transform group-hover:scale-110"
                    />
                  </button>
                )
              })}

              {/* Inline Add Custom URL card at end of grid */}
              <button
                type="button"
                onClick={() => openPlatform('custom')}
                className={`col-span-5 sm:col-span-4 flex h-12 items-center gap-3 rounded-xl border px-3.5 text-left transition-all cursor-pointer ${
                  selectedPlatform === 'custom'
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10'
                    : 'border-white/[0.06] bg-[#151519] hover:border-white/15 hover:bg-[#1a1a20]'
                }`}
              >
                <Globe size={20} className="shrink-0 text-white/75" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">Add Custom URL</p>
                  <p className="truncate text-[10px] text-white/45">
                    Use your own URL and choose an icon to match.
                  </p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      {/* Active links 3-column card grid */}
      <BlurFade delay={0.07}>
        {links.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#0e0e11]/60 p-8 text-center">
            <p className="text-sm text-white/55">No links added yet.</p>
            <p className="mt-1 text-xs text-white/35">
              Tap any icon above to add your first social profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
            {links.map((link) => {
              const isEditing = editingId === link.id
              const displayHandle = formatLinkDisplay(link.platform, link.url)
              const isDragOver = dragOverId === link.id && draggedId !== link.id

              return (
                <div
                  key={link.id}
                  draggable={!isEditing}
                  onDragStart={() => setDraggedId(link.id)}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (dragOverId !== link.id) setDragOverId(link.id)
                  }}
                  onDragLeave={() => {
                    if (dragOverId === link.id) setDragOverId(null)
                  }}
                  onDrop={() => handleDrop(link.id)}
                  onDragEnd={() => {
                    setDraggedId(null)
                    setDragOverId(null)
                  }}
                  className={`flex items-center gap-2 rounded-2xl border bg-[#0e0e11] p-3.5 pl-2.5 transition-all ${
                    isDragOver
                      ? 'border-[var(--color-accent)]/60 bg-[#15151a]'
                      : 'border-white/[0.06] hover:border-white/[0.11]'
                  } ${!link.is_active ? 'opacity-55' : ''}`}
                >
                  {/* 6-dot drag handle */}
                  <div
                    className="flex shrink-0 cursor-grab items-center justify-center px-0.5 text-white/25 hover:text-white/60 active:cursor-grabbing"
                    title="Drag to reorder"
                    aria-hidden="true"
                  >
                    <GripVertical size={15} />
                  </div>

                  {/* Card body */}
                  <div className="min-w-0 flex-1 space-y-2.5">
                    {/* Top row: Platform title + Edit / Eye / Delete */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs font-semibold text-white/90">
                        {getPlatformLabel(link.platform)}
                      </p>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => (isEditing ? setEditingId(null) : startEditing(link))}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                            isEditing
                              ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                              : 'border-white/[0.06] bg-white/[0.03] text-white/55 hover:bg-white/[0.08] hover:text-white'
                          }`}
                          aria-label={`Edit ${getPlatformLabel(link.platform)}`}
                          title="Edit"
                        >
                          <Pencil size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleLink(link.id, link.is_active)}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                            link.is_active
                              ? 'border-white/[0.06] bg-white/[0.03] text-white/55 hover:bg-white/[0.08] hover:text-white'
                              : 'border-white/[0.08] bg-white/[0.06] text-white/35 hover:text-white'
                          }`}
                          aria-label={link.is_active ? 'Hide link' : 'Show link'}
                          title={link.is_active ? 'Visible on card' : 'Hidden from card'}
                        >
                          {link.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteLink(link.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer"
                          aria-label={`Delete ${getPlatformLabel(link.platform)}`}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom dark inset pill */}
                    {isEditing ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--color-accent)]/45 bg-[#08080a] px-2.5 py-1.5">
                          <PlatformIcon platform={link.platform} size={15} colored />
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => {
                              setEditValue(e.target.value)
                              if (editError) setEditError('')
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') startTransition(() => saveEdit(link))
                              if (e.key === 'Escape') setEditingId(null)
                            }}
                            autoFocus
                            className="min-w-0 flex-1 bg-transparent text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => startTransition(() => saveEdit(link))}
                            disabled={isPending}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent)] text-black cursor-pointer"
                            aria-label="Save"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                            aria-label="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        {editError && (
                          <p className="text-[11px] text-red-400" role="alert">
                            {editError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-2.5 rounded-xl border border-white/[0.04] bg-[#08080a] px-3 py-2.5"
                        title={link.url}
                      >
                        <PlatformIcon platform={link.platform} size={16} colored />
                        <span className="truncate text-xs font-medium text-white/85">
                          {displayHandle}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </BlurFade>
    </div>
  )
}
