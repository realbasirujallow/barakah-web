import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Islamic Finance App 2026 — Complete Guide & Comparison | Barakah',
  description:
    'Find the best Islamic finance app for 2026. Compare Barakah, Zoya, Wahed, and others across zakat, halal investing, budgeting, and Islamic will planning. Fiqh-aware reviews.',
  keywords: [
    'best islamic finance app',
    'best islamic finance app 2026',
    'islamic finance app',
    'halal finance app',
    'muslim finance app',
    'islamic money management app',
    'sharia compliant finance app',
    'zakat app',
    'halal investing app',
    'islamic budgeting software',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-finance-app' },
  openGraph: {
    title: 'Best Islamic Finance App 2026 — Complete Guide & Comparison',
    description:
      'The definitive guide to Islamic finance apps — zakat, halal investing, budgeting, and Islamic will planning. See how Barakah compares.',
    url: 'https://trybarakah.com/learn/islamic-finance-app',
    siteName: 'Barakah',
    type: 'article',
    images: [
      {
        url: 'https://trybarakah.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Best Islamic Finance App 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Islamic Finance App 2026 — Barakah',
    description:
      'The definitive guide to Islamic finance apps — zakat, halal investing, budgeting, and Islamic will.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Best Islamic Finance App 2026',
      item: 'https://trybarakah.com/learn/islamic-finance-app',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Islamic Finance App 2026 — Complete Guide & Comparison',
  description:
    'The definitive comparison of Islamic finance apps — covering zakat calculators, halal investing, budgeting, and Islamic will planning.',
  image: 'https://trybarakah.com/og-image.png',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: {
    '@type': 'Organization',
    name: 'Barakah',
    logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' },
  },
  datePublished: '2024-01-15',
  dateModified: '2026-04-15',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/islamic-finance-app' },
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
        text: 'Barakah is the most comprehensive Islamic finance app in 2026 for Muslim households. It combines zakat calculation, riba detection, halal stock screening, sadaqah tracking, Islamic will planning, and family budgeting — all built around fiqh principles. Zoya is the best dedicated halal stock screener. Wahed Invest is best for Sharia-compliant managed portfolios. For a complete household finance platform, Barakah is the top choice.',
      },
    },
    {
      '@type': 'Question',
      name: 'What features should the best Islamic finance app have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "A truly Islamic finance app must include: (1) Zakat calculator with multi-madhab support and live nisab prices; (2) Hawl anniversary tracking; (3) Riba detection and elimination tools; (4) Halal stock screener using AAOIFI Standard 21; (5) Sadaqah and waqf tracking; (6) Islamic will (wasiyyah) planner with faraid; (7) Family budgeting that respects Islamic household roles; (8) Halal investment categories. Apps that only do budgeting or only do investing are incomplete for a Muslim's full financial life.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a free Islamic finance app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Barakah offers a free plan with the core zakat calculator, hawl tracking, expense tracking, and sadaqah goals — no credit card required. Zoya also has a limited free tier for stock screening. Most other Islamic finance tools are paid-only.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Barakah and Zoya?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Zoya is a dedicated halal stock screener — it tells you whether a specific stock is halal or haram based on AAOIFI Standard 21 criteria. Barakah is a comprehensive Islamic household finance platform that includes a halal stock screener alongside zakat calculation, budgeting, riba detection, Islamic will planning, and sadaqah tracking. If you only want to screen stocks, Zoya is excellent. If you want your entire financial life to be fiqh-aware, Barakah is the better choice.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between Barakah and Wahed Invest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Wahed Invest is a Sharia-compliant robo-advisor — it manages your investment portfolio in halal ETFs and sukuk on your behalf. Barakah is not an investment manager; it is a finance management platform that helps you screen, track, and plan your investments alongside budgeting, zakat, and will planning. Many Muslims use both: Wahed to manage their halal portfolio, Barakah to track the full household financial picture.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does Barakah support multiple madhabs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Barakah supports zakat calculation according to all four major Sunni madhabs — Hanafi, Shafi\'i, Maliki, and Hanbali. Key differences include: Hanafi uses silver nisab (87.48g silver), which is typically lower; Shafi\'i/Maliki/Hanbali use gold nisab (85g gold) or silver, whichever is higher per your scholar. Barakah lets you select your madhab and calculates accordingly.',
      },
    },
  ],
};

