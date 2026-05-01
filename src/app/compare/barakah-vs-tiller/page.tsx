import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Tiller (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Tiller is the spreadsheet-lover's budgeting tool — daily transaction sync straight to Google Sheets. But there's no zakat, no hawl, no halal screening, no riba detection. Barakah is the Islamic-first answer.",
  keywords: [
    'barakah vs tiller',
    'tiller for muslims',
    'halal alternative tiller',
    'muslim tiller alternative',
    'tiller alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-tiller' },
  openGraph: {
    title: 'Barakah vs Tiller (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Tiller and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-tiller',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', tiller: 'Daily bank-sync into Google Sheets / Excel — spreadsheet-first', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', tiller: '$79/year (no free tier; 30-day trial)', winner: 'Tie' as const, note: 'Tiller is cheaper if you only need spreadsheet sync; Barakah Free covers more out of the box.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', tiller: 'Plaid + Yodlee — broad US + some international', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', tiller: 'Yes — but you build the dashboard yourself in Sheets', winner: 'Barakah' as const, note: 'Tiller gives you raw data; you do the visualization.' },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', tiller: 'Whatever you build — comes with templates (Foundation, Envelope, etc.)', winner: 'Tie' as const, note: 'Tiller wins for tinkerers; Barakah wins for done-for-you.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', tiller: 'Share the Google Sheet — collaboration is free via Sheets', winner: 'Tie' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', tiller: 'None (build your own zakat sheet if you can)', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', tiller: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', tiller: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', tiller: 'None — interest income just appears as a row', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', tiller: 'None', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', tiller: 'Yes — Tiller appends daily balances; you graph them in Sheets', winner: 'Tie' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', tiller: 'No native mobile app — use Google Sheets app', winner: 'Barakah' as const, note: 'Tiller is fundamentally a desktop / spreadsheet experience.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', tiller: 'Data lives in your own Google account; Tiller does not sell data', winner: 'Tiller' as const, note: 'Tiller wins on data ownership — you own the spreadsheet.' },
];

export default function BarakahVsTillerPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Tiller</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Tiller (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Tiller is the spreadsheet-power-user&apos;s answer to budgeting: daily bank-sync straight into Google Sheets or
            Excel, with templates you customize endlessly. For tinkerers it&apos;s perfect. For Muslim households it&apos;s
            limited — there&apos;s no zakat engine, no hawl tracking, no halal screen, and you&apos;d be building each of those
            yourself with formulas. Barakah does the Islamic layer out of the box.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Tiller</strong> if: you love spreadsheets, want full data ownership, and are happy to build (or copy) zakat / halal logic in Sheets.</li>
              <li><strong>Switch to Barakah</strong> if: you want zakat, hawl, halal screening, and riba detection done for you — and a real mobile app.</li>
              <li><strong>Use both</strong> if: you want Tiller&apos;s raw data feed for power-user spreadsheets, and Barakah for the Islamic features and mobile experience.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Tiller</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.tiller}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Tiller' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Tiller is a beautiful product for spreadsheet people — and at $79/year it&apos;s the cheapest serious budgeting
              tool on this list. If you already live in Google Sheets, you&apos;d miss being able to pivot, formula, and slice
              your data. But every Islamic feature you&apos;d want — zakat across multiple asset types, hawl-aware nisab checks,
              30,000-stock halal screening, riba flagging on transaction sync, faraid distributions — would have to be
              hand-built. The honest answer for most Muslim households: use Barakah for the Islamic layer and budgeting,
              and keep Tiller only if you have specific spreadsheet workflows that justify it.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Tiller doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
