import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Halal Stock Screener 2026 — Screen 30,000+ Stocks for Islamic Compliance | Barakah',
  description:
    'Screen stocks for halal compliance using AAOIFI Standard 21 criteria. Understand business screening, financial ratio tests, and how to purify haram income — with Barakah\'s free halal stock screener.',
  keywords: [
    'halal stock screener',
    'halal stock screener free',
    'sharia compliant stocks',
    'halal stocks',
    'aaoifi standard 21',
    'is a stock halal',
    'how to screen halal stocks',
    'islamic stock screener',
    'halal investing stocks',
    'shariah stock screening',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-stock-screener' },
  openGraph: {
    title: 'Halal Stock Screener 2026 — How to Screen 30,000+ Stocks for Islamic Compliance',
    description: 'Screen stocks for halal compliance using AAOIFI Standard 21. Business screen, financial ratios, purification of haram income — complete guide.',
    url: 'https://trybarakah.com/learn/halal-stock-screener',
    siteName: 'Barakah',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Halal Stock Screener', item: 'https://trybarakah.com/learn/halal-stock-screener' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Stock Screener 2026 — Screen 30,000+ Stocks for Islamic Compliance',
  description: 'A comprehensive guide to halal stock screening using AAOIFI Standard 21 — business screen, financial ratio tests, and income purification.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-03-15',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/halal-stock-screener' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does a halal stock screener work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A halal stock screener checks companies against AAOIFI Standard 21 criteria in two stages: (1) Business Screen — checks whether the company\'s primary business is in a halal sector. If the company\'s core business is alcohol, tobacco, pork, weapons, gambling, or conventional finance, it fails immediately. (2) Financial Ratio Screen — checks whether the company\'s financial structure (debt, interest income, liquid assets) stays within permissible thresholds even for mostly-halal businesses. Barakah screens 30,000+ stocks against both criteria with updated data.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it haram to invest in stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Investing in stocks is not inherently haram in Islam. The Accounting and Auditing Organisation for Islamic Financial Institutions (AAOIFI) and most contemporary Islamic finance scholars permit stock ownership in companies whose primary business is halal. The key conditions are: the company\'s business must be permissible, you must not derive benefit from haram portions, and you must purify any small haram income portions by donating them to charity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the AAOIFI financial ratio screens for halal stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AAOIFI Standard 21 sets three financial ratio limits: (1) Debt ratio — total interest-bearing debt must be less than 30% of the company\'s total market capitalization or assets; (2) Interest income ratio — income from interest and impermissible sources must be less than 5% of total revenue; (3) Liquid assets ratio — accounts receivable and liquid assets must be less than 67% of total assets (to ensure the stock is not just trading in money/debt). If all three ratios pass, the stock is considered Sharia-compliant from a financial structure standpoint.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is income purification (tathir) for halal stocks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Even Sharia-compliant companies may have a small percentage of haram income (e.g., interest earned on cash reserves). Income purification (tathir) means calculating what percentage of the dividend or profit came from haram sources, and donating that percentage to charity. For example: if a company earns 2% of revenue from interest income and you receive $500 in dividends, you would donate $10 (2% of $500) to charity. Barakah calculates your purification amount automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Apple stock halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apple (AAPL) passes the business screen — it is primarily a technology and consumer electronics company with no haram primary business. It must then pass the financial ratio tests: check its interest-bearing debt ratio, interest income ratio, and liquid assets ratio. These ratios change quarterly as Apple\'s financials update. Use Barakah\'s live halal stock screener for the current status — most analysis services rate AAPL as Sharia-compliant subject to quarterly purification on interest income.',
      },
    },
  ],
};

const haramSectors = [
  { sector: 'Conventional Banking & Finance', examples: 'JPMorgan, Bank of America, Goldman Sachs', reason: 'Primary business is riba (interest)' },
  { sector: 'Alcohol', examples: 'Anheuser-Busch InBev, Diageo, Molson Coors', reason: 'Producing, distributing, or selling alcohol' },
  { sector: 'Tobacco', examples: 'Philip Morris, Altria, British American Tobacco', reason: 'Producing tobacco products' },
  { sector: 'Pork / Non-Halal Meat', examples: 'Smithfield Foods, Hormel', reason: 'Primary business is pork products' },
  { sector: 'Gambling & Casinos', examples: 'MGM Resorts, DraftKings, Las Vegas Sands', reason: 'Maysir (gambling) is prohibited' },
  { sector: 'Weapons (Offensive)', examples: 'Raytheon, Northrop Grumman', reason: 'Controversial weapons — scholarly disagreement' },
  { sector: 'Adult Entertainment', examples: 'Various entertainment companies', reason: 'Immoral content' },
  { sector: 'Conventional Insurance', examples: 'AIG, MetLife', reason: 'Contains elements of riba and gharar — takaful is the halal alternative' },
];

