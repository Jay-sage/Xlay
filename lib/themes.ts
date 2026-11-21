// lib/themes.ts - Shared theme definitions for Theme Editor, CardPreview, PublicCard,
// and the future v2 Community Templates & Theme Publisher blueprint.

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

// ---------------------------------------------------------------------------
// v2 Blueprint: Community Templates & Theme Publisher (not yet mounted in UI)
// ---------------------------------------------------------------------------
// Strictly stores visual style tokens only — never personal links, bios, or
// Snapchat Bitmoji artwork (keeps published templates 100% Snap-compliant).

export interface TemplateStyleConfig {
  theme_id: string
  accent_color: string
  bg_glow: boolean
  avatar_pose: string
  // Extensible v2 slots:
  card_radius?: 'sharp' | 'rounded' | 'pill'
  surface_blur?: 'none' | 'subtle' | 'glass'
  font_pair?: 'syne-dm' | 'editorial' | 'mono'
  link_layout?: 'icons' | 'pills' | 'cards'
}

export interface CommunityTemplate {
  id: string
  slug: string
  name: string
  description: string
  author_username: string
  tags: string[]
  uses_count: number
  stars_count: number
  is_starred?: boolean
  created_at: string
  style: TemplateStyleConfig
}

export interface PublishTemplateDraft {
  name: string
  description: string
  tags: string[]
  style: TemplateStyleConfig
}

/**
 * Extracts only shareable visual theme settings from a user's profile so
 * publishing a template never leaks personal links, bio, or Bitmoji URLs.
 */
export function serializeProfileToTemplateConfig(profile: {
  theme_id?: string | null
  accent_color?: string | null
  bg_glow?: boolean | null
  avatar_pose?: string | null
}): TemplateStyleConfig {
  const { accent, preset } = resolveCardColors(profile)
  return {
    theme_id: preset.id,
    accent_color: accent,
    bg_glow: profile.bg_glow ?? true,
    avatar_pose: profile.avatar_pose ?? '30415970',
    card_radius: 'rounded',
    surface_blur: 'subtle',
    font_pair: 'syne-dm',
    link_layout: 'icons',
  }
}
