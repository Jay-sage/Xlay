'use client'

import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { USERNAME_ERROR_MESSAGES, validateUsername } from '@/lib/username'
import { ArrowRight, Check, Loader2, Mail, ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState, useTransition } from 'react'

function OnboardingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const initialClaim =
    searchParams.get('claim')?.trim().replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) ?? ''

  const [step, setStep] = useState<'username' | 'email'>('username')
  const [username, setUsername] = useState(initialClaim)
  const [usernameError, setUsernameError] = useState('')
  const [available, setAvailable] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isPending, startTransition] = useTransition()

  // Live debounced availability check as the user types
  useEffect(() => {
    const trimmed = username.trim()
    if (!trimmed) {
      setAvailable(null)
      setUsernameError('')
      setChecking(false)
      return
    }

    const err = validateUsername(trimmed)
    if (err) {
      setAvailable(null)
      setUsernameError(USERNAME_ERROR_MESSAGES[err])
      setChecking(false)
      return
    }

    setUsernameError('')
    setChecking(true)
    let cancelled = false

    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', trimmed.toLowerCase())
        .maybeSingle()

      if (cancelled) return
      setChecking(false)
      setAvailable(data === null)
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [username, supabase])

  function handleClaimUsername(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = username.trim()
    const err = validateUsername(trimmed)
    if (err) {
      setUsernameError(USERNAME_ERROR_MESSAGES[err])
      return
    }
    if (!available) {
      setUsernameError('That username is already taken.')
      return
    }

    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({ username: trimmed.toLowerCase() })
        .eq('id', user.id)

      if (error) {
        setUsernameError(
          error.message.includes('reserved')
            ? 'That username is reserved.'
            : 'Could not save username. Try another.'
        )
      } else {
        setStep('email')
      }
    })
  }

  function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault()
    setEmailError('')

    startTransition(async () => {
      if (email.trim()) {
        const { error } = await supabase.auth.updateUser({ email: email.trim() })
        if (error) {
          setEmailError('Enter a valid email address or skip for now.')
          return
        }
      }
      router.push('/dashboard')
    })
  }

  const displayHandle = username.trim().toLowerCase() || 'yourname'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top bar with step indicator */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-black tracking-tight text-primary"
          >
            Xlay
          </Link>

          {/* 2-step indicator */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <Badge
              variant={step === 'username' ? 'default' : 'secondary'}
              className={
                step === 'username'
                  ? 'rounded-full bg-primary/15 px-2.5 py-1 text-primary hover:bg-primary/15'
                  : 'rounded-full bg-transparent px-2.5 py-1 text-[var(--text-muted)]'
              }
            >
              01 Handle
            </Badge>
            <span className="h-px w-4 bg-white/15" aria-hidden="true" />
            <Badge
              variant={step === 'email' ? 'default' : 'secondary'}
              className={
                step === 'email'
                  ? 'rounded-full bg-primary/15 px-2.5 py-1 text-primary hover:bg-primary/15'
                  : 'rounded-full bg-transparent px-2.5 py-1 text-[var(--text-muted)]'
              }
            >
              02 Recovery
            </Badge>
          </div>
        </div>
      </header>

      {/* Main step card */}
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <BlurFade key={step} delay={0.04} className="w-full max-w-md">
          <Card className="relative overflow-hidden rounded-2xl border-border bg-card py-0 shadow-none">
            <CardContent className="p-6 sm:p-8">
              {step === 'username' ? (
                <form onSubmit={handleClaimUsername}>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Step 1 of 2
                    </p>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                      Claim your handle
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Pick the link you will drop in your Snap bio, TikTok, and WhatsApp.
                    </p>
                  </div>

                  {/* Live URL preview */}
                  <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                    <span className="truncate text-sm">
                      <span className="text-[var(--text-muted)]">xlay.me/</span>
                      <span className="font-semibold text-foreground">{displayHandle}</span>
                    </span>
                    <span className="ml-3 flex-shrink-0 text-xs font-medium">
                      {checking ? (
                        <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                          Checking
                        </span>
                      ) : available === true ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Check size={13} aria-hidden="true" />
                          Available
                        </span>
                      ) : available === false ? (
                        <span className="inline-flex items-center gap-1 text-red-400">
                          <X size={13} aria-hidden="true" />
                          Taken
                        </span>
                      ) : null}
                    </span>
                  </div>

                  {/* Input */}
                  <div className="mt-4 space-y-2">
                    <label
                      htmlFor="username-input"
                      className="block text-xs font-medium text-muted-foreground"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                        @
                      </span>
                      <Input
                        id="username-input"
                        type="text"
                        autoFocus
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="yourname"
                        maxLength={20}
                        className="min-h-[48px] rounded-xl border-input bg-white/[0.04] pl-9 pr-10 text-sm"
                      />
                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                        {checking ? (
                          <Loader2
                            size={16}
                            className="animate-spin text-[var(--text-muted)]"
                            aria-hidden="true"
                          />
                        ) : available === true ? (
                          <Check size={16} className="text-emerald-400" aria-hidden="true" />
                        ) : available === false || usernameError ? (
                          <X size={16} className="text-red-400" aria-hidden="true" />
                        ) : null}
                      </span>
                    </div>

                    {usernameError ? (
                      <p className="text-xs text-red-400">{usernameError}</p>
                    ) : available === false ? (
                      <p className="text-xs text-red-400">That username is taken. Try another.</p>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)]">
                        3–20 characters · letters, numbers, and underscores only.
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isPending || checking || !available}
                    className="mt-6 min-h-[52px] w-full rounded-xl text-sm font-semibold"
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Claiming…
                      </>
                    ) : (
                      <>
                        Claim xlay.me/{displayHandle}
                        <ArrowRight size={16} aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSaveEmail}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-primary">
                    <Mail size={20} aria-hidden="true" />
                  </div>

                  <div className="mt-5 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Step 2 of 2 · Optional
                    </p>
                    <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                      Add a recovery email
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Only used if you ever need help recovering{' '}
                      <span className="font-medium text-foreground">xlay.me/{displayHandle}</span>.
                      Never sold, no newsletters.
                    </p>
                  </div>

                  <div className="mt-6 space-y-2">
                    <label
                      htmlFor="email-input"
                      className="block text-xs font-medium text-muted-foreground"
                    >
                      Email address
                    </label>
                    <Input
                      id="email-input"
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError('')
                      }}
                      placeholder="you@example.com"
                      className="min-h-[48px] rounded-xl border-input bg-white/[0.04] text-sm"
                    />
                    {emailError && <p className="text-xs text-red-400">{emailError}</p>}
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isPending}
                      className="min-h-[52px] w-full rounded-xl text-sm font-semibold"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          Saving…
                        </>
                      ) : (
                        <>
                          Finish setup
                          <ArrowRight size={16} aria-hidden="true" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={() => router.push('/dashboard')}
                      className="min-h-[48px] w-full rounded-xl text-muted-foreground"
                    >
                      Skip for now
                    </Button>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <ShieldCheck size={14} aria-hidden="true" />
                    <span>You can add or remove your email anytime in Settings.</span>
                  </div>
                </form>
              )}
            </CardContent>
            <BorderBeam
              size={140}
              duration={10}
              colorFrom="#e8ff47"
              colorTo="rgba(255,255,255,0.25)"
              borderWidth={1}
            />
          </Card>
        </BlurFade>
      </main>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 size={20} className="animate-spin text-primary" />
        </main>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
