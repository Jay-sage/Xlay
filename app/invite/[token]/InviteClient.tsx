'use client'
// app/invite/[token]/InviteClient.tsx
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useState, useTransition } from 'react'

interface Props {
  invite: {
    id: string
    status: string
    owner_id: string
    owner: { display_name: string; avatar_url: string | null; username: string | null } | null
  }
  token: string
  currentProfile: { id: string; username: string | null; display_name: string; avatar_url: string | null } | null
}

export default function InviteClient({ invite, token, currentProfile }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState<'accepted' | 'declined' | null>(null)
  const [error, setError] = useState('')

  if (invite.status !== 'pending') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-4">
          <div className="text-4xl">🔗</div>
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            This invite is {invite.status}.
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ask {invite.owner?.display_name} to send a new one.
          </p>
        </div>
      </main>
    )
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-4">
          <div className="text-4xl">{done === 'accepted' ? '🎉' : '👋'}</div>
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            {done === 'accepted' ? "You're on the card!" : 'Invite declined.'}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {done === 'accepted'
              ? `Your Bitmoji will appear on ${invite.owner?.display_name}'s Xlay card.`
              : 'No worries. You can always change your mind later.'}
          </p>
          <Link href="/dashboard" className="btn-primary block py-3 rounded-xl text-sm font-semibold">
            Go to your dashboard
          </Link>
        </div>
      </main>
    )
  }

  if (!currentProfile) {
    // Not logged in — prompt Snap login, then return here
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-5">
          <div className="text-4xl">👻</div>
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            {invite.owner?.display_name} wants you on their Xlay card
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Sign in with Snapchat to accept — your Bitmoji will appear on their card.
          </p>
          <a
            href={`/auth/snap?next=/invite/${token}`}
            className="btn-primary block py-3 rounded-xl text-sm font-semibold"
          >
            Sign in with Snapchat
          </a>
        </div>
      </main>
    )
  }

  // Can't accept your own invite
  if (currentProfile.id === invite.owner_id) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-4">
          <div className="text-4xl">🤔</div>
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            That&apos;s your own invite!
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Share this link with a friend — you can&apos;t add yourself.
          </p>
        </div>
      </main>
    )
  }

  async function respond(action: 'accepted' | 'declined') {
    startTransition(async () => {
      setError('')
      const { error } = await supabase
        .from('best_friend_invites')
        .update({
          status: action,
          friend_profile_id: action === 'accepted' ? currentProfile!.id : null,
          accepted_at: action === 'accepted' ? new Date().toISOString() : null,
        })
        .eq('id', invite.id)
        .eq('status', 'pending')

      if (error) {
        setError(error.message.includes('max_friends') ? 'This card already has 3 best friends.' : 'Something went wrong. Try again.')
      } else {
        setDone(action)
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-6">
        <div className="space-y-3">
          {invite.owner?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={invite.owner.avatar_url} alt="" className="h-16 w-16 rounded-full mx-auto object-cover ring-2 ring-[var(--color-accent)]/30" />
          )}
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            {invite.owner?.display_name} wants you as a Best Friend
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Your Bitmoji and name will appear on their Xlay card at{' '}
            <strong>xlay.me/{invite.owner?.username}</strong>.
          </p>
        </div>

        {/* Preview of what will show */}
        <div className="glass rounded-xl p-4 flex items-center gap-3">
          {currentProfile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentProfile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-sm">
              {currentProfile.display_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">{currentProfile.display_name}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">@{currentProfile.username}</p>
          </div>
          <span className="ml-auto text-green-400 text-xs font-semibold">Will appear ✓</span>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => respond('declined')}
            disabled={isPending}
            className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Decline
          </button>
          <button
            onClick={() => respond('accepted')}
            disabled={isPending}
            className="flex-1 btn-primary py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Accept'}
          </button>
        </div>

        <p className="text-xs text-[var(--color-text-secondary)]">
          You can remove yourself from their card at any time in your Settings.
        </p>
      </div>
    </main>
  )
}
