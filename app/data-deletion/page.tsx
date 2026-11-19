import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Deletion — Xlay',
  description: 'How to delete your Xlay account and all your data.',
}

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-16 space-y-8">
      <Link href="/" className="text-sm text-[var(--color-accent)] hover:underline">← xlay.me</Link>
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">Data Deletion</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-2">How to delete your account and all your data.</p>
      </div>
      <div className="space-y-6 text-[var(--color-text-secondary)] text-sm leading-relaxed">
        <div className="glass rounded-2xl p-6 space-y-3">
          <h2 className="text-[var(--color-text-primary)] font-semibold">Delete from your dashboard</h2>
          <p>The easiest way to delete your account and all your data is from your Xlay dashboard:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Sign in at <Link href="/login" className="underline text-[var(--color-accent)]">xlay.me/login</Link></li>
            <li>Go to <strong>Settings</strong></li>
            <li>Scroll to <strong>Danger zone</strong></li>
            <li>Click <strong>Delete account</strong> and confirm</li>
          </ol>
          <p>This immediately and permanently deletes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Your profile (display name, bio, settings)</li>
            <li>All your links</li>
            <li>Your uploaded music file and avatar (if applicable)</li>
            <li>Your best friend invites</li>
            <li>Your view and click logs</li>
            <li>Your Supabase Auth account</li>
          </ul>
        </div>

        <div className="glass rounded-2xl p-6 space-y-3">
          <h2 className="text-[var(--color-text-primary)] font-semibold">Can't access your account?</h2>
          <p>If you can't sign in, email us at <a href="mailto:support@xlay.me" className="underline text-[var(--color-accent)]">support@xlay.me</a> with the subject line <strong>"Data Deletion Request"</strong>. Include your Snapchat username or the Xlay username of your account. We will delete all associated data within 30 days and confirm by email.</p>
        </div>

        <p className="text-xs">
          For more information on what data we hold, see our <Link href="/privacy" className="underline text-[var(--color-accent)]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
