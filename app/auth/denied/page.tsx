'use client'
import Link from 'next/link'

export default function AuthDeniedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="glass max-w-sm w-full text-center p-8 rounded-2xl space-y-5">
        <div className="text-4xl">🤔</div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
          Access denied
        </h1>
        <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
          You need to allow Xlay to access your Snapchat account to sign in. We only use your
          display name, Bitmoji, and a unique ID — nothing else.
        </p>
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
