'use client'
// app/dashboard/themes/page.tsx
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useTransition } from 'react'

const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    desc: 'Pure dark, electric yellow',
    bg: '#080808',
    accent: '#E8FF47',
    surface: '#141414',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    desc: 'Deep purple, ghost white',
    bg: '#0a0812',
    accent: '#E8E0FF',
    surface: '#13102a',
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    desc: 'Dark teal, cyan glow',
    bg: '#060f10',
    accent: '#00e5ff',
    surface: '#0d1a1c',
  },
  {
    id: 'ember',
    name: 'Ember',
    desc: 'Warm dark, orange fire',
    bg: '#0f0a08',
    accent: '#ff6b2b',
    surface: '#1a110c',
  },
]

export default function ThemesPage() {
  const supabase = createClient()
  const [themeId, setThemeId] = useState('midnight')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('profiles').select('theme_id').eq('id', user.id).single().then(({ data }) => {
        if (data?.theme_id) setThemeId(data.theme_id)
      })
    })
  }, [])

  function selectTheme(id: string) {
    startTransition(async () => {
      setThemeId(id)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('profiles').update({ theme_id: id }).eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Themes</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Pick a vibe for your card. More themes coming soon.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => selectTheme(t.id)}
            className={`glass rounded-2xl p-5 text-left transition-all focus:outline-none ${
              themeId === t.id ? 'ring-2 ring-[var(--color-accent)]' : 'hover:ring-1 hover:ring-white/20'
            }`}
          >
            {/* Mini preview */}
            <div
              className="w-full h-16 rounded-xl mb-3 relative overflow-hidden"
              style={{ background: t.bg }}
            >
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2"
                style={{ borderColor: t.accent, background: t.surface }}
              />
              <div
                className="absolute bottom-2 right-3 h-2 w-10 rounded-full"
                style={{ background: t.accent, opacity: 0.4 }}
              />
            </div>
            <p className="font-semibold text-sm text-[var(--color-text-primary)]">{t.name}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{t.desc}</p>
            {themeId === t.id && (
              <span className="mt-2 inline-block text-xs font-semibold text-[var(--color-accent)]">✓ Active</span>
            )}
          </button>
        ))}
      </div>

      {saved && (
        <p className="text-sm text-green-400 text-center">Theme saved!</p>
      )}
    </div>
  )
}
