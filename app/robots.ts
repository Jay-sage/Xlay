// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/onboarding', '/auth/', '/api/'],
      },
    ],
    sitemap: 'https://xlay.me/sitemap.xml',
  }
}