export default function HalalStockScreenerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Halal Stock Screener</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">HALAL INVESTING</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Halal Stock Screener 2026 — Screen 30,000+ Stocks for Islamic Compliance
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              Screening stocks for halal compliance means checking both the company&apos;s business activities and its financial ratios against AAOIFI Standard 21. This guide explains exactly how the screen works and how to use Barakah&apos;s free halal stock screener.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Updated April 2026</span>
              <span>⏱ 10 min read</span>
              <span>✅ Based on AAOIFI Standard 21</span>
            </div>
          </header>

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-white">
              <p className="font-bold">Screen any stock for halal compliance — free with Barakah</p>
              <p className="text-green-100 text-sm">30,000+ stocks screened against AAOIFI Standard 21 with live financial data.</p>
            </div>
            <Link href="/signup" className="flex-shrink-0 bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition whitespace-nowrap dark:bg-gray-800">
              Try Screener Free →
            </Link>
          </div>

          {/* AAOIFI Standard 21 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">AAOIFI Standard 21: The Global Halal Stock Framework</h2>
            <p className="text-gray-600 mb-6 leading-relaxed dark:text-gray-400">
              AAOIFI (Accounting and Auditing Organisation for Islamic Financial Institutions) Standard 21 is the most widely accepted framework for determining whether a publicly traded stock is Sharia-compliant. It is used by Dow Jones Islamic Market, MSCI Islamic indexes, Barakah, Zoya, and most Islamic finance institutions globally.
            </p>

            <h3 className="font-bold text-gray-900 mb-4 dark:text-gray-100">Stage 1: Business Screen</h3>
            <div className="bg-red-50 rounded-2xl p-5 mb-6">
              <p className="font-semibold text-red-800 mb-3">❌ Immediately Haram — Fail on Primary Business Activity</p>
              <p className="text-sm text-red-700 mb-4">If a company&apos;s primary revenue comes from any of these activities, it is haram regardless of financial ratios:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="text-left p-2 font-semibold text-red-800">Sector</th>
                      <th className="text-left p-2 font-semibold text-red-800">Example Companies</th>
                      <th className="text-left p-2 font-semibold text-red-800">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {haramSectors.map((s, i) => (
                      <tr key={s.sector} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                        <td className="p-2 font-medium text-gray-800 dark:text-gray-100">{s.sector}</td>
                        <td className="p-2 text-gray-600 dark:text-gray-400">{s.examples}</td>
                        <td className="p-2 text-red-700">{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 dark:text-gray-100">Stage 2: Financial Ratio Screen</h3>
            <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
              Even companies with a halal primary business may have problematic financial structures. AAOIFI Standard 21 applies three financial tests:
            </p>
            <div className="space-y-4">
              {[
                {
                  test: 'Debt Ratio Test',
                  limit: '< 30%',
                  formula: 'Interest-Bearing Debt ÷ Market Capitalization (or Total Assets)',
                  purpose: 'Ensures the company is not heavily leveraged with interest-bearing loans (riba debt)',
                },
                {
                  test: 'Interest Income Test',
                  limit: '< 5%',
                  formula: '(Interest Income + Haram Revenue) ÷ Total Revenue',
                  purpose: 'Ensures haram income is less than 5% of total revenue — any more and the business becomes predominantly haram',
                },
                {
                  test: 'Liquid Assets Test',
                  limit: '< 67%',
                  formula: '(Cash + Receivables) ÷ Total Assets',
                  purpose: "Ensures the stock represents real business assets, not just money trading (which would require special Islamic rules for exchange)",
                },
              ].map((test) => (
                <div key={test.test} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">{test.test}</h4>
                    <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full flex-shrink-0 ml-2">Must be {test.limit}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 rounded px-2 py-1 dark:bg-gray-800 dark:text-gray-400">{test.formula}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{test.purpose}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Income Purification */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Income Purification (Tathir)</h2>
            <p className="text-gray-600 mb-4 leading-relaxed dark:text-gray-400">
              When you receive dividends or sell a halal stock at a profit, you must purify any small portion of haram income the company earned. This is called <strong>tathir</strong> (تطهير) — purification.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
              <p className="font-semibold text-amber-900 mb-2">Purification Formula</p>
              <p className="font-mono text-sm text-amber-800 mb-3">Dividend × (Haram Income %) = Amount to Donate</p>
              <p className="text-sm text-amber-700">Example: You receive $500 in dividends. The company earned 1.8% of revenue from interest income. You donate $500 × 1.8% = $9.00 to charity.</p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Barakah calculates your purification amount automatically for every halal stock in your portfolio, showing you exactly how much to donate each year.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Screen Stocks for Free — Barakah Halal Screener</h2>
            <p className="text-green-100 mb-6">30,000+ stocks. AAOIFI Standard 21. Automatic purification calculation. Available with Barakah Plus.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">{`Start ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} Free Trial`}</Link>
              <Link href="/learn/halal-investing-guide" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">Halal Investing Guide</Link>
            </div>
          </div>

          {/* Related */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/halal-stocks', title: 'Halal Stocks Guide', desc: 'Which stocks are halal and how to build a halal portfolio.' },
                { href: '/learn/halal-investing-guide', title: 'Halal Investing Guide', desc: 'Complete guide to investing according to Islamic finance.' },
                { href: '/learn/zakat-on-stocks', title: 'Zakat on Stocks', desc: 'How to calculate zakat on your stock portfolio.' },
                { href: '/learn/zakat-on-stocks-and-etfs', title: 'Zakat on ETFs', desc: 'Calculating zakat on ETFs and index funds.' },
                { href: '/compare', title: 'Compare Islamic Apps', desc: 'Barakah vs Zoya vs Wahed — which is best for halal investing?' },
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting', desc: 'Budget the Islamic way — zakat first, riba-free accounts.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700">
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
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/sukuk" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sukuk →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
