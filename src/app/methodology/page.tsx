import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah Methodology | How Zakat, Nisab, Hawl, Riba, and Wasiyyah Work',
  description:
    'Learn how Barakah approaches zakat calculation, live nisab pricing, Hawl continuity, riba detection, and Islamic estate planning with clear methodology notes and trust boundaries.',
  alternates: {
    canonical: 'https://trybarakah.com/methodology',
  },
};

const sections = [
  {
    title: 'Zakat',
    body:
      'Barakah treats zakat as a rules-driven calculation, not a black box. The app separates zakatable assets from exempt personal-use items, applies debt deductions based on the selected fiqh settings, and calculates the 2.5% due amount only after nisab eligibility is met.',
  },
  {
    title: 'Nisab',
    body:
      'Nisab thresholds are based on live gold and silver pricing. Users can choose the methodology they follow, including gold, classical silver, or lower-of-two settings where supported. Public pages explain the difference clearly, and signed-in calculations use the same live thresholds as the dashboard.',
  },
  {
    title: 'Hawl Continuity',
    body:
      'Barakah tracks Hawl continuity daily for signed-in users. If zakatable wealth genuinely falls below nisab, the app can pause or reset the Hawl cycle based on the user’s fiqh preference instead of assuming the year continued uninterrupted.',
  },
  {
    title: 'Riba Detection',
    body:
      'Riba detection is a transaction-review aid. It looks for interest-related wording, category signals, and context patterns to help users catch potential interest income or expense, but it should always be reviewed by the user because transaction descriptions from banks are not perfect.',
  },
  {
    title: 'Wasiyyah',
    body:
      'Barakah helps users record Islamic will instructions, estate obligations, and faraid planning notes. It is designed to support household preparedness, not replace a qualified scholar or estate attorney for complex inheritance cases.',
  },
];

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-[#FFF8E1] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-4xl">📘</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">How Barakah Calculates and Guides</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-700">
            Barakah is built to be transparent. This page explains the practical methodology behind the
            product so users can understand what the app is doing, where scholarly differences exist,
            and where human review is still necessary.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">{section.title}</h2>
              <p className="text-sm leading-7 text-gray-700">{section.body}</p>
            </section>
          ))}
        </div>

        {/* Backed by Quran & Sunnah */}
        <section className="mt-8 rounded-2xl bg-green-900 p-6 text-white text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-green-300 mb-3">Grounded in Quran &amp; Sunnah</p>
          <blockquote className="text-base md:text-lg font-semibold mb-3 leading-relaxed italic max-w-2xl mx-auto">
            &ldquo;And establish prayer and give zakat, and whatever good you put forward for yourselves — you will find it with Allah&rdquo;
          </blockquote>
          <p className="text-green-300 text-sm font-medium">Quran 2:110</p>
          <p className="text-green-200 text-xs mt-3 max-w-xl mx-auto">
            Every calculation in Barakah is rooted in Quranic commands and classical jurisprudence. We surface methodology transparently so you can verify our approach against your own scholarship.
          </p>
        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Important Boundaries</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>Barakah is a fiqh-aware decision-support tool, not a personal fatwa service.</li>
            <li>Where scholarly opinions differ, Barakah surfaces the methodology instead of pretending there is no difference.</li>
            <li>Complex family, estate, and jurisdiction-specific cases should still be reviewed with a qualified scholar and legal professional.</li>
          </ul>
        </section>

        {/* Scholar oversight + changelog + open briefs */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">Scholar Oversight</h2>
          <p className="mb-4 text-sm leading-7 text-gray-700">
            Every opinionated fiqh decision in Barakah gets a dedicated review brief. We publish the
            brief alongside the product change, track whether scholar review is still pending or has
            been completed, and add named reviewers only after they have actually engaged and
            approved public disclosure. The goal is honest transparency, not implied endorsement.
          </p>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>
              <Link href="/scholars" className="text-[#1B5E20] font-semibold hover:underline">
                Scholar Board →
              </Link>{' '}
              Board formation status, planned engagements, and any named reviewers once confirmed.
            </li>
            <li>
              <Link href="/methodology/changelog" className="text-[#1B5E20] font-semibold hover:underline">
                Methodology changelog →
              </Link>{' '}
              Every fiqh/methodology rule change, when it was made, and why.
            </li>
            <li>
              <strong>Hanafi ↔ silver nisab auto-link</strong> — active. Brief published in-repo at{' '}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                docs/SCHOLAR_REVIEW_HANAFI_SILVER.md
              </code>
              . Awaiting named-scholar response. See the changelog for dates.
            </li>
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-[#1B5E20] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Want the full product view?</h2>
            <p className="mt-1 text-sm text-green-100">
              See the trust posture, privacy boundaries, and support channels Barakah uses today.
            </p>
          </div>
          <Link
            href="/trust"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
          >
            View Trust & Security
          </Link>
        </div>
      </div>
    </main>
  );
}
