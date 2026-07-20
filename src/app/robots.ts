import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Let crawlers fetch /dashboard/* so proxy.ts can return the
        // authoritative 403 + X-Robots-Tag: noindex response. Blocking it
        // here leaves Google with "blocked by robots.txt" rows it cannot
        // recrawl to deindex.
        disallow: ['/admin/', '/api/', '/auth/'],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://trybarakah.com'}/sitemap.xml`,
  };
}
