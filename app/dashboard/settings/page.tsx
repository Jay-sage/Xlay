'use client'
// app/dashboard/settings/page.tsx
import { BITMOJI_POSES, DEFAULT_BITMOJI_POSE, getBitmojiPoseUrl } from '@/lib/snap/bitmoji'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPose, setAvatarPose] = useState(DEFAULT_BITMOJI_POSE)
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
      supabase.from('profiles').select('display_name,bio,is_private,avatar_url,avatar_pose').eq('id', user.id).single()
        .then(({ data }) => {
          if (data) {
            setDisplayName(data.display_name ?? '')
            setBio(data.bio ?? '')
            setIsPrivate(data.is_private ?? false)
            setAvatarUrl(data.avatar_url ?? null)
            setAvatarPose(data.avatar_pose ?? DEFAULT_BITMOJI_POSE)
          }
        })
    })
  }, [])

  function handleSave() {
    startTransition(async () => {
      if (!userId) return
      await supabase.from('profiles').update({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        is_private: isPrivate,
        avatar_pose: avatarPose,
      }).eq('id', userId)
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
      supabase.from('card_views').select('source,device,country,created_at').eq('profile_id', userId).limit(1000),
    ])
    const blob = new Blob([JSON.stringify({
      profile: profile.data,
      links: links.data,
      best_friend_invites: friends.data,
      card_views: views.data,
      exported_at: new Date().toISOString(),
    }, null, 2)], { type: 'application/json' })
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
      // Delete storage files
      await supabase.storage.from('music').remove([`${userId}/track.mp3`, `${userId}/track.m4a`])
      await supabase.storage.from('avatars').remove([`${userId}/avatar`])
      // Delete profile (cascades to links, invites, etc.)
      await supabase.from('profiles').delete().eq('id', userId)
      // Sign out
      await supabase.auth.signOut()
      router.push('/?deleted=1')
    } catch {
      setDeleting(false)
      alert('Something went wrong. Please contact support@xlay.me')
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>

      {/* Bitmoji 3D Pose Picker */}
      {avatarUrl && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Bitmoji Pose (3D)</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
              Choose full-body 3D or classic portrait for your card.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BITMOJI_POSES.map((pose) => {
              const previewSrc = getBitmojiPoseUrl(avatarUrl, pose.id) ?? avatarUrl
              const active = avatarPose === pose.id
              return (
                <button
                  key={pose.id}
                  type="button"
                  onClick={() => setAvatarPose(pose.id)}
                  className={`rounded-xl p-3 flex flex-col items-center gap-2 transition-all bg-white/5 ${
                    active
                      ? 'ring-2 ring-[var(--color-accent)] bg-[var(--color-accent)]/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewSrc}
                    alt={pose.label}
                    className={`h-20 w-20 ${pose.isFullBody ? 'object-contain' : 'rounded-full object-cover'}`}
                  />
                  <span className="text-xs font-medium text-[var(--color-text-primary)] text-center leading-tight">
                    {pose.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Profile */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Profile</h2>
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--color-text-secondary)]">Display name</label>
          <input
            type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={50}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-[var(--color-text-secondary)]">Bio</label>
          <textarea
            value={bio} onChange={e => setBio(e.target.value)} maxLength={160} rows={3}
            placeholder="A short bio (160 chars)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:border-[var(--color-accent)]/50 resize-none"
          />
        </div>

        {/* Privacy toggle */}
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm text-[var(--color-text-primary)]">Private card</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Only people with your direct link can see it</p>
          </div>
          <button
            role="switch" aria-checked={isPrivate} onClick={() => setIsPrivate(!isPrivate)}
            className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${isPrivate ? 'bg-[var(--color-accent)]' : 'bg-white/10'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </label>

        <button onClick={handleSave} disabled={isPending}
          className="btn-primary w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
          {saved ? '✓ Saved!' : isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {/* Data */}
      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">Your data</h2>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Download a copy of your Xlay data as JSON — your profile, links, best friends, and view stats.
        </p>
        <button onClick={handleExport}
          className="w-full border border-white/10 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-primary)] hover:bg-white/5 transition-colors">
          Download my data (JSON)
        </button>
      </div>

      {/* Delete account */}
      <div className="glass rounded-2xl p-5 space-y-4 border border-red-500/20">
        <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
          Permanently delete your Xlay account, card, links, and all data. This cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="w-full border border-red-500/40 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors">
            Delete account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-400">Are you sure? This deletes everything.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 border border-white/10 py-3 rounded-xl text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-500 py-3 rounded-xl text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                {deleting ? 'Deleting…' : 'Yes, delete everything'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
