import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trybarakah.com';

  // Only include public, indexable pages. Exclude auth pages (/login, /signup)
  // and protected dashboard pages — they redirect to login and shouldn't be indexed.
  return [
    // Homepage
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },

    // High-value SEO tools
    { url: `${baseUrl}/zakat-calculator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },

    // Learn hub + articles (primary SEO content)
    { url: `${baseUrl}/learn`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/learn/zakat-on-401k`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/halal-stocks`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/islamic-will`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-stocks`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-gold`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-retirement-accounts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-savings`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/nisab-threshold`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-al-fitr`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/islamic-finance-basics`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // Referral
    { url: `${baseUrl}/refer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Legal & info pages
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];
}
