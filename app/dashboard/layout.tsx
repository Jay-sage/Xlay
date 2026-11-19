// app/dashboard/layout.tsx
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from './DashboardNav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard — Xlay',
  robots: { index: false },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url')
    .eq('id', user.id)
    .single()

  // If no username yet, send to onboarding
  if (!profile?.username) redirect('/onboarding')

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <DashboardNav profile={profile} />
      <main className="flex-1 md:ml-64 pb-24 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
