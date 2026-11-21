'use client'
// app/dashboard/links/page.tsx - Manage links
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { normalizeUrl } from '@/lib/url'
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'

type LinkRow = {
  id: string
  platform: string
  url: string
  sort_order: number
  is_active: boolean
}

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
  const supabase = useMemo(() => createClient(), [])
  const [links, setLinks] = useState<LinkRow[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
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

  async function addLink() {
    setError('')

    const normalised = normalizeUrl(newUrl)
    if (!normalised.ok) {
      setError(normalised.message)
      return
    }

    const platform = detectPlatform(normalised.url)

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
    <div className="mx-auto max-w-2xl space-y-6 p-6 md:p-10">
      <BlurFade delay={0.03}>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Links
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your socials or websites. Platform icons are detected automatically.
        </p>
      </BlurFade>

      <BlurFade delay={0.07}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-sm font-bold text-foreground">Add a link</h2>
            <div className="flex gap-2">
              <Input
                type="url"
                value={newUrl}
                onChange={(e) => {
                  setNewUrl(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && startTransition(addLink)}
                placeholder="instagram.com/yourname or yoursite.com"
                className="min-h-[46px] flex-1 rounded-xl"
              />
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
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.11} className="space-y-2.5">
        {links.length === 0 && (
          <Card className="rounded-2xl border-dashed border-border bg-card/50 py-0 shadow-none">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No links yet. Paste your first link above.
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
                <p className="text-sm font-semibold capitalize text-foreground">{link.platform}</p>
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
