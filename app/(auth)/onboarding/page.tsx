'use client'
import { validateUsername, USERNAME_ERROR_MESSAGES } from '@/lib/username'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<'username' | 'email'>('username')
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [available, setAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()

  async function checkAvailability(value: string) {
    setAvailable(null)
    const err = validateUsername(value)
    if (err) {
      setUsernameError(USERNAME_ERROR_MESSAGES[err])
      return
    }
    setUsernameError('')
    setChecking(true)
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', value.toLowerCase())
      .maybeSingle()
    setChecking(false)
    setAvailable(data === null)
  }

  function handleUsernameChange(v: string) {
    setUsername(v)
    setAvailable(null)
    setUsernameError('')
  }

  async function handleClaimUsername() {
    const err = validateUsername(username)
    if (err) { setUsernameError(USERNAME_ERROR_MESSAGES[err]); return }
    if (!available) { setUsernameError('That username is taken.'); return }

    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { error } = await supabase
        .from('profiles')
        .update({ username: username.toLowerCase() })
        .eq('id', user.id)

      if (error) {
        setUsernameError(error.message.includes('reserved') ? 'That username is reserved.' : 'Could not save username. Try another.')
      } else {
        setStep('email')
      }
    })
  }

  async function handleSaveEmail() {
    startTransition(async () => {
      if (email.trim()) {
        await supabase.auth.updateUser({ email })
      }
      router.push('/dashboard')
    })
  }

  if (step === 'email') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="glass max-w-sm w-full p-8 rounded-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="text-3xl">📬</div>
            <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
              Add your email?
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm">
              Optional. For account recovery only — no spam.
            </p>
          </div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50"
          />
          <button
            onClick={handleSaveEmail}
            disabled={isPending}
            className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Continue'}
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="block w-full text-center text-xs text-[var(--color-text-secondary)] underline"
          >
            Skip for now
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass max-w-sm w-full p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-1">
          <span className="font-display text-2xl font-black text-[var(--color-accent)]">Xlay</span>
          <h1 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Claim your username
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Your card will live at <strong>xlay.me/username</strong>
          </p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] text-sm">
              xlay.me/
            </span>
            <input
              type="text"
              value={username}
              onChange={e => handleUsernameChange(e.target.value)}
              onBlur={() => username && checkAvailability(username)}
              placeholder="yourname"
              maxLength={20}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-[72px] pr-10 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50"
            />
            {/* Availability indicator */}
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
              {checking ? '…' : available === true ? '✓' : available === false ? '✗' : ''}
            </span>
          </div>

          {usernameError && (
            <p className="text-red-400 text-xs">{usernameError}</p>
          )}
          {available === false && !usernameError && (
            <p className="text-red-400 text-xs">That username is taken.</p>
          )}
          {available === true && (
            <p className="text-green-400 text-xs">Available!</p>
          )}
        </div>

        <button
          onClick={handleClaimUsername}
          disabled={isPending || !available}
          className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          {isPending ? 'Claiming…' : 'Claim username'}
        </button>
      </div>
    </main>
  )
}
