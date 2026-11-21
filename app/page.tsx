import LandingShowcase from '@/components/marketing/LandingShowcase'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import {
  ArrowRight,
  BarChart3,
  Ghost,
  Link2,
  Moon,
  Music,
  Users,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

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
    label: 'Bitmoji front and centre',
    desc: 'Your Snapchat avatar becomes the face of your page — unmodified and free for everyone.',
  },
  {
    Icon: Link2,
    label: '47+ app & social icons',
    desc: 'Instagram, TikTok, Audiomack, Spotify, WhatsApp, and custom links in one glass pill.',
  },
  {
    Icon: Music,
    label: 'Apple Music soundtrack',
    desc: 'Search any song and attach its 30-second preview. Plays the moment someone taps in.',
  },
  {
    Icon: Users,
    label: 'Best Friends squad',
    desc: 'Invite up to 3 Snap friends to appear on your card. They opt in and can leave anytime.',
  },
  {
    Icon: BarChart3,
    label: 'Streak & Snap Score',
    desc: 'Surface the stats you want to share and keep everything else private.',
  },
  {
    Icon: Moon,
    label: 'Built for dark mode & speed',
    desc: 'Lightweight pages engineered for mid-range Android phones and Nigerian mobile data.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Sign in with Snapchat',
    desc: 'One tap with Snap Login Kit. Your display name and Bitmoji come across automatically.',
  },
  {
    n: '02',
    title: 'Claim xlay.me/you',
    desc: 'Pick your handle, choose your 3D pose, set a theme, and add your links and soundtrack.',
  },
  {
    n: '03',
    title: 'Show up everywhere',
    desc: 'Drop your Xlay link in your Snap bio, TikTok, Instagram, and WhatsApp.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080808] text-[var(--color-text-primary)] overflow-x-hidden">
      {/* Floating rounded pill navbar */}
      <header className="sticky top-4 z-40 px-4">
        <nav className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-full border border-white/10 bg-[#0d0d10]/85 px-4 py-2.5 shadow-2xl shadow-black/60 backdrop-blur-xl sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-black tracking-tight text-white"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
              <Ghost size={15} aria-hidden="true" />
            </span>
            <span>Xlay</span>
          </Link>

          <div className="hidden items-center gap-6 text-xs font-medium text-white/70 md:flex">
            <a href="#how-it-works" className="transition-colors hover:text-white">
              How it works
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:text-white sm:text-sm"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 px-4 py-1.5 text-xs font-semibold text-[var(--color-accent)] shadow-[0_0_24px_rgba(232,255,71,0.18)] transition-all hover:bg-[var(--color-accent)] hover:text-black sm:px-5 sm:py-2 sm:text-sm"
            >
              Sign Up Free
            </Link>
          </div>
        </nav>
      </header>

      {/* Centered Hero */}
      <section className="relative pt-16 pb-8 sm:pt-24">
        {/* Soft radial top wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.09] blur-[120px]"
          style={{ background: 'var(--color-accent)' }}
        />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
          <BlurFade delay={0.04}>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.06]">
              Show Up, right here.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Xlay is your Snapchat-native link-in-bio for Nigerian creators, students, and
              event-goers — your Bitmoji, links, soundtrack, and best friends on one card.
            </p>
          </BlurFade>

          {/* Dual glowing pill CTAs */}
          <BlurFade delay={0.12} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--color-accent)]/60 bg-[var(--color-accent)] px-7 text-sm font-semibold text-black shadow-[0_0_32px_rgba(232,255,71,0.28)] transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Sign Up for Free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-7 text-sm font-semibold text-white/90 transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              See how it works
            </a>
          </BlurFade>

          {/* Username claim pill */}
          <BlurFade delay={0.18} className="mt-6 w-full max-w-sm">
            <form
              action="/login"
              method="get"
              className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1.5 pl-4 transition-colors focus-within:border-[var(--color-accent)]/50"
            >
              <span className="whitespace-nowrap text-xs font-medium text-white/45 sm:text-sm">
                xlay.me/
              </span>
              <input
                type="text"
                name="claim"
                placeholder="yourname"
                maxLength={20}
                aria-label="Claim your username"
                className="min-w-0 flex-1 bg-transparent py-2 pr-2 text-xs text-white placeholder:text-white/30 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent)] hover:text-black cursor-pointer"
              >
                Claim
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            </form>
            <p className="mt-2.5 text-[11px] text-white/40">
              Free forever. No credit card. No ad trackers.
            </p>
          </BlurFade>
        </div>

        {/* Signature tilted Dashboard + Fanned Cards Showcase */}
        <BlurFade delay={0.24}>
          <LandingShowcase />
        </BlurFade>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            How it works
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Live in under a minute.
          </h2>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-white/[0.08] bg-[#101010] p-6 space-y-3"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 font-display text-xs font-bold text-[var(--color-accent)]">
                {s.n}
              </span>
              <h3 className="font-display text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Features
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Everything on one card.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.08] bg-[#101010] p-5 transition-colors hover:border-white/15"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[var(--color-accent)]">
                <Icon size={17} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-sm font-bold text-white">{label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-16 pb-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111113] px-7 py-10 sm:px-12 sm:py-12">
          {/* Subtle accent wash */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.1] blur-[90px]"
            style={{ background: 'var(--color-accent)' }}
          />

          {/* Subtle background ghost watermarks */}
          <Ghost
            size={96}
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 left-6 -rotate-12 text-white/[0.03]"
          />
          <Ghost
            size={110}
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-6 right-10 rotate-12 text-white/[0.03]"
          />
          <Ghost
            size={72}
            aria-hidden="true"
            className="pointer-events-none absolute top-6 right-[26%] rotate-[22deg] text-white/[0.025]"
          />

          <div className="relative z-10 max-w-xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Show Up, right here.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              Claim your handle with Snapchat and put your Bitmoji, links, soundtrack, and best
              friends on one free card.
            </p>

            {/* Left-aligned claim input + button */}
            <form
              action="/login"
              method="get"
              className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center"
            >
              <div className="flex min-h-[48px] flex-1 max-w-xs items-center rounded-xl border border-white/10 bg-[#080808]/90 px-4 focus-within:border-[var(--color-accent)]/50">
                <span className="whitespace-nowrap text-sm font-medium text-white/50">
                  xlay.me/
                </span>
                <input
                  type="text"
                  name="claim"
                  placeholder="username"
                  maxLength={20}
                  aria-label="Claim your username"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[var(--color-accent)]/50 bg-[var(--color-accent)]/15 px-6 text-sm font-semibold text-[var(--color-accent)] shadow-[0_0_24px_rgba(232,255,71,0.14)] transition-all hover:bg-[var(--color-accent)] hover:text-black cursor-pointer"
              >
                Claim Now
              </button>
            </form>
          </div>

          <BorderBeam
            size={140}
            duration={11}
            colorFrom="#e8ff47"
            colorTo="rgba(255,255,255,0.18)"
            borderWidth={1}
          />
        </div>
      </section>

      {/* Structured Multi-Column Footer */}
      <footer className="mt-auto border-t border-white/[0.06] px-6 py-12">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1.35fr_repeat(4,1fr)]">
          {/* Brand + System Status */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 font-display text-base font-black tracking-tight text-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                  <Ghost size={15} aria-hidden="true" />
                </span>
                <span>Xlay</span>
              </Link>
              <a
                href="/api/health"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                System Status
              </a>
            </div>
            <p className="max-w-[230px] text-xs leading-relaxed text-white/45">
              Snapchat-native link-in-bio for Nigerian creators, students, and event-goers.
            </p>
            <p className="text-[11px] text-white/30">© {new Date().getFullYear()} Xlay</p>
          </div>

          {/* General */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-white">General</p>
            <ul className="space-y-2 text-xs text-white/55">
              <li>
                <Link href="/login" className="transition-colors hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-white">
                  Sign Up
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#features" className="transition-colors hover:text-white">
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-white">Product</p>
            <ul className="space-y-2 text-xs text-white/55">
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-white">
                  Card Preview
                </Link>
              </li>
              <li>
                <Link href="/dashboard/themes" className="transition-colors hover:text-white">
                  Theme Editor
                </Link>
              </li>
              <li>
                <Link href="/dashboard/music" className="transition-colors hover:text-white">
                  Soundtrack
                </Link>
              </li>
              <li>
                <Link href="/dashboard/friends" className="transition-colors hover:text-white">
                  Best Friends
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-white">Contact</p>
            <ul className="space-y-2 text-xs text-white/55">
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Contact Page
                </Link>
              </li>
              <li>
                <a href="mailto:support@xlay.me" className="transition-colors hover:text-white">
                  Support Email
                </a>
              </li>
              <li>
                <a href="mailto:abuse@xlay.me" className="transition-colors hover:text-white">
                  Report Abuse
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-white">Legal</p>
            <ul className="space-y-2 text-xs text-white/55">
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="transition-colors hover:text-white">
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
