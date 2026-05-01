import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Apple (AAPL) Halal? Shariah Screening 2026 | Barakah',
  description:
    "Is Apple stock halal? Full AAOIFI screening review for AAPL — business-activity check, the three financial ratios, purification dividend guidance, and what to verify before you buy.",
  keywords: ['is apple halal', 'aapl halal', 'apple stock halal', 'is aapl shariah compliant', 'apple shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/aapl' },
  openGraph: {
    title: 'Is Apple (AAPL) Halal? Shariah Screening 2026 | Barakah',
    description: 'AAOIFI screening review of Apple (AAPL) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/aapl',
    type: 'article',
  },
};

export default function AaplPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Apple stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Apple (AAPL) has historically passed AAOIFI halal screening. Its primary revenue comes from permissible sources (hardware, software, services), and its financial ratios — debt-to-market-cap, interest-bearing securities, and non-permissible income — have consistently been within AAOIFI thresholds. However, compliance is recalculated quarterly and can change; always verify the current status before buying.',
        },
      },
      {
        '@type': 'Question',
        name: "Do I need to purify dividends from Apple stock?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Even if Apple is compliant overall, a small portion of its revenue typically comes from interest income on its cash reserves. Scholars require purifying your dividend (and a proportional share of capital gains) by donating the impermissible percentage to charity. Barakah calculates this purification amount automatically.",
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
          <span className="text-gray-900">AAPL</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Apple (AAPL) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Apple (<strong>AAPL</strong>) has historically been considered <strong>halal</strong> by most major AAOIFI-based
              screeners. Its core business activities — hardware, software, and services — are all permissible, and its
              financial ratios have consistently fallen within Shariah-compliant thresholds. That said, the screen must be
              re-verified <em>quarterly</em> and any dividend income purified.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Apple&apos;s revenue mix as of the most recent annual report breaks down roughly:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>iPhone</strong> (~50%) — hardware, permissible</li>
              <li><strong>Services</strong> (~20–25%) — App Store, iCloud, Apple Pay, Apple Music — mostly permissible</li>
              <li><strong>Wearables, Home & Accessories</strong> (~10%) — permissible</li>
              <li><strong>Mac & iPad</strong> (~10–15%) — permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Caveats:</strong> Apple Music and the App Store host some content that would be considered non-halal
              (music with inappropriate lyrics, gambling apps, etc.). Most scholars treat this as an incidental, indirect
              revenue stream and apply purification rather than disqualifying the entire stock — provided the overall
              non-permissible revenue ratio stays under 5%.
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
                    <th className="p-3 font-semibold text-gray-700">AAPL historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 3–5%</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Historically the tightest constraint</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically &lt; 2%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Apple holds very large cash and marketable-securities positions (hundreds of billions of USD). The
              interest-bearing-securities ratio is the one most scholars watch, because it has occasionally approached
              the 30% cap. Point-in-time verification matters.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Even if AAPL passes screening, a small percentage of its income comes from interest on cash reserves and
              from impermissible content on its platforms. Shariah scholars require <em>purifying</em> the non-permissible
              share of any dividends or capital gains you receive, by donating it to charity. This is usually 1–3% of
              dividend received; Barakah calculates the exact figure based on the most recent quarterly disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current compliance against the
              latest quarterly filing. Barakah Plus ($9.99/mo) re-screens AAPL — and 30,000 other tickers — continuously.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/msft" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">MSFT →</Link>
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
