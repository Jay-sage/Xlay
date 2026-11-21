'use client'

import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const MESSAGES: Record<string, string> = {
  snap_error: 'Snapchat returned an error while signing you in. Please try again.',
  missing_params: 'The sign-in callback was incomplete. Please start again.',
  state_mismatch: 'Your sign-in session expired. Please try again.',
  missing_verifier: 'Your sign-in session expired. Please try again.',
  create_user_failed: 'We could not create your account right now. Please try again.',
  profile_create_failed: 'We could not set up your profile. Contact support@xlay.me if this persists.',
  session_failed: 'We could not start your session. Please try again.',
  unexpected: 'Something went wrong during sign-in. Please try again.',
}

function ErrorContent() {
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'unexpected'
  const message = MESSAGES[reason] ?? MESSAGES.unexpected

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-black tracking-tight text-[var(--color-accent)]"
          >
            Xlay
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-white/[0.05] hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[var(--bg-surface-1)] p-7 space-y-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
            <AlertCircle size={20} aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Sign-in error
            </h1>
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{message}</p>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            <Link
              href="/auth/snap"
              className="btn-primary flex min-h-[48px] w-full items-center justify-center rounded-xl text-sm font-semibold"
            >
              Try again
            </Link>
            <Link
              href="/"
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl text-xs font-medium text-[var(--color-text-secondary)] hover:bg-white/[0.05] hover:text-[var(--color-text-primary)]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
