import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Unilever (UL) Halal? Shariah Screening 2026',
  description:
    "Is Unilever stock halal? Full AAOIFI screening review for UL — business-activity check (food, home & personal care), the three financial ratios where debt is the swing factor, purification guidance, and why screeners can disagree.",
  keywords: ['is unilever halal', 'ul halal', 'unilever stock halal', 'is unilever shariah compliant', 'unilever zoya shariah compliance'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/ul' },
  openGraph: {
    title: 'Is Unilever (UL) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Unilever (UL) — compliance status, the three ratios, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/ul',
    type: 'article',
  },
};

export default function UlPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Unilever stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Unilever (UL) passes the AAOIFI business-activity screen — its revenue comes from food, ice cream, home care, and personal care, all permissible. The deciding factor is financial: like many consumer-staples companies, Unilever carries meaningful interest-bearing debt, so the debt-to-market-cap ratio is the swing item that can move it in or out of compliance. Different screeners (such as Zoya or Musaffa) may reach different verdicts depending on the period and their exact methodology. Always verify the current ratio before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Why do screeners disagree on whether Unilever is halal?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Because compliance hinges on financial ratios that change every quarter and that each screener calculates slightly differently — some use a trailing-12-month average market cap, others a point-in-time figure, and debt levels shift with share price. Unilever's business is clean, so the disagreement is almost always about whether its debt ratio sits just under or just over the 30% threshold at that moment.",
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
          <span className="text-gray-900">UL</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Unilever (UL) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-22 · AAOIFI methodology</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Unilever (<strong>UL</strong>) clears the business-activity screen — food, ice cream, home care, and
              personal care are all permissible. The open question is <strong>financial</strong>: Unilever carries
              meaningful interest-bearing debt, and its debt ratio can sit close to the AAOIFI 30% cap. Treat UL as
              <strong> conditionally compliant — verify the current debt ratio</strong>, and purify dividend income.
              This is also why screeners like Zoya and Musaffa sometimes disagree on it.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Unilever&apos;s revenue spans consumer staples across five segments:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Beauty &amp; Wellbeing</strong> — permissible</li>
              <li><strong>Personal Care</strong> — soaps, deodorants, oral care — permissible</li>
              <li><strong>Home Care</strong> — cleaning &amp; laundry products — permissible</li>
              <li><strong>Nutrition</strong> — foods, condiments, dressings — permissible</li>
              <li><strong>Ice Cream</strong> — permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              Unilever exited alcohol long ago and does not sell tobacco, so there is no material prohibited revenue at
              the business level. (Individual food products may contain non-halal ingredients, but that is a
              product-purchase question for consumers, not a stock business-screen disqualifier.)
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
                    <th className="p-3 font-semibold text-gray-700">UL note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">The swing factor — consumer-staples leverage can run close to the cap</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Generally comfortable</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Typically low</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              The debt ratio is what determines UL&apos;s status in any given quarter. Because it can hover near the
              threshold, the verdict genuinely changes over time — point-in-time verification matters more here than for
              a cash-rich, low-debt tech company.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              If UL passes the ratios in the period you hold it, scholars still require <em>purifying</em> the small
              non-permissible share of income (mainly interest earned on cash) by donating it to charity. Unilever pays
              a meaningful dividend, so the purification step is relevant for most holders. Barakah calculates the exact
              figure from the latest disclosure.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status, and UL&apos;s debt ratio is the swing factor. Before you
              buy, confirm the current AAOIFI Standard 21 ratios against the latest filing. Barakah Plus ($9.99/mo) runs
              the full ratio screen live whenever you check UL and re-screens the tickers you hold automatically.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/aapl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">AAPL →</Link>
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
