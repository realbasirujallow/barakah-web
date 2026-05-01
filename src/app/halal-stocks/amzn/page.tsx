import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Amazon (AMZN) Halal? Shariah Screening 2026 | Barakah',
  description:
    "Is Amazon stock halal? AAOIFI screening for AMZN — business-activity review, the three financial ratios, AWS and marketplace caveats, and purification guidance.",
  keywords: ['is amazon halal', 'amzn halal', 'amazon stock halal', 'is amzn shariah compliant', 'amazon shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/amzn' },
  openGraph: {
    title: 'Is Amazon (AMZN) Halal? Shariah Screening 2026 | Barakah',
    description: 'AAOIFI screening review of Amazon (AMZN) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/amzn',
    type: 'article',
  },
};

export default function AmznPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Amazon stock halal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Amazon (AMZN) is a borderline case. The e-commerce marketplace and AWS cloud are permissible, but Amazon sells a broad assortment including alcohol, pork products, and interest-based financial-services referrals. Scholars differ: some consider AMZN halal with purification required; others prefer more focused halal-tech alternatives. Financial ratios have historically been within AAOIFI thresholds, but the non-permissible-income ratio is the tightest constraint for Amazon.",
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
          <span className="text-gray-900">AMZN</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Amazon (AMZN) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Amazon (<strong>AMZN</strong>) is <strong>a borderline case</strong> with scholar-dependent answers. Financial ratios
              have historically passed, but the non-permissible-income test is the tightest constraint because Amazon
              sells alcohol, pork, and retail finance products. Most major screeners classify AMZN as compliant-with-purification;
              more conservative investors avoid it.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Amazon&apos;s revenue mix (approximate):
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Online stores + third-party seller services</strong> (~55%) — permissible e-commerce core, but marketplace carries non-halal products</li>
              <li><strong>AWS</strong> (~17%) — cloud infrastructure, permissible</li>
              <li><strong>Advertising + subscription services</strong> (~15%) — mostly permissible; Prime Video includes some impermissible content</li>
              <li><strong>Physical stores + other</strong> (~13%) — Whole Foods includes halal and haram products</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Concerns:</strong> Alcohol and pork sales on the marketplace; Amazon Pay consumer-credit products;
              Prime Video content that includes non-halal entertainment. The aggregate non-permissible revenue is
              historically around 2–4% — within AAOIFI&apos;s 5% cap, but not zero.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Financial ratios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">AMZN historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 5–9%</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 3–6%</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically 2–4% (tight)</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification</h2>
            <p className="text-base leading-7 text-gray-800">
              Because non-permissible income is a meaningful share of AMZN revenue, purification obligations are higher
              than for pure-tech stocks. Scholars typically require donating 3–5% of dividend (or capital-gain yield) to
              charity. Amazon pays no regular dividend, so purification attaches to realized gains when you sell.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              Amazon&apos;s compliance is closer to the line than most mega-cap tech. Before you buy, verify the current
              non-permissible ratio in Barakah — it updates every quarter and can tip the classification.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/aapl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AAPL →</Link>
              <Link href="/halal-stocks/msft" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">MSFT →</Link>
              <Link href="/halal-stocks/nvda" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">NVDA →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
