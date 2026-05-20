import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Oracle (ORCL) Halal? Shariah Screening 2026',
  description:
    "Is Oracle stock halal? Full AAOIFI screening review for ORCL — business-activity check, the three financial ratios (debt is the key constraint), purification guidance, and what to verify before you buy.",
  keywords: ['is oracle halal', 'orcl halal', 'oracle stock halal', 'is orcl shariah compliant', 'oracle shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/orcl' },
  openGraph: {
    title: 'Is Oracle (ORCL) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Oracle (ORCL) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/orcl',
    type: 'article',
  },
};

export default function OrclPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Oracle stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oracle (ORCL) passes the AAOIFI business-activity screen — its revenue comes from database software, cloud infrastructure, and license support, all permissible. The constraint is financial: Oracle has historically carried significant interest-bearing debt from large acquisitions (Cerner, NetSuite), and its debt-to-market-cap ratio has at times approached the AAOIFI 30% threshold. Compliance is recalculated quarterly and can flip; always verify the current ratio before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Why is Oracle borderline for halal screening?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Oracle funds much of its growth with debt. The AAOIFI interest-bearing-debt ratio (debt divided by trailing-12-month average market cap) must stay under 30%. After debt-funded acquisitions this ratio has periodically tightened. The business itself is clean — the watch item is leverage, so point-in-time verification matters more for ORCL than for cash-rich peers.",
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
          <span className="text-gray-900">ORCL</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Oracle (ORCL) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-20 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Oracle (<strong>ORCL</strong>) clears the business-activity screen — databases, cloud infrastructure, and
              license support are all permissible. The open question is <strong>financial</strong>: Oracle carries
              meaningful interest-bearing debt from past acquisitions, and its debt ratio has at times moved close to the
              AAOIFI 30% cap. Treat ORCL as <strong>conditionally compliant — verify the current debt ratio</strong>, and
              purify any dividend income.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Oracle&apos;s revenue is overwhelmingly software and cloud:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Cloud services &amp; license support</strong> (~75%) — permissible</li>
              <li><strong>Cloud license &amp; on-premise license</strong> (~10%) — permissible</li>
              <li><strong>Hardware</strong> (~6%) — permissible</li>
              <li><strong>Services</strong> (~9%) — consulting/implementation, permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              There is no material revenue from alcohol, gambling, conventional finance, or other prohibited activities.
              The business screen is clean.
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
                    <th className="p-3 font-semibold text-gray-700">ORCL note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">The key constraint — debt-funded acquisitions push this up</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Generally comfortable</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically low</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              For ORCL the interest-bearing-debt ratio is the line to watch. Because it sits closer to the threshold than
              for cash-rich tech peers, the screen can change quarter to quarter — verify before buying.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              If ORCL passes the ratios in the period you hold it, scholars still require <em>purifying</em> the small
              non-permissible share of income (mainly interest earned on cash) by donating it to charity. Barakah
              calculates the exact figure from the most recent quarterly disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status and ORCL&apos;s debt ratio is the swing factor. Before you buy,
              confirm the current AAOIFI Standard 21 ratios against the latest quarterly filing. Barakah Plus ($9.99/mo)
              runs the full ratio screen live whenever you check ORCL and re-screens the tickers you hold automatically.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/crm" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">CRM →</Link>
              <Link href="/halal-stocks/msft" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">MSFT →</Link>
              <Link href="/halal-stocks/adbe" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">ADBE →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
