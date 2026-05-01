import type { Metadata } from 'next';
import {
  DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL,
} from '../../lib/trial';
import ComparePageClient from './ComparePageClient';

export const metadata: Metadata = {
  title: 'Compare Islamic Finance Apps 2026 — Barakah vs Competitors | Barakah',
  description:
    'Compare Barakah with other Islamic finance and budgeting apps. Side-by-side feature comparison of zakat calculators, halal screeners, budgeting tools, and pricing for Muslim households.',
  keywords: [
    'best islamic finance app 2026',
    'compare islamic finance apps',
    'barakah vs other apps',
    'halal budgeting app comparison',
    'best muslim finance app',
    'islamic finance app review',
    'zakat app comparison',
    'halal investing app',
    'barakah app review',
    'mint alternative comparison',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare' },
  openGraph: {
    title: 'Compare Islamic Finance Apps 2026 — Find the Best Halal Finance App',
    description: 'Side-by-side comparison of Islamic finance apps. See which app has the best zakat calculator, halal stock screener, budgeting tools, and pricing.',
    url: 'https://trybarakah.com/compare',
    siteName: 'Barakah',
    type: 'website',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630, alt: 'Compare Islamic Finance Apps — Barakah' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Islamic Finance Apps 2026',
    description: 'Side-by-side: Barakah vs every other Islamic finance and budgeting app. Features, pricing, and halal compliance.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const compareSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Compare Islamic Finance Apps 2026',
  description: 'Side-by-side comparison of Islamic finance apps for Muslim households in 2026.',
  url: 'https://trybarakah.com/compare',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
      { '@type': 'ListItem', position: 2, name: 'Compare Apps', item: 'https://trybarakah.com/compare' },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the best Islamic finance app in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah is the most complete Islamic finance app in 2026. It combines a free multi-madhab zakat calculator, halal stock screener (30,000+ stocks), riba detection, Islamic will planner, family budgeting, and Barakah Score in one fiqh-aware platform. It\'s free to start with no credit card or debit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free Islamic finance app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes — Barakah has a permanent free plan that includes the full zakat calculator, manual transaction tracking (up to 10/month), hawl tracker, and basic budgeting. The Plus plan ($9.99/month) adds unlimited transactions, bank sync, halal stock screener, savings goals, Faraid calculator, and Barakah Score. Both include a ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} free trial of Plus.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What Islamic finance apps have a halal stock screener?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Very few apps include a halal stock screener. Barakah screens 30,000+ stocks against AAOIFI Standard 21. Zoya and SalaamInvest also offer halal screening but are focused only on investing — they don\'t include zakat calculation, budgeting, or estate planning features.',
      },
    },
  ],
};

