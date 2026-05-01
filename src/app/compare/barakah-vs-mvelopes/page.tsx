import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Mvelopes (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Mvelopes built the digital envelope system. But it has no zakat, no hawl, no halal screening, no riba detection. Barakah brings the Islamic layer to envelope budgeting.",
  keywords: [
    'barakah vs mvelopes',
    'mvelopes for muslims',
    'halal alternative mvelopes',
    'envelope budgeting muslim',
    'mvelopes alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-mvelopes' },
  openGraph: {
    title: 'Barakah vs Mvelopes (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Mvelopes and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-mvelopes',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', mvelopes: 'Digital envelope budgeting system', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', mvelopes: '$5.97 – $19.97/mo by tier', winner: 'Barakah' as const, note: 'Mvelopes Premier ($19.97) is the priciest in this category.' },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', mvelopes: 'Yes — broad US coverage', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', mvelopes: 'Limited; envelopes are spending-focused', winner: 'Barakah' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', mvelopes: 'Pure envelope system — strict zero-based', winner: 'Mvelopes' as const, note: 'If you want envelopes specifically, Mvelopes invented the digital version.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', mvelopes: 'Shared envelopes on higher tiers', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', mvelopes: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', mvelopes: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', mvelopes: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', mvelopes: 'None', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', mvelopes: 'None', winner: 'Barakah' as const },
  { feature: 'Debt paydown tools', barakah: 'Riba-aware paydown ranking', mvelopes: 'Built-in debt reduction planner', winner: 'Mvelopes' as const, note: 'Mvelopes\' debt module on Premier is detailed.' },
  { feature: 'Coaching / 1-on-1', barakah: 'Self-serve + scholar-reviewed methodology', mvelopes: 'Premier tier includes a coach', winner: 'Mvelopes' as const, note: 'A real human coach is genuinely useful for some users.' },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', mvelopes: 'iOS & Android, mature but dated UI', winner: 'Barakah' as const },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', mvelopes: 'Standard SaaS; no data sale per policy', winner: 'Tie' as const },
];

export default function BarakahVsMvelopesPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/compare" className="hover:text-[#1B5E20] transition">Compare</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">Barakah vs Mvelopes</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Mvelopes (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Mvelopes pioneered digital envelope budgeting and that&apos;s still its strength. If you&apos;re a strict
            envelope-system devotee with high-interest debt and want a coach, the Premier tier earns its $19.97. But
            for a Muslim household, Mvelopes treats interest as ordinary income, has no zakat, and won&apos;t tell you
            whether your stocks are halal. Different problems, different tools.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Mvelopes</strong> if: you want strict envelopes, a debt-paydown coach, and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you want flexible budgeting plus zakat, hawl, halal screening, and the Islamic compliance layer.</li>
              <li><strong>Use both</strong> if: Mvelopes for the envelope discipline; Barakah for the Islamic layer and investments.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Mvelopes</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.mvelopes}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Mvelopes' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Mvelopes is a serious tool for serious envelope users. The price is high and the UI feels older than it
              should, but the methodology works. For a Muslim household, the bigger question is whether you want
              envelopes badly enough to pay envelope prices and still need a separate workflow for zakat and halal
              checking. Barakah Plus at $9.99 covers more ground for less.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Mvelopes doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
