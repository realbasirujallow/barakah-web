import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Is Nestlé (NSRGY) Halal? Shariah Screening 2026',
  description:
    "Is Nestlé stock halal? Full AAOIFI screening review for NSRGY (Nestlé ADR) — business-activity check across food, water, coffee, pet care; the three financial ratios; ethical concerns scholars sometimes flag; purification guidance.",
  keywords: ['is nestle halal', 'nsrgy halal', 'nestle stock halal', 'is nsrgy shariah compliant', 'nestle shariah', 'nesn halal'],
  alternates: { canonical: 'https://trybarakah.com/halal-stocks/nsrgy' },
  openGraph: {
    title: 'Is Nestlé (NSRGY) Halal? Shariah Screening 2026',
    description: 'AAOIFI screening review of Nestlé (NSRGY) — compliance status, the three ratios, ethical concerns, purification guidance.',
    url: 'https://trybarakah.com/halal-stocks/nsrgy',
    type: 'article',
  },
};

export default function NsrgyPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is Nestlé stock halal in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Nestlé (NSRGY) generally passes the AAOIFI business-activity screen — the vast majority of its revenue comes from permissible food, bottled water, coffee, pet care, and infant nutrition. A small share of revenue is from products containing alcohol or non-halal ingredients in certain markets, but this stays under the 5% non-permissible threshold. Financially, Nestlé's blue-chip balance sheet typically keeps the debt ratio inside AAOIFI limits. Many Shariah screeners (Zoya, Musaffa, Wahed) currently list it as compliant — but ratios are recalculated quarterly, and some scholars also weigh non-AAOIFI ethical concerns (infant-formula marketing history, water-sourcing controversies). Verify current ratios before buying.",
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to purify dividends from Nestlé stock?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Even when NSRGY passes screening, a small portion of revenue is from non-permissible categories and interest on cash. Scholars require purifying that non-permissible share of dividends and capital gains by donating it to charity. Barakah calculates the exact purification amount from the latest disclosure.",
        },
      },
      {
        '@type': 'Question',
        name: 'What’s the difference between NSRGY and NESN?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Same company. NESN is Nestlé's primary listing on the SIX Swiss Exchange (Zurich, in Swiss francs). NSRGY is the unsponsored ADR (American Depositary Receipt) that trades over-the-counter in the US in dollars. Each NSRGY represents one NESN share. The underlying business and Shariah screening are identical; only the listing venue and currency differ.",
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
          <span className="text-gray-900">NSRGY</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Is Nestlé (NSRGY) Halal?</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-05-25 · AAOIFI methodology · NSRGY ADR / NESN Swiss listing</p>

          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Quick answer</h2>
            <p className="text-base leading-7 text-gray-800">
              Nestlé (<strong>NSRGY</strong>, ADR for Swiss-listed <strong>NESN</strong>) generally clears the AAOIFI screens
              — the bulk of revenue is permissible food, bottled water, coffee, pet care, and infant nutrition, and
              non-permissible categories sit below the 5% threshold. Financial ratios typically pass. <strong>Treat NSRGY
              as compliant pending live ratios.</strong> Note the separate non-AAOIFI concerns below — some Muslim
              investors factor those in even when the formal screen passes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Stage 1: Business-activity screen</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">Nestlé&apos;s revenue spans seven product segments:</p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Powdered &amp; Liquid Beverages</strong> — Nescafé, Nespresso, Nesquik — permissible</li>
              <li><strong>Water</strong> — Perrier, S.Pellegrino, Pure Life — permissible</li>
              <li><strong>Milk products &amp; Ice Cream</strong> — Carnation, Häagen-Dazs (intl), Drumstick — mostly permissible (check individual products in non-Muslim markets for alcohol-flavored variants)</li>
              <li><strong>Nutrition &amp; Health Science</strong> — Gerber infant formula, Boost, Garden of Life — permissible</li>
              <li><strong>Prepared Dishes &amp; Cooking Aids</strong> — Maggi, Stouffer&apos;s, DiGiorno — mostly permissible (some regional variants contain non-halal meat or trace alcohol; halal-certified lines exist in Muslim-majority markets)</li>
              <li><strong>Confectionery</strong> — KitKat, Smarties, Aero — permissible (some Muslim-market variants are halal-certified)</li>
              <li><strong>PetCare</strong> — Purina, Friskies, Pro Plan — permissible</li>
            </ul>
            <p className="text-base leading-7 text-gray-800 mt-3">
              <strong>The flagged share</strong> — small amounts of revenue come from products containing alcohol (e.g.,
              certain liqueur-infused chocolates and ice creams in European markets) or non-halal animal ingredients in
              non-Muslim regions. AAOIFI tolerates this provided <strong>total non-permissible revenue stays under 5%</strong>
              of group revenue. For Nestlé that test is met — but the ratio is recalculated each quarter.
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
                    <th className="p-3 font-semibold text-gray-700">NSRGY note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing debt</td><td className="p-3">&lt; 30%</td><td className="p-3">Comfortable — blue-chip balance sheet keeps this in check</td></tr>
                  <tr className="border-b border-gray-100"><td className="p-3 font-semibold">Interest-bearing securities + cash</td><td className="p-3">&lt; 30%</td><td className="p-3">Generally comfortable</td></tr>
                  <tr><td className="p-3 font-semibold">Non-permissible income</td><td className="p-3">&lt; 5%</td><td className="p-3">Tight — passes, but it&apos;s the ratio to watch</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm italic text-gray-600 mt-3">
              Nestlé&apos;s large market cap and steady cash flow help keep the debt ratio low, but it moves with the
              share price — verify the current figure before buying.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-blue-50 border border-blue-200 p-6">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Beyond AAOIFI — ethical concerns to weigh</h2>
            <p className="text-sm leading-7 text-blue-900 mb-3">
              The AAOIFI screen is a <em>financial</em> Shariah test. Some scholars and Muslim investors additionally weigh
              broader ethical concerns that are <strong>not part of the formal screen</strong> but may matter to you:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm leading-7 text-blue-900">
              <li><strong>Infant-formula marketing history</strong> — Nestlé&apos;s 1970s–80s marketing practices in developing
                  countries drew long-running boycotts and remain a reputational issue scholars sometimes cite.</li>
              <li><strong>Bottled-water sourcing</strong> — disputes over groundwater rights in several jurisdictions
                  (US, France, Pakistan).</li>
            </ul>
            <p className="text-sm leading-7 text-blue-900 mt-3">
              These are ethical/governance considerations, not AAOIFI Standard 21 tests. NSRGY can pass formal Shariah
              screening while still being something a Muslim investor avoids on ethical grounds. Your call.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Purification amount</h2>
            <p className="text-base leading-7 text-gray-800">
              Even when NSRGY passes screening, a portion of income is from non-permissible product categories and interest
              on cash. Scholars require <em>purifying</em> that share of dividends or capital gains by donating it to
              charity. Barakah calculates the exact purification figure from the latest disclosure each quarter.
            </p>
          </section>

          <section className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">Check live compliance</h2>
            <p className="text-sm leading-7 text-amber-900">
              This page reflects <em>historical</em> status. Before you buy, confirm current AAOIFI Standard 21 ratios
              against the latest filing — both the non-permissible revenue share and the debt ratio can shift quarter to
              quarter. Barakah Plus ($9.99/mo) runs the full ratio screen live whenever you check NSRGY.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Related tickers</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/halal-stocks/ul" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">UL →</Link>
              <Link href="/halal-stocks/pg" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">PG →</Link>
              <Link href="/halal-stocks/ko" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">KO →</Link>
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
