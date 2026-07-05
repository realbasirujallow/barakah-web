import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Monarch Alternative for Muslims — Halal Money Tracker (Barakah 2026)',
  description:
    'Monarch is the post-Mint pick for net-worth tracking, but it ignores zakat, hawl, halal investing, and Islamic estate planning. Barakah keeps Monarch-style household visibility and adds the Islamic-finance layer Muslim households actually need.',
  keywords: [
    'monarch alternative for muslims',
    'monarch for muslims',
    'halal alternative to monarch',
    'islamic finance monarch',
    'muslim money tracker',
    'monarch vs barakah',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/monarch-alternative-for-muslims' },
  openGraph: {
    title: 'Monarch Alternative for Muslims — Halal Money Tracker',
    description: "Monarch is the post-Mint pick — but it doesn't compute zakat, track hawl, screen halal stocks, or plan Islamic wills. Barakah does.",
    url: 'https://trybarakah.com/learn/monarch-alternative-for-muslims',
    type: 'article',
  },
};

const comparisonRows = [
  { area: 'Core product', monarch: 'Subscription household-finance dashboard with strong mainstream UX.', barakah: 'Fiqh-aware household finance OS — budget + zakat + hawl + halal screen + riba + Islamic will.', winner: 'Different jobs' },
  { area: 'Pricing model', monarch: 'Paid subscription only, billed monthly or yearly.', barakah: 'Free; Plus and Family paid plans for Muslim household workflows.', winner: 'Barakah on access' },
  { area: 'Net-worth tracking', monarch: 'Strong reporting, custom assets, real-estate values, and long-history UX.', barakah: 'Linked/manual assets, snapshots, debt coverage, and zakat-aware treatment.', winner: 'Monarch on depth' },
  { area: 'Dashboard customization', monarch: 'Customizable dashboard widgets and drag-and-drop ordering.', barakah: 'Daily priorities, Islamic finance cards, and dashboard widgets; less customizable today.', winner: 'Monarch on polish' },
  { area: 'Joint household UX', monarch: 'Household collaboration, partner review, and advisor/pro access.', barakah: 'Family plan up to 6 members with household rollups and Islamic workflows.', winner: 'Different jobs' },
  { area: 'Bank sync', monarch: 'Multiple financial data providers and broad institution coverage.', barakah: 'Plaid-backed account sync.', winner: 'Monarch on coverage' },
  { area: 'Zakat calculator (multi-asset)', monarch: 'None', barakah: 'Cash, gold, silver, stocks, 401k/IRA, rental, crypto, business inventory — multi-madhab', winner: 'Barakah' },
  { area: 'Hawl anniversary tracking', monarch: 'None', barakah: 'Daily nisab check, fiqh-aware reset rules, anniversary reminders', winner: 'Barakah' },
  { area: 'Halal stock screening', monarch: 'None — investment view shows all your holdings without Shariah filter', barakah: '30,000+ ticker library + on-demand AAOIFI Standard 21 screen', winner: 'Barakah' },
  { area: 'Riba / interest detection', monarch: 'None — interest income shown as positive cash flow', barakah: 'Transaction-level flagging with purification math', winner: 'Barakah' },
  { area: 'Islamic estate planning', monarch: 'None', barakah: 'Faraid calculator + wasiyyah builder', winner: 'Barakah' },
  { area: 'Budgeting', monarch: 'Flex budgeting, category budgeting, rollovers, forecasts, and strong widget UX.', barakah: 'Category budgets, rollovers, safe-to-spend, forecasts, integrated with zakat and riba detector.', winner: 'Tie' },
  { area: 'Recurring bills', monarch: 'Bills and subscriptions as calendar/list, plus reminders.', barakah: 'Recurring rules, monthly overview, list + calendar; reminders still less mature.', winner: 'Monarch on polish' },
  { area: 'Investments', monarch: 'Holdings, allocation, movers, and risk profile UX.', barakah: 'Holdings, allocation/risk/movers, benchmarks, halal screening, and zakat handling.', winner: 'Tie' },
  { area: 'Mobile app polish', monarch: 'Mature iOS + Android', barakah: 'iOS + Android live; iterating fast', winner: 'Monarch on maturity' },
  { area: 'Privacy posture', monarch: 'Subscription-funded — no ads, no data sales (per their published privacy stance)', barakah: 'Subscription-funded — no ads, no data sales, self-hosted option on roadmap', winner: 'Tie' },
];

