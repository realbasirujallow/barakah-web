import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Scholar Board | Barakah',
  description:
    "Barakah's fiqh methodology is reviewed by qualified Islamic scholars across madhabs. Meet the Scholar Board, read published review briefs, and see our methodology changelog.",
  alternates: {
    canonical: 'https://trybarakah.com/scholars',
  },
  openGraph: {
    title: 'Scholar Board | Barakah',
    description:
      "Barakah's fiqh methodology is reviewed by qualified Islamic scholars across madhabs.",
    url: 'https://trybarakah.com/scholars',
    type: 'website',
  },
};

// Scholars go in here once engagements are confirmed + they've approved a
// public profile. Starting honestly with an empty roster rather than naming
// placeholder scholars.
const scholars: Array<{
  name: string;
  credentials: string;
  specialty: string;
  institutionalAffiliation?: string;
  reviewedDecisions: Array<{ title: string; date: string; briefUrl?: string }>;
}> = [];

const upcomingEngagements = [
  {
    focus: 'Hanafi jurisprudence (primary reviewer for the Hanafi-silver auto-link default)',
    target: 'Q2 2026',
  },
  {
    focus: "Shafi'i / Maliki jurisprudence (zakat of retirement & investment holdings)",
    target: 'Q3 2026',
  },
  {
    focus: 'Contemporary fiqh & AAOIFI standards (sukuk, halal stock screening, purification)',
    target: 'Q3 2026',
  },
];

export default function ScholarsPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-4xl">📜</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">Scholar Board</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-700">
            Barakah&apos;s fiqh methodology is reviewed by qualified Islamic scholars across madhabs.
            Every opinionated default we ship — Hanafi-silver nisab, retirement zakat logic, hawl
            continuity rules, madhab-specific fitr methods — is recorded in a review brief and
            surfaced here once a named scholar has engaged.
          </p>
        </div>

        {/* Transparency note */}
        <section className="mb-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            Launching Q3 2026
          </p>
          <h2 className="mb-3 text-xl font-bold text-amber-900">
            We&apos;re being honest about where we are
          </h2>
          <p className="text-sm leading-7 text-amber-900">
            As of 2026-04-19, no scholar has publicly signed on to our Scholar Board yet. Our first
            review brief — the <strong>Hanafi-silver nisab auto-link</strong> — was committed to
            our backend repo at{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
              docs/SCHOLAR_REVIEW_HANAFI_SILVER.md
            </code>{' '}
            and is currently being sent to qualified Hanafi scholars for response. We&apos;ll
            update this page the moment a scholar approves public naming.
          </p>
          <p className="mt-3 text-sm leading-7 text-amber-900">
            We believe an empty but dated public roster beats stuffed-with-placeholders. Your trust
            is our compound interest.
          </p>
        </section>

        {/* Current roster */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Current Reviewers</h2>
          {scholars.length === 0 ? (
            <p className="text-sm italic text-gray-600">
              No reviewers listed yet. See &ldquo;Launching Q3 2026&rdquo; above for the engagement
              plan.
            </p>
          ) : (
            <div className="space-y-4">
              {scholars.map((scholar) => (
                <div
                  key={scholar.name}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <h3 className="text-lg font-bold text-[#1B5E20]">{scholar.name}</h3>
                  <p className="mt-1 text-sm text-gray-700">{scholar.credentials}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    <strong>Specialty:</strong> {scholar.specialty}
                  </p>
                  {scholar.institutionalAffiliation && (
                    <p className="mt-1 text-sm text-gray-600">
                      <strong>Affiliation:</strong> {scholar.institutionalAffiliation}
                    </p>
                  )}
                  {scholar.reviewedDecisions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700">Reviewed:</p>
                      <ul className="mt-1 space-y-1 text-sm text-gray-600">
                        {scholar.reviewedDecisions.map((d) => (
                          <li key={d.title}>
                            {d.briefUrl ? (
                              <Link href={d.briefUrl} className="text-[#1B5E20] hover:underline">
                                {d.title}
                              </Link>
                            ) : (
                              d.title
                            )}{' '}
                            <span className="text-gray-400">· {d.date}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming engagements */}
        <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-[#1B5E20]">Upcoming Engagements</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            {upcomingEngagements.map((eng) => (
              <li key={eng.focus} className="flex items-start gap-3">
                <span className="mt-1 rounded-full bg-[#1B5E20] px-2 py-0.5 text-xs font-semibold text-white">
                  {eng.target}
                </span>
                <span className="flex-1">{eng.focus}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Scholar CTA */}
        <section className="mb-8 rounded-2xl bg-[#1B5E20] p-6 text-white">
          <h2 className="mb-3 text-xl font-bold">Are you a qualified Islamic scholar?</h2>
          <p className="mb-4 text-sm leading-7 text-green-100">
            We&apos;re actively engaging reviewers across madhabs. You don&apos;t need to agree with
            every Barakah default — we want reviewers who will push back on copy, product
            decisions, and fiqh claims. Your review time is compensated. Your name, credentials,
            and dissenting opinions (if any) are published openly.
          </p>
          <a
            href="mailto:scholars@trybarakah.com"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
          >
            Contact scholars@trybarakah.com
          </a>
        </section>

        {/* Related pages */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/methodology"
            className="flex-1 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Methodology →</h3>
            <p className="text-sm text-gray-700">How Barakah calculates zakat, nisab, hawl, and riba.</p>
          </Link>
          <Link
            href="/methodology/changelog"
            className="flex-1 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Methodology Changelog →</h3>
            <p className="text-sm text-gray-700">Every fiqh rule change, dated and explained.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
