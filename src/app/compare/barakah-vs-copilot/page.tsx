import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Barakah vs Copilot Money (2026): Halal Alternative for Muslim Households | Barakah',
  description:
    "Copilot Money is the most beautiful iOS budgeting app — but it's iOS-only, and there's no zakat, no hawl, no halal screening, no riba detection. Barakah covers Android + the full Islamic layer.",
  keywords: [
    'barakah vs copilot',
    'copilot money for muslims',
    'halal alternative copilot money',
    'muslim copilot alternative',
    'copilot money alternative islamic',
  ],
  alternates: { canonical: 'https://trybarakah.com/compare/barakah-vs-copilot' },
  openGraph: {
    title: 'Barakah vs Copilot Money (2026) — Halal Alternative for Muslim Households | Barakah',
    description: 'Honest comparison of Copilot Money and Barakah for Muslim households.',
    url: 'https://trybarakah.com/compare/barakah-vs-copilot',
    type: 'article',
  },
};

const rows = [
  { feature: 'Core product', barakah: 'Muslim household financial OS', copilot: 'iOS-first beautiful budgeting app — design-led personal finance', winner: 'Different jobs' as const },
  { feature: 'Pricing', barakah: 'Free + $9.99/mo Plus + $14.99/mo Family', copilot: '$13/mo or $95/yr (no free tier; 30-day trial)', winner: 'Barakah' as const },
  { feature: 'Bank aggregation', barakah: 'Plaid — 12,000+ US banks', copilot: 'Plaid + MX + Finicity — broad US coverage', winner: 'Tie' as const },
  { feature: 'Investments tracking', barakah: 'Yes (read-only via Plaid)', copilot: 'Yes — clean visualizations, brokerage + crypto', winner: 'Tie' as const },
  { feature: 'Budgeting methodology', barakah: 'Category-based, flexible', copilot: 'Category-based with intelligent auto-categorization (uses ML)', winner: 'Copilot' as const, note: 'Copilot\'s auto-categorization is genuinely the cleanest in market.' },
  { feature: 'Collaborative / family', barakah: 'Family plan — 6 seats, shared budgets + zakat', copilot: 'Single user — no native multi-user / household sharing', winner: 'Barakah' as const },
  { feature: 'Zakat (multi-asset)', barakah: 'Cash + gold + silver + stocks + 401k + rental + crypto + business', copilot: 'None', winner: 'Barakah' as const },
  { feature: 'Hawl continuity tracking', barakah: 'Daily nisab-check, fiqh-aware', copilot: 'None', winner: 'Barakah' as const },
  { feature: 'Halal stock screening', barakah: '30,000+ AAOIFI-screened', copilot: 'None', winner: 'Barakah' as const },
  { feature: 'Riba / interest detection', barakah: 'Transaction-level flagging + purification', copilot: 'None — interest just shows as income', winner: 'Barakah' as const },
  { feature: 'Islamic will / faraid', barakah: 'Faraid calculator + wasiyyah builder', copilot: 'None', winner: 'Barakah' as const },
  { feature: 'Net-worth history', barakah: 'Yes, with integrity-hash snapshots', copilot: 'Yes — clean trend chart, but newer product so shorter history', winner: 'Tie' as const },
  { feature: 'Mobile app quality', barakah: 'Live on iOS & Android', copilot: 'Award-winning iOS + Mac; Android shipped late but still less mature', winner: 'Copilot' as const, note: 'Copilot is the design benchmark for personal-finance apps on iOS.' },
  { feature: 'Privacy', barakah: 'Self-hosted option on roadmap; no data sold', copilot: 'No data sold; clear privacy policy', winner: 'Tie' as const },
];

export default function BarakahVsCopilotPage() {
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
          <span className="text-gray-900">Barakah vs Copilot Money</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="mb-4 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Barakah vs Copilot Money (2026)</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-26</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Copilot Money is the most beautiful budgeting app on iOS — period. The auto-categorization is the cleanest in
            the market, and the design is Apple-Design-Award caliber. But it&apos;s iOS-first (Android arrived late and
            remains less mature), it&apos;s single-user, and it has none of the Islamic-finance features Muslim households
            need. Barakah covers Android-first equally, supports family plans, and ships zakat / hawl / halal / riba /
            wasiyyah out of the box.
          </p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">The quick read</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              <li><strong>Keep Copilot</strong> if: you&apos;re iOS-only, single-user, and value design / auto-categorization above all — and you handle zakat separately.</li>
              <li><strong>Switch to Barakah</strong> if: you&apos;re on Android, share finances with a spouse, or want zakat + hawl + halal + riba + will in the same app.</li>
              <li><strong>Use both</strong> if: you love Copilot&apos;s daily UX. Copilot for budgeting; Barakah Plus ($9.99/mo) for the Islamic layer.</li>
            </ul>
          </section>

          <section className="mb-10 overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Feature-by-feature</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left">
                  <th className="py-2 pr-3 font-semibold text-gray-700">Feature</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Barakah</th>
                  <th className="py-2 pr-3 font-semibold text-gray-700">Copilot</th>
                  <th className="py-2 font-semibold text-gray-700">Winner</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature} className="border-b border-gray-100 align-top">
                    <td className="py-3 pr-3 font-semibold text-gray-900">{r.feature}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.barakah}</td>
                    <td className="py-3 pr-3 text-xs text-gray-700">{r.copilot}</td>
                    <td className="py-3">
                      <span className={
                        r.winner === 'Barakah' ? 'rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white' :
                        r.winner === 'Copilot' ? 'rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white' :
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
              Copilot is, frankly, the prettiest personal-finance app on the App Store, and its ML-powered
              auto-categorization saves real time. But it&apos;s $95/yr for a single iPhone user — no Android-first
              experience, no spouse-sharing, and no Islamic-finance features. For an observant Muslim household, the math
              is straightforward: Barakah Family covers two devices on either OS, both spouses, and the full Islamic
              layer for $14.99/mo. If you already love Copilot and won&apos;t switch, bolt on Barakah Plus ($9.99/mo) for
              the zakat / hawl / halal / riba / wasiyyah pieces Copilot will never ship.
            </p>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Add the Islamic layer to your setup</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Link your accounts via Plaid; get zakat, hawl, halal screening, riba detection, and wasiyyah builder —
              everything Copilot doesn&apos;t do for Muslim households. Free for {DEFAULT_ONBOARDING_TRIAL_DAYS_LABEL}.
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
