'use client'

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
  ChevronDown,
  Copy,
  ExternalLink,
  Ghost,
  LayoutGrid,
  Link2,
  LogOut,
  MoreHorizontal,
  Music,
  Palette,
  Search,
  Settings,
  Share2,
  UserCog,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const ACCOUNT_ITEMS = [
  { href: '/dashboard', Icon: LayoutGrid, label: 'Overview' },
  { href: '/dashboard/stats', Icon: BarChart3, label: 'Stats' },
  { href: '/dashboard/settings', Icon: Settings, label: 'Settings' },
]

const MAIN_ITEMS = [
  { href: '/dashboard/themes', Icon: Palette, label: 'Customize' },
  { href: '/dashboard/links', Icon: Link2, label: 'Links' },
  { href: '/dashboard/music', Icon: Music, label: 'Soundtrack' },
  { href: '/dashboard/friends', Icon: Users, label: 'Best Friends' },
  { href: '/dashboard/share', Icon: Share2, label: 'Share' },
]

const ALL_ITEMS = [...ACCOUNT_ITEMS, ...MAIN_ITEMS]

const MOBILE_PRIMARY = [
  { href: '/dashboard', Icon: LayoutGrid, label: 'Card' },
  { href: '/dashboard/links', Icon: Link2, label: 'Links' },
  { href: '/dashboard/themes', Icon: Palette, label: 'Customize' },
  { href: '/dashboard/music', Icon: Music, label: 'Music' },
]

const MOBILE_MORE = [
  { href: '/dashboard/stats', Icon: BarChart3, label: 'Stats' },
  { href: '/dashboard/friends', Icon: Users, label: 'Best Friends' },
  { href: '/dashboard/share', Icon: Share2, label: 'Share' },
  { href: '/dashboard/settings', Icon: Settings, label: 'Settings' },
]

interface Props {
  profile: { username: string | null; display_name: string; avatar_url: string | null }
}

export default function DashboardNav({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [accountOpen, setAccountOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const cardUrl = `https://xlay.me/${profile.username ?? ''}`

  // Ctrl+K / Cmd+K focuses sidebar feature search
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function copyCardUrl() {
    navigator.clipboard.writeText(cardUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const trimmedQuery = searchQuery.trim().toLowerCase()
  const searchMatches = trimmedQuery
    ? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(trimmedQuery))
    : []

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col rounded-r-3xl border-r border-white/[0.06] bg-[#0b0b0e] p-4 md:flex">
        {/* Brand mark */}
        <div className="flex items-center gap-2.5 px-2 pt-1 pb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-display text-lg font-black tracking-tight text-white"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-accent)] text-black">
              <Ghost size={17} aria-hidden="true" />
            </span>
            <span>Xlay</span>
          </Link>
        </div>

        {/* Search features (Ctrl K) */}
        <div className="relative mb-5">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            aria-hidden="true"
          />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchMatches[0]) {
                router.push(searchMatches[0].href)
                setSearchQuery('')
              }
            }}
            placeholder="Search features…"
            className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#121216] pl-9 pr-14 text-xs text-white placeholder:text-white/35 focus:border-[var(--color-accent)]/50 focus:outline-none"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/45">
            Ctrl K
          </kbd>

          {trimmedQuery && (
            <div className="absolute inset-x-0 top-11 z-50 rounded-xl border border-white/10 bg-[#141418] p-1.5 shadow-2xl">
              {searchMatches.length > 0 ? (
                searchMatches.map(({ href, Icon, label }) => (
                  <button
                    key={href}
                    type="button"
                    onClick={() => {
                      router.push(href)
                      setSearchQuery('')
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-white/80 hover:bg-white/[0.06] hover:text-white cursor-pointer"
                  >
                    <Icon size={14} className="text-[var(--color-accent)]" />
                    {label}
                  </button>
                ))
              ) : (
                <p className="px-2.5 py-2 text-xs text-white/40">No matching feature</p>
              )}
            </div>
          )}
        </div>

        {/* Nav list */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {/* Collapsible Account group */}
          <button
            type="button"
            onClick={() => setAccountOpen((v) => !v)}
            className="flex items-center justify-between rounded-full px-3.5 py-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/[0.04] hover:text-white cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <UserCog size={16} aria-hidden="true" />
              Account
            </span>
            <ChevronDown
              size={15}
              className={`text-white/45 transition-transform duration-150 ${
                accountOpen ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {accountOpen && (
            <div className="mb-1 ml-3 flex flex-col gap-0.5 border-l border-white/[0.07] pl-3">
              {ACCOUNT_ITEMS.map(({ href, Icon, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2.5 rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                      active
                        ? 'border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/12 text-[var(--color-accent)]'
                        : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Primary sections */}
          {MAIN_ITEMS.map(({ href, Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/12 text-[var(--color-accent)]'
                    : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom pinned actions (Copy Link + My Page + Sign out) */}
        <div className="mt-4 space-y-2 rounded-2xl border border-white/[0.06] bg-[#111115] p-2.5">
          <button
            type="button"
            onClick={copyCardUrl}
            className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/85 transition-colors hover:bg-white/[0.08] cursor-pointer"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            {copied ? 'Link Copied' : 'Copy My Link'}
          </button>

          {profile.username && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 px-3 text-xs font-semibold text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)] hover:text-black"
            >
              <ExternalLink size={14} aria-hidden="true" />
              My Page
            </a>
          )}

          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-1.5 text-[11px] font-medium text-white/40 transition-colors hover:text-red-400 cursor-pointer"
            >
              <LogOut size={12} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md md:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-display text-base font-black tracking-tight text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent)] text-black">
            <Ghost size={14} aria-hidden="true" />
          </span>
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
            <Button asChild variant="ghost" size="icon-xs" aria-label="My Page">
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={14} />
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Mobile bottom bar + More sheet */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#0b0b0e]/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5 px-2 py-1.5">
          {MOBILE_PRIMARY.map(({ href, Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                  active ? 'text-[var(--color-accent)]' : 'text-muted-foreground'
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
                  MOBILE_MORE.some((item) => item.href === pathname)
                    ? 'text-[var(--color-accent)]'
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
                {MOBILE_MORE.map(({ href, Icon, label }) => {
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
