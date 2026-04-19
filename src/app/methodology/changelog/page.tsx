import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Methodology Changelog | Barakah',
  description:
    'Every fiqh and methodology rule change in Barakah, dated with rationale and scholar review status. Full transparency on how our calculations evolve.',
  alternates: {
    canonical: 'https://trybarakah.com/methodology/changelog',
  },
  openGraph: {
    title: 'Methodology Changelog | Barakah',
    description: 'Every fiqh and methodology rule change in Barakah, dated with rationale.',
    url: 'https://trybarakah.com/methodology/changelog',
    type: 'article',
  },
};

type ChangelogEntry = {
  date: string;
  title: string;
  summary: string;
  rationale: string;
  whoReviewed?: string;
  briefUrl?: string;
  affectedUsers?: string;
};

// Entries are reverse-chronological. When a scholar signs off on a decision,
// update `whoReviewed` and (optionally) link the signed brief.
const entries: ChangelogEntry[] = [
  {
    date: '2026-04-18',
    title: 'Hanafi ↔ silver nisab auto-link added',
    summary:
      'When a user selects the Hanafi madhab in Fiqh Settings, their nisab threshold methodology now auto-switches to Classical Silver (595g × live spot). When they move away from Hanafi, we revert to the AMJA Gold default — but only if the silver setting was the one we auto-applied (we respect explicit user overrides).',
    rationale:
      'The classical Hanafi position on nisab uses silver (≈595g) as the threshold, not gold. Most contemporary Hanafi scholars (Darul Uloom Deoband, Taqi Usmani) recommend silver for North American Muslims because its lower threshold results in more zakat being paid — the pro-obligation choice.',
    whoReviewed: 'Not yet — brief published, awaiting first named reviewer',
    briefUrl:
      'https://github.com/realbasirujallow/barakah-backend/blob/main/docs/SCHOLAR_REVIEW_HANAFI_SILVER.md',
    affectedUsers:
      'Any Hanafi-selecting user. In-product snackbar explicitly tells the user we switched their nisab, and they can override in Zakat settings.',
  },
  {
    date: '2026-04-18',
    title: 'Mobile default nisab threshold aligned exactly with backend fallback',
    summary:
      'The mobile app&apos;s fallback nisab (used only when the live price API is unreachable on cold start) was $14,225.60. It is now exactly $14,025.00 — the product of the backend&apos;s NISAB_GOLD_GRAMS (85) and FALLBACK_GOLD_PRICE_PER_GRAM ($165).',
    rationale:
      'Prior ~$200 drift between mobile and backend could produce different zakat-eligibility outcomes for users at the threshold boundary on offline/API-failure paths. Values now match exactly; any future backend price update requires a lockstep mobile update.',
    whoReviewed: 'Internal engineering change; no fiqh decision altered',
  },
  {
    date: '2026-04-18',
    title: 'Historical zakat backfill race condition closed via DB constraint',
    summary:
      'The new /api/zakat/snapshots/historical-paid endpoint (which lets users record zakat paid before joining Barakah) had a check-then-insert race that could in principle create two locked snapshots for the same lunar year from concurrent requests. Closed with a partial unique index (V69 Flyway migration) on (user_id, lunar_year) WHERE locked = true.',
    rationale:
      'A locked zakat snapshot is an immutable financial-audit record. DB-level uniqueness is the only correct guarantee; the service-layer check stays for a friendly error message.',
    whoReviewed: 'Internal engineering; no fiqh decision altered',
  },
  {
    date: '2026-04-18',
    title: 'Bill due-date calculation anchored to UTC',
    summary:
      'BillService.calculateNextDueDate previously used LocalDate.now() (JVM default timezone). Pinned to ZoneId.of("UTC") to match the rest of the bill-date path and remove dev/prod drift.',
    rationale:
      'Railway JVM is UTC; dev machines vary. The inconsistency meant a dev running with TZ=America/Los_Angeles could create a bill whose next-due date was computed off a different &quot;today&quot; than prod. Pinning to UTC is the minimally-invasive fix. Per-user timezone is a future plumbing change.',
    whoReviewed: 'Internal engineering; no fiqh decision altered',
  },
  {
    date: '2026-04-18',
    title: 'Ramadan-start fallback now throws instead of silently returning March 1',
    summary:
      'HijriCalendarUtil.getRamadanStartDate used to fall back to LocalDate.of(year, 3, 1) for any year outside the static 1447–1456 mapping. March 1 has no astronomical relationship to Ramadan. Replaced with an IllegalStateException and a new tryGetRamadanStartDate() Optional variant for callers that can tolerate &quot;unknown year&quot;.',
    rationale:
      'Silently shipping the wrong Ramadan date on a trust-critical Ramadan-mode feature is worse than a loud error. Callers should route through /api/islamic-calendar/today (server-authoritative Umm al-Qura source) for years not in the static map.',
    whoReviewed: 'Internal engineering; no fiqh decision altered',
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-4xl">📝</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">Methodology Changelog</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-700">
            Every fiqh, methodology, or calculation-logic change in Barakah — dated, explained,
            and linked to its review brief (where one exists). Fiqh is living; our product
            decisions evolve. Making the history visible is the strongest trust signal we can
            ship.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm italic leading-6 text-gray-600">
            We don&apos;t log internal refactors or typo fixes here — only decisions that could
            affect a user&apos;s zakat, hawl, riba, or estate-planning outcome.
          </p>
        </div>

        <div className="space-y-6">
          {entries.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#1B5E20] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  {entry.date}
                </span>
                {entry.whoReviewed && entry.whoReviewed.toLowerCase().startsWith('not yet') && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
                    Review pending
                  </span>
                )}
              </div>
              <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">{entry.title}</h2>
              <p className="mb-3 text-sm leading-7 text-gray-700">{entry.summary}</p>
              <p className="mb-3 text-sm leading-7 text-gray-700">
                <strong>Rationale:</strong> {entry.rationale}
              </p>
              {entry.whoReviewed && (
                <p className="mb-2 text-sm leading-7 text-gray-700">
                  <strong>Reviewed by:</strong> {entry.whoReviewed}
                </p>
              )}
              {entry.affectedUsers && (
                <p className="mb-2 text-sm leading-7 text-gray-700">
                  <strong>Affected users:</strong> {entry.affectedUsers}
                </p>
              )}
              {entry.briefUrl && (
                <a
                  href={entry.briefUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#1B5E20] hover:underline"
                >
                  Read the review brief →
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/methodology"
            className="flex-1 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Methodology →</h3>
            <p className="text-sm text-gray-700">How Barakah calculates zakat, nisab, hawl, and riba.</p>
          </Link>
          <Link
            href="/scholars"
            className="flex-1 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <h3 className="mb-2 text-lg font-bold text-[#1B5E20]">Scholar Board →</h3>
            <p className="text-sm text-gray-700">Review status, planned engagements, and any named reviewers once confirmed.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
