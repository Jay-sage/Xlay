'use client'
// app/dashboard/friends/page.tsx - Best Friends management
import Avatar from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { Check, Clock, Copy, Loader2, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'

type Invite = {
  id: string
  token: string
  status: string
  created_at: string
  friend_profile: { display_name: string; avatar_url: string | null; username: string | null } | null
}

export default function FriendsPage() {
  const supabase = useMemo(() => createClient(), [])
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const fetchInvites = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('best_friend_invites')
      .select(
        `id, token, status, created_at, friend_profile_id,
        friend_profile:profiles!friend_profile_id(display_name, avatar_url, username)`
      )
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    setInvites((data ?? []) as unknown as Invite[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchInvites()
  }, [fetchInvites])

  const accepted = invites.filter((i) => i.status === 'accepted')
  const pending = invites.filter((i) => i.status === 'pending')

  async function createInvite() {
    setError('')
    if (accepted.length >= 3) {
      setError('You already have 3 best friends.')
      return
    }
    setCreating(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setCreating(false)
      return
    }
    const { error: insertErr } = await supabase
      .from('best_friend_invites')
      .insert({ owner_id: user.id })
    if (insertErr) {
      setError(
        insertErr.message.includes('max_friends')
          ? 'Max 3 best friends allowed.'
          : 'Could not create invite.'
      )
    }
    setCreating(false)
    fetchInvites()
  }

  function revokeInvite(id: string) {
    startTransition(async () => {
      await supabase.from('best_friend_invites').update({ status: 'revoked' }).eq('id', id)
      fetchInvites()
    })
  }

  function copyLink(token: string) {
    const url = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Best Friends
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add up to 3 friends whose Bitmojis appear on your card after they accept.
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
            {accepted.length} / 3
          </Badge>
        </div>
      </BlurFade>

      {accepted.length > 0 && (
        <BlurFade delay={0.07}>
          <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-display text-sm font-bold text-foreground">On your card</h2>
              {accepted.map((inv) => (
                <div key={inv.id} className="flex items-center gap-3">
                  <Avatar
                    avatarUrl={inv.friend_profile?.avatar_url}
                    displayName={inv.friend_profile?.display_name}
                    size="sm"
                    forceCircle
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {inv.friend_profile?.display_name ?? 'Unknown'}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      @{inv.friend_profile?.username ?? '—'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => revokeInvite(inv.id)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </BlurFade>
      )}

      {pending.length > 0 && (
        <BlurFade delay={0.1}>
          <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
            <CardContent className="space-y-3 p-6">
              <h2 className="font-display text-sm font-bold text-foreground">Pending invites</h2>
              {pending.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/60 px-3.5 py-2.5"
                >
                  <Clock size={15} className="flex-shrink-0 text-muted-foreground" aria-hidden="true" />
                  <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                    xlay.me/invite/{inv.token.slice(0, 10)}…
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="xs"
                    onClick={() => copyLink(inv.token)}
                    className="rounded-lg"
                  >
                    {copied === inv.token ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => revokeInvite(inv.id)}
                    className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </BlurFade>
      )}

      {accepted.length < 3 && (
        <BlurFade delay={0.13}>
          <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">
                {accepted.length === 0
                  ? 'Generate a private invite link and send it to your friend on Snapchat or WhatsApp.'
                  : `You can add ${3 - accepted.length} more friend${3 - accepted.length > 1 ? 's' : ''}.`}
              </p>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <Button
                type="button"
                size="lg"
                onClick={() => startTransition(createInvite)}
                disabled={creating || isPending}
                className="min-h-[48px] w-full rounded-xl font-semibold"
              >
                {creating ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Plus size={16} aria-hidden="true" />
                    Create invite link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </BlurFade>
      )}
    </div>
  )
}
