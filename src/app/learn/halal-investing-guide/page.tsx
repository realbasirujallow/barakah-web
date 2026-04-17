import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Investing Guide 2026 — How to Invest According to Islamic Finance | Barakah',
  description:
    'Complete halal investing guide 2026: what makes an investment haram or halal, AAOIFI standards, how to screen stocks, halal ETFs, Islamic bonds (sukuk), and the best halal investing apps.',
  keywords: [
    'halal investing',
    'halal investment guide',
    'islamic investing 2026',
    'sharia compliant investing',
    'halal stocks',
    'halal etf',
    'islamic finance investing',
    'how to invest halal',
    'riba free investing',
    'aaoifi standard 21',
    'halal stock screener',
    'sukuk',
    'islamic bonds',
    'halal portfolio',
    'shariah compliant stocks',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-investing-guide' },
  openGraph: {
    title: 'Halal Investing Guide 2026 — Islamic Investment Principles & Best Apps',
    description: 'Everything Muslims need to invest halal: AAOIFI standards, stock screening, halal ETFs, what makes investments haram, and free tools to screen your portfolio.',
    url: 'https://trybarakah.com/learn/halal-investing-guide',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Halal Investing Guide 2026 — How to Invest as a Muslim',
    description: 'What makes investments halal or haram, AAOIFI screening criteria, halal ETFs, and the free tools to screen your portfolio.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Halal Investing Guide 2026', item: 'https://trybarakah.com/learn/halal-investing-guide' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Investing Guide 2026 — How to Invest According to Islamic Finance',
  description: 'Complete halal investing guide: what makes investments haram, AAOIFI standards, how to screen stocks, halal ETFs, Islamic sukuk, and the best free tools.',
  url: 'https://trybarakah.com/learn/halal-investing-guide',
  datePublished: '2024-03-01',
  dateModified: '2026-04-15',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What makes an investment halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An investment is halal if it avoids riba (interest), gharar (excessive uncertainty), maysir (gambling), and haram industries. The company must derive less than 5% of its revenue from prohibited activities (alcohol, tobacco, pork, weapons, pornography, conventional banking). Financial ratios must also pass screening: debt-to-assets under 33%, interest-bearing securities under 33%, and cash/receivables under 33% of total assets.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are haram investments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Haram investments include: conventional bank stocks (profit from interest), alcohol companies, tobacco companies, gambling/casino operators, pork producers, weapons manufacturers, pornography companies, and any company where more than 5% of revenue comes from prohibited activities. Conventional bonds are haram due to fixed interest. Leveraged instruments with riba are also prohibited.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are S&P 500 index funds halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard S&P 500 index funds are generally NOT halal because they include banks, financial companies that earn riba, alcohol companies, and other prohibited businesses. However, there are Shariah-compliant alternatives like the Wahed FTSE USA Shariah ETF (HLAL) and the SP Funds S&P 500 Sharia Industry Exclusions ETF (SPUS) that screen out haram companies. Screen individual stocks using Barakah\'s halal screener.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is AAOIFI Standard 21 for halal stock screening?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) Standard 21 provides the most widely accepted criteria for halal stock screening. It requires: (1) less than 5% revenue from prohibited activities, (2) total debt ÷ total assets < 33%, (3) interest-bearing investments ÷ total assets < 33%, (4) total cash and receivables ÷ total assets < 33%. Barakah screens 30,000+ stocks against these criteria.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is cryptocurrency halal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most contemporary Islamic scholars treat major cryptocurrencies like Bitcoin as permissible (halal) because they function as commodities. However, there is ongoing scholarly debate. Key concerns include: excessive speculation (maysir), uncertain value (gharar), and no underlying asset. Most scholars agree that cryptocurrency can be owned and traded but should not constitute an excessive portion of one\'s wealth. For zakat purposes, crypto is treated as a zakatable asset at market value on your hawl anniversary.',
      },
    },
  ],
};

