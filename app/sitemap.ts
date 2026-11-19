// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const revalidate = 3600 // Regenerate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://xlay.me'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const admin = createAdminClient()
    const { data: profiles } = await admin
      .from('profiles')
      .select('username, updated_at')
      .not('username', 'is', null)
      .eq('is_private', false)

    const profileRoutes: MetadataRoute.Sitemap = (profiles ?? []).map(p => ({
      url: `${base}/${p.username}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    return [...staticRoutes, ...profileRoutes]
  } catch {
    return staticRoutes
  }
}
