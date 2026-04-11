import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://trybarakah.com';

  // Only include public, indexable pages. Exclude auth pages (/login, /signup)
  // and protected dashboard pages — they redirect to login and shouldn't be indexed.
  return [
    // Homepage
    { url: baseUrl, changeFrequency: 'weekly', priority: 1.0 },

    // High-value SEO tools
    { url: `${baseUrl}/zakat-calculator`, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/faraid-calculator`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'monthly', priority: 0.9 },

    // Learn hub + articles (primary SEO content)
    { url: `${baseUrl}/learn`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/learn/zakat-on-401k`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/halal-stocks`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/islamic-will`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-stocks`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-gold`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-retirement-accounts`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-on-savings`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/nisab-threshold`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/zakat-al-fitr`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/islamic-finance-basics`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/learn/riba-elimination`, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/learn/madhab-finance`, changeFrequency: 'monthly', priority: 0.85 },

    // Referral
    { url: `${baseUrl}/refer`, changeFrequency: 'monthly', priority: 0.7 },

    // Legal & info pages
    { url: `${baseUrl}/methodology`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/trust`, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
