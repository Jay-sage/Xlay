import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Xlay — Show Up.',
  description:
    'Xlay is the Snapchat-native link-in-bio for Nigerian creators, students and event-goers. Your Bitmoji. Your links. One card.',
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
  { icon: '👻', label: 'Bitmoji card', desc: 'Your Snap avatar is the face of your page.' },
  { icon: '🔗', label: 'All your links', desc: 'Instagram, TikTok, Spotify — one glass pill.' },
  { icon: '🎵', label: 'Your soundtrack', desc: 'Upload a track. It plays on tap.' },
  { icon: '👥', label: 'Best Friends', desc: 'Show your Snap squad on your card.' },
  { icon: '📊', label: 'Streak & score', desc: 'Show off (or keep private).' },
  { icon: '🌙', label: 'Dark-first design', desc: 'Built for how Nigerians actually use their phones.' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <span className="font-display text-xl font-black text-[var(--color-accent)]">Xlay</span>
        <Link
          href="/login"
          className="text-sm font-semibold text-[var(--color-text-primary)] border border-white/10 px-4 py-2 rounded-full hover:border-[var(--color-accent)]/50 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 gap-8">
        <div className="space-y-4 max-w-xl">
          <h1 className="font-display text-6xl sm:text-7xl font-black tracking-tight text-[var(--color-text-primary)] leading-none">
            Show Up.
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
            One link for everything you are. Sign in with Snapchat — your Bitmoji becomes the face
            of your page at{' '}
            <span className="text-[var(--color-text-primary)] font-semibold">xlay.me/you</span>.
          </p>
        </div>

        {/* Username claim input */}
        <form
          action="/login"
          method="get"
          className="flex items-center gap-0 glass rounded-2xl overflow-hidden max-w-sm w-full"
        >
          <span className="pl-4 text-sm text-[var(--color-text-secondary)] whitespace-nowrap">
            xlay.me/
          </span>
          <input
            type="text"
            name="claim"
            placeholder="yourname"
            maxLength={20}
            className="flex-1 bg-transparent py-4 pr-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none"
          />
          <button
            type="submit"
            className="btn-primary m-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap"
          >
            Claim it →
          </button>
        </form>

        <p className="text-xs text-[var(--color-text-secondary)]">Free. No credit card. No ads.</p>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="font-display text-2xl font-bold text-center mb-10 text-[var(--color-text-primary)]">
          How it works
        </h2>
        <ol className="grid sm:grid-cols-3 gap-6 text-center">
          {[
            { n: '1', title: 'Sign in with Snapchat', desc: 'One tap — your Bitmoji and name are pulled in automatically.' },
            { n: '2', title: 'Claim your username', desc: 'Get xlay.me/you. Add your links, music, and best friends.' },
            { n: '3', title: 'Share it everywhere', desc: 'Drop it in your Snap bio, TikTok, WhatsApp — one link for everything.' },
          ].map(s => (
            <li key={s.n} className="glass rounded-2xl p-6 space-y-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-black font-bold font-display text-lg mx-auto">
                {s.n}
              </span>
              <h3 className="font-semibold text-[var(--color-text-primary)]">{s.title}</h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto w-full">
        <h2 className="font-display text-2xl font-bold text-center mb-10 text-[var(--color-text-primary)]">
          Everything on one card
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.label} className="glass rounded-2xl p-5 flex gap-4 items-start">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="font-semibold text-sm text-[var(--color-text-primary)]">{f.label}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="glass max-w-md mx-auto rounded-2xl p-10 space-y-5">
          <h2 className="font-display text-3xl font-black text-[var(--color-text-primary)]">
            Ready to show up?
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Free for everyone. Always.</p>
          <Link
            href="/login"
            className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold"
          >
            Get your Xlay card
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
          <span className="font-display font-bold text-sm text-[var(--color-accent)]">Xlay</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--color-text-primary)] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--color-text-primary)] transition-colors">Terms</Link>
            <Link href="/data-deletion" className="hover:text-[var(--color-text-primary)] transition-colors">Data Deletion</Link>
            <Link href="/contact" className="hover:text-[var(--color-text-primary)] transition-colors">Contact</Link>
          </div>
          <span>© {new Date().getFullYear()} Xlay</span>
        </div>
      </footer>
    </div>
  )
}
