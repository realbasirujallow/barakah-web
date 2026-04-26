import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Fudget (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Fudget is a $4.99 one-time list-based budget. It's deliberately simple — no bank sync, no zakat, no halal screening. Barakah covers the Muslim household end-to-end.",
  keywords: [
    'barakah vs fudget',
    'fudget for muslims',
    'halal alternative fudget',
    'muslim budget app',
    'fudget alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-fudget' },
  openGraph: {
    title: 'Barakah vs Fudget (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Fudget and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-fudget',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', fudget: 'Simple list-based budget tracker', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', fudget: '$4.99 one-time purchase', winner: 'Fudget' as const, note: 'Hard to beat a one-time fee if all you need is a list.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', fudget: 'None — fully manual', winner: 'Barakah' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', fudget: 'None', winner: 'Barakah' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', fudget: 'Plain in/out list, no categories required', winner: 'Tie' as const, note: 'Different philosophies — both valid.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', fudget: 'Single-user only', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', fudget: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', fudget: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', fudget: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', fudget: 'None', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', fudget: 'None', winner: 'Barakah' as const },
  { feature: 'Speed of entry', barakah: 'Plaid auto-import + manual', fudget: 'Famously fast manual entry', winner: 'Fudget' as const, note: 'Fudget\'s entry speed is its whole selling point.' },
  { feature: 'Learning curve', barakah: 'Moderate — Islamic concepts to learn', fudget: 'Near-zero — open and type', winner: 'Fudget' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', fudget: 'Mature on iOS & Android', winner: 'Tie' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', fudget: 'No accounts, all local — best in class', winner: 'Fudget' as const, note: 'Fudget stores nothing on a server. Best privacy story in budgeting.' },
];

export default function BarakahVsFudgetPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
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
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Fudget</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Fudget (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Fudget is intentionally a one-trick app: a list, a running total, $4.99 once. No bank sync, no charts, no
            cloud account. For people who want to type in numbers and see a balance, it&apos;s perfect. But it doesn&apos;t
            track investments, doesn&apos;t calculate zakat, and doesn&apos;t know what riba is. These are different tools for
            different jobs.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Fudget</strong> if: you want a no-frills list, full local privacy, and you handle zakat + investments elsewhere.</li>
              <li><strong>Switch to Barakah</strong> if: you want bank sync, investment tracking, and the Islamic compliance layer in one app.</li>
              <li><strong>Use both</strong> if: Fudget for daily cash tracking; Barakah for zakat, hawl, halal screening, and the household view.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Fudget</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.fudget}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Fudget' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Fudget is a great $5 purchase if all you need is a calculator with categories. It&apos;s not trying to be
              what Barakah is. The honest pitch is this: if your finances fit on a Fudget list and you don&apos;t care
              about zakat tracking, save your money. If you have investments, gold, retirement accounts, or want to
              calculate zakat correctly across asset classes, Barakah is doing a different job entirely.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Fudget doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
