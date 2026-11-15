import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl text-center space-y-6">
        <span className="font-['Syne'] text-6xl font-black text-[var(--accent)] tracking-tight">
          404
        </span>
        <div className="space-y-2">
          <h1 className="font-['Syne'] text-2xl font-bold text-[var(--text-primary)]">
            Page not found
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            The profile or page you are looking for doesn&apos;t exist or is not available.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center justify-center w-full min-h-[48px] px-6 py-3 rounded-full font-medium text-sm transition-opacity bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 active:scale-[0.98]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
