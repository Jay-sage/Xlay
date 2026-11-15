export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-[var(--border-subtle)] border-t-[var(--accent)] animate-spin" />
        <span className="font-['Syne'] text-sm tracking-wider uppercase text-[var(--text-secondary)]">
          Xlay
        </span>
      </div>
    </div>
  );
}
