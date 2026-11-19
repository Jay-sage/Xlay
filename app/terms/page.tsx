import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Xlay',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-16 space-y-8">
      <Link href="/" className="text-sm text-[var(--color-accent)] hover:underline">← xlay.me</Link>
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">Terms of Service</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">Last updated: November 20, 2026</p>
      </div>
      <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
        <p>By using Xlay you agree to these terms. If you don't agree, please don't use the service.</p>
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">1. What Xlay is</h2>
          <p>Xlay is a link-in-bio platform that lets you create a public profile page linked to your Snapchat account. It is free to use.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">2. Your account</h2>
          <p>You must have a valid Snapchat account to use Xlay. You are responsible for all activity under your account. Keep your links and content legal and appropriate.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">3. Content rules</h2>
          <p>You must not post illegal content, harassing content, spam, or anything that violates Snapchat's terms or any applicable law. We may remove content or suspend accounts that violate these rules.</p>
          <p className="mt-2">Music you upload must be music you own or have rights to use. By uploading a track you confirm you have those rights.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">4. Snapchat integration</h2>
          <p>Xlay uses Snap Login Kit. Your use of Snapchat features is also subject to <a href="https://snap.com/en-US/terms" className="underline text-[var(--color-accent)]" target="_blank" rel="noopener noreferrer">Snapchat's Terms of Service</a>. Bitmoji art belongs to Snap Inc. and is used in accordance with their developer policies.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">5. Availability</h2>
          <p>We provide Xlay as-is. We may change or discontinue features at any time. We are not liable for any loss arising from use of the service.</p>
        </section>
        <section>
          <h2 className="text-[var(--color-text-primary)] font-semibold mb-2">6. Contact</h2>
          <p>Questions: <a href="mailto:support@xlay.me" className="underline text-[var(--color-accent)]">support@xlay.me</a></p>
        </section>
      </div>
    </div>
  )
}
