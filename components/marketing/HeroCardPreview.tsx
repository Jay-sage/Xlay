// components/marketing/HeroCardPreview.tsx
// A static phone-frame preview of the real public card, used in the homepage
// hero.
//
// Snap compliance: this is MARKETING content, so it uses a neutral
// illustrated stand-in avatar rather than any Bitmoji artwork. The card
// chrome (glass pill, stats, link pills, footer) mirrors the real card so the
// preview stays honest.
//
// The preview is static — no animation, no autoplay — and respects
// prefers-reduced-motion.

import StandInAvatar from '@/components/illustrations/StandInAvatar'
import { Link2, Music, Sparkles } from 'lucide-react'

const SAMPLE_LINKS = [
  { label: 'Instagram', icon: 'instagram' },
  { label: 'TikTok', icon: 'tiktok' },
  { label: 'X', icon: 'twitter' },
]

/** Small inline brand-ish glyphs — geometric, not trademarked brand marks. */
function SampleLinkIcon({ kind }: { kind: string }) {
  if (kind === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (kind === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 4c.6 2.4 2.2 4 4.5 4.4" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  )
}

export default function HeroCardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* Accent glow behind the device — sits behind everything */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[64px] opacity-20 blur-3xl"
        style={{ background: 'var(--color-accent)' }}
      />

      {/* Phone frame */}
      <div className="relative rounded-[40px] border border-white/10 bg-[#0b0b0d] p-2 shadow-2xl shadow-black/60">
        {/* Notch */}
        <div aria-hidden="true" className="absolute left-1/2 top-3 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

        {/* Screen */}
        <div className="relative flex h-[500px] flex-col items-center overflow-hidden rounded-[32px] bg-[#080808] px-5 pt-12 pb-6">
          {/* Soft accent wash behind the card */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-64 opacity-[0.18] blur-3xl"
            style={{ background: 'radial-gradient(ellipse at top, var(--color-accent), transparent 70%)' }}
          />

          {/* Avatar */}
          <div className="relative">
            <StandInAvatar size={112} className="rounded-full" />
          </div>

          {/* Name + handle */}
          <div className="relative mt-3 text-center">
            <p className="font-display text-sm font-bold leading-tight text-white">Sage</p>
            <p className="mt-0.5 text-[11px] text-white/50">@sage</p>
          </div>

          {/* Bio */}
          <p className="relative mt-2.5 max-w-[210px] text-center text-[11px] leading-relaxed text-white/60">
            Creator. Lagos, NG. Building things.
          </p>

          {/* Stats */}
          <div className="relative mt-4 flex gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
              <p className="text-[9px] text-white/40">Streak</p>
              <p className="text-xs font-bold text-[var(--color-accent)]">142</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-center">
              <p className="text-[9px] text-white/40">Score</p>
              <p className="text-xs font-bold text-[var(--color-accent)]">12.4k</p>
            </div>
          </div>

          {/* Link pills */}
          <div className="relative mt-4 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5">
            {SAMPLE_LINKS.map(l => (
              <span
                key={l.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"
                title={l.label}
              >
                <SampleLinkIcon kind={l.icon} />
              </span>
            ))}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white" title="Website">
              <Link2 size={16} aria-hidden="true" />
            </span>
          </div>

          {/* Soundtrack bar */}
          <div className="relative mt-4 flex w-full max-w-[230px] items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2">
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
              <Music size={13} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium text-white/80">Midnight Drive</p>
              <p className="truncate text-[9px] text-white/40">Sage&apos;s soundtrack</p>
            </div>
            <Sparkles size={12} className="flex-shrink-0 text-white/30" aria-hidden="true" />
          </div>

          {/* Best friends */}
          <div className="relative mt-5">
            <p className="text-center text-[9px] uppercase tracking-[0.18em] text-white/30">
              Best friends
            </p>
            <div className="mt-2 flex justify-center -space-x-2.5">
              {['#3a3a44', '#46464f', '#2e2e36'].map((tone, i) => (
                <span
                  key={tone}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#080808] text-[10px] font-semibold text-white/70"
                  style={{ background: tone }}
                  aria-hidden="true"
                >
                  {['A', 'T', 'K'][i]}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-auto pt-4 text-[9px] text-white/20">Powered by Xlay</p>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-3 -left-4 hidden items-center gap-2 rounded-full border border-white/10 bg-[#141416] px-3 py-2 shadow-lg sm:flex">
        <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
        <span className="text-[11px] font-medium text-white/80">xlay.me/sage</span>
      </div>
    </div>
  )
}
