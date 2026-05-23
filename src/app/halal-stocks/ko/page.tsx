import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Coca-Cola (KO) Halal? Shariah Screening 2026',
  description:
    "Is Coca-Cola stock halal? AAOIFI screening review for KO — the business-activity question raised by recent alcohol-brand partnerships, the debt ratio, purification guidance, and why screeners differ.",
  keywords: ['is coca cola halal', 'ko halal', 'coca cola stock halal', 'is ko shariah compliant', 'coca cola shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/ko' },
  openGraph: {
    title: 'Is Coca-Cola (KO) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Coca-Cola (KO) — alcohol-partnership nuance, debt ratio, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/ko',
    type: 'article',
  },
};

export default function KoPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Coca-Cola stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Coca-Cola (KO) is borderline and worth verifying carefully. Its core business — non-alcoholic beverages — is permissible, but in recent years KO has entered branded alcohol partnerships (such as ready-to-drink cocktails and hard seltzers licensed under its trademarks). The revenue is a small share, and scholars and screeners differ on whether it crosses the business-activity threshold. Separately, KO carries meaningful debt, so the financial ratios also need checking. Verify the current screen before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Does Coca-Cola sell alcohol?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Coca-Cola's main business is non-alcoholic, and it exited the wine business decades ago. However, since the early 2020s it has launched alcohol products through brand partnerships — for example ready-to-drink cocktails and hard seltzers carrying its trademarks. This is a small portion of revenue, but it is why some Shariah screeners now flag KO where they previously passed it. Check the latest non-permissible-revenue figure.",
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
          <span className="text-gray-900">KO</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Coca-Cola (KO) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-22 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Coca-Cola (<strong>KO</strong>) is <strong>borderline — verify carefully</strong>. The core soft-drink
              business is permissible, but KO has added <strong>alcohol-brand partnerships</strong> (ready-to-drink
              cocktails and hard seltzers under its trademarks) in recent years. That revenue is small, and screeners
              disagree on whether it disqualifies the stock. KO also carries meaningful debt, so the financial ratios
              need checking too. Confirm both before buying.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              The overwhelming majority of Coca-Cola&apos;s revenue is non-alcoholic beverages — sodas, water, juice,
              sports drinks, tea, and coffee — all permissible. The complication is recent:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Non-alcoholic beverages</strong> (the vast majority) — permissible</li>
              <li><strong>Alcohol brand partnerships</strong> (small) — ready-to-drink cocktails and hard seltzers licensed under Coca-Cola trademarks; this is the screening concern</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              Most AAOIFI-based screens disqualify a company if non-permissible revenue exceeds 5% of total revenue.
              KO&apos;s alcohol-linked revenue has been well below that, so many screeners still pass it on a purification
              basis — but some treat any branded alcohol involvement more strictly. This is a genuine point of difference;
              check the latest figure and your own comfort level.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 2: AAOIFI financial ratios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">KO note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Carries meaningful debt — verify against current market cap</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Generally comfortable</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Watch the alcohol-partnership share here</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              If you conclude KO is permissible to hold, the non-permissible portion of income (interest plus any
              alcohol-linked share) must be <em>purified</em> by donating it to charity. Because of the alcohol exposure,
              the purification percentage for KO may be higher than for a pure soft-drink peer. Barakah calculates it from
              the latest disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              KO is a case where the verdict genuinely depends on current figures and your chosen screening standard.
              Confirm the latest non-permissible-revenue and debt ratios before buying. Barakah Plus ($9.99/mo) runs the
              full AAOIFI Standard 21 screen live whenever you check KO.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/pg" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">PG →</Link>
              <Link href="/halal-stocks/ul" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">UL →</Link>
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
