import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Adobe (ADBE) Halal? Shariah Screening 2026',
  description:
    "Is Adobe stock halal? Full AAOIFI screening review for ADBE — business-activity check, the three financial ratios, purification guidance, and what to verify before you buy.",
  keywords: ['is adobe halal', 'adbe halal', 'adobe stock halal', 'is adbe shariah compliant', 'adobe shariah'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/adbe' },
  openGraph: {
    title: 'Is Adobe (ADBE) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Adobe (ADBE) — compliance status, ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/adbe',
    type: 'article',
  },
};

export default function AdbePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Adobe stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Adobe (ADBE) has historically passed AAOIFI halal screening. Its revenue is overwhelmingly software subscriptions (Creative Cloud, Document Cloud, Experience Cloud), all permissible, and it carries little debt with strong cash generation. Its financial ratios have generally stayed within AAOIFI thresholds — the cash-and-securities ratio is the one to glance at. Compliance is recalculated quarterly; verify before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to purify income from Adobe stock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Adobe does not pay a dividend, so returns are realized through capital gains. Scholars still require purifying the non-permissible share of income — primarily interest Adobe earns on its cash and short-term investments — by donating the proportional amount to charity. Barakah calculates this automatically from the latest quarterly disclosure.",
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
          <span className="text-gray-900">ADBE</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Adobe (ADBE) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-20 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Adobe (<strong>ADBE</strong>) has historically been considered <strong>halal</strong> by most major
              AAOIFI-based screeners. Its business is subscription software, with very low debt and strong cash flow, so
              its financial ratios have generally stayed within Shariah-compliant thresholds. Re-verify the screen
              <em> quarterly</em> and purify any income.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Adobe&apos;s revenue is almost entirely recurring software subscriptions:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Digital Media</strong> (~73%) — Creative Cloud (Photoshop, Illustrator, Premiere) &amp; Document Cloud (Acrobat, PDF) — permissible</li>
              <li><strong>Digital Experience</strong> (~25%) — analytics &amp; marketing software — permissible</li>
              <li><strong>Publishing &amp; advertising</strong> (~2%) — permissible</li>
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
                    <th className="p-3 font-semibold text-gray-700">ADBE note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Low — modest debt relative to market cap</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Holds cash &amp; short-term investments — the ratio to watch</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically &lt; 2%</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Adobe&apos;s low leverage keeps the debt ratio easy; the cash-and-securities ratio is the one most screeners
              glance at. ADBE has generally cleared all three, but point-in-time verification matters.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Even when ADBE passes screening, a small percentage of its income comes from interest on cash and
              investments. Scholars require <em>purifying</em> that non-permissible share of any gains by donating it to
              charity. Barakah calculates the exact figure from the latest quarterly disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current compliance against the
              latest quarterly filing. Barakah Plus ($9.99/mo) runs the full AAOIFI Standard 21 ratio screen live whenever
              you check ADBE, and re-screens the tickers you hold automatically.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/crm" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">CRM →</Link>
              <Link href="/halal-stocks/msft" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">MSFT →</Link>
              <Link href="/halal-stocks/orcl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">ORCL →</Link>
              <Link href="/halal-stocks" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">All tickers →</Link>
              <Link href="/signup" className="rounded-full bg-[#1B5E20] px-3 py-1 text-sm text-white hover:bg-[#2E7D32] transition">Screen live →</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
