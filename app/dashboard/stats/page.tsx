'use client'
// app/dashboard/stats/page.tsx
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useTransition } from 'react'

export default function StatsPage() {
  const supabase = createClient()
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [showStreak, setShowStreak] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [showViews, setShowViews] = useState(false)
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('profiles')
        .select('streak_count,snap_score,show_streak,show_score,show_views')
        .eq('id', user.id)
        .single()
      if (data) {
        setStreak(data.streak_count ?? 0)
        setScore(data.snap_score ?? 0)
        setShowStreak(data.show_streak)
        setShowScore(data.show_score)
        setShowViews(data.show_views)
      }
      const { count } = await supabase
        .from('card_views')
        .select('id', { count: 'exact', head: true })
        .eq('profile_id', user.id)
      setViewCount(count ?? 0)
    }
    load()
  }, [])

  function handleSave() {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('profiles').update({
        streak_count: streak,
        snap_score: score,
        show_streak: showStreak,
        show_score: showScore,
        show_views: showViews,
      }).eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Stats</h1>

      {viewCount !== null && (
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <span className="text-3xl">👁️</span>
          <div>
            <p className="text-2xl font-bold font-display text-[var(--color-text-primary)]">
              {viewCount.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">Total card views</p>
          </div>
        </div>
      )}

      <div className="glass rounded-2xl p-5 space-y-5">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Your Snap stats</h2>
        <p className="text-xs text-[var(--color-text-secondary)]">Enter your stats manually from your Snapchat profile.</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-secondary)]">🔥 Streak</label>
            <input
              type="number" min={0} value={streak} onChange={e => setStreak(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--color-text-secondary)]">⭐ Snap Score</label>
            <input
              type="number" min={0} value={score} onChange={e => setScore(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Show streak on card', val: showStreak, set: setShowStreak },
            { label: 'Show Snap score on card', val: showScore, set: setShowScore },
            { label: 'Show view count on card', val: showViews, set: setShowViews },
          ].map(({ label, val, set }) => (
            <label key={label} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-[var(--color-text-primary)]">{label}</span>
              <button
                role="switch" aria-checked={val} onClick={() => set(!val)}
                className={`relative w-10 h-6 rounded-full transition-colors ${val ? 'bg-[var(--color-accent)]' : 'bg-white/10'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-transform ${val ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </label>
          ))}
        </div>

        <button onClick={handleSave} disabled={isPending}
          className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
          {saved ? '✓ Saved!' : isPending ? 'Saving…' : 'Save stats'}
        </button>
      </div>
    </div>
  )
}
