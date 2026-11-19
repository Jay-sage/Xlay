// app/dashboard/page.tsx - Card Preview (main dashboard view)
import { createServerClient } from '@/lib/supabase/server'
import CardPreview from './CardPreview'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', user!.id)
    .eq('is_active', true)
    .order('sort_order')

  const { data: friends } = await supabase
    .from('best_friend_invites')
    .select(`
      id,
      friend_profile_id,
      profiles!friend_profile_id (
        display_name,
        avatar_url,
        username
      )
    `)
    .eq('owner_id', user!.id)
    .eq('status', 'accepted')

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
          Card Preview
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          This is how your card looks to visitors.{' '}
          <a
            href={`/${profile?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] underline"
          >
            View live →
          </a>
        </p>
      </div>

      <CardPreview
        profile={profile}
        links={links ?? []}
        friends={
          (friends ?? []).map((f) => ({
            id: f.id,
            friend_profile_id: f.friend_profile_id,
            profiles: Array.isArray(f.profiles) ? f.profiles[0] ?? null : f.profiles,
          }))
        }
      />
    </div>
  )
}