const faqItems = [
  {
    q: 'Is Monarch halal for Muslims to use?',
    a: "Monarch the product is neutral — it's a finance dashboard, and dashboards are permissible. The Shariah-relevant concerns for Muslim Monarch users are about what Monarch leaves to you: it doesn't compute zakat across your multi-asset wealth, doesn't track your hawl, doesn't surface interest income (riba) on the cash side or distinguish purification-required dividends on the investment side, and doesn't help with halal stock screening or wasiyyah. Using Monarch is fine; it just doesn't carry the Islamic-finance layer.",
  },
  {
    q: 'Why is Monarch the most-recommended Mint successor?',
    a: "Mint shut down in 2024; Monarch was the most carefully-designed alternative in the immediate aftermath — built by ex-Mint engineers in some cases, with thoughtful joint-account UX for couples and a clean net-worth view. For a household whose finances are simple and whose religious framework doesn't need to be reflected in the app, Monarch is genuinely good. For Muslim households who want zakat + hawl + halal + riba + will woven into the same product, the alternative is purpose-built.",
  },
  {
    q: "Can I use Monarch's net-worth view AND Barakah's Islamic layer together?",
    a: "Yes, and that's a reasonable bridge if your portfolio is complex enough that you want Monarch's net-worth depth. Many users keep Monarch for the cross-account visualisation and use Barakah for zakat, hawl, halal stock screening, riba detection, and Islamic will planning. The two apps don't conflict — they look at different aspects of your finances. The cleaner long-term setup is consolidation, but the hybrid works.",
  },
  {
    q: "What does Barakah do that Monarch doesn't on joint household finance?",
    a: "Monarch is optimised for couples (two users sharing accounts). Barakah's Family plan supports up to six members with privacy-preserving household roll-ups — each member keeps their own private accounts and hawl, while the household sees joint goals and a non-leaking zakat-due status. For Muslim extended families and multi-generational households that's a meaningful structural difference.",
  },
  {
    q: 'Is the Monarch-to-Barakah migration straightforward?',
    a: "Yes for the household-finance side: link your accounts via Plaid in Barakah and they sync the same way Monarch's Plaid integration does. The history depth in Barakah is shorter than Monarch's multi-year track record, but ongoing data builds from the moment you link. Zakat history starts from your first hawl-completion in Barakah; previous years remain in whatever record you used before.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Monarch Alternative for Muslims', item: 'https://trybarakah.com/learn/monarch-alternative-for-muslims' },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Monarch Alternative for Muslims</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">

          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Monarch alternative for Muslims</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-07-04</p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#1B5E20] mb-2">The short version</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Monarch is one of the strongest post-Mint picks for US households — clean net-worth views, flexible budgeting,
              recurring bills, reports, household collaboration, and a mature mobile experience. For Muslim households it
              leaves an entire layer of the finances on the side of the road: there&apos;s no zakat across your multi-asset
              wealth, no hawl tracker, no halal stock screen, no riba flagging, no wasiyyah planner.
            </p>
            <p className="text-base leading-7 text-gray-800">
              Barakah keeps the net-worth + budgeting visibility you came to Monarch for and adds the Islamic-finance layer Muslim families actually need. This page is an honest comparison including where Monarch still wins.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">The quick decision</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Stay on Monarch</strong> if: you love Monarch&apos;s dashboard, reports, recurring calendar, investment UX, and collaboration model, and you are comfortable doing the Islamic layer outside the app.</li>
              <li><strong>Switch to Barakah</strong> if: you want one app that handles budget + zakat + hawl + halal + riba + will for a Muslim household, especially a multi-member one.</li>
              <li><strong>Use both</strong> if: you want Monarch&apos;s mainstream polish today alongside Barakah&apos;s Islamic-finance engine while Barakah keeps closing parity gaps.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Area</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Monarch</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((r) => (
                  <tr key={r.area} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.area}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.monarch}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 text-xs">
                      <span className={
                        r.winner === 'Barakah' || r.winner === 'Barakah on price' || r.winner === 'Barakah on scale' ?
                          'rounded-full bg-[#1B5E20] px-2 py-0.5 font-semibold text-white' :
                        r.winner.startsWith('Monarch') ?
                          'rounded-full bg-gray-700 px-2 py-0.5 font-semibold text-white' :
                          'rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-900'
                      }>{r.winner}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-2">The honest take</h2>
            <p className="text-sm leading-6 text-amber-900">
              Monarch is genuinely good at what it does, and for a mainstream finance dashboard it is the right answer for many households.
              For a Muslim household that wants the same household visibility plus zakat, hawl, halal screening, riba detection,
              and wasiyyah — without running a parallel spreadsheet — Barakah was built for exactly that gap. Try the free tier
              alongside Monarch and see whether enough of the Islamic-finance layer pulls itself together that the switch, or the
              parallel use, is worth it.
            </p>
          </section>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-3">Frequently asked</h2>
            <div className="space-y-4">
              {faqItems.map((f) => (
                <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                  <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-3">Related</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/learn/ynab-alternative-for-muslims" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">YNAB alternative for Muslims</Link>
              <Link href="/learn/mint-alternative-for-muslims" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Mint alternative for Muslims</Link>
              <Link href="/learn/islamic-finance-app" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Best Islamic finance app</Link>
              <Link href="/family" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Family plan</Link>
              <Link href="/compare/barakah-vs-monarch" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Barakah vs Monarch (full)</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Try Barakah free</h2>
            <p className="text-sm leading-6 text-green-100 mb-4">
              Sync accounts via Plaid. Watch zakat compute across cash, gold, stocks, and 401k. See whether enough of your Monarch-side gaps fill themselves in to make the switch worth it.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Start free →
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}
