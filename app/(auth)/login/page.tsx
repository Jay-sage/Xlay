import HeroCardPreview from '@/components/marketing/HeroCardPreview'
import { ArrowLeft, Fingerprint, Ghost, ShieldCheck, User } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign in — Xlay',
  description: 'Sign in with your Snapchat account to create your Xlay card.',
  robots: { index: false },
}

interface Props {
  searchParams: Promise<{ claim?: string }>
}

const SNAP_SCOPES_SUMMARY = [
  { Icon: User, label: 'Display name', desc: 'Shown at the top of your card' },
  { Icon: Ghost, label: 'Bitmoji avatar', desc: 'Rendered unmodified on your card' },
  { Icon: Fingerprint, label: 'Unique Snap ID', desc: 'Keeps your account linked to you' },
]

export default async function LoginPage({ searchParams }: Props) {
  const { claim } = await searchParams
  const cleanClaim = claim?.trim().replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || ''
  const authHref = cleanClaim
    ? `/auth/snap?claim=${encodeURIComponent(cleanClaim)}`
    : '/auth/snap'

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      {/* Top bar */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
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
            Back
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative flex flex-1 items-center overflow-hidden">
        {/* Subtle ambient accent wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-8%] top-[-10%] h-[380px] w-[380px] rounded-full opacity-[0.06] blur-[110px]"
          style={{ background: 'var(--color-accent)' }}
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          {/* Left: Auth panel */}
          <div className="mx-auto w-full max-w-md lg:mx-0">
            {cleanClaim && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.08] px-3.5 py-1.5 text-xs font-medium text-[var(--color-accent)]">
                <span>Claiming</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  xlay.me/{cleanClaim.toLowerCase()}
                </span>
              </div>
            )}

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-[42px] sm:leading-[1.08]">
              Your Snap, your card.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
              Sign in with Snapchat to create or open your Xlay page. Free for everyone, no
              passwords to remember.
            </p>

            {/* Primary Snap CTA */}
            <div className="mt-8">
              <Link
                href={authHref}
                className="btn-primary flex min-h-[54px] w-full items-center justify-center gap-3 rounded-xl px-6 text-sm font-semibold shadow-lg shadow-[var(--color-accent)]/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.21 2C8.16 2 5.6 4.9 5.6 8.35c0 1.25.32 2.38.83 3.32.2.37.15.65-.12.87-.52.42-1.37.75-2.06 1.05-.33.15-.49.37-.47.69.04.48.51.78 1.05.78.36 0 .72-.07 1.05-.18.24-.08.45.02.57.24.32.58.74 1.15 1.29 1.63.15.13.2.29.17.48-.12.85-.75 1.48-1.55 1.7-.35.1-.47.34-.4.66.08.38.45.62.91.57.85-.09 1.69-.37 2.45-.84.22-.14.43-.09.61.08.79.76 1.76 1.28 2.87 1.51.35.07.69.1 1.04.1.35 0 .69-.03 1.04-.1 1.11-.23 2.08-.75 2.87-1.51.18-.17.39-.22.61-.08.76.47 1.6.75 2.45.84.46.05.83-.19.91-.57.07-.32-.05-.56-.4-.66-.8-.22-1.43-.85-1.55-1.7-.03-.19.02-.35.17-.48.55-.48.97-1.05 1.29-1.63.12-.22.33-.32.57-.24.33.11.69.18 1.05.18.54 0 1.01-.3 1.05-.78.02-.32-.14-.54-.47-.69-.69-.3-1.54-.63-2.06-1.05-.27-.22-.32-.5-.12-.87.51-.94.83-2.07.83-3.32C18.82 4.9 16.26 2 12.21 2z" />
                </svg>
                Continue with Snapchat
              </Link>
            </div>

            {/* Transparent scope breakdown */}
            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[var(--bg-surface-1)] p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-text-secondary)]">
                <ShieldCheck size={14} className="text-[var(--color-accent)]" aria-hidden="true" />
                <span>What Xlay reads from Snapchat</span>
              </div>
              <ul className="mt-4 space-y-3">
                {SNAP_SCOPES_SUMMARY.map(({ Icon, label, desc }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[var(--color-text-secondary)]">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--color-text-primary)]">{label}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <p className="mt-6 text-xs leading-relaxed text-[var(--color-text-muted)]">
              By continuing, you agree to our{' '}
              <Link
                href="/terms"
                className="text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)]"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-text-primary)]"
              >
                Privacy Policy
              </Link>
              . Session cookie only — no ad trackers.
            </p>
          </div>

          {/* Right: Card preview (desktop only so mobile stays crisp & fast) */}
          <div className="hidden lg:block">
            <HeroCardPreview />
          </div>
        </div>
      </main>
    </div>
  )
}
