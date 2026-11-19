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
          {/* Snapchat ghost icon (SVG inline, no external asset) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
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
