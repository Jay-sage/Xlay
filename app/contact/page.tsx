import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact — Xlay',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-16 space-y-8">
      <Link href="/" className="text-sm text-[var(--color-accent)] hover:underline">← xlay.me</Link>
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">Contact</h1>
      </div>
      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="space-y-1">
          <p className="font-semibold text-[var(--color-text-primary)]">General support</p>
          <a href="mailto:support@xlay.me" className="text-[var(--color-accent)] underline text-sm">support@xlay.me</a>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[var(--color-text-primary)]">Report abusive content or music</p>
          <a href="mailto:abuse@xlay.me" className="text-[var(--color-accent)] underline text-sm">abuse@xlay.me</a>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-[var(--color-text-primary)]">Data deletion requests</p>
          <p className="text-sm text-[var(--color-text-secondary)]">See our <Link href="/data-deletion" className="underline text-[var(--color-accent)]">Data Deletion page</Link> or email support@xlay.me with subject "Data Deletion Request".</p>
        </div>
      </div>
    </div>
  )
}
