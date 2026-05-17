import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Netflix (NFLX) Halal? Shariah Screening 2026',
  description:
    "Is Netflix stock halal? Full AAOIFI screening review for NFLX — the entertainment-content question, the three financial ratios, why scholarly opinion is divided, and what to verify before you buy.",
  keywords: ['is netflix halal', 'nflx halal', 'netflix stock halal', 'is nflx shariah compliant', 'netflix shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/nflx' },
  openGraph: {
    title: 'Is Netflix (NFLX) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Netflix (NFLX) — compliance status, ratios, why scholarly opinion is divided.',
    url: 'https://trybarakah.com/halal-stocks/nflx',
    type: 'article',
  },
};

export default function NflxPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Netflix (NFLX) stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Netflix is one of the most contested tickers in Shariah screening. Most strict AAOIFI-based screeners classify NFLX as non-compliant on business-activity grounds — entertainment-content production is treated as the primary revenue, and a meaningful share of that content (music, intimate scenes, certain themes) is considered impermissible. A minority position treats it as compliant with high purification (8–15%), arguing that the underlying business is technology/distribution rather than content. Most contemporary scholars side with the strict view.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do scholarly opinions diverge on Netflix?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "The disagreement is over how to classify the business. Strict screening treats NFLX as a content producer/distributor — and because non-permissible content is core to the offering (not incidental), it fails the business-activity gate regardless of financial ratios. Lenient screening treats it as a streaming-technology platform with content as a means — applying the AAOIFI 5% non-permissible-revenue threshold instead. Most major Shariah indices (S&P, Dow Jones, MSCI Islamic) currently exclude NFLX.",
        },
      },
      {
        '@type': 'Question',
        name: "Do I need to purify gains from Netflix stock if I owned it?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "If you held NFLX and decide to exit on Shariah grounds, the consensus view is to donate any gains attributable to the impermissible portion of revenue. For a stock judged non-compliant on business-activity grounds, scholars typically recommend donating the full realized gain (after recovering original capital) to charity, rather than treating it as personal profit.",
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
          <span className="text-gray-900">NFLX</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Netflix (NFLX) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-17 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm border-l-4 border-red-500">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Netflix (<strong>NFLX</strong>) is typically classified as <strong>non-compliant</strong> by most major
              AAOIFI-based screeners on <em>business-activity</em> grounds — entertainment content is core to the revenue
              and a meaningful share is considered impermissible. A minority scholarly view treats it as compliant with high
              purification (8–15%), but the strict view is more widely held. <strong>Most Shariah-aligned investors exclude NFLX.</strong>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Netflix&apos;s revenue mix is concentrated in a single business:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Subscription streaming</strong> (~95%+) — global subscribers paying for access to a content library Netflix licenses or produces</li>
              <li><strong>Ad-supported tier</strong> (~5% and growing) — lower-priced tier with advertising; same content library</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>The core question:</strong> Netflix is a content company. Unlike Apple Music (a small slice of Apple) or
              YouTube (a slice of Alphabet&apos;s ad revenue), Netflix&apos;s entire revenue depends on the content library. Strict
              AAOIFI-based screeners therefore evaluate the <em>content itself</em>, not just the financial ratios — and conclude
              that impermissible content (music, intimate scenes, certain narrative themes) is not incidental but core to the
              offering. Major Shariah indices (S&amp;P Shariah, Dow Jones Islamic, MSCI Islamic) all currently exclude NFLX.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 2: AAOIFI financial ratios</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Note: financial ratios are typically only assessed <em>after</em> a stock clears the business-activity screen.
              Most screeners stop at Stage 1 for NFLX. For reference, the financial ratios are:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">NFLX historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Historically elevated (15–25%) due to content financing</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 2–6%</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Not applicable — content classification fails earlier</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">If you already own NFLX</h2>
            <p className="text-base leading-7 text-gray-800">
              If you held Netflix before reviewing its compliance status and decide to exit on Shariah grounds, the consensus
              guidance is: recover your original capital, then donate any realized gain (above cost basis) to charity. This is
              treated as purification, not regular profit. Some scholars permit phased exits to avoid forced losses; Barakah&apos;s
              purification tracker can help compute the exact donation amount.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects the <em>current consensus</em> status. Shariah classifications can shift if Netflix changes
              its content mix or business model. Barakah Plus ($9.99/mo) runs the full AAOIFI Standard 21 screen live whenever
              you check NFLX, including the business-activity gate, and re-screens the tickers you hold automatically.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/googl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">GOOGL →</Link>
              <Link href="/halal-stocks/meta" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">META →</Link>
              <Link href="/halal-stocks/aapl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AAPL →</Link>
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
