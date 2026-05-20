import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is AMD Halal? Shariah Screening 2026',
  description:
    "Is AMD stock halal? Full AAOIFI screening review for Advanced Micro Devices — business-activity check, the three financial ratios, purification guidance, and what to verify before you buy.",
  keywords: ['is amd halal', 'amd halal', 'amd stock halal', 'is amd shariah compliant', 'advanced micro devices shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/amd' },
  openGraph: {
    title: 'Is AMD Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Advanced Micro Devices (AMD) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/amd',
    type: 'article',
  },
};

export default function AmdPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is AMD stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "AMD (Advanced Micro Devices) has historically passed AAOIFI halal screening. It designs CPUs, GPUs, and data-center chips — a permissible business — and carries very little interest-bearing debt, since the large Xilinx acquisition was funded mostly with stock rather than borrowing. Its financial ratios have generally stayed comfortably within AAOIFI thresholds. Compliance is recalculated quarterly; verify before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Does AMD pay a dividend that needs purification?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "AMD does not currently pay a dividend, so most investors realize returns through capital gains. Scholars still require purifying the non-permissible share of income — primarily interest AMD earns on its cash and short-term investments — by donating the proportional amount to charity. Barakah calculates this automatically from the latest quarterly disclosure.",
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
          <span className="text-gray-900">AMD</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is AMD Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-20 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              AMD (<strong>Advanced Micro Devices</strong>) has historically been considered <strong>halal</strong> by most
              major AAOIFI-based screeners. It designs semiconductors — CPUs, GPUs, and data-center accelerators — and
              carries very low debt, so all three financial ratios have generally stayed comfortably within Shariah
              thresholds. Re-verify <em>quarterly</em> and purify any income.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              AMD&apos;s revenue comes from chip design across four segments:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Data Center</strong> — server CPUs (EPYC) and AI accelerators (Instinct) — permissible</li>
              <li><strong>Client</strong> — desktop &amp; laptop processors (Ryzen) — permissible</li>
              <li><strong>Gaming</strong> — GPUs (Radeon) and semi-custom console chips — permissible</li>
              <li><strong>Embedded</strong> — FPGA/adaptive computing from the Xilinx acquisition — permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              No material revenue from prohibited activities. The business-activity screen is clean.
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
                    <th className="p-3 font-semibold text-gray-700">AMD note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Very low — Xilinx deal was stock-funded</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Generally comfortable</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically minimal</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              AMD&apos;s clean balance sheet is the reason it screens well. Because chip valuations swing, the ratios
              (which divide by market cap) can move with the share price — a quick re-check before buying is still wise.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Even when AMD passes screening, a small share of its income comes from interest on cash and short-term
              investments. Scholars require <em>purifying</em> that non-permissible portion of any gains by donating it to
              charity. Barakah calculates the exact figure from the latest quarterly disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current compliance against the
              latest quarterly filing. Barakah Plus ($9.99/mo) runs the full AAOIFI Standard 21 ratio screen live whenever
              you check AMD, and re-screens the tickers you hold automatically.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/nvda" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">NVDA →</Link>
              <Link href="/halal-stocks/orcl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">ORCL →</Link>
              <Link href="/halal-stocks/crm" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">CRM →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
