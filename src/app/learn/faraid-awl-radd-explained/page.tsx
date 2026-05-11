import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Faraid Awl &amp; Radd Explained — When Quranic Shares Don&apos;t Sum to 1',
  description:
    'When the prescribed faraid shares add up to MORE than the estate, Awl reduces them proportionally. When they add up to LESS, Radd returns the residual. Worked examples for both.',
  keywords: [
    'faraid awl',
    'faraid radd',
    'islamic inheritance edge cases',
    'awl and radd',
    'faraid worked examples',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/faraid-awl-radd-explained' },
  openGraph: {
    title: 'Faraid Awl &amp; Radd Explained',
    description:
      'When prescribed faraid shares overshoot or undershoot the estate. Worked examples for Awl + Radd.',
    url: 'https://trybarakah.com/learn/faraid-awl-radd-explained',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function FaraidAwlRaddPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Awl &amp; Radd Explained</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Faraid Awl &amp; Radd — when shares don&apos;t sum to 1
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Methodology summary, not a fatwa. The Barakah faraid
          calculator handles Awl and Radd automatically — this page explains what it&apos;s
          doing under the hood.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Why this is needed</h2>
          <p className="text-base text-gray-700">
            The Quran prescribes specific fractional shares for specific heirs (1/2 for a
            husband with no children, 1/4 with children, 1/3 for the mother, etc.). In some
            family compositions, the sum of all the prescribed shares is GREATER than 1 — the
            estate would have to grow to satisfy everyone. In other compositions, the sum is
            LESS than 1 — there&apos;s a residual nobody has been assigned. Awl and Radd are the
            classical mechanisms that handle these two situations.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Awl — when shares overshoot</h2>
          <p className="text-base text-gray-700 mb-3">
            <strong>Rule:</strong> When prescribed shares sum to more than 1 (more than the
            full estate), reduce all shares proportionally so they sum to exactly 1.
          </p>
          <p className="text-base text-gray-700 mb-3">
            <strong>Worked example:</strong> A wife survives her husband. He also leaves two full
            sisters and a mother. Quranic prescribed shares:
          </p>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700 mb-3">
            <li>Wife: 1/4 (no children)</li>
            <li>Two full sisters: 2/3 (combined)</li>
            <li>Mother: 1/6</li>
          </ul>
          <p className="text-base text-gray-700 mb-3">
            Sum: 3/12 + 8/12 + 2/12 = <strong>13/12</strong> — over 1.
          </p>
          <p className="text-base text-gray-700">
            Awl: increase the denominator from 12 to 13, so each share is reduced proportionally.
            Wife now gets 3/13 (≈23.1%), the two sisters get 8/13 (≈61.5%), the mother gets 2/13
            (≈15.4%). Total = 1.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Radd — when shares undershoot</h2>
          <p className="text-base text-gray-700 mb-3">
            <strong>Rule:</strong> When prescribed shares sum to less than 1, the residual is
            redistributed back to the prescribed-share heirs proportionally to their original
            shares. Radd does NOT apply to a surviving spouse — they get only their prescribed
            share, never the residual.
          </p>
          <p className="text-base text-gray-700 mb-3">
            <strong>Worked example:</strong> A daughter survives her father. No spouse, no other
            heirs.
          </p>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700 mb-3">
            <li>Daughter: 1/2 (single daughter, no sons)</li>
          </ul>
          <p className="text-base text-gray-700 mb-3">
            Sum: 1/2 — leaves 1/2 unassigned. Without Radd this 1/2 goes to the public treasury
            (bayt al-mal). With Radd, the daughter inherits the full 1.
          </p>
          <p className="text-base text-gray-700 mb-3">
            <strong>Spouse exception worked example:</strong> A wife and a daughter survive a man
            with no other heirs.
          </p>
          <ul className="list-disc list-inside space-y-1 text-base text-gray-700 mb-3">
            <li>Wife: 1/8 (with children)</li>
            <li>Daughter: 1/2</li>
          </ul>
          <p className="text-base text-gray-700">
            Sum: 5/8 — leaves 3/8 unassigned. The wife&apos;s 1/8 is fixed (no Radd to spouses). The
            full 3/8 residual goes to the daughter via Radd, so the daughter takes 7/8 total and
            the wife takes 1/8.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Madhab differences</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Hanafi, Shafi&apos;i, Maliki, Hanbali</strong> all accept Awl on the same proportional-reduction principle. Implementation is uniform across the four schools.</li>
            <li><strong>Radd</strong> is accepted by Hanafi and Hanbali. Maliki and Shafi&apos;i historically directed the residual to the public treasury rather than redistribute. In modern jurisdictions without functional bayt al-mal, all four schools generally apply Radd in practice.</li>
            <li><strong>Spouse exclusion from Radd</strong> is consistent across all four schools.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Use the calculator</h2>
          <p className="text-base text-gray-700 mb-4">
            Barakah&apos;s faraid calculator applies Awl and Radd automatically based on your
            chosen madhab. Enter your heirs and it shows the final shares, including any
            adjustment notes.
          </p>
          <Link href="/faraid-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the faraid calculator →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/learn/islamic-estate-planning" className="text-[#1B5E20] underline">Islamic estate planning overview</Link></li>
            <li>· <Link href="/learn/islamic-will-checklist" className="text-[#1B5E20] underline">Islamic will checklist</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Full methodology + sources</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
