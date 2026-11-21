'use client'
// components/themes/CommunityTemplates.tsx
// v2 BLUEPRINT (UNMOUNTED): Community Template Library + "Publish Your Theme" drawer.
// Designed to plug into /dashboard/themes as a tab once the community_templates
// Supabase table and moderation/reporting flow are enabled in v2.
// Note: Template previews intentionally use StandInAvatar (never real Bitmoji art).

import StandInAvatar from '@/components/illustrations/StandInAvatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getThemePreset,
  type CommunityTemplate,
  type PublishTemplateDraft,
  type TemplateStyleConfig,
} from '@/lib/themes'
import {
  ArrowUpRight,
  Check,
  Clock,
  Copy,
  Flame,
  LayoutTemplate,
  Plus,
  Search,
  Sparkles,
  Star,
  Upload,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

type TemplateTab = 'library' | 'favorites' | 'recent' | 'mine'
type SortOption = 'trending' | 'newest' | 'most_used'

interface CommunityTemplatesProps {
  templates: CommunityTemplate[]
  currentStyle: TemplateStyleConfig
  currentUsername: string
  onApplyTemplate: (template: CommunityTemplate) => Promise<void> | void
  onToggleStar?: (templateId: string) => Promise<void> | void
  onPublishTemplate?: (draft: PublishTemplateDraft) => Promise<void> | void
}

const TABS: Array<{ id: TemplateTab; label: string }> = [
  { id: 'library', label: 'Community Library' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'recent', label: 'Last Used' },
  { id: 'mine', label: 'My Published' },
]

export function CommunityTemplates({
  templates,
  currentStyle,
  currentUsername,
  onApplyTemplate,
  onToggleStar,
  onPublishTemplate,
}: CommunityTemplatesProps) {
  const [tab, setTab] = useState<TemplateTab>('library')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('trending')
  const [appliedId, setAppliedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Publish modal state
  const [publishOpen, setPublishOpen] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftDesc, setDraftDesc] = useState('')
  const [draftTags, setDraftTags] = useState('')
  const [publishing, setPublishing] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const base = templates.filter((t) => {
      if (tab === 'favorites' && !t.is_starred) return false
      if (tab === 'mine' && t.author_username.toLowerCase() !== currentUsername.toLowerCase()) {
        return false
      }
      if (!q) return true
      return (
        t.name.toLowerCase().includes(q) ||
        t.author_username.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    })

    return [...base].sort((a, b) => {
      if (sort === 'most_used') return b.uses_count - a.uses_count
      if (sort === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return b.stars_count + b.uses_count * 0.25 - (a.stars_count + a.uses_count * 0.25)
    })
  }, [templates, tab, query, sort, currentUsername])

  async function handleApply(template: CommunityTemplate) {
    await onApplyTemplate(template)
    setAppliedId(template.id)
    setTimeout(() => setAppliedId(null), 1800)
  }

  function handleCopyShareLink(template: CommunityTemplate) {
    const url = `${window.location.origin}/dashboard/themes?template=${encodeURIComponent(template.slug)}`
    navigator.clipboard.writeText(url)
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  async function handlePublishSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!onPublishTemplate || !draftName.trim()) return
    setPublishing(true)
    try {
      const tags = draftTags
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean)
        .slice(0, 4)

      await onPublishTemplate({
        name: draftName.trim(),
        description: draftDesc.trim(),
        tags,
        style: currentStyle,
      })
      setDraftName('')
      setDraftDesc('')
      setDraftTags('')
      setPublishOpen(false)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-[#0e0e11] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-white">
            <LayoutTemplate size={18} className="text-[var(--color-accent)]" aria-hidden="true" />
            Community Templates
          </h2>
          <p className="mt-1 text-xs text-white/50">
            Apply a creator-built Xlay theme in one tap, or publish your own style for others to
            remix.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setPublishOpen(true)}
          className="rounded-xl font-semibold"
        >
          <Upload size={15} />
          Publish My Theme
        </Button>
      </div>

      {/* Tabs + Search + Sort */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.06] bg-[#0e0e11] p-1">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-1 gap-2 lg:max-w-md">
          <div className="relative flex-1">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              aria-hidden="true"
            />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates or tags…"
              className="h-9 rounded-xl border-white/[0.08] bg-[#0e0e11] pl-8 text-xs"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            aria-label="Sort templates"
            className="h-9 rounded-xl border border-white/[0.08] bg-[#0e0e11] px-3 text-xs text-white/80 focus:outline-none"
          >
            <option value="trending">Trending</option>
            <option value="most_used">Most Used</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Template Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.08] bg-[#0e0e11]/60 p-10 text-center">
          <Sparkles size={20} className="mx-auto text-white/30" />
          <p className="mt-2 text-sm text-white/60">No templates match this view yet.</p>
          <p className="mt-1 text-xs text-white/35">
            Be the first to publish your current Theme Editor setup.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tpl) => {
            const preset = getThemePreset(tpl.style.theme_id)
            const accent = tpl.style.accent_color || preset.accent
            const isApplied = appliedId === tpl.id

            return (
              <div
                key={tpl.id}
                className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0e0e11] transition-colors hover:border-white/[0.14]"
              >
                {/* Live style preview stage (StandInAvatar — never Bitmoji) */}
                <div
                  className="relative flex h-40 items-center justify-center overflow-hidden p-4"
                  style={{ background: preset.bg }}
                >
                  {tpl.style.bg_glow && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute h-28 w-28 rounded-full opacity-25 blur-2xl"
                      style={{ background: accent }}
                    />
                  )}

                  {onToggleStar && (
                    <button
                      type="button"
                      onClick={() => onToggleStar(tpl.id)}
                      aria-label={tpl.is_starred ? 'Unstar template' : 'Star template'}
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                        tpl.is_starred
                          ? 'border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                          : 'border-white/10 bg-black/40 text-white/50 hover:text-white'
                      }`}
                    >
                      <Star size={14} fill={tpl.is_starred ? 'currentColor' : 'none'} />
                    </button>
                  )}

                  {/* Mini card preview */}
                  <div
                    className="relative z-10 flex flex-col items-center rounded-2xl border px-5 py-3 text-center"
                    style={{
                      background: preset.surface,
                      borderColor: `${accent}33`,
                    }}
                  >
                    <StandInAvatar size={40} />
                    <p className="mt-1.5 font-display text-xs font-bold text-white">{tpl.name}</p>
                    <span
                      className="mt-1 inline-block h-1.5 w-10 rounded-full"
                      style={{ background: accent }}
                    />
                  </div>
                </div>

                {/* Metadata + actions */}
                <div className="space-y-3 p-4">
                  <div>
                    <p className="truncate font-display text-sm font-bold text-white">{tpl.name}</p>
                    <p className="text-[11px] text-white/45">by @{tpl.author_username}</p>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-white/45">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} />
                      {tpl.uses_count.toLocaleString()} uses
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Flame size={11} className="text-[var(--color-accent)]" />
                      {tpl.stars_count.toLocaleString()} stars
                    </span>
                  </div>

                  {tpl.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleApply(tpl)}
                      className="flex-1 rounded-xl font-semibold"
                    >
                      {isApplied ? (
                        <>
                          <Check size={13} />
                          Applied
                        </>
                      ) : (
                        <>
                          Use Template
                          <ArrowUpRight size={13} />
                        </>
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleCopyShareLink(tpl)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                      aria-label="Copy template link"
                      title="Copy template link"
                    >
                      {copiedId === tpl.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Publish My Theme Modal */}
      {publishOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e11] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-base font-bold text-white">
                  Publish to Community Templates
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Shares only your colors, glow, and layout — never your personal links, bio, or
                  Bitmoji.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublishOpen(false)}
                className="rounded-lg p-1.5 text-white/45 hover:bg-white/10 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/75">Template Name</label>
                <Input
                  type="text"
                  required
                  maxLength={40}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Lagos Midnight"
                  className="rounded-xl border-white/10 bg-[#08080a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/75">Short Description</label>
                <Input
                  type="text"
                  maxLength={90}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  placeholder="Clean dark card with neon lime aura"
                  className="rounded-xl border-white/10 bg-[#08080a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/75">
                  Tags (comma separated, max 4)
                </label>
                <Input
                  type="text"
                  value={draftTags}
                  onChange={(e) => setDraftTags(e.target.value)}
                  placeholder="dark, minimal, neon, lagos"
                  className="rounded-xl border-white/10 bg-[#08080a]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPublishOpen(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={publishing || !draftName.trim()}
                  className="rounded-xl font-semibold"
                >
                  <Plus size={14} />
                  {publishing ? 'Publishing…' : 'Publish Template'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
