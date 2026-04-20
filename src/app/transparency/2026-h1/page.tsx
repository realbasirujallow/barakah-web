import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Transparency Report H1 2026 (Draft) | Barakah',
  description:
    "Barakah's first public transparency report covers Jan 1 \u2013 Jun 30, 2026. Draft scaffold; final figures publish July 2026.",
  keywords: ['barakah transparency h1 2026', 'barakah annual report', 'islamic finance transparency'],
  alternates: { canonical: 'https://trybarakah.com/transparency/2026-h1' },
  openGraph: {
    title: 'Transparency Report H1 2026 (Draft) | Barakah',
    description: 'Draft scaffold of the first Barakah transparency report.',
    url: 'https://trybarakah.com/transparency/2026-h1',
    type: 'article',
  },
};

const sections: Array<{
  title: string;
  note: string;
  draft: string;
}> = [
  {
    title: 'User growth',
    note: 'Total accounts, monthly actives, country-level geographic distribution.',
    draft: 'Final figures publish July 2026. Growth metrics tracked internally via PostHog + Plaid signup telemetry.',
  },
  {
    title: 'Zakat calculated',
    note: 'Total US dollars of zakat computed by the app in the period, split by methodology (AMJA-gold, Classical-silver, Lower-of-Two) and asset class.',
    draft: 'Sensitive metric \u2014 publishes as order-of-magnitude aggregates only (no per-user attribution). Methodology-split reported as percentages.',
  },
  {
    title: 'Sadaqah and sadaqah-jariyah logged',
    note: 'Voluntary giving recorded by users, split by destination categories where disclosed.',
    draft: 'Aggregate totals only. No attribution to individual donors or recipients. Final figures July 2026.',
  },
  {
    title: 'Methodology changes',
    note: 'Every fiqh-config change that shipped in the period, with scholars consulted and effective date.',
    draft: (
      // keep copy referencing the live changelog so readers get the current truth between reports
      'See the live changelog for every decision shipped in H1 2026.'
    ),
  },
  {
    title: 'Scholar engagements',
    note: 'Which scholars engaged with Barakah (with their consent), what they reviewed, and whether their feedback shipped.',
    draft: 'Scholar Board is forming through Q2\u2013Q3 2026. The H1 report will list the named reviewers confirmed by June 30, the artifacts they reviewed, and any methodology changes that resulted from their feedback.',
  },
  {
    title: 'Security posture',
    note: 'Incidents (if any), responsible-disclosure reports, penetration-test summaries, and compliance progress (SOC 2 / ISO 27001 / GLBA).',
    draft: 'Quarterly internal security audits run against the R4/R5/R6 checklist. Any responsible-disclosure reports will be listed with severity and time-to-fix.',
  },
  {
    title: 'Financials',
    note: 'Revenue by tier (Free, Plus, Family, Premium), refund rate, cash-runway commitment.',
    draft: 'Aggregate revenue and runway commitment \u2014 not a full P&L. Goal: show solvency sufficient to keep serving users for 12+ months.',
  },
  {
    title: 'Complaints',
    note: 'Volume of user complaints by category; median resolution time.',
    draft: 'Every support ticket tagged with category on receipt. Report publishes bucketed volumes and median resolution time by category.',
  },
];

export default function TransparencyH1Page() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Visible status banner so the H1 2026 report can't be mistaken for
          shipped figures while it's still a scaffold + commitment. Final
          numbers publish July 2026 after H1 closes June 30. */}
      <div className="bg-amber-100 border-b-2 border-amber-400 px-4 py-2 text-center text-xs font-semibold text-amber-900">
        ⚠ DRAFT · H1 figures finalize July 2026 · this page is the commitment template, not final numbers
      </div>
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/transparency" className="text-sm text-[#1B5E20] font-medium hover:underline">Transparency</Link>
            <Link href="/methodology" className="text-sm text-[#1B5E20] font-medium hover:underline">Methodology</Link>
          </div>
        </div>
      </header>
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/transparency" className="hover:text-[#1B5E20] transition">Transparency</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">H1 2026</span>
        </div>
      </nav>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="mb-4 inline-block rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-semibold">
            Draft scaffold · Coverage: Jan 1 – Jun 30, 2026 · Final figures publish July 2026
          </div>
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">
            Transparency Report H1 2026
          </h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-bold text-[#1B5E20]">What this page is, right now</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              This page is <strong>the scaffold and commitment</strong> for Barakah&apos;s first
              public transparency report. The period it covers (H1 2026) is still in progress, so the
              quantitative sections show our <em>commitments</em> rather than final numbers.
            </p>
            <p className="text-base leading-7 text-gray-800">
              When H1 closes on June 30, 2026, this page will be updated with the actual figures —
              reviewed by our founder and any Scholar Board members engaged by that date — and published
              by end of July 2026.
            </p>
          </section>

          <section className="mb-10 space-y-4">
            {sections.map((s) => (
              <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#1B5E20] mb-2">{s.title}</h2>
                <p className="text-sm text-gray-600 mb-3 italic">{s.note}</p>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm leading-7 text-amber-900">
                    <strong>Draft note:</strong> {s.draft}
                  </p>
                </div>
              </div>
            ))}
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">Live trust surfaces (not waiting for this report)</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Periodic reports are one trust mechanism; continuous surfaces are another. While H1
              data aggregates, you can already verify these at any time:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li><Link href="/methodology" className="text-[#1B5E20] underline">/methodology</Link> — current fiqh-config</li>
              <li><Link href="/methodology/changelog" className="text-[#1B5E20] underline">/methodology/changelog</Link> — every change since launch</li>
              <li><Link href="/scholars" className="text-[#1B5E20] underline">/scholars</Link> — Scholar Board roster + outreach status</li>
              <li><Link href="/verify" className="text-[#1B5E20] underline">/verify</Link> — per-snapshot integrity-hash verification</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Hold us to this</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              Publishing a twice-yearly report is a commitment; the actual value comes from publishing
              it consistently, with honest numbers, year over year. If you notice we&apos;ve missed a
              publication window or a section is under-specified, email the founder at{' '}
              <a href="mailto:support@trybarakah.com" className="underline font-semibold hover:text-white">support@trybarakah.com</a>.
            </p>
            <Link href="/transparency" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              All transparency reports →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
