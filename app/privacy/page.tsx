import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Xlay',
  description: 'How Xlay handles your data.',
}

export default function PrivacyPage() {
  const updated = 'November 20, 2026'

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-16 space-y-8">
      <Link href="/" className="text-sm text-[var(--color-accent)] hover:underline">← xlay.me</Link>

      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">Privacy Policy</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Last updated: {updated}</p>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-[var(--color-text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">What we collect</h2>
          <p>When you sign in with Snapchat, we receive your Snapchat external ID, display name, and Bitmoji avatar URL from Snap. We store these to power your Xlay card.</p>
          <p className="mt-2">If you choose to add an email address, we store it for account recovery only.</p>
          <p className="mt-2">We store the links, stats, music, and profile settings you enter in your dashboard.</p>
        </section>

        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">What we don't collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>We <strong>never store your IP address</strong>. For view counting, your IP is hashed with a daily salt (SHA-256) and immediately discarded.</li>
            <li>We do not use advertising trackers, analytics SDKs, or third-party cookies.</li>
            <li>We do not sell your data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">Sessions and cookies</h2>
          <p>We use a single session cookie (set by Supabase Auth) to keep you signed in. This cookie is httpOnly, Secure, and SameSite=Lax. No tracking cookies.</p>
        </section>

        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">Snapchat data</h2>
          <p>Your Bitmoji avatar is provided by Snap Inc. We display it unmodified on your card and in the Best Friends feature. We do not alter, filter, or overlay the Bitmoji artwork. Bitmoji display is free for all users and is never placed behind a paywall.</p>
          <p className="mt-2">A friend's Bitmoji only appears on your card after that friend authenticates with their own Snapchat account and explicitly accepts your invite.</p>
          <p className="mt-2">We comply with Snap's <a href="https://kit.snapchat.com/portal" className="underline text-[var(--color-accent)]" target="_blank" rel="noopener noreferrer">developer terms</a>.</p>
        </section>

        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">View and click logs</h2>
          <p>When someone visits your card, we log the visit source (e.g. from Snapchat, Instagram, or direct), device type, and country (from Cloudflare headers). We use a daily-salted hash of IP + user-agent to count unique visitors — the raw IP is never stored. Logs from known link-preview bots are discarded.</p>
        </section>

        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">Data deletion</h2>
          <p>You can delete your account and all associated data at any time from <strong>Settings → Delete account</strong> in your dashboard. This permanently removes your profile, links, view logs, and uploaded files. See our <Link href="/data-deletion" className="underline text-[var(--color-accent)]">Data Deletion page</Link> for details.</p>
        </section>

        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">Contact</h2>
          <p>Questions? Email us at <a href="mailto:support@xlay.me" className="underline text-[var(--color-accent)]">support@xlay.me</a>.</p>
        </section>
      </div>
    </div>
  )
}
