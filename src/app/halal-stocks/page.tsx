import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../lib/trial';

export const metadata: Metadata = {
  title: 'Halal Stocks (2026): Live Shariah Screening for Major US Tickers | Barakah',
  description:
    'Per-ticker halal screening for the top US stocks — AAPL, MSFT, AMZN, TSLA, NVDA, GOOGL, META — using AAOIFI standards. See the business-activity filter, the three financial ratios, and what to verify before you buy.',
  keywords: [
    'halal stocks',
    'halal stock list',
    'is apple halal',
    'is tesla halal',
    'is microsoft halal',
    'aaoifi halal stocks',
    'shariah compliant stocks usa',
  ],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks' },
  openGraph: {
    title: 'Halal Stocks — Live Shariah Screening for Major US Tickers | Barakah',
    description: 'AAOIFI-standard halal screening for AAPL, MSFT, AMZN, TSLA, NVDA, GOOGL, META.',
    url: 'https://trybarakah.com/halal-stocks',
    type: 'article',
  },
};

const tickers = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', note: 'Generally halal' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', note: 'Generally halal' },
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'Consumer / Tech', note: 'Verify ratios' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', note: 'Generally halal' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Automotive / Tech', note: 'Historically varied' },
];

export default function HalalStocksHub() {
  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Halal Stock Screener — Individual Ticker Reviews',
    description:
      'AAOIFI Standard 21 halal screening for individual stocks: business-activity review, the three financial ratios, and purification guidance.',
    url: 'https://trybarakah.com/halal-stocks',
    isPartOf: { '@type': 'WebSite', name: 'Barakah', url: 'https://trybarakah.com' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
      { '@type': 'ListItem', position: 2, name: 'Halal Stocks', item: 'https://trybarakah.com/halal-stocks' },
    ],
  };
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">Get Started</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Halal Stocks</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Halal Stocks — Live Screening</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18 · AAOIFI methodology</p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The two-stage halal screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              A stock is halal only if it passes both stages:
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li>
                <strong>Business-activity screen.</strong> The company&apos;s primary revenue must not come from prohibited sectors —
                alcohol, pork, gambling, conventional banking/insurance, weapons, tobacco, pornography, or non-halal entertainment.
              </li>
              <li>
                <strong>Financial-ratio screen (AAOIFI).</strong> Three ratios, all calculated against the trailing 12-month average market cap:
                <ul className="list-disc space-y-1 pl-6 mt-1">
                  <li>Interest-bearing debt &lt; 30%</li>
                  <li>Interest-bearing deposits and securities &lt; 30%</li>
                  <li>Non-permissible income &lt; 5% of total revenue</li>
                </ul>
              </li>
            </ol>
            <p className="text-sm italic text-gray-600 mt-3">
              Ratios are reassessed <strong>quarterly</strong>. A stock that passes in Q1 can fail in Q3 if debt-to-market-cap
              crosses the threshold. This is why point-in-time screening matters.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Most-searched US tickers</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {tickers.map((t) => (
                <Link
                  key={t.symbol}
                  href={`/halal-stocks/${t.symbol.toLowerCase()}`}
                  className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition border border-transparent hover:border-[#1B5E20]"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold text-[#1B5E20]">{t.symbol}</span>
                    <span className="text-xs text-gray-500">{t.sector}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-6 mb-2">{t.name}</p>
                  <span className="inline-block rounded-full bg-amber-50 text-amber-900 px-2 py-0.5 text-xs font-semibold">
                    {t.note}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">Why static lists mislead</h2>
            <p className="text-sm leading-7 text-amber-900">
              Most &quot;halal stocks 2026&quot; lists were assembled once and never re-screened. The financial ratios that determine
              compliance change every quarter as debt, cash, and market cap fluctuate. Barakah re-runs the AAOIFI screen against
              30,000+ stocks continuously, so when you ask &quot;is AAPL halal <em>today</em>&quot;, the answer is calculated against
              the latest available data — not last year&apos;s.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Screen any US/UK/GCC stock in seconds</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Barakah Plus ($9.99/mo) gives you unlimited halal screening against 30,000+ tickers with live AAOIFI ratios,
              purification amounts, and zakat integration. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Start {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL} free trial →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
