import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is NVIDIA (NVDA) Halal? Shariah Screening 2026 | Barakah',
  description:
    "Is NVIDIA stock halal? AAOIFI screening for NVDA — business-activity review, the three financial ratios, gaming and AI caveats, and purification guidance.",
  keywords: ['is nvidia halal', 'nvda halal', 'nvidia stock halal', 'is nvda shariah compliant', 'nvidia shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/nvda' },
  openGraph: {
    title: 'Is NVIDIA (NVDA) Halal? Shariah Screening 2026 | Barakah',
    description: 'AAOIFI screening review of NVIDIA (NVDA) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/nvda',
    type: 'article',
  },
};

export default function NvdaPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is NVIDIA stock halal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'NVIDIA (NVDA) is generally considered halal by AAOIFI-based screeners. Its core business is GPU chips for gaming, AI/data center, and professional graphics — all permissible. Debt is low and interest-bearing securities stay well within thresholds. The main caveat: a portion of gaming GPU revenue flows to games with impermissible content, but this is typically indirect and within the 5% non-permissible cap.',
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
          <span className="text-gray-900">NVDA</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is NVIDIA (NVDA) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-18 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              NVIDIA (<strong>NVDA</strong>) has consistently been considered <strong>halal</strong> by major AAOIFI
              screeners. Semiconductors are fully permissible; NVIDIA&apos;s debt is very low relative to market cap; and
              interest income stays comfortably within the 5% non-permissible-revenue ceiling.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              NVIDIA&apos;s segment mix as of recent quarters:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Data Center</strong> (~75–85%) — AI training/inference GPUs (H100, B100, etc.), networking — permissible</li>
              <li><strong>Gaming</strong> (~10–15%) — GeForce consumer GPUs — permissible hardware; indirect exposure to non-halal games</li>
              <li><strong>Professional Visualization</strong> (~2%) — workstation graphics — permissible</li>
              <li><strong>Automotive</strong> (~2%) — in-car AI compute — permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>Caveats scholars discuss:</strong>
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>A share of gaming-segment revenue flows to users playing impermissible content — indirect exposure, not direct revenue</li>
              <li>AI chips sometimes power conventional-banking, insurance, or adult-industry workloads — again indirect</li>
              <li>No meaningful interest-income business</li>
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
                    <th className="p-3 font-semibold text-gray-700">NVDA historical range</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Very low — typically &lt; 2%</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Typically 3–6%</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically &lt; 2%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Of the five mega-cap tech names on this list, NVDA is the cleanest on the financial-ratio screen — abundant
              margin to the thresholds.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification</h2>
            <p className="text-base leading-7 text-gray-800">
              NVIDIA pays a small dividend. Typical purification: 1–2% of dividend (and capital-gain yield at sale) donated
              to charity. Barakah calculates the exact share based on the most recent quarterly revenue disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              NVDA has been comfortably compliant through the 2023–2025 AI boom. Still confirm before you buy — and once
              purchased, subscribe to Barakah&apos;s compliance-change alerts so you&apos;re notified if the classification flips.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/aapl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AAPL →</Link>
              <Link href="/halal-stocks/msft" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">MSFT →</Link>
              <Link href="/halal-stocks/tsla" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">TSLA →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
