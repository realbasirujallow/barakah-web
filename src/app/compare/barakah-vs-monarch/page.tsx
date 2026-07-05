import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Monarch Money (2026): Halal Alternative for Muslim Households',
  description:
    "Monarch is the most popular Mint successor. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah adds the Islamic layer to modern budgeting.",
  keywords: [
    'barakah vs monarch',
    'monarch money for muslims',
    'halal alternative monarch',
    'muslim budget app',
    'monarch alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-monarch' },
  openGraph: {
    title: 'Barakah vs Monarch Money (2026) — Halal Alternative for Muslim Households',
    description: 'Honest comparison of Monarch Money and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-monarch',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', monarch: 'Subscription personal-finance dashboard', winner: 'Different jobs' as const },
  { feature: 'Pricing model', barakah: 'Free + Plus + Family', monarch: 'Paid subscription only; monthly/yearly plans', winner: 'Barakah' as const },
  { feature: 'Bank aggregation', barakah: 'Plaid-backed account sync', monarch: 'Multiple financial data providers and broad institution coverage', winner: 'Monarch' as const },
  { feature: 'Dashboard', barakah: 'Islamic-first daily priorities, zakat, riba, net worth, widgets', monarch: 'Customizable drag-and-drop widget dashboard', winner: 'Monarch' as const, note: 'Monarch still wins on dashboard customization polish.' },
  { feature: 'Investments tracking', barakah: 'Holdings, halal screening, allocation/risk/movers, zakat treatment', monarch: 'Holdings, allocation, top movers, risk profile', winner: 'Tie' as const, note: 'Barakah adds the Islamic screen; Monarch is still visually more mature.' },
  { feature: 'Budgeting methodology', barakah: 'Category budgets, rollovers, safe-to-spend, forecasts', monarch: 'Flex budgeting + category budgeting + rollovers', winner: 'Tie' as const },
  { feature: 'Recurring bills', barakah: 'Recurring rules, monthly overview, list + calendar', monarch: 'Bills/subscriptions calendar, list, and reminders', winner: 'Monarch' as const, note: 'Barakah is close, but reminders/calendar polish still trail Monarch.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — up to 6 seats, household rollups, Islamic workflows', monarch: 'Household collaboration, partner review, advisor/pro access', winner: 'Monarch' as const, note: 'Barakah scales beyond couples; Monarch has stronger review/assignment workflows.' },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ library + on-demand AAOIFI ratios', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', monarch: 'None (shows interest as income)', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', monarch: 'None', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Snapshots, linked/manual assets, liabilities', monarch: 'Deep net-worth reporting, real-estate values, long history', winner: 'Monarch' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android; iterating quickly', monarch: 'Mature iOS + Android experience', winner: 'Monarch' as const },
  { feature: 'Privacy', barakah: 'Subscription-funded; no ads or data-selling business model', monarch: 'Subscription-funded; official pages say no ads and no sale of financial data', winner: 'Tie' as const },
];

const faqs = [
  {
    q: 'Is Monarch halal for Muslims?',
    a: "Monarch the app is a clean net-worth and household-finance dashboard — neutral by itself. The Shariah gap for Muslim users is what it doesn't do: no zakat across your multi-asset wealth, no hawl tracker, no halal stock screen, no riba flagging on interest income, no Islamic estate planner. Using Monarch is fine; it just leaves the Islamic-finance layer to you.",
  },
  {
    q: 'What does Barakah do that Monarch does not?',
    a: 'Zakat across cash, gold, stocks, 401k, rental, crypto, and business; hawl continuity tracking; AAOIFI screening on 30,000+ tickers; transaction-level riba detection with purification math; and faraid + wasiyyah. Monarch is better at dashboard customization and collaboration polish; Barakah is purpose-built for the Islamic-finance layer.',
  },
  {
    q: 'Can I use Monarch and Barakah together?',
    a: "Yes — a common bridge for households who love Monarch's net-worth view. Keep Monarch for portfolio visualisation; use Barakah for zakat, hawl, halal screening, riba detection, and Islamic will planning. Same bank connections via Plaid; no conflict between the apps.",
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function BarakahVsMonarchPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Monarch</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Monarch Money (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-07-04</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Monarch is one of the strongest post-Mint personal-finance apps: polished dashboards, flexible budgeting,
            recurring bills, reports, household collaboration, and investment views. But Monarch is not built around
            zakat, hawl, halal screening, riba purification, faraid, or wasiyyah. If those pieces matter — and for
            observant Muslim households, they do — Barakah is the Islamic layer Monarch does not try to be.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Monarch</strong> if: you want the most polished mainstream household-finance UX and you are comfortable handling zakat, halal screening, and riba review outside the app.</li>
              <li><strong>Switch to Barakah</strong> if: you want budget + net worth + zakat + hawl + halal + riba + Islamic estate planning in one Muslim-household product.</li>
              <li><strong>Use both</strong> if: you love Monarch&apos;s dashboard/reporting polish today and want Barakah for the Islamic-finance layer while Barakah keeps catching up on mainstream UX.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Monarch</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.monarch}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Monarch' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
                        'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900'
                      }>
                        {r.winner}
                      </span>
                      {r.note && <p className="mt-1 text-xs italic text-gray-500">{r.note}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">The honest recommendation</h2>
            <p className="text-sm leading-7 text-amber-900">
              Monarch&apos;s collaboration, dashboard customization, reports, recurring calendar, and investment UI are genuinely
              excellent. The gap is not that Monarch is bad; the gap is that it is religiously neutral. If you are a Muslim
              household, that means your zakat, hawl, halal screening, riba cleanup, and Islamic will still live somewhere
              else. Barakah is built to bring that layer into the same daily finance workflow.
            </p>
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Frequently asked</h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="rounded-xl border border-gray-200 p-4">
                  <summary className="cursor-pointer text-base font-semibold text-gray-900">{f.q}</summary>
                  <p className="mt-2 text-sm leading-7 text-gray-700">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Monarch doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Get started free →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
