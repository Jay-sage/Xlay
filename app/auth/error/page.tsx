'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const MESSAGES: Record<string, string> = {
  snap_error: 'Snapchat returned an error while signing you in. Please try again.',
  missing_params: 'The sign-in callback was incomplete. Please start again.',
  state_mismatch: 'Your sign-in session expired. Please try again.',
  missing_verifier: 'Your sign-in session expired. Please try again.',
  create_user_failed: 'We could not create your account right now. Please try again.',
  profile_create_failed:
    'We could not set up your profile. Contact support@xlay.me if this persists.',
  session_failed: 'We could not start your session. Please try again.',
  unexpected: 'Something went wrong during sign-in. Please try again.',
}

function ErrorContent() {
  const params = useSearchParams()
  const reason = params.get('reason') ?? 'unexpected'
  const message = MESSAGES[reason] ?? MESSAGES.unexpected

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-display text-lg font-black tracking-tight text-primary"
          >
            Xlay
          </Link>
          <Button asChild variant="ghost" size="sm" className="rounded-full text-muted-foreground">
            <Link href="/">
              <ArrowLeft size={14} aria-hidden="true" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <BlurFade delay={0.04} className="w-full max-w-sm">
          <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
            <CardContent className="space-y-5 p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400">
                <AlertCircle size={20} aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  Sign-in error
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <Button asChild size="lg" className="min-h-[48px] w-full rounded-xl font-semibold">
                  <Link href="/auth/snap">Try again</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="min-h-[44px] w-full rounded-xl text-muted-foreground">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      </main>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  )
}
