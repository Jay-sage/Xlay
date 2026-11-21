import HeroCardPreview from '@/components/marketing/HeroCardPreview'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlatformIcon } from '@/components/ui/PlatformIcon'
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-black tracking-tight text-primary"
          >
            Xlay
          </Link>
          <Button asChild variant="ghost" size="sm" className="rounded-full text-muted-foreground">
            <Link href="/">
              <ArrowLeft size={14} aria-hidden="true" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative flex flex-1 items-center overflow-hidden">
        {/* Subtle ambient accent wash */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-8%] top-[-10%] h-[380px] w-[380px] rounded-full opacity-[0.06] blur-[110px]"
          style={{ background: 'var(--primary)' }}
        />

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          {/* Left: Auth panel */}
          <div className="mx-auto w-full max-w-md lg:mx-0">
            <BlurFade delay={0.04} inView>
              {cleanClaim && (
                <Badge
                  variant="outline"
                  className="mb-5 gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary"
                >
                  <span>Claiming</span>
                  <span className="font-semibold text-foreground">
                    xlay.me/{cleanClaim.toLowerCase()}
                  </span>
                </Badge>
              )}

              <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-[42px] sm:leading-[1.08]">
                Your Snap, your card.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Sign in with Snapchat to create or open your Xlay page. Free for everyone, no
                passwords to remember.
              </p>
            </BlurFade>

            {/* Primary Snap CTA */}
            <BlurFade delay={0.12} inView>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="min-h-[54px] w-full rounded-xl px-6 text-sm font-semibold shadow-lg shadow-primary/10"
                >
                  <Link href={authHref}>
                    <PlatformIcon platform="snapchat" size={19} />
                    Continue with Snapchat
                  </Link>
                </Button>
              </div>
            </BlurFade>

            {/* Transparent scope breakdown with Magic UI BorderBeam */}
            <BlurFade delay={0.2} inView>
              <Card className="relative mt-8 overflow-hidden rounded-2xl border-border bg-card py-0 shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <ShieldCheck size={14} className="text-primary" aria-hidden="true" />
                    <span>What Xlay reads from Snapchat</span>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {SNAP_SCOPES_SUMMARY.map(({ Icon, label, desc }) => (
                      <li key={label} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-white/[0.03] text-muted-foreground">
                          <Icon size={14} aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground">{label}</p>
                          <p className="text-xs text-[var(--text-muted)]">{desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <BorderBeam
                  size={120}
                  duration={10}
                  colorFrom="#e8ff47"
                  colorTo="rgba(255,255,255,0.25)"
                  borderWidth={1}
                />
              </Card>

              {/* Legal */}
              <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted)]">
                By continuing, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                . Session cookie only — no ad trackers.
              </p>
            </BlurFade>
          </div>

          {/* Right: Card preview (desktop only) */}
          <BlurFade delay={0.16} inView className="hidden lg:block">
            <HeroCardPreview />
          </BlurFade>
        </div>
      </main>
    </div>
  )
}