const appCategories = [
  {
    category: 'Best Overall Islamic Finance App',
    winner: 'Barakah',
    reason: 'Only app that covers the full Islamic household finance lifecycle — zakat, budgeting, riba elimination, halal investing, and Islamic will.',
    icon: '🏆',
  },
  {
    category: 'Best Halal Stock Screener',
    winner: 'Zoya',
    reason: 'Dedicated stock-screening tool with a clean UI, AAOIFI Standard 21 compliance, and a large database. Barakah includes a screener too.',
    icon: '📊',
  },
  {
    category: 'Best Sharia-Compliant Investing',
    winner: 'Wahed Invest',
    reason: 'Regulated robo-advisor that manages halal ETF portfolios, sukuk, and gold. Best for hands-off Islamic investing.',
    icon: '💹',
  },
  {
    category: 'Best Free Zakat Calculator',
    winner: 'Barakah',
    reason: 'Multi-madhab zakat calculator with live gold and silver prices, hawl tracking, and category breakdowns — entirely free.',
    icon: '🧮',
  },
  {
    category: 'Best Islamic Budgeting App',
    winner: 'Barakah',
    reason: 'Purpose-built for Muslim household budgets with halal categories, riba alerts, family sharing, and Hajj savings goals.',
    icon: '📒',
  },
  {
    category: 'Best Islamic Will Planner',
    winner: 'Barakah',
    reason: 'Full wasiyyah builder with faraid inheritance calculator. The only consumer app covering Islamic estate planning end-to-end.',
    icon: '📜',
  },
];

const pillarsOfIslamicFinance = [
  {
    name: 'Prohibition of Riba',
    arabic: 'حرمة الربا',
    description:
      'Interest (riba) is strictly forbidden in Islam. Any predetermined increase on a loan or debt — whether simple or compound — is riba. This affects mortgages, credit cards, conventional savings accounts, and bonds.',
    quranRef: 'Quran 2:275 — "Allah has permitted trade and forbidden riba."',
  },
  {
    name: 'Prohibition of Gharar',
    arabic: 'حرمة الغرر',
    description:
      'Excessive uncertainty (gharar) in contracts is forbidden. This prohibits highly speculative instruments like certain derivatives, short-selling, and options. It is why conventional insurance needs an Islamic alternative (takaful).',
    quranRef: 'Derived from Hadith: "The Prophet ﷺ forbade transactions involving gharar." (Sahih Muslim 1513)',
  },
  {
    name: 'Prohibition of Maysir',
    arabic: 'حرمة الميسر',
    description:
      'Gambling (maysir) and games of chance are forbidden. This includes lottery tickets, speculative day trading for entertainment, and binary options.',
    quranRef: 'Quran 5:90 — "O you who believe, indeed, intoxicants, gambling... are an abomination from the work of Satan."',
  },
  {
    name: 'Obligation of Zakat',
    arabic: 'فريضة الزكاة',
    description:
      'Zakat is the third pillar of Islam — a mandatory annual charitable payment of 2.5% on wealth above nisab that has been held for one lunar year (hawl). It purifies your wealth and redistributes to the poor.',
    quranRef: 'Quran 2:43 — "And establish prayer and give zakat and bow with those who bow."',
  },
  {
    name: 'Ethical Investment',
    arabic: 'الاستثمار الأخلاقي',
    description:
      "Muslim investors cannot hold shares in businesses whose primary activity is haram — including alcohol, tobacco, pork, weapons, conventional banking, and adult entertainment. This is enforced through AAOIFI Standard 21's sector and financial ratio screens.",
    quranRef: 'General principle of avoiding that which Allah has made haram (Quran 2:188)',
  },
];

