import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Google (GOOGL / GOOG) Halal? Shariah Screening 2026',
  description:
    "Is Google stock halal? Full AAOIFI screening review for Alphabet (GOOGL / GOOG) — business-activity check, the three financial ratios, purification dividend guidance, and what to verify before you buy.",
  keywords: ['is google halal', 'googl halal', 'google stock halal', 'is googl shariah compliant', 'alphabet shariah', 'goog halal'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/googl' },
  openGraph: {
    title: 'Is Google (GOOGL) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Alphabet (GOOGL) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/googl',
    type: 'article',
  },
};

export default function GooglPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Google (GOOGL) stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Alphabet (GOOGL / GOOG) has historically passed AAOIFI halal screening on the financial ratios, but its YouTube and advertising businesses include some impermissible content categories. Most AAOIFI-based screeners classify it as compliant with required purification, provided non-permissible revenue stays under the 5% threshold. Compliance is recalculated quarterly and can change.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between GOOGL and GOOG?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GOOGL is Class A shares with voting rights. GOOG is Class C shares without voting rights. Both represent the same underlying business (Alphabet) and have identical Shariah compliance status. From a halal-screening standpoint they are interchangeable.',
        },
      },
      {
        '@type': 'Question',
        name: "Do I need to purify dividends from Google stock?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Alphabet does not currently pay regular dividends — it returns capital primarily via share buybacks. However, you must still purify capital gains by donating the impermissible portion of revenue (typically 1–4%) on any gains you realize. Barakah helps you estimate the purification amount based on the issuer's most recent filings; final figures depend on your madhab settings and you should verify before donating.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/halal-stocks" className="hover:text-[#1B5E20] transition">Halal Stocks</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">GOOGL</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Google (GOOGL) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-17 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Alphabet (<strong>GOOGL / GOOG</strong>) has historically been classified as <strong>halal with purification</strong> by
              most major AAOIFI-based screeners. The financial ratios are well within Shariah-compliant limits, and the
              core advertising business is permissible. The compliance edge lies in non-permissible content categories
              served through YouTube and Search ads — typically managed via purification rather than disqualification.
              Re-verify quarterly.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Alphabet&apos;s revenue mix breaks down roughly as:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Google Search &amp; Ads</strong> (~57%) — permissible advertising, with a small share of impermissible ad categories</li>
              <li><strong>YouTube Ads</strong> (~10%) — advertising on user-generated content, including some impermissible categories</li>
              <li><strong>Google Network</strong> (~10%) — third-party-site ads</li>
              <li><strong>Google Cloud</strong> (~12%) — infrastructure, permissible</li>
              <li><strong>Other (Play, Pixel, subscriptions)</strong> (~10%) — mostly permissible; Play hosts some impermissible apps (gambling, etc.)</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Caveats:</strong> YouTube hosts content categories (music, gambling promotions, adult-adjacent content,
              alcohol/tobacco ads in certain regions) that would be considered non-halal. Most scholars treat ad-network
              exposure as incidental and apply purification, provided the overall non-permissible revenue stays under the
              AAOIFI 5% threshold.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 2: AAOIFI financial ratios</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Three ratios are calculated against the trailing 12-month average market cap:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">GOOGL historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 1–3% (very low)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 7–12%</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically 2–4%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Alphabet has historically run all three ratios well inside AAOIFI limits. The non-permissible-income ratio is
              the one most worth tracking quarter-over-quarter, since shifts in YouTube content mix or ad-policy enforcement
              can move it closer to the 5% cap.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Even though Alphabet passes screening, the impermissible portion of revenue must be purified on any income
              you receive. Alphabet doesn&apos;t currently pay regular dividends, so for most holders this means purifying a
              proportional slice of <em>realized capital gains</em> by donating it to charity. Typical purification rate
              runs 2–4% of the gain; Barakah calculates the exact figure based on the most recent quarterly disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current compliance against the latest
              quarterly filing. Barakah Plus ($9.99/mo) runs the full AAOIFI Standard 21 ratio screen live whenever you
              check GOOGL, and re-screens the tickers you hold automatically.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/aapl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AAPL →</Link>
              <Link href="/halal-stocks/msft" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">MSFT →</Link>
              <Link href="/halal-stocks/meta" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">META →</Link>
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
