'use client'
// app/dashboard/settings/page.tsx
import { BlurFade } from '@/components/ui/blur-fade'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { Check, Download, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      supabase
        .from('profiles')
        .select('display_name,bio,is_private')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setDisplayName(data.display_name ?? '')
            setBio(data.bio ?? '')
            setIsPrivate(data.is_private ?? false)
          }
        })
    })
  }, [supabase])

  function handleSave() {
    startTransition(async () => {
      if (!userId) return
      await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          is_private: isPrivate,
        })
        .eq('id', userId)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  async function handleExport() {
    if (!userId) return
    const [profile, links, friends, views] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('links').select('*').eq('profile_id', userId),
      supabase.from('best_friend_invites').select('*').eq('owner_id', userId),
      supabase
        .from('card_views')
        .select('source,device,country,created_at')
        .eq('profile_id', userId)
        .limit(1000),
    ])
    const blob = new Blob(
      [
        JSON.stringify(
          {
            profile: profile.data,
            links: links.data,
            best_friend_invites: friends.data,
            card_views: views.data,
            exported_at: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'xlay-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete() {
    if (!userId) return
    setDeleting(true)
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) throw new Error('Delete failed')
      await supabase.auth.signOut()
      router.push('/?deleted=1')
    } catch {
      setDeleting(false)
      alert('Something went wrong. Please contact support@xlay.me')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 md:p-10">
      <BlurFade delay={0.03}>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile details, privacy, and data. Customize your 3D Bitmoji pose in the{' '}
          <Link href="/dashboard/themes" className="text-primary underline underline-offset-4">
            Theme Editor
          </Link>
          .
        </p>
      </BlurFade>

      <BlurFade delay={0.07}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-5 p-6">
            <h2 className="font-display text-sm font-bold text-foreground">Profile</h2>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Display name
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="min-h-[44px] rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="A short bio (up to 160 characters)"
                className="w-full resize-none rounded-xl border border-input bg-transparent px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground">Private card</p>
                <p className="text-xs text-muted-foreground">
                  Hides your card behind a private screen.
                </p>
              </div>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                aria-label="Private card"
              />
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
                'Save changes'
              )}
            </Button>
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.11}>
        <Card className="rounded-2xl border-border bg-card py-0 shadow-none">
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="font-display text-sm font-bold text-foreground">Your data</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Export your profile, links, best friends, and view logs as JSON.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={handleExport}
              className="min-h-[48px] w-full rounded-xl font-semibold"
            >
              <Download size={15} aria-hidden="true" />
              Download my data (JSON)
            </Button>
          </CardContent>
        </Card>
      </BlurFade>

      <BlurFade delay={0.15}>
        <Card className="rounded-2xl border-red-500/25 bg-card py-0 shadow-none">
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="font-display text-sm font-bold text-red-400">Danger zone</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Permanently delete your Xlay card, links, and data. This cannot be undone.
              </p>
            </div>
            {!showDeleteConfirm ? (
              <Button
                type="button"
                variant="destructive"
                size="lg"
                onClick={() => setShowDeleteConfirm(true)}
                className="min-h-[48px] w-full rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25"
              >
                <Trash2 size={15} aria-hidden="true" />
                Delete account
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-red-400">
                  Are you sure? Everything will be permanently removed.
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="min-h-[48px] flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="lg"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="min-h-[48px] flex-1 rounded-xl"
                  >
                    {deleting ? 'Deleting…' : 'Yes, delete everything'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  )
}