const haramSectors = [
  { emoji: '🍺', name: 'Alcohol', desc: 'Brewing, distilling, wine, beer, spirits production and distribution' },
  { emoji: '🎰', name: 'Gambling', desc: 'Casinos, sports betting, lottery, online gambling platforms' },
  { emoji: '🐷', name: 'Pork', desc: 'Pork processing, swine farming, non-halal meat production' },
  { emoji: '🏦', name: 'Conventional Banking', desc: 'Banks earning primarily from interest (riba) — loans, mortgages, bonds' },
  { emoji: '🚬', name: 'Tobacco', desc: 'Cigarette manufacturing, smokeless tobacco, e-cigarettes' },
  { emoji: '🔞', name: 'Adult content', desc: 'Pornography platforms, adult entertainment companies' },
  { emoji: '🔫', name: 'Weapons', desc: 'Civilian weapons manufacturers (military/defense varies by scholar)' },
  { emoji: '💊', name: 'Drugs (non-medicinal)', desc: 'Recreational cannabis in prohibited jurisdictions, illicit substances' },
];

export default function HalalInvestingGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Screen My Portfolio Free →
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Halal Investing Guide 2026</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Updated April 2026 · 12 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Halal Investing Guide 2026 — How to Invest According to Islamic Finance Principles
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Investing is not only permitted in Islam — it is encouraged as a way to grow and protect your wealth. But not all investments are equal under Islamic law. This complete guide explains what makes an investment halal or haram, the AAOIFI screening criteria, and how to build a Shariah-compliant portfolio in 2026.
          </p>

          {/* Screener CTA */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">✅ Screen 30,000+ Stocks for Free</p>
            <p className="text-green-200 text-sm mb-4">Barakah&apos;s halal stock screener checks every stock against AAOIFI Standard 21. Know in seconds if your investments are halal.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Start Free Account →
            </Link>
          </div>

          {/* Islamic Investing Principles */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Core Principles of Islamic Investing</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Islamic finance is governed by Shariah (Islamic law). For investments, four major prohibitions apply:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { title: 'No Riba (Interest)', desc: 'Earning or paying a fixed return on money is prohibited. This rules out conventional bonds, savings accounts, and stocks of interest-based banks.' },
              { title: 'No Gharar (Excessive Uncertainty)', desc: 'Contracts with excessive ambiguity or risk are forbidden. Highly speculative derivatives and uncertain instruments may fall here.' },
              { title: 'No Maysir (Gambling)', desc: 'Zero-sum wealth transfers based on chance are prohibited. Pure speculation without underlying value is haram.' },
              { title: 'No Haram Industries', desc: 'Investing in companies whose primary business is prohibited under Islamic law — alcohol, pork, gambling, pornography, etc.' },
            ].map((p) => (
              <div key={p.title} className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
                <p className="font-bold text-[#1B5E20] mb-2">{p.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Haram Sectors */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Haram Industries to Avoid</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {haramSectors.map((s) => (
              <div key={s.name} className="flex gap-3 p-4 border border-red-100 rounded-xl bg-red-50">
                <span className="text-2xl shrink-0">{s.emoji}</span>
                <div>
                  <p className="font-semibold text-red-800">{s.name}</p>
                  <p className="text-xs text-red-600 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* AAOIFI Screening */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">AAOIFI Standard 21: The Halal Stock Screening Criteria</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The <strong>Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI)</strong> provides the most globally recognized standard for halal stock screening. AAOIFI Standard 21 requires a company to pass both a <em>qualitative</em> (business activity) and <em>quantitative</em> (financial ratio) screen.
          </p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">1. Business Activity Screen</h3>
          <p className="text-gray-700 mb-4 dark:text-gray-300">A company must derive <strong>less than 5% of total revenue</strong> from prohibited activities. Even if a company sells mostly halal products, if 5%+ of revenue comes from alcohol, interest, etc., it fails.</p>

          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">2. Financial Ratio Screens</h3>
          <div className="space-y-3 mb-6">
            {[
              { ratio: 'Total Debt ÷ Total Assets', limit: '< 33%', desc: 'Excessive leverage through interest-bearing debt makes a company non-compliant.' },
              { ratio: 'Interest-Bearing Securities ÷ Total Assets', limit: '< 33%', desc: 'Large holdings of conventional bonds or interest-bearing instruments disqualify a stock.' },
              { ratio: 'Cash + Receivables ÷ Total Assets', limit: '< 33%', desc: 'When trading a stock purely based on its cash, you may be paying a premium for riba — hence this cap.' },
            ].map((r) => (
              <div key={r.ratio} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="shrink-0">
                  <p className="font-mono text-sm font-bold text-gray-800 dark:text-gray-100">{r.ratio}</p>
                  <p className="font-bold text-[#1B5E20] text-sm">{r.limit}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Barakah screens <strong>30,000+ stocks</strong> from US and international markets against all AAOIFI criteria. When you view a stock in the app, you see immediately whether it passes all screens — and why it failed if it doesn&apos;t.
          </p>

          {/* Halal investment types */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Types of Halal Investments in 2026</h2>
          <div className="space-y-4 mb-8">
            {[
              { title: 'Shariah-Compliant Stocks', desc: 'Individual stocks of companies that pass AAOIFI screening. Screen using Barakah before buying.', positive: true },
              { title: 'Halal ETFs', desc: 'Shariah-compliant ETFs like SPUS (SP Funds S&P 500 Sharia ETF), HLAL (Wahed FTSE USA Shariah ETF), ISWD (iShares MSCI World Islamic). These are managed funds that exclude haram companies.', positive: true },
              { title: 'Sukuk (Islamic Bonds)', desc: 'Sukuk are Shariah-compliant alternatives to conventional bonds. Instead of paying interest, they provide returns based on asset ownership. Government and corporate sukuk are available in many Muslim-majority countries.', positive: true },
              { title: 'Real Estate (Halal)', desc: 'Owning rental properties is generally halal. REITs may include properties with haram tenants (casinos, bars) — screen carefully. Islamic REITs exist in Malaysia and other markets.', positive: true },
              { title: 'Islamic Mutual Funds', desc: 'Managed funds that follow Shariah screens. Check fund prospectus for compliance certification. Available through some brokerages in the US, UK, and globally.', positive: true },
              { title: 'Conventional Bonds', desc: 'Prohibited. They pay fixed interest (riba) regardless of company performance. Replace with sukuk or equity investments.', positive: false },
              { title: 'Conventional Bank Stocks', desc: 'Generally prohibited as banks derive most income from riba. Islamic bank stocks may qualify — screen individually.', positive: false },
            ].map((item) => (
              <div key={item.title} className={`flex gap-4 p-4 rounded-xl border ${item.positive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <span className={`text-lg font-bold shrink-0 ${item.positive ? 'text-green-600' : 'text-red-600'}`}>{item.positive ? '✅' : '❌'}</span>
                <div>
                  <p className={`font-semibold ${item.positive ? 'text-green-800' : 'text-red-800'}`}>{item.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Purification */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">Purification of Haram Income</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            If a company you own stock in earns some income from haram activities (even below the 5% threshold), scholars recommend <strong>purifying</strong> your investment returns. The process:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Calculate the proportion of haram revenue as a percentage of total revenue</li>
            <li>Multiply your dividend or capital gain by that percentage</li>
            <li>Donate that amount to charity (sadaqah) — not as zakat, but as purification</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Barakah tracks the halal ratio of your portfolio and can calculate how much to donate for purification.
          </p>

          {/* FAQ */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-5 mb-10">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">{faq.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Screen your portfolio for free</h2>
            <p className="text-green-200 mb-6">Barakah screens 30,000+ stocks against AAOIFI Standard 21. Create a free account and see your portfolio&apos;s halal compliance in seconds.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free — Screen My Portfolio
              </Link>
              <Link href="/learn/halal-stocks" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Halal Stocks Guide →
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/halal-stocks', title: 'Halal Stocks Guide', desc: 'How to find and vet Shariah-compliant stocks.' },
                { href: '/learn/halal-stock-screener', title: 'Halal Stock Screener', desc: 'How Barakah screens 30,000+ stocks for compliance.' },
                { href: '/learn/riba-elimination', title: 'Riba Elimination Guide', desc: 'Remove interest from your financial life step by step.' },
                { href: '/learn/zakat-on-stocks', title: 'Zakat on Stocks', desc: 'How to calculate zakat on your investment portfolio.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
