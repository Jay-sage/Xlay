'use client'
// app/dashboard/share/page.tsx
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { createClient } from '@/lib/supabase/client'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const SHARE_PLATFORMS = [
  { id: 'snapchat', label: 'Snapchat', ref: 'snapchat', copyOnly: true },
  { id: 'whatsapp', label: 'WhatsApp', ref: 'whatsapp', copyOnly: false },
  { id: 'tiktok', label: 'TikTok', ref: 'tiktok', copyOnly: true },
  { id: 'instagram', label: 'Instagram', ref: 'instagram', copyOnly: true },
]

export default function SharePage() {
  const supabase = useMemo(() => createClient(), [])
  const [username, setUsername] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setUsername(data?.username ?? ''))
    })
  }, [supabase])

  const baseUrl = `https://xlay.me/${username}`

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  function shareUrl(ref: string) {
    return `${baseUrl}?ref=${ref}`
  }

  function whatsappHref(ref: string) {
    const url = encodeURIComponent(shareUrl(ref))
    const text = encodeURIComponent('Check out my Xlay card')
    return `https://wa.me/?text=${text}%20${url}`
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 md:p-10">
      <BlurFade delay={0.03}>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Share
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop your tagged links in your bios so Xlay can track where visitors come from.
        </p>
      </BlurFade>

      <BlurFade delay={0.07}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-3 p-6">
            <h2 className="font-display text-sm font-bold text-foreground">Direct link</h2>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3">
              <span className="flex-1 truncate text-sm font-medium text-foreground">{baseUrl}</span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => copy(baseUrl, 'base')}
                className="rounded-lg"
              >
                {copiedId === 'base' ? (
                  <>
                    <Check size={14} className="text-emerald-400" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} aria-hidden="true" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.11}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="font-display text-sm font-bold text-foreground">
                Tagged platform links
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Includes <code className="text-primary">?ref=platform</code> for source attribution.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SHARE_PLATFORMS.map((p) =>
                p.copyOnly ? (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => copy(shareUrl(p.ref), p.id)}
                    className="flex min-h-[64px] items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:border-primary/40 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white/[0.04] text-foreground">
                        <PlatformIcon platform={p.id} size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {copiedId === p.id ? 'Copied tagged link' : 'Copy tagged link'}
                        </p>
                      </div>
                    </div>
                    {copiedId === p.id ? (
                      <Check size={15} className="text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy size={15} className="text-muted-foreground" aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  <a
                    key={p.id}
                    href={whatsappHref(p.ref)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[64px] items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white/[0.04] text-foreground">
                        <PlatformIcon platform={p.id} size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.label}</p>
                        <p className="text-xs text-muted-foreground">Share in app</p>
                      </div>
                    </div>
                    <ExternalLink size={15} className="text-muted-foreground" aria-hidden="true" />
                  </a>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
