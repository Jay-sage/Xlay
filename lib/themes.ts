// lib/themes.ts - Shared theme definitions for Theme Editor, CardPreview, and PublicCard

export interface ThemePreset {
  id: string
  name: string
  desc: string
  bg: string
  accent: string
  surface: string
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    desc: 'Obsidian dark, electric lime',
    bg: '#080808',
    accent: '#E8FF47',
    surface: '#121212',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    desc: 'Deep violet-black, ghost white',
    bg: '#0a0812',
    accent: '#E8E0FF',
    surface: '#141026',
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    desc: 'Abyssal teal, electric cyan',
    bg: '#060f10',
    accent: '#00E5FF',
    surface: '#0d1a1c',
  },
  {
    id: 'ember',
    name: 'Ember',
    desc: 'Warm charcoal, solar orange',
    bg: '#0f0a08',
    accent: '#FF6B2B',
    surface: '#1a110c',
  },
]

export const ACCENT_SWATCHES = [
  { name: 'Lime', value: '#E8FF47' },
  { name: 'Cyan', value: '#00E5FF' },
  { name: 'Ember', value: '#FF6B2B' },
  { name: 'Ghost', value: '#E8E0FF' },
  { name: 'Rose', value: '#FF4D8D' },
  { name: 'Emerald', value: '#34D399' },
]

export function getThemePreset(themeId: string | null | undefined): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === themeId) ?? THEME_PRESETS[0]
}

export function resolveCardColors(profile: {
  theme_id?: string | null
  accent_color?: string | null
}) {
  const preset = getThemePreset(profile.theme_id)
  return {
    bg: preset.bg,
    surface: preset.surface,
    accent: profile.accent_color || preset.accent,
    preset,
  }
}
