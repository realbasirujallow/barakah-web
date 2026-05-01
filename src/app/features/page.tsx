import type { Metadata } from 'next';
import FeaturesPageClient from './FeaturesPageClient';

export const metadata: Metadata = {
  title: 'Features — Barakah Islamic Finance App',
  description:
    'Explore all Barakah features: multi-madhab zakat calculator, riba detector, halal stock screener, family budgeting, Barakah Score, wasiyyah planner, and more — built for Muslim households.',
  alternates: {
    canonical: 'https://trybarakah.com/features',
  },
  openGraph: {
    title: 'Features — Barakah Islamic Finance App',
    description:
      'Explore all Barakah features: multi-madhab zakat calculator, riba detector, halal stock screener, family budgeting, Barakah Score, wasiyyah planner, and more — built for Muslim households.',
    url: 'https://trybarakah.com/features',
    siteName: 'Barakah',
    images: [
      {
        url: 'https://trybarakah.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Barakah — Islamic Finance App',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Features — Barakah Islamic Finance App',
    description:
      'Explore all Barakah features: multi-madhab zakat calculator, riba detector, halal stock screener, family budgeting, Barakah Score, wasiyyah planner, and more — built for Muslim households.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

export default function FeaturesPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
      { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://trybarakah.com/features' },
    ],
  };
  return (
    <main className="min-h-screen px-4 py-20 max-w-5xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <FeaturesPageClient />
    </main>
  );
}
