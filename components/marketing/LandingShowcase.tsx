// components/marketing/LandingShowcase.tsx
// Angled Dashboard + fanned Public Card stack directly below the centered hero.
// Snap compliance: marketing visuals use the neutral StandInAvatar, never Bitmoji art.

import StandInAvatar from '@/components/illustrations/StandInAvatar'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
import { LayoutGrid, Link2, Music, Palette, Settings, Users } from 'lucide-react'

const SIDEBAR_ITEMS = [
  { Icon: LayoutGrid, label: 'Card', active: true },
  { Icon: Palette, label: 'Themes', active: false },
  { Icon: Link2, label: 'Links', active: false },
  { Icon: Music, label: 'Music', active: false },
  { Icon: Users, label: 'Friends', active: false },
  { Icon: Settings, label: 'Settings', active: false },
]

export default function LandingShowcase() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-6xl px-4 sm:px-6">
      {/* Subtle accent glow behind the showcase */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-6 h-56 rounded-full opacity-[0.11] blur-[100px]"
        style={{ background: 'var(--color-accent)' }}
      />

      <div className="relative grid items-end gap-8 overflow-hidden pt-4 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        {/* LEFT: Angled Xlay Dashboard Window */}
        <div className="relative origin-bottom-left transition-transform duration-300 lg:-rotate-[2.5deg] lg:translate-y-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10]/95 shadow-2xl shadow-black/80">
            {/* Window chrome */}
            <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="rounded-full border border-white/[0.08] bg-black/50 px-3 py-0.5 font-mono text-[10px] text-white/45">
                xlay.me/dashboard
              </span>
              <span className="w-8" />
            </div>

            {/* Dashboard interior */}
            <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[155px_1fr]">
              {/* Mini sidebar */}
              <div className="border-r border-white/[0.06] bg-[#0a0a0c] p-3">
                <div className="mb-3 flex items-center gap-2 px-1.5">
                  <span className="font-display text-xs font-black text-[var(--color-accent)]">
                    Xlay
                  </span>
                  <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9px] text-white/50">
                    Free
                  </span>
                </div>
                <div className="space-y-1">
                  {SIDEBAR_ITEMS.map(({ Icon, label, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                        active
                          ? 'bg-[var(--color-accent)] text-black font-semibold'
                          : 'text-white/45'
                      }`}
                    >
                      <Icon size={12} aria-hidden="true" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main dashboard canvas */}
              <div className="space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-xs font-bold text-white">Theme Editor</p>
                    <p className="text-[10px] text-white/45">xlay.me/you</p>
                  </div>
                  <span className="rounded-lg bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-semibold text-black">
                    Save theme
                  </span>
                </div>

                {/* Preset cards row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Midnight', bg: '#080808', accent: '#E8FF47', active: true },
                    { name: 'Lagoon', bg: '#060f10', accent: '#00E5FF', active: false },
                    { name: 'Ember', bg: '#0f0a08', accent: '#FF6B2B', active: false },
                  ].map((t) => (
                    <div
                      key={t.name}
                      className={`rounded-xl border p-2 ${
                        t.active
                          ? 'border-[var(--color-accent)]/50 bg-white/[0.05]'
                          : 'border-white/[0.07] bg-white/[0.02]'
                      }`}
                    >
                      <div
                        className="mb-1.5 h-8 rounded-lg border border-white/[0.06]"
                        style={{
                          background: `radial-gradient(ellipse at top, ${t.accent}33, ${t.bg} 75%)`,
                        }}
                      />
                      <p className="text-[10px] font-semibold text-white/85">{t.name}</p>
                    </div>
                  ))}
                </div>

                {/* Connected links + music row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
                    <p className="text-[9px] uppercase tracking-wider text-white/40">Links</p>
                    <div className="mt-2 flex gap-1.5 text-white/80">
                      {['instagram', 'tiktok', 'spotify', 'audiomack'].map((p) => (
                        <span
                          key={p}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.06]"
                        >
                          <PlatformIcon platform={p} size={11} />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
                    <p className="text-[9px] uppercase tracking-wider text-white/40">Soundtrack</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                        <Music size={10} aria-hidden="true" />
                      </span>
                      <span className="truncate text-[10px] text-white/75">
                        Apple Music · 30s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Fanned / Overlapping Public Card Stack */}
        <div className="relative mx-auto flex h-[300px] w-full max-w-[380px] items-end justify-center sm:h-[320px] lg:max-w-none">
          {/* Back-left card (Lagoon) */}
          <div className="absolute left-2 bottom-2 w-[170px] -rotate-6 rounded-3xl border border-white/10 bg-[#060f10] p-4 shadow-2xl sm:left-6 sm:w-[190px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-3xl opacity-25 blur-2xl"
              style={{ background: 'radial-gradient(ellipse at top, #00E5FF, transparent 70%)' }}
            />
            <div className="relative flex flex-col items-center text-center">
              <StandInAvatar size={58} className="rounded-full" />
              <p className="mt-2 font-display text-xs font-bold text-white">Tomiwa</p>
              <p className="text-[10px] text-white/45">@tomiwa</p>
              <div className="mt-3 flex gap-1.5">
                {['instagram', 'audiomack', 'twitter'].map((p) => (
                  <span
                    key={p}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <PlatformIcon platform={p} size={11} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Back-right card (Ember) */}
          <div className="absolute right-2 bottom-0 w-[170px] rotate-6 rounded-3xl border border-white/10 bg-[#0f0a08] p-4 shadow-2xl sm:right-6 sm:w-[190px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-24 rounded-t-3xl opacity-25 blur-2xl"
              style={{ background: 'radial-gradient(ellipse at top, #FF6B2B, transparent 70%)' }}
            />
            <div className="relative flex flex-col items-center text-center">
              <StandInAvatar size={58} className="rounded-full" />
              <p className="mt-2 font-display text-xs font-bold text-white">Zara</p>
              <p className="text-[10px] text-white/45">@zara_ng</p>
              <div className="mt-3 flex gap-1.5">
                {['tiktok', 'youtube', 'spotify'].map((p) => (
                  <span
                    key={p}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <PlatformIcon platform={p} size={11} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Front-center hero card (Midnight) */}
          <div className="relative z-10 w-[205px] rounded-3xl border border-white/15 bg-[#0b0b0d] p-5 shadow-2xl shadow-black/90 sm:w-[225px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-28 rounded-t-3xl opacity-25 blur-2xl"
              style={{
                background: 'radial-gradient(ellipse at top, var(--color-accent), transparent 72%)',
              }}
            />
            <div className="relative flex flex-col items-center text-center">
              <StandInAvatar size={76} className="rounded-full" />
              <p className="mt-2.5 font-display text-sm font-bold text-white">Sage</p>
              <p className="text-[11px] text-white/45">@sage</p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-white/60">
                Lagos, NG · Show Up.
              </p>

              {/* Links glass pill */}
              <div className="mt-3.5 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2">
                {['snapchat', 'instagram', 'tiktok', 'spotify'].map((p) => (
                  <span
                    key={p}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white"
                  >
                    <PlatformIcon platform={p} size={13} />
                  </span>
                ))}
              </div>

              {/* Soundtrack pill */}
              <div className="mt-3 flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                  <Music size={10} aria-hidden="true" />
                </span>
                <span className="truncate text-[10px] text-white/70">Tap to play soundtrack</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade so showcase melts cleanly into the dark base */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-transparent"
      />
    </div>
  )
}