export default function IslamicFinanceAppPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Best Islamic Finance App 2026</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              ISLAMIC FINANCE GUIDE
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Best Islamic Finance App 2026 — Complete Guide & Comparison
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              The Muslim financial landscape now has dedicated apps for zakat, halal investing, Islamic budgeting, and estate planning. This guide ranks the best Islamic finance apps across every category and shows you exactly what to look for in a fiqh-aware platform.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Updated April 2026</span>
              <span>⏱ 15 min read</span>
              <span>✅ Reviewed for Islamic accuracy</span>
            </div>
          </header>

          {/* Quick Summary */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-12">
            <h2 className="text-lg font-bold text-green-900 mb-4">Best Islamic Finance Apps by Category (2026)</h2>
            <div className="space-y-3">
              {appCategories.map((cat) => (
                <div key={cat.category} className="flex items-start gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{cat.category}: </span>
                    <span className="text-green-700 font-bold">{cat.winner}</span>
                    <span className="text-gray-600 text-sm dark:text-gray-400"> — {cat.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Five Pillars of Islamic Finance */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">The 5 Pillars of Islamic Finance</h2>
            <p className="text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
              To evaluate any Islamic finance app, you must first understand the core principles it must respect. A truly Sharia-compliant platform enforces all five of these foundations — not just one or two.
            </p>
            <div className="space-y-6">
              {pillarsOfIslamicFinance.map((pillar, i) => (
                <div key={pillar.name} className="border border-gray-200 rounded-2xl p-6 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-green-700 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{pillar.name}</h3>
                        <span className="text-green-700 font-medium" dir="rtl">{pillar.arabic}</span>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-3 dark:text-gray-400">{pillar.description}</p>
                      <p className="text-sm italic text-green-800 bg-green-50 rounded-lg px-3 py-2">{pillar.quranRef}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Barakah Deep Dive */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Barakah — Best Overall Islamic Finance App 2026</h2>
            <p className="text-gray-600 mb-6 leading-relaxed dark:text-gray-400">
              Barakah is the only Islamic finance app that covers the complete Muslim household finance lifecycle. While competitors specialize in one area — Zoya for stock screening, Wahed for investing — Barakah integrates every domain of Islamic personal finance into a single, fiqh-aware platform.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                { title: 'Zakat Calculator', desc: 'Multi-madhab, live gold/silver prices, hawl tracking, 8 asset categories', badge: 'Free' },
                { title: 'Riba Detector', desc: 'Flags interest charges, calculates purification amounts, elimination roadmap', badge: 'Free' },
                { title: 'Halal Stock Screener', desc: '30,000+ stocks against AAOIFI Standard 21 business + financial ratios', badge: 'Plus' },
                { title: 'Sadaqah Tracker', desc: 'Goals, history, waqf contributions, year-end giving summary', badge: 'Free' },
                { title: 'Islamic Will Planner', desc: 'Full wasiyyah builder with faraid inheritance calculator', badge: 'Plus' },
                { title: 'Family Budgeting', desc: 'Shared household finance for up to 6 members with Islamic categories', badge: 'Plus' },
                { title: 'Barakah Score', desc: 'Islamic financial health metric (0–100) based on fiqh compliance', badge: 'Plus' },
                { title: 'Hajj Savings', desc: 'Goal-based savings tracker with monthly contribution calculator', badge: 'Free' },
              ].map((item) => (
                <div key={item.title} className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badge === 'Free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-800">Free</div>
                <div className="text-sm text-green-700">Core zakat + budgeting</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-800">$9.99/mo</div>
                <div className="text-sm text-green-700">Full platform — Plus plan</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-800">4.8★</div>
                <div className="text-sm text-green-700">App Store rating</div>
              </div>
            </div>
          </section>

          {/* Other Apps */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Other Islamic Finance Apps Worth Knowing</h2>
            <div className="space-y-5">
              {[
                {
                  name: 'Zoya',
                  type: 'Halal Stock Screener',
                  pros: ['Clean, intuitive interface', 'Accurate AAOIFI screening', 'Portfolio tracking'],
                  cons: ['Investing only — no budgeting, zakat, or will planning', 'Free tier is limited', 'No family sharing'],
                  verdict: 'Best for: Muslims who want a dedicated stock screener alongside Barakah.',
                },
                {
                  name: 'Wahed Invest',
                  type: 'Sharia-Compliant Robo-Advisor',
                  pros: ['Regulated, managed halal portfolios', 'Sukuk and gold exposure', 'Available globally'],
                  cons: ['Investment manager only — no budgeting, zakat, or planning', 'Management fees apply', 'Limited to their curated portfolios'],
                  verdict: 'Best for: Muslims who want hands-off Sharia-compliant portfolio management.',
                },
                {
                  name: 'Islamic Finance Guru (IFG)',
                  type: 'Education & Research Platform',
                  pros: ['Excellent educational content', 'Halal investment reviews', 'UK-focused guidance'],
                  cons: ['Not a finance app — primarily editorial', 'No transaction tracking or calculators', 'Subscription for premium research'],
                  verdict: 'Best for: Learning about Islamic finance. Not a replacement for an Islamic finance app.',
                },
              ].map((app) => (
                <div key={app.name} className="border border-gray-200 rounded-2xl p-6 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{app.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{app.type}</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">PROS</p>
                      <ul className="space-y-1">
                        {app.pros.map((p) => <li key={p} className="text-sm text-gray-600 flex gap-2 dark:text-gray-400"><span className="text-green-600">✓</span>{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-600 mb-1">CONS</p>
                      <ul className="space-y-1">
                        {app.cons.map((c) => <li key={c} className="text-sm text-gray-600 flex gap-2 dark:text-gray-400"><span className="text-red-400">✗</span>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-green-800 bg-green-50 rounded-lg px-3 py-2">{app.verdict}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Try the Best Islamic Finance App — Free</h2>
            <p className="text-green-100 mb-6">
              Start with our free zakat calculator, then unlock the full suite — halal screener, riba detector, family budgeting, and Islamic will planner.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800"
              >
                Create Free Account
              </Link>
              <Link
                href="/zakat-calculator"
                className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition"
              >
                Try Zakat Calculator
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'Complete 2026 guide — rules, calculation, who must pay.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'AAOIFI Standard 21 screening and Islamic investment types.' },
                { href: '/learn/islamic-budgeting-app', title: 'Islamic Budgeting App', desc: 'Best halal budgeting apps for Muslim households in 2026.' },
                { href: '/learn/mint-alternative-for-muslims', title: 'Mint Alternative for Muslims', desc: 'What to use after Mint shut down in January 2024.' },
                { href: '/learn/what-is-riba', title: 'What is Riba?', desc: "Understanding Islam's prohibition on interest." },
                { href: '/compare', title: 'Full App Comparison', desc: 'Barakah vs Zoya vs Wahed vs YNAB — feature breakdown.' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700"
                >
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Nisab →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
