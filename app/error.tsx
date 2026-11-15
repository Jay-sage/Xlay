"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in dev/production
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-base)]">
      <div className="glass-panel max-w-md w-full p-8 rounded-2xl text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-surface-3)] text-[var(--accent)] font-bold text-xl">
          !
        </div>
        <div className="space-y-2">
          <h2 className="font-['Syne'] text-2xl font-bold text-[var(--text-primary)]">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            We couldn&apos;t load this page. Please try again.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="w-full min-h-[48px] px-6 py-3 rounded-full font-medium text-sm transition-opacity bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
