'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const MESSAGES: Record<string, string> = {
  snap_error: 'Snapchat returned an error. Please try again.',
  missing_params: 'The sign-in link was incomplete. Please try again.',
  state_mismatch: 'The sign-in session expired. Please try again.',
  missing_verifier: 'The sign-in session expired. Please try again.',
  create_user_failed: 'We could not create your account. Please try again.',
  profile_create_failed: 'We could not set up your profile. Please contact support.',
  session_failed: 'We could not start your session. Please try again.',
  unexpected: 'Something went wrong. Please try again or contact support.',
}

function ErrorContent() {
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'unexpected'
  const message = MESSAGES[reason] ?? MESSAGES.unexpected

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-5">
        <div className="text-4xl">⚠️</div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
          Sign-in error
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{message}</p>
        <Link
          href="/auth/snap"
          className="btn-primary block w-full py-3 rounded-xl text-sm font-semibold"
        >
          Try again
        </Link>
        <Link href="/" className="block text-xs text-[var(--color-text-secondary)] underline">
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
