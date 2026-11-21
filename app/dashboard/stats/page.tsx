'use client'
// app/dashboard/stats/page.tsx
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { Check, Eye, Flame, Loader2, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'

export default function StatsPage() {
  const supabase = useMemo(() => createClient(), [])
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
      const {
        data: { user },
      } = await supabase.auth.getUser()
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
  }, [supabase])

  function handleSave() {
    startTransition(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      await supabase
        .from('profiles')
        .update({
          streak_count: streak,
          snap_score: score,
          show_streak: showStreak,
          show_score: showScore,
          show_views: showViews,
        })
        .eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 md:p-10">
      <BlurFade delay={0.03}>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Stats
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control which numbers appear on your public card.
        </p>
      </BlurFade>

      {viewCount !== null && (
        <BlurFade delay={0.07}>
          <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-primary">
                <Eye size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">
                  {viewCount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total card views</p>
              </div>
            </CardContent>
          </Card>
        </BlurFade>
      )}

      <BlurFade delay={0.11}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div>
              <h2 className="font-display text-sm font-bold text-foreground">Snap stats</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Self-entered from your Snapchat profile. Hide any stat you do not want public.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Flame size={13} className="text-primary" aria-hidden="true" />
                  Streak count
                </label>
                <Input
                  type="number"
                  min={0}
                  value={streak}
                  onChange={(e) => setStreak(Number(e.target.value))}
                  className="min-h-[44px] rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Sparkles size={13} className="text-primary" aria-hidden="true" />
                  Snap Score
                </label>
                <Input
                  type="number"
                  min={0}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="min-h-[44px] rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-5">
              {[
                { label: 'Show streak on card', val: showStreak, set: setShowStreak },
                { label: 'Show Snap Score on card', val: showScore, set: setShowScore },
                { label: 'Show view count on card', val: showViews, set: setShowViews },
              ].map(({ label, val, set }) => (
                <div key={label} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-foreground">{label}</span>
                  <Switch checked={val} onCheckedChange={set} aria-label={label} />
                </div>
              ))}
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleSave}
              disabled={isPending}
              className="min-h-[48px] w-full rounded-xl font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <Check size={15} aria-hidden="true" />
                  Saved
                </>
              ) : (
                'Save stats'
              )}
            </Button>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
