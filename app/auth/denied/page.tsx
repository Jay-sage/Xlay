'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AuthDeniedPage() {
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
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-primary">
                <ShieldAlert size={20} aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  Snapchat access declined
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Xlay needs permission to read your Snapchat display name, Bitmoji, and unique ID
                  to sign you in. Nothing else is accessed.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <Button asChild size="lg" className="min-h-[48px] w-full rounded-xl font-semibold">
                  <Link href="/auth/snap">Try again</Link>
                </Button>
                <Button asChild variant="ghost" size="default" className="min-h-[44px] w-full rounded-xl text-muted-foreground">
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
