import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BarChart3,
  Ghost,
  Link2,
  Music,
  Moon,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react'

import HeroCardPreview from '@/components/marketing/HeroCardPreview'

export const metadata: Metadata = {
  title: 'Xlay — Show Up.',
  description:
    'Xlay is the Snapchat-native link-in-bio for Nigerian creators, students and event-goers. Your Bitmoji. Your links. One card.',
  alternates: { canonical: 'https://xlay.me' },
  openGraph: {
    title: 'Xlay — Show Up.',
    description: 'Your Snapchat card, amplified. Free link-in-bio for Nigerian creators.',
    url: 'https://xlay.me',
    siteName: 'Xlay',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Xlay — Show Up.' },
}

const FEATURES = [
  {
    Icon: Ghost,
    label: 'Bitmoji card',
    desc: 'Your Snap avatar becomes the face of your page — no photo upload needed.',
  },
  {
    Icon: Link2,
    label: 'All your links',
    desc: 'Instagram, TikTok, Spotify, your portfolio. One clean card.',
  },
  {
    Icon: Music,
    label: 'Your soundtrack',
    desc: 'Pick a track and it plays the moment someone taps in.',
  },
  {
    Icon: Users,
    label: 'Best Friends',
    desc: 'Show your squad on your card — they opt in, you stay in control.',
  },
  {
    Icon: BarChart3,
    label: 'Streak & score',
    desc: 'Surface the stats you are proud of. Hide the ones you are not.',
  },
  {
    Icon: Moon,
    label: 'Dark-first design',
    desc: 'Built for how Nigerians actually use their phones, late at night.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Sign in with Snapchat',
    desc: 'One tap. Your Bitmoji and name come across automatically.',
  },
  {
    n: '02',
    title: 'Claim your username',
    desc: 'Get xlay.me/you. Add your links, soundtrack and best friends.',
  },
  {
    n: '03',
    title: 'Share it everywhere',
    desc: 'Drop it in your Snap bio, TikTok, WhatsApp. One link for everything.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-[var(--bg-base)]/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg font-black tracking-tight text-[var(--color-accent)]">
            Xlay
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-white/5"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="btn-primary rounded-full px-4 py-2 text-sm font-semibold"
            >
              Get your card
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — two columns: copy left, live preview right */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Ambient background wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-[-15%] h-[420px] w-[420px] rounded-full opacity-[0.07] blur-[110px]"
          style={{ background: 'var(--color-accent)' }}
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          {/* Copy */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
              Built for Snapchat
            </span>

            <h1 className="mt-6 font-display text-6xl font-black leading-[0.95] tracking-tight text-[var(--color-text-primary)] sm:text-7xl">
              Show Up.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              One link for everything you are. Sign in with Snapchat and your Bitmoji
              becomes the face of your page at{' '}
              <span className="font-semibold text-[var(--color-text-primary)]">
                xlay.me/you
              </span>
              .
            </p>

            {/* Username claim */}
            <form
              action="/login"
              method="get"
              className="mt-8 flex max-w-sm items-center gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] focus-within:border-[var(--color-accent)]/50"
            >
              <span className="pl-4 text-sm whitespace-nowrap text-[var(--color-text-secondary)]">
                xlay.me/
              </span>
              <input
                type="text"
                name="claim"
                placeholder="yourname"
                maxLength={20}
                aria-label="Your Xlay username"
                className="flex-1 bg-transparent py-4 pr-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
              />
              <button
                type="submit"
                className="btn-primary m-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap"
              >
                Claim it →
              </button>
            </form>

            <p className="mt-4 text-xs text-[var(--color-text-muted)]">
              Free to start. No credit card.
            </p>
          </div>

          {/* Preview */}
          <div className="lg:pl-8">
            <HeroCardPreview />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-white/5 px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Live in three steps
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">
              No forms to fill in twice. Your Snapchat account does most of the work.
            </p>
          </div>

          <ol className="mt-12 grid gap-8 sm:grid-cols-3">
            {STEPS.map(s => (
              <li key={s.n} className="relative">
                {/* Connector line between steps on desktop */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-2 hidden h-px w-full bg-gradient-to-r from-white/15 to-transparent sm:block"
                />
                <p className="font-display relative text-sm font-bold text-[var(--color-accent)]">
                  {s.n}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-[var(--color-text-primary)]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {s.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-white/5 px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Everything on one card
            </h2>
            <p className="mt-3 text-[var(--color-text-secondary)]">
              The things you keep typing into your bio, gathered in one place.
            </p>
          </div>

          {/* Asymmetric grid — the first and last tiles span two columns so the
              four-column grid fills evenly with no orphan. */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => {
              const wide = i === 0 || i === FEATURES.length - 1
              return (
                <div
                  key={f.label}
                  className={`group glass rounded-2xl p-6 transition-colors hover:border-[var(--color-accent)]/30 ${
                    wide ? 'lg:col-span-2' : ''
                  }`}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <f.Icon size={19} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold text-[var(--color-text-primary)]">
                    {f.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {f.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto w-full max-w-3xl text-center">
          <Zap className="mx-auto text-[var(--color-accent)]" size={28} aria-hidden="true" />
          <h2 className="mt-6 font-display text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
            Ready to show up?
          </h2>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            Free to start. Show up.
          </p>
          <Link
            href="/login"
            className="btn-primary mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 font-semibold"
          >
            <Smartphone size={17} aria-hidden="true" />
            Get your Xlay card
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)] sm:flex-row">
          <span className="font-display text-sm font-bold text-[var(--color-accent)]">Xlay</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-[var(--color-text-primary)]">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--color-text-primary)]">Terms</Link>
            <Link href="/data-deletion" className="transition-colors hover:text-[var(--color-text-primary)]">Data Deletion</Link>
            <Link href="/contact" className="transition-colors hover:text-[var(--color-text-primary)]">Contact</Link>
          </div>
          <span>© {new Date().getFullYear()} Xlay</span>
        </div>
      </footer>
    </div>
  )
}