const apps = [
  {
    name: 'Barakah',
    emoji: '🌙',
    tagline: 'All-in-one Islamic household finance',
    price: 'Free / $9.99 mo',
    highlight: true,
    features: {
      'Free tier': '✅ Always free',
      'Zakat calculator': '✅ Multi-madhab',
      'Hawl tracker': '✅',
      'Live nisab prices': '✅',
      'Halal stock screener': '✅ 30,000+ stocks',
      'Riba detection': '✅ Automatic',
      'Bank sync': '✅ Plaid',
      'Islamic will planner': '✅ Wasiyyah',
      'Faraid calculator': '✅',
      'Family finance (6 members)': '✅',
      'Sadaqah/Waqf tracker': '✅',
      'Hajj savings goal': '✅',
      'Barakah Score': '✅',
      'iOS & Android app': '✅',
      'No data selling': '✅',
    },
  },
  {
    name: 'Zoya',
    emoji: '📊',
    tagline: 'Halal investing focused',
    price: 'Free / $9.99 mo',
    highlight: false,
    features: {
      'Free tier': '✅',
      'Zakat calculator': '❌',
      'Hawl tracker': '❌',
      'Live nisab prices': '❌',
      'Halal stock screener': '✅',
      'Riba detection': '❌',
      'Bank sync': '❌',
      'Islamic will planner': '❌',
      'Faraid calculator': '❌',
      'Family finance (6 members)': '❌',
      'Sadaqah/Waqf tracker': '❌',
      'Hajj savings goal': '❌',
      'Barakah Score': '❌',
      'iOS & Android app': '✅',
      'No data selling': 'Unknown',
    },
  },
  {
    name: 'Islamic Finance Guru',
    emoji: '📚',
    tagline: 'Education & resources',
    price: 'Free (ads)',
    highlight: false,
    features: {
      'Free tier': '✅',
      'Zakat calculator': '⚠️ Basic',
      'Hawl tracker': '❌',
      'Live nisab prices': '⚠️ Static',
      'Halal stock screener': '❌',
      'Riba detection': '❌',
      'Bank sync': '❌',
      'Islamic will planner': '❌',
      'Faraid calculator': '❌',
      'Family finance (6 members)': '❌',
      'Sadaqah/Waqf tracker': '❌',
      'Hajj savings goal': '❌',
      'Barakah Score': '❌',
      'iOS & Android app': '⚠️ Web only',
      'No data selling': '❌ Ad-supported',
    },
  },
  {
    name: 'Wahed Invest',
    emoji: '💰',
    tagline: 'Halal robo-advisor',
    price: '0.49% / yr',
    highlight: false,
    features: {
      'Free tier': '❌',
      'Zakat calculator': '⚠️ Basic',
      'Hawl tracker': '❌',
      'Live nisab prices': '❌',
      'Halal stock screener': '⚠️ Portfolio only',
      'Riba detection': '❌',
      'Bank sync': '❌ Deposits only',
      'Islamic will planner': '❌',
      'Faraid calculator': '❌',
      'Family finance (6 members)': '❌',
      'Sadaqah/Waqf tracker': '⚠️ Partial',
      'Hajj savings goal': '⚠️ Partial',
      'Barakah Score': '❌',
      'iOS & Android app': '✅',
      'No data selling': 'Unknown',
    },
  },
  {
    name: 'YNAB',
    emoji: '💵',
    tagline: 'General budgeting app',
    price: '$109 / yr',
    highlight: false,
    features: {
      'Free tier': '❌',
      'Zakat calculator': '❌',
      'Hawl tracker': '❌',
      'Live nisab prices': '❌',
      'Halal stock screener': '❌',
      'Riba detection': '❌',
      'Bank sync': '✅',
      'Islamic will planner': '❌',
      'Faraid calculator': '❌',
      'Family finance (6 members)': '✅ Extra cost',
      'Sadaqah/Waqf tracker': '❌',
      'Hajj savings goal': '❌',
      'Barakah Score': '❌',
      'iOS & Android app': '✅',
      'No data selling': '✅',
    },
  },
];

const allFeatures = Object.keys(apps[0].features);

export default function ComparePage() {
  const reviews = [
    {
      name: 'Barakah', emoji: '🌙', verdict: '⭐⭐⭐⭐⭐ Best overall for Muslim households',
      pros: ['Only app combining zakat, halal investing, budgeting, estate planning', 'Multi-madhab fiqh support (Hanafi, Shafi\'i, Maliki, Hanbali)', 'Live nisab prices with hawl tracking', 'Family plan for up to 6 members', 'No data selling — ever', 'Free tier available forever'],
      cons: ['Bank sync is Plus-tier only', 'Newer app than YNAB/Mint (less community content)'],
      link: '/signup',
      cta: 'Try Barakah Free',
    },
    {
      name: 'Zoya', emoji: '📊', verdict: '⭐⭐⭐⭐ Great for halal investing only',
      pros: ['Good halal stock screener', 'Clean interface', 'Stocks and ETF coverage'],
      cons: ['No zakat calculator', 'No budgeting or bank sync', 'No household or estate features', 'Not a complete finance solution'],
      link: null, cta: null,
    },
    {
      name: 'YNAB', emoji: '💵', verdict: '⭐⭐⭐ Good budgeting, zero Islamic features',
      pros: ['Excellent zero-based budgeting system', 'Good bank sync', 'Large community and tutorials'],
      cons: ['$109/year with no free tier', 'Zero Islamic finance features', 'No zakat, halal screening, riba detection, or estate planning', 'Not built for Muslim households'],
      link: null, cta: null,
    },
    {
      name: 'Wahed Invest', emoji: '💰', verdict: '⭐⭐⭐ Good robo-advisor, limited features',
      pros: ['Shariah-screened investment portfolios', 'Regulated and reputable', 'Simple to invest'],
      cons: ['Not a full finance app — investing only', 'No budgeting, bank sync, or zakat', 'Fees on invested assets', 'Can\'t see your full financial picture'],
      link: null, cta: null,
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ComparePageClient
        apps={apps.map((app) => ({ ...app, features: app.features as Record<string, string> }))}
        faqs={faqSchema.mainEntity.map((faq) => ({
          name: faq.name,
          acceptedAnswer: { text: faq.acceptedAnswer.text },
        }))}
        reviews={reviews}
        allFeatures={[...allFeatures]}
      />
    </>
  );
}
