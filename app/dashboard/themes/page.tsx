'use client'
// app/dashboard/themes/page.tsx - Interactive Theme Editor with live iPhone preview

import CardPreview, {
  type PreviewFriend,
  type PreviewLink,
  type PreviewProfile,
} from '@/app/dashboard/CardPreview'
import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { BorderBeam } from '@/components/ui/border-beam'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MagicCard } from '@/components/ui/magic-card'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BITMOJI_POSES, DEFAULT_BITMOJI_POSE, getBitmojiPoseUrl } from '@/lib/snap/bitmoji'
import { createClient } from '@/lib/supabase/client'
import { ACCENT_SWATCHES, getThemePreset, THEME_PRESETS } from '@/lib/themes'
import { Check, Loader2, Palette, RotateCcw, Smartphone, Sparkles, User } from 'lucide-react'
import { useEffect, useMemo, useState, useTransition } from 'react'

const HEX_RE = /^#[0-9a-fA-F]{6}$/

export default function ThemesPage() {
  const supabase = useMemo(() => createClient(), [])
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<PreviewProfile | null>(null)
  const [links, setLinks] = useState<PreviewLink[]>([])
  const [friends, setFriends] = useState<PreviewFriend[]>([])
  const [loading, setLoading] = useState(true)

  // Editable state
  const [themeId, setThemeId] = useState('midnight')
  const [accentColor, setAccentColor] = useState<string | null>(null)
  const [customHex, setCustomHex] = useState('#E8FF47')
  const [bgType, setBgType] = useState<'glow' | 'solid'>('glow')
  const [avatarPose, setAvatarPose] = useState(DEFAULT_BITMOJI_POSE)

  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let active = true
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user || !active) return
      setUserId(user.id)

      const [{ data: prof }, { data: linkRows }, { data: friendRows }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('links')
          .select('id, platform, url, sort_order')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('best_friend_invites')
          .select(
            'id, friend_profile_id, profiles!friend_profile_id(display_name, avatar_url, username)'
          )
          .eq('owner_id', user.id)
          .eq('status', 'accepted'),
      ])

      if (!active) return
      if (prof) {
        setProfile(prof as PreviewProfile)
        const preset = getThemePreset(prof.theme_id)
        setThemeId(preset.id)
        setAccentColor(prof.accent_color ?? null)
        setCustomHex(prof.accent_color ?? preset.accent)
        setBgType(prof.bg_type === 'solid' ? 'solid' : 'glow')
        setAvatarPose(prof.avatar_pose ?? DEFAULT_BITMOJI_POSE)
      }
      setLinks((linkRows ?? []) as PreviewLink[])
      setFriends(
        (friendRows ?? []).map((f) => ({
          id: f.id,
          friend_profile_id: f.friend_profile_id,
          profiles: Array.isArray(f.profiles) ? (f.profiles[0] ?? null) : f.profiles,
        })) as PreviewFriend[]
      )
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [supabase])

  const liveProfile: PreviewProfile | null = profile
    ? {
        ...profile,
        theme_id: themeId,
        accent_color: accentColor,
        bg_type: bgType,
        avatar_pose: avatarPose,
      }
    : null

  const activePreset = getThemePreset(themeId)
  const effectiveAccent = accentColor ?? activePreset.accent

  function handleSelectPreset(id: string) {
    const preset = getThemePreset(id)
    setThemeId(id)
    setAccentColor(null)
    setCustomHex(preset.accent)
    setSaved(false)
  }

  function handleSelectAccent(hex: string) {
    setAccentColor(hex)
    setCustomHex(hex)
    setSaved(false)
  }

  function handleCustomHexChange(val: string) {
    const formatted = val.startsWith('#') ? val : `#${val}`
    setCustomHex(formatted)
    if (HEX_RE.test(formatted)) {
      setAccentColor(formatted.toUpperCase())
      setSaved(false)
    }
  }

  function handleSave() {
    if (!userId) return
    startTransition(async () => {
      await supabase
        .from('profiles')
        .update({
          theme_id: themeId,
          accent_color: accentColor,
          bg_type: bgType,
          avatar_pose: avatarPose,
        })
        .eq('id', userId)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-10 text-muted-foreground">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6 md:p-10">
      {/* Header */}
      <BlurFade delay={0.03}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Theme Editor
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Customize your preset, accent glow, and 3D Bitmoji pose in real time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile live preview sheet trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-[44px] rounded-xl lg:hidden"
                >
                  <Smartphone size={15} aria-hidden="true" />
                  Preview
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="max-h-[90vh] overflow-y-auto rounded-t-2xl border-border bg-card px-5 pb-8 pt-6"
              >
                <SheetHeader className="mb-4 text-left">
                  <SheetTitle className="font-display text-base font-bold">
                    Live Card Preview
                  </SheetTitle>
                </SheetHeader>
                <CardPreview profile={liveProfile} links={links} friends={friends} />
              </SheetContent>
            </Sheet>

            <Button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="min-h-[44px] rounded-xl px-5 font-semibold"
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
                'Save theme'
              )}
            </Button>
          </div>
        </div>
      </BlurFade>

      {/* Main split: Editor left, Live Phone Preview right */}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <BlurFade delay={0.08}>
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid h-11 w-full grid-cols-3 rounded-xl border border-border bg-card p-1">
              <TabsTrigger value="presets" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <Palette size={14} aria-hidden="true" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="accent" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <Sparkles size={14} aria-hidden="true" />
                Accent & Glow
              </TabsTrigger>
              <TabsTrigger value="pose" className="gap-1.5 rounded-lg text-xs sm:text-sm">
                <User size={14} aria-hidden="true" />
                3D Pose
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Theme Presets */}
            <TabsContent value="presets" className="mt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {THEME_PRESETS.map((t) => {
                  const active = themeId === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectPreset(t.id)}
                      className="group relative rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    >
                      <MagicCard
                        gradientColor={t.accent}
                        gradientOpacity={0.14}
                        className="rounded-2xl border border-border bg-card p-4"
                      >
                        {/* Mini theme swatch */}
                        <div
                          className="relative mb-3.5 h-20 w-full overflow-hidden rounded-xl border border-white/[0.06]"
                          style={{ backgroundColor: t.bg }}
                        >
                          <div
                            className="absolute inset-x-0 top-0 h-14 opacity-30 blur-xl"
                            style={{
                              background: `radial-gradient(ellipse at top, ${t.accent}, transparent 75%)`,
                            }}
                          />
                          <div
                            className="absolute bottom-3 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full border-2"
                            style={{ borderColor: t.accent, backgroundColor: t.surface }}
                          />
                          <div
                            className="absolute bottom-3 right-3 h-2 w-10 rounded-full opacity-50"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-display text-sm font-bold text-foreground">
                              {t.name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                          </div>
                          {active && (
                            <Badge className="rounded-full bg-primary/15 text-primary hover:bg-primary/15">
                              Active
                            </Badge>
                          )}
                        </div>
                      </MagicCard>
                      {active && (
                        <BorderBeam
                          size={100}
                          duration={8}
                          colorFrom={t.accent}
                          colorTo="rgba(255,255,255,0.2)"
                          borderWidth={1.5}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </TabsContent>

            {/* Tab 2: Accent & Atmosphere */}
            <TabsContent value="accent" className="mt-5 space-y-5">
              <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
                <CardContent className="space-y-5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-sm font-bold text-foreground">
                        Accent color
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Applies to stats, music play badge, and ambient glow.
                      </p>
                    </div>
                    {accentColor && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setAccentColor(null)
                          setCustomHex(activePreset.accent)
                          setSaved(false)
                        }}
                        className="text-muted-foreground"
                      >
                        <RotateCcw size={12} aria-hidden="true" />
                        Reset
                      </Button>
                    )}
                  </div>

                  {/* Swatches */}
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                    {ACCENT_SWATCHES.map((sw) => {
                      const active = effectiveAccent.toUpperCase() === sw.value.toUpperCase()
                      return (
                        <button
                          key={sw.value}
                          type="button"
                          onClick={() => handleSelectAccent(sw.value)}
                          className={`flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-xl border p-2 transition-all cursor-pointer ${
                            active
                              ? 'border-white/40 bg-white/[0.08]'
                              : 'border-border bg-background/60 hover:bg-white/[0.04]'
                          }`}
                        >
                          <span
                            className="h-5 w-5 rounded-full border border-white/20"
                            style={{ backgroundColor: sw.value }}
                          />
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {sw.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom hex */}
                  <div className="flex items-center gap-3 pt-1">
                    <span
                      className="h-10 w-10 flex-shrink-0 rounded-xl border border-white/15"
                      style={{ backgroundColor: effectiveAccent }}
                    />
                    <Input
                      type="text"
                      value={customHex}
                      onChange={(e) => handleCustomHexChange(e.target.value)}
                      maxLength={7}
                      placeholder="#E8FF47"
                      className="h-10 max-w-[160px] rounded-xl font-mono text-xs uppercase"
                    />
                    <span className="text-xs text-muted-foreground">Custom hex</span>
                  </div>
                </CardContent>
              </Card>

              {/* Atmosphere / background style */}
              <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h2 className="font-display text-sm font-bold text-foreground">
                      Background atmosphere
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Choose between a soft top radial wash or pure flat dark.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'glow' as const, label: 'Radial Glow', desc: 'Soft accent wash at top' },
                      { id: 'solid' as const, label: 'Pure Solid', desc: 'Clean matte dark canvas' },
                    ].map((opt) => {
                      const active = bgType === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setBgType(opt.id)
                            setSaved(false)
                          }}
                          className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                            active
                              ? 'border-primary/50 bg-primary/[0.08]'
                              : 'border-border bg-background/60 hover:bg-white/[0.04]'
                          }`}
                        >
                          <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: 3D Bitmoji Pose */}
            <TabsContent value="pose" className="mt-5">
              <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
                <CardContent className="space-y-4 p-6">
                  <div>
                    <h2 className="font-display text-sm font-bold text-foreground">
                      3D Bitmoji Pose
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Your Bitmoji is always displayed unmodified — free for everyone.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BITMOJI_POSES.map((pose) => {
                      const previewSrc =
                        getBitmojiPoseUrl(profile?.avatar_url, pose.id) ?? profile?.avatar_url
                      const active = avatarPose === pose.id
                      return (
                        <button
                          key={pose.id}
                          type="button"
                          onClick={() => {
                            setAvatarPose(pose.id)
                            setSaved(false)
                          }}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 transition-all cursor-pointer ${
                            active
                              ? 'border-primary/60 bg-primary/[0.08]'
                              : 'border-border bg-background/60 hover:bg-white/[0.04]'
                          }`}
                        >
                          {previewSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previewSrc}
                              alt={pose.label}
                              className={`h-24 w-24 ${
                                pose.isFullBody ? 'object-contain' : 'rounded-full object-cover'
                              }`}
                            />
                          ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/5 text-lg font-bold text-muted-foreground">
                              {profile?.display_name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                          )}
                          <span className="text-xs font-semibold text-foreground">
                            {pose.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </BlurFade>

        {/* Sticky Live iPhone Preview (Desktop) */}
        <BlurFade delay={0.14} className="hidden lg:sticky lg:top-8 lg:block">
          <CardPreview profile={liveProfile} links={links} friends={friends} />
        </BlurFade>
      </div>
    </div>
  )
}
