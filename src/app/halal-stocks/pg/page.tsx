import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Procter & Gamble (PG) Halal? Shariah Screening 2026',
  description:
    "Is Procter & Gamble stock halal? Full AAOIFI screening review for PG — business-activity check (household & personal care), the three financial ratios, purification guidance, and what to verify before you buy.",
  keywords: ['is procter and gamble halal', 'pg halal', 'p&g stock halal', 'is pg shariah compliant', 'procter gamble shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/pg' },
  openGraph: {
    title: 'Is Procter & Gamble (PG) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Procter & Gamble (PG) — compliance status, the three ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/pg',
    type: 'article',
  },
};

export default function PgPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Procter & Gamble stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Procter & Gamble (PG) passes the AAOIFI business-activity screen — its revenue comes from household, personal care, grooming, and health products, all permissible. The deciding factor is financial: like most consumer-staples companies, P&G carries interest-bearing debt, so the debt-to-market-cap ratio is the item to verify. It has generally stayed within AAOIFI limits, but compliance is recalculated quarterly, so confirm before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to purify dividends from P&G stock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. P&G is a long-standing dividend payer, and a small portion of its income comes from interest on cash. Scholars require purifying that non-permissible share of dividends or gains by donating it to charity. Barakah calculates the exact purification amount automatically.",
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
          <span className="text-gray-900">PG</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Procter &amp; Gamble (PG) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-22 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Procter &amp; Gamble (<strong>PG</strong>) clears the business-activity screen — household and personal-care
              products are all permissible. The open question is <strong>financial</strong>: P&amp;G carries
              interest-bearing debt typical of consumer staples, so the debt ratio is the item to check. It has generally
              stayed within AAOIFI limits — treat PG as <strong>likely compliant, verify the current ratios</strong>, and
              purify dividend income.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">P&amp;G&apos;s revenue spans five product segments:</p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Fabric &amp; Home Care</strong> — Tide, Downy, Dawn — permissible</li>
              <li><strong>Baby, Feminine &amp; Family Care</strong> — Pampers, Always, Bounty — permissible</li>
              <li><strong>Beauty</strong> — Olay, Pantene, Head &amp; Shoulders — permissible</li>
              <li><strong>Grooming</strong> — Gillette, Venus — permissible</li>
              <li><strong>Health Care</strong> — Crest, Oral-B, Vicks — permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">No material revenue from prohibited activities. The business screen is clean.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 2: AAOIFI financial ratios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">PG note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">The item to watch — typical consumer-staples leverage</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Generally comfortable</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically low</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              P&amp;G&apos;s large, stable market cap helps keep the debt ratio in check, but it does move with the share
              price — verify the current figure before buying.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Even when PG passes screening, a small percentage of income comes from interest on cash. Scholars require
              <em> purifying</em> that non-permissible share of dividends or gains by donating it to charity. Barakah
              calculates the exact figure from the latest disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current AAOIFI Standard 21 ratios
              against the latest filing. Barakah Plus ($9.99/mo) runs the full ratio screen live whenever you check PG.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/ul" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">UL →</Link>
              <Link href="/halal-stocks/ko" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">KO →</Link>
              <Link href="/halal-stocks/list" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Full list →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
