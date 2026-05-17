import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Meta (META) Halal? Shariah Screening 2026',
  description:
    "Is Meta Platforms stock halal? Full AAOIFI screening review for META — Facebook, Instagram, WhatsApp business mix, the three financial ratios, purification dividend guidance, and what to verify before you buy.",
  keywords: ['is meta halal', 'meta halal', 'is facebook stock halal', 'meta shariah compliant', 'instagram parent halal'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/meta' },
  openGraph: {
    title: 'Is Meta (META) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Meta Platforms (META) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/meta',
    type: 'article',
  },
};

export default function MetaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Meta (META) stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Meta Platforms (META) has historically passed the AAOIFI financial-ratio screen. The advertising business is permissible in principle, but a meaningful share of ads on Facebook and Instagram falls into impermissible categories. Most AAOIFI-based screeners classify META as compliant with required purification, provided non-permissible revenue stays under the 5% threshold. Re-verify quarterly.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does Meta pay dividends?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes — Meta initiated its first regular cash dividend in 2024. If META passes screening when you receive a dividend, you must purify the impermissible portion (typically 2–5%) by donating it to charity. Barakah calculates the exact purification amount based on the most recent quarterly disclosure.',
        },
      },
      {
        '@type': 'Question',
        name: 'What about Reality Labs and the metaverse?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Reality Labs (VR/AR hardware and the metaverse) is currently loss-making but the underlying business — hardware and software — is permissible. It does not currently change Meta's overall compliance status. Watch for in-app purchases and content categories as the metaverse scales.",
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
          <span className="text-gray-900">META</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Meta (META) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-17 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Meta Platforms (<strong>META</strong>) has historically been classified as <strong>halal with purification</strong> by
              most major AAOIFI-based screeners. The financial ratios are well inside Shariah-compliant limits and the
              core advertising business is permissible. The compliance edge sits in non-permissible ad categories shown on
              Facebook and Instagram — typically managed via purification rather than disqualification.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Meta&apos;s revenue mix breaks down roughly as:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Family of Apps advertising</strong> (~97%) — Facebook, Instagram, Messenger, WhatsApp; mostly permissible with some impermissible ad categories</li>
              <li><strong>Reality Labs</strong> (~3%) — VR/AR hardware (Quest), software, and metaverse experiences; permissible, currently loss-making</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Caveats:</strong> Meta&apos;s platforms host impermissible content categories (gambling, alcohol, adult-adjacent
              dating, music with impermissible themes). Ad revenue from these categories is treated as incidental and purified,
              provided the overall non-permissible revenue stays under the AAOIFI 5% threshold. Scholars who take a stricter
              view of social-media platforms in general may exclude META on broader grounds — this is a minority position.
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
                    <th className="p-3 font-semibold text-gray-700">META historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 2–5% (very low)</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 5–10%</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically 2–4%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Meta runs comfortably inside all three AAOIFI limits. The non-permissible-income ratio is the one to track —
              shifts in ad policy enforcement (e.g., gambling ads in newly opened markets) can push it toward the cap.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Meta now pays regular cash dividends and conducts large share buybacks. You must purify the impermissible portion
              of any dividend received and a proportional share of realized capital gains. Typical purification rate runs 2–4%;
              Barakah computes the exact figure based on the most recent quarterly disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current compliance against the latest
              quarterly filing. Barakah Plus ($9.99/mo) runs an AAOIFI-style ratio screen (debt, interest income, illiquid assets) against the most recent quarterly filing whenever you
              check META, and refreshes the tickers you hold on each quarter&apos;s filing cycle. Final compliance is your responsibility — re-verify with your scholar before investing.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/googl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">GOOGL →</Link>
              <Link href="/halal-stocks/nflx" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">NFLX →</Link>
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
