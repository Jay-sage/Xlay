import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign in — Xlay',
  description: 'Sign in with your Snapchat account to create your Xlay card.',
  robots: { index: false },
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 gap-8">
      {/* Logo */}
      <div className="text-center">
        <span className="font-display text-3xl font-black tracking-tight text-[var(--color-accent)]">
          Xlay
        </span>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">Show Up.</p>
      </div>

      {/* Card */}
      <div className="glass max-w-sm w-full p-8 rounded-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
            Your Snap, your card.
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
            Sign in with Snapchat to create your free Xlay link-in-bio page. We use your display
            name and Bitmoji — nothing else.
          </p>
        </div>

        {/* Snap OAuth link */}
        <Link
          href="/auth/snap"
          className="btn-primary flex items-center justify-center gap-3 w-full py-4 rounded-xl font-semibold text-sm"
        >
          {/* Authentic Snapchat Ghost Icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.21 2C8.16 2 5.6 4.9 5.6 8.35c0 1.25.32 2.38.83 3.32.2.37.15.65-.12.87-.52.42-1.37.75-2.06 1.05-.33.15-.49.37-.47.69.04.48.51.78 1.05.78.36 0 .72-.07 1.05-.18.24-.08.45.02.57.24.32.58.74 1.15 1.29 1.63.15.13.2.29.17.48-.12.85-.75 1.48-1.55 1.7-.35.1-.47.34-.4.66.08.38.45.62.91.57.85-.09 1.69-.37 2.45-.84.22-.14.43-.09.61.08.79.76 1.76 1.28 2.87 1.51.35.07.69.1 1.04.1.35 0 .69-.03 1.04-.1 1.11-.23 2.08-.75 2.87-1.51.18-.17.39-.22.61-.08.76.47 1.6.75 2.45.84.46.05.83-.19.91-.57.07-.32-.05-.56-.4-.66-.8-.22-1.43-.85-1.55-1.7-.03-.19.02-.35.17-.48.55-.48.97-1.05 1.29-1.63.12-.22.33-.32.57-.24.33.11.69.18 1.05.18.54 0 1.01-.3 1.05-.78.02-.32-.14-.54-.47-.69-.69-.3-1.54-.63-2.06-1.05-.27-.22-.32-.5-.12-.87.51-.94.83-2.07.83-3.32C18.82 4.9 16.26 2 12.21 2z" />
          </svg>
          Continue with Snapchat
        </Link>

        <p className="text-center text-xs text-[var(--color-text-secondary)] leading-relaxed">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  )
}
