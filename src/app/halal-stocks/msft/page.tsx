import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Microsoft (MSFT) Halal? Shariah Screening 2026 | Barakah',
  description:
    "Is Microsoft stock halal? AAOIFI screening for MSFT — business-activity review, the three financial ratios, Azure and gaming caveats, and purification guidance.",
  keywords: ['is microsoft halal', 'msft halal', 'microsoft stock halal', 'is msft shariah compliant', 'microsoft shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/msft' },
  openGraph: {
    title: 'Is Microsoft (MSFT) Halal? Shariah Screening 2026 | Barakah',
    description: 'AAOIFI screening review of Microsoft (MSFT) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/msft',
    type: 'article',
  },
};

export default function MsftPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Microsoft stock halal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Microsoft (MSFT) is generally considered halal by AAOIFI-based screeners. Its core businesses — Windows, Office 365, Azure cloud, and enterprise software — are permissible. Its financial ratios (debt-to-market-cap, interest-bearing securities, non-permissible income) have historically fallen within Shariah thresholds. Scholars note Xbox gaming exposure and Azure financial-services clients as items to watch, but neither disqualifies the stock as long as non-permissible income stays below 5%.',
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
          <span className="text-gray-900">MSFT</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Microsoft (MSFT) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Microsoft (<strong>MSFT</strong>) has historically been considered <strong>halal</strong> by the major AAOIFI
              screeners. Core businesses are permissible; financial ratios have remained well within compliance thresholds;
              purification is required on a small percentage of dividend income.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Business-activity screen</h2>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Productivity and Business Processes</strong> (~33%) — Microsoft 365, LinkedIn, Dynamics — all permissible</li>
              <li><strong>Intelligent Cloud</strong> (~42%) — Azure, server products — permissible, with caveat on banking-services clients</li>
              <li><strong>More Personal Computing</strong> (~25%) — Windows, Surface, Xbox, search advertising — mostly permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Caveats scholars discuss:</strong>
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>Xbox gaming content includes some impermissible games (gambling mechanics, explicit content)</li>
              <li>Azure is used by conventional banks and insurance firms — indirect exposure but not direct revenue from riba</li>
              <li>OpenAI partnership includes investment gains; generally treated as capital returns rather than riba</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Financial ratios</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm rounded-2xl bg-white shadow-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-left">
                    <th className="p-3 font-semibold text-gray-700">Ratio</th>
                    <th className="p-3 font-semibold text-gray-700">AAOIFI limit</th>
                    <th className="p-3 font-semibold text-gray-700">MSFT historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 5–8%</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 6–12%</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically &lt; 2%</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification</h2>
            <p className="text-base leading-7 text-gray-800">
              A small share (~1–2%) of your dividend is typically tied to interest income and impermissible gaming content.
              Shariah scholars require donating that percentage to charity. Barakah calculates the exact purification amount
              per dividend automatically.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              Ratios change quarterly. Before you buy, confirm current MSFT compliance in Barakah — plus get live purification
              calculations, automatic zakat integration, and halal-portfolio tracking.
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
