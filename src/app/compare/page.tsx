import type { Metadata } from 'next';
import Link from 'next/link';

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
        text: 'Barakah is the most comprehensive Islamic finance app in 2026. It combines a free multi-madhab zakat calculator, halal stock screener (30,000+ stocks), riba detection, Islamic will planner, family budgeting, and Barakah Score in one fiqh-aware platform. It\'s free to start with no credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free Islamic finance app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Barakah has a permanent free plan that includes the full zakat calculator, manual transaction tracking, hawl tracker, savings goals, and basic budgeting. The Plus plan ($9.99/month) adds bank sync, halal stock screener, Faraid calculator, and Barakah Score. Both include a 7-day free trial of Plus.',
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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-white">

        <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Start Free — No Card
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-12">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <span>Compare Apps</span>
          </nav>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
              Updated April 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
              Best Islamic Finance Apps 2026 — Side-by-Side Comparison
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comparing every major Islamic finance app feature-by-feature. See which app has what Muslim households actually need: zakat, halal screening, riba detection, estate planning, and budgeting.
            </p>
          </div>

          {/* Winner callout */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10 text-center">
            <p className="text-2xl font-bold mb-1">🌙 Barakah wins on Islamic finance features</p>
            <p className="text-green-200 mb-4">The only app with zakat calculator + halal screener + riba detector + Islamic will + family finance — all in one platform, free to start.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition">
              Start 7-Day Free Trial — No Card
            </Link>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 mb-12">
            <table className="w-full text-sm min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-5 py-4 text-gray-500 font-semibold w-44">Feature</th>
                  {apps.map((app) => (
                    <th key={app.name} className={`px-4 py-4 text-center ${app.highlight ? 'bg-[#1B5E20] text-white rounded-t-xl' : 'text-gray-700'}`}>
                      <p className="text-xl mb-0.5">{app.emoji}</p>
                      <p className="font-bold">{app.name}</p>
                      <p className={`text-xs mt-0.5 ${app.highlight ? 'text-green-300' : 'text-gray-400'}`}>{app.price}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-5 py-3 font-medium text-gray-700 border-r border-gray-100">{feature}</td>
                    {apps.map((app) => (
                      <td key={app.name} className={`px-4 py-3 text-center text-sm ${app.highlight ? 'bg-green-50 font-medium text-[#1B5E20]' : 'text-gray-600'}`}>
                        {(app.features as Record<string, string>)[feature] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Individual app sections */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed App Reviews</h2>
          <div className="space-y-6 mb-12">
            {[
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
            ].map((app) => (
              <div key={app.name} className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{app.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500">{app.verdict}</p>
                    </div>
                  </div>
                  {app.link && (
                    <Link href={app.link} className="shrink-0 bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E7D32] transition">
                      {app.cta}
                    </Link>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pros</p>
                    <ul className="space-y-1.5">
                      {app.pros.map((p) => (
                        <li key={p} className="flex gap-2 text-sm text-gray-700"><span className="text-green-500 shrink-0">✓</span>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cons</p>
                    <ul className="space-y-1.5">
                      {app.cons.map((c) => (
                        <li key={c} className="flex gap-2 text-sm text-gray-700"><span className="text-red-400 shrink-0">✗</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5 mb-12">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-[#FFF8E1] border-2 border-[#1B5E20] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">Start with the best — for free</h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">Barakah is the only Islamic finance app that covers your entire financial life as a Muslim. Start free, no credit card. 7 days of Plus included.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition">
                Start Free — 7 Days Plus
              </Link>
              <Link href="/pricing" className="border border-[#1B5E20] text-[#1B5E20] px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition">
                See Pricing
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
