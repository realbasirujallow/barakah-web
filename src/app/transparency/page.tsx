import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Transparency Reports | Barakah',
  description:
    "Barakah publishes a public transparency report every six months: user growth, zakat calculated, methodology changes, scholar engagements, and security posture. The first Muslim-finance app to commit to this cadence.",
  keywords: [
    'barakah transparency report',
    'islamic finance transparency',
    'muslim app accountability',
    'barakah annual report',
  ],
  alternates: { canonical: 'https://trybarakah.com/transparency' },
  openGraph: {
    title: 'Transparency Reports | Barakah',
    description: 'Public 6-month reports on user growth, zakat calculated, methodology changes, and more.',
    url: 'https://trybarakah.com/transparency',
    type: 'website',
  },
};

const reports = [
  {
    slug: '2026-h1',
    period: 'H1 2026',
    coverage: 'Jan 1 \u2013 Jun 30, 2026',
    status: 'Upcoming \u2014 publishes after June 30 close',
    stateClass: 'bg-amber-100 text-amber-900',
    href: null,
  },
];

const commitments = [
  'User growth — total accounts, monthly actives, geographic distribution at country level (privacy-preserving).',
  'Zakat calculated — total dollars of zakat computed by the app, split by methodology and asset class.',
  'Sadaqah and sadaqah-jariyah logged — voluntary giving tracked, with attribution to destination categories.',
  'Methodology changes — every fiqh-config change that shipped in the period, with scholars consulted and effective date (full changelog at /methodology/changelog).',
  'Scholar engagements — which scholars engaged with Barakah (with their consent), what they reviewed, and whether their feedback shipped.',
  'Security posture — any incidents, responsible-disclosure reports, penetration-test summaries, and SOC 2 / ISO 27001 / Gramm-Leach-Bliley progress.',
  'Financials — Barakah revenue by tier (Free, Plus, Family, Premium), refund rate, and cash runway commitment.',
  'Complaints — volume of user complaints categorised by type, median resolution time.',
];

export default function TransparencyIndexPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="mb-3 text-4xl md:text-5xl font-extrabold text-[#1B5E20]">Transparency reports</h1>
          <p className="text-base text-gray-600 mb-6">Last reviewed: 2026-04-19</p>

          <p className="text-lg leading-8 text-gray-800 mb-6">
            Every six months, Barakah publishes a public report covering user growth, zakat
            calculated, methodology changes, scholar engagements, security posture, and complaints.
            To the best of our knowledge, Barakah is the first Muslim-finance app to commit publicly
            to this cadence.
          </p>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Why publish these?</h2>
            <p className="text-base leading-7 text-gray-800 mb-3">
              Islamic finance apps operate on trust: you&apos;re trusting the app to calculate an
              obligation owed to Allah and to the poor. That trust needs to be continuously earned,
              not just claimed at signup. A twice-yearly report forces us (and lets you verify) that:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-base leading-7 text-gray-800">
              <li>The product is actually serving a growing community, not quietly declining</li>
              <li>Methodology changes are disclosed and scholarly-reviewed, not silent</li>
              <li>Security incidents (if any) are acknowledged</li>
              <li>Complaints are tracked and addressed</li>
              <li>The company is solvent enough to keep serving users</li>
            </ul>
          </section>

          <section className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">What every report covers</h2>
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-gray-800">
              {commitments.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Reports</h2>
            <div className="space-y-3">
              {reports.map((r) => {
                const content = (
                  <>
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xl font-bold text-[#1B5E20]">{r.period}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.stateClass}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{r.coverage}</p>
                    {!r.href && (
                      <p className="mt-3 text-xs leading-6 text-gray-500">
                        We&apos;re keeping report periods visible here, but we do not publish placeholder
                        report pages before the numbers are final.
                      </p>
                    )}
                  </>
                );

                return r.href ? (
                  <Link
                    key={r.slug}
                    href={r.href}
                    className="block rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition border border-transparent hover:border-[#1B5E20]"
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={r.slug}
                    className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-xl font-bold text-amber-900">Complement to other trust surfaces</h2>
            <p className="text-sm leading-7 text-amber-900 mb-3">
              Transparency reports are periodic — the continuous trust surfaces live elsewhere:
            </p>
            <ul className="list-disc space-y-1 pl-6 text-sm leading-7 text-amber-900">
              <li><Link href="/methodology" className="underline font-semibold">/methodology</Link> — current methodology and fiqh-config decisions</li>
              <li><Link href="/methodology/changelog" className="underline font-semibold">/methodology/changelog</Link> — every change, dated, reasoned</li>
              <li><Link href="/scholars" className="underline font-semibold">/scholars</Link> — Scholar Board roster (forming Q3 2026) and scholar review briefs</li>
              <li><Link href="/verify" className="underline font-semibold">/verify</Link> — per-snapshot integrity-hash verification</li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[#1B5E20] p-6 text-white">
            <h2 className="mb-3 text-xl font-bold">Want to be notified when H1 2026 publishes?</h2>
            <p className="mb-4 text-sm leading-7 text-green-100">
              We&apos;ll announce the report via email and social when it goes live in July 2026.
              Create a free account to get the email, or follow along at{' '}
              <a
                href="https://github.com/realbasirujallow/barakah-web"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                github.com/realbasirujallow/barakah-web
              </a>.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50">
              Sign up →
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
