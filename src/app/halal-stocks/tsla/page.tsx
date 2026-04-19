import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Tesla (TSLA) Halal? Shariah Screening 2026 | Barakah',
  description:
    "Is Tesla stock halal? AAOIFI screening for TSLA — business-activity review, the three financial ratios, debt history, energy credits, and purification guidance.",
  keywords: ['is tesla halal', 'tsla halal', 'tesla stock halal', 'is tsla shariah compliant', 'tesla shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/tsla' },
  openGraph: {
    title: 'Is Tesla (TSLA) Halal? Shariah Screening 2026 | Barakah',
    description: 'AAOIFI screening review of Tesla (TSLA) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/tsla',
    type: 'article',
  },
};

export default function TslaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Tesla stock halal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Tesla (TSLA) has historically varied in halal-screening status. The core business — electric vehicles, energy storage, and solar — is permissible, but Tesla's debt levels and financing operations have caused the debt-to-market-cap ratio to flirt with the 30% AAOIFI limit. In 2020-2021 the stock passed; in some earlier periods it was excluded. Always check point-in-time compliance before buying.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          <Link href="/halal-stocks" className="hover:text-[#1B5E20] transition">Halal Stocks</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">TSLA</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Tesla (TSLA) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Tesla (<strong>TSLA</strong>) has <strong>varied in compliance over time</strong>. The business is permissible (EVs,
              batteries, solar), but debt and interest-bearing-security ratios have historically moved close to AAOIFI&apos;s
              30% thresholds. This is a stock where <em>point-in-time screening matters more than any other on the list</em>.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Business-activity screen</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Automotive</strong> (~80–85%) — EVs, a permissible product</li>
              <li><strong>Energy generation + storage</strong> (~6–8%) — solar panels, Powerwall, utility-scale batteries</li>
              <li><strong>Services + other</strong> (~8–10%) — supercharging, used-car sales, software upgrades</li>
              <li><strong>Regulatory credits</strong> — sold to other automakers to offset emissions; permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Caveats:</strong> Tesla Finance offers interest-based auto loans and leases directly. This is a direct
              riba revenue stream. However, it&apos;s a minority of total revenue and falls under AAOIFI&apos;s 5% non-permissible
              cap. Scholars generally permit TSLA despite this, with purification.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Financial ratios — the real constraint</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">TSLA notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Historically tight — varies with share price</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Tesla holds significant cash; can approach limit</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Tesla Finance revenue — typically 2–4%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Because the three ratios are calculated against <em>trailing 12-month average market cap</em>, TSLA&apos;s
              volatile share price has historically caused compliance flips. When the stock is high, ratios improve; when
              it drops, ratios can tip out of compliance.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification</h2>
            <p className="text-base leading-7 text-gray-800">
              Tesla pays no dividend, so purification only applies to realized capital gains. If TSLA is halal at time of
              sale, donate the non-permissible-income percentage of your gain to charity — typically 3–5%.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              TSLA&apos;s compliance can flip in either direction quarterly. If you hold TSLA, subscribe to a live screener.
              Barakah Plus re-screens TSLA (and 30,000+ other stocks) against the latest AAOIFI filings and flags when a
              held stock transitions compliant ↔ non-compliant.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/aapl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AAPL →</Link>
              <Link href="/halal-stocks/nvda" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">NVDA →</Link>
              <Link href="/halal-stocks/amzn" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AMZN →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
