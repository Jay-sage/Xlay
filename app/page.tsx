import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between p-6 sm:p-12 max-w-5xl mx-auto w-full">
      {/* Header */}
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="font-['Syne'] text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Xlay<span className="text-[var(--accent)]">.</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/api/health"
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            System Status
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center my-auto py-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] text-xs text-[var(--accent)] font-medium">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
          Foundation Ready
        </div>

        <h1 className="font-['Syne'] text-5xl sm:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-2xl">
          Show Up<span className="text-[var(--accent)]">.</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-md font-normal leading-relaxed">
          Snapchat-native link-in-bio platform for Nigerian creators, students, and event-goers.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="glass-panel px-6 py-3 rounded-full text-xs text-[var(--text-secondary)]">
            Phase 0 Foundation • Next.js App Router • Tailwind • Supabase
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
        <div>&copy; {new Date().getFullYear()} Xlay. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>xlay.me</span>
        </div>
      </footer>
    </main>
  );
}
