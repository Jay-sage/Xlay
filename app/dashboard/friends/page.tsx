'use client'
// app/dashboard/friends/page.tsx - Best Friends management
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useTransition } from 'react'

type Invite = {
  id: string
  token: string
  status: string
  created_at: string
  friend_profile: { display_name: string; avatar_url: string | null; username: string | null } | null
}

export default function FriendsPage() {
  const supabase = createClient()
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  async function fetchInvites() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('best_friend_invites')
      .select(`id, token, status, created_at, friend_profile_id,
        friend_profile:profiles!friend_profile_id(display_name, avatar_url, username)`)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    setInvites((data ?? []) as unknown as Invite[])
    setLoading(false)
  }

  useEffect(() => { fetchInvites() }, [])

  const accepted = invites.filter(i => i.status === 'accepted')

  async function createInvite() {
    setError('')
    if (accepted.length >= 3) { setError('You already have 3 best friends.'); return }
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setCreating(false); return }
    const { error } = await supabase.from('best_friend_invites').insert({ owner_id: user.id })
    if (error) { setError(error.message.includes('max_friends') ? 'Max 3 best friends allowed.' : 'Could not create invite.') }
    setCreating(false)
    fetchInvites()
  }

  async function revokeInvite(id: string) {
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

  if (loading) return <div className="p-10 text-[var(--color-text-secondary)]">Loading…</div>

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Best Friends</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Add up to 3 friends whose Bitmojis appear on your card.
        </p>
      </div>

      {/* Accepted friends */}
      {accepted.length > 0 && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">On your card</h2>
          {accepted.map(inv => (
            <div key={inv.id} className="flex items-center gap-3">
              {inv.friend_profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={inv.friend_profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover bg-white/5" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-sm">
                  {inv.friend_profile?.display_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{inv.friend_profile?.display_name ?? 'Unknown'}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">@{inv.friend_profile?.username ?? '—'}</p>
              </div>
              <button onClick={() => revokeInvite(inv.id)} className="text-xs text-red-400 underline">Remove</button>
            </div>
          ))}
        </div>
      )}

      {/* Pending invites */}
      {invites.filter(i => i.status === 'pending').length > 0 && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Pending invites</h2>
          {invites.filter(i => i.status === 'pending').map(inv => (
            <div key={inv.id} className="flex items-center gap-3">
              <span className="text-lg">⏳</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  xlay.me/invite/{inv.token.slice(0, 8)}…
                </p>
              </div>
              <button onClick={() => copyLink(inv.token)}
                className="text-xs font-medium text-[var(--color-accent)] px-2 py-1 rounded-lg bg-[var(--color-accent)]/10">
                {copied === inv.token ? '✓ Copied' : 'Copy link'}
              </button>
              <button onClick={() => revokeInvite(inv.id)} className="text-xs text-red-400 underline">Revoke</button>
            </div>
          ))}
        </div>
      )}

      {/* Create invite */}
      {accepted.length < 3 && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {accepted.length === 0
              ? 'Create an invite link and send it to your friend.'
              : `You can add ${3 - accepted.length} more friend${3 - accepted.length > 1 ? 's' : ''}.`}
          </p>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            onClick={() => startTransition(createInvite)}
            disabled={creating || isPending}
            className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {creating ? 'Creating…' : '+ Create invite link'}
          </button>
        </div>
      )}
    </div>
  )
}
