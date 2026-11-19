'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard', icon: '🃏', label: 'Card' },
  { href: '/dashboard/links', icon: '🔗', label: 'Links' },
  { href: '/dashboard/stats', icon: '📊', label: 'Stats' },
  { href: '/dashboard/themes', icon: '🎨', label: 'Themes' },
  { href: '/dashboard/music', icon: '🎵', label: 'Music' },
  { href: '/dashboard/friends', icon: '👥', label: 'Friends' },
  { href: '/dashboard/share', icon: '📤', label: 'Share' },
  { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
]

interface Props {
  profile: { username: string | null; display_name: string; avatar_url: string | null }
}

export default function DashboardNav({ profile }: Props) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-white/5 bg-[var(--color-surface)] p-4 gap-6 z-40">
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-3">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-9 w-9 rounded-full object-cover bg-white/5"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-sm">
              {profile.display_name?.[0]?.toUpperCase() ?? '?'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {profile.display_name}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              xlay.me/{profile.username}
            </p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[var(--color-accent)] text-black'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
                }`}
              >
                <span className="w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer logout */}
        <div className="mt-auto">
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-white/5 transition-colors"
            >
              <span className="w-5 text-center">🚪</span>
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 bg-[var(--color-surface)]">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV.slice(0, 6).map(item => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[44px] ${
                  active ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span className="text-[9px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
