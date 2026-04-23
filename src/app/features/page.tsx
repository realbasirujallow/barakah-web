import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL } from '../../lib/trial';

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

const featureList = [
  {
    icon: '💰',
    title: 'Zakat Calculator',
    desc: "Multi-madhab nisab (gold or silver standard), live prices, Hawl tracker, and auto-categorized asset breakdown — supporting Hanafi, Shafi'i, Maliki, Hanbali, and AMJA methodologies.",
  },
  {
    icon: '🛡️',
    title: 'Riba Detector',
    desc: 'Scan transactions to flag interest-bearing activity and stay halal-compliant with automatic alerts.',
  },
  {
    icon: '✅',
    title: 'Halal Stock Screener',
    desc: '30,000+ stocks screened using criteria based on AAOIFI Standard 21 — filter by halal or haram with sector breakdown.',
  },
  {
    icon: '📊',
    title: 'Budgets & Analytics',
    desc: 'Track spending by category and see where every dollar goes with visualized insights and trends.',
  },
  {
    icon: '💎',
    title: 'Net Worth Tracker',
    desc: 'Real-time net worth with assets, debts, and investments in one comprehensive dashboard.',
  },
  {
    icon: '🤲',
    title: 'Sadaqah & Waqf',
    desc: 'Log charitable giving and endowments alongside everyday finances with dedicated impact tracking.',
  },
  {
    icon: '📜',
    title: 'Wasiyyah & Estate Obligations',
    desc: 'Record your Islamic will, beneficiaries, and outstanding obligations (Zakat, Kaffarah, loans) for family.',
  },
  {
    icon: '🎯',
    title: 'Savings Goals',
    desc: 'Set goals for Hajj, emergency funds, or any milestone — with automatic Hajj savings template.',
  },
  {
    icon: '⭐',
    title: 'Barakah Score',
    desc: 'Your Islamic financial health score (0–100) across Zakat, Riba-free living, Sadaqah, Hawl, and debt.',
  },
  {
    icon: '👥',
    title: 'Shared Family Finances',
    desc: 'Family plan lets up to 6 members track shared expenses, group transactions, and family Zakat.',
  },
];

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
      <h1 className="text-4xl font-bold text-center mb-4">
        Everything You Need for Halal Finances
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
        Barakah brings together every Islamic finance tool a Muslim household
        needs — from zakat to estate planning — in one fiqh-aware platform.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featureList.map((f) => (
          <li
            key={f.title}
            className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
          >
            <span className="text-3xl mb-3 block">{f.icon}</span>
            <h2 className="font-semibold text-lg mb-2">{f.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
          </li>
        ))}
      </ul>
      <div className="text-center">
        <Link
          href="/signup"
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {`Start ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} Free Trial`}
        </Link>
      </div>
    </main>
  );
}
