'use client'

import Avatar from '@/components/ui/Avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  LayoutGrid,
  Link2,
  LogOut,
  MoreHorizontal,
  Music,
  Palette,
  Settings,
  Share2,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const PRIMARY_NAV = [
  { href: '/dashboard', Icon: LayoutGrid, label: 'Card' },
  { href: '/dashboard/links', Icon: Link2, label: 'Links' },
  { href: '/dashboard/themes', Icon: Palette, label: 'Themes' },
  { href: '/dashboard/music', Icon: Music, label: 'Music' },
]

const SECONDARY_NAV = [
  { href: '/dashboard/stats', Icon: BarChart3, label: 'Stats' },
  { href: '/dashboard/friends', Icon: Users, label: 'Friends' },
  { href: '/dashboard/share', Icon: Share2, label: 'Share' },
  { href: '/dashboard/settings', Icon: Settings, label: 'Settings' },
]

const ALL_NAV = [...PRIMARY_NAV, ...SECONDARY_NAV]

interface Props {
  profile: { username: string | null; display_name: string; avatar_url: string | null }
}

export default function DashboardNav({ profile }: Props) {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const cardUrl = `https://xlay.me/${profile.username ?? ''}`

  function copyCardUrl() {
    navigator.clipboard.writeText(cardUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card p-4 md:flex">
        {/* Brand + user */}
        <div className="flex items-center justify-between px-2 pb-4">
          <Link
            href="/dashboard"
            className="font-display text-lg font-black tracking-tight text-primary"
          >
            Xlay
          </Link>
          {profile.username && (
            <Button
              asChild
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
            >
              <a
                href={`/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Open live card"
                aria-label="Open live card"
              >
                <ExternalLink size={14} />
              </a>
            </Button>
          )}
        </div>

        {/* Profile pill */}
        <div className="mb-5 rounded-xl border border-border bg-background/80 p-3">
          <div className="flex items-center gap-3">
            <Avatar
              avatarUrl={profile.avatar_url}
              displayName={profile.display_name}
              size="sm"
              forceCircle
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {profile.display_name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                xlay.me/{profile.username}
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              onClick={copyCardUrl}
              className="flex-1 rounded-lg text-[11px]"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
            {profile.username && (
              <Button asChild variant="secondary" size="xs" className="rounded-lg text-[11px]">
                <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                  Live
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1">
          {ALL_NAV.map(({ href, Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground'
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer logout */}
        <div className="border-t border-border pt-3">
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
            >
              <LogOut size={17} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md md:hidden">
        <Link
          href="/dashboard"
          className="font-display text-base font-black tracking-tight text-primary"
        >
          Xlay
        </Link>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={copyCardUrl}
            className="rounded-full px-3 text-[11px]"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            {copied ? 'Copied' : `/${profile.username}`}
          </Button>
          {profile.username && (
            <Button asChild variant="ghost" size="icon-xs" aria-label="View live card">
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Mobile bottom bar + More sheet */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5 px-2 py-1.5">
          {PRIMARY_NAV.map(({ href, Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon size={19} aria-hidden="true" />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl transition-colors cursor-pointer ${
                  SECONDARY_NAV.some((item) => item.href === pathname)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <MoreHorizontal size={19} aria-hidden="true" />
                <span className="text-[10px] font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="rounded-t-2xl border-border bg-card px-5 pb-8 pt-6"
            >
              <SheetHeader className="mb-4 text-left">
                <SheetTitle className="font-display text-base font-bold text-foreground">
                  More tools
                </SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-2.5">
                {SECONDARY_NAV.map(({ href, Icon, label }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSheetOpen(false)}
                      className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-4 text-sm font-medium transition-colors ${
                        active
                          ? 'border-primary/40 bg-primary/10 text-primary'
                          : 'border-border bg-background/60 text-foreground hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon size={17} aria-hidden="true" />
                      {label}
                    </Link>
                  )
                })}
              </div>
              <form action="/auth/logout" method="post" className="mt-4">
                <Button
                  type="submit"
                  variant="ghost"
                  className="min-h-[48px] w-full justify-start rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-400"
                >
                  <LogOut size={16} aria-hidden="true" />
                  Sign out
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  )
}
