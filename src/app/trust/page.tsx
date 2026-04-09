import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Barakah Trust & Security | Data Handling, Privacy, and Product Boundaries',
  description:
    'Review how Barakah handles sessions, financial data, live pricing, user support, and Islamic-finance product boundaries.',
  alternates: {
    canonical: 'https://trybarakah.com/trust',
  },
};

const pillars = [
  {
    title: 'Cookie-Based Sessions',
    body:
      'The web app uses httpOnly cookie sessions so the browser does not need to keep bearer or refresh tokens in localStorage. That reduces the blast radius of front-end scripting issues and keeps authentication closer to standard financial-app practice.',
  },
  {
    title: 'Live Pricing With Freshness Signals',
    body:
      'Barakah surfaces live gold and silver data with source and staleness information instead of pretending stale values are fresh. If a live feed is unavailable, the product falls back carefully and tells the user what happened.',
  },
  {
    title: 'Human Support',
    body:
      'Contact submissions, user outreach details, and support paths are retained so Barakah can follow up quickly when something looks wrong or when a user needs help understanding a result.',
  },
  {
    title: 'Scholarly Boundaries',
    body:
      'Barakah is intentionally clear about where the app assists and where a qualified scholar is still needed. That boundary is part of trust, not a weakness.',
  },
];

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-4xl">🛡️</p>
          <h1 className="mb-4 text-4xl font-extrabold text-[#1B5E20]">Trust & Security</h1>
          <p className="mx-auto max-w-2xl text-base leading-7 text-gray-700">
            Barakah is handling sensitive financial and personal information. This page explains the
            product boundaries, session model, and operational safeguards that matter most for a
            high-trust Islamic finance platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <section key={pillar.title} className="rounded-2xl border border-gray-200 bg-[#FFF8E1] p-6">
              <h2 className="mb-3 text-xl font-bold text-[#1B5E20]">{pillar.title}</h2>
              <p className="text-sm leading-7 text-gray-700">{pillar.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-bold text-[#1B5E20]">What Barakah Does Not Claim</h2>
          <ul className="space-y-3 text-sm leading-7 text-gray-700">
            <li>It does not replace a qualified scholar for case-specific rulings.</li>
            <li>It does not replace a lawyer for estate documents or jurisdiction-specific compliance.</li>
            <li>It does not guarantee that a bank or transaction description is perfectly labeled, which is why review tools remain visible to the user.</li>
          </ul>
        </section>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-[#1B5E20] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Questions or concerns?</h2>
            <p className="mt-1 text-sm text-green-100">
              Reach out if you want something reviewed or corrected. Trust grows when issues are surfaced and fixed quickly.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1B5E20] transition hover:bg-green-50"
            >
              Contact Barakah
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center rounded-xl border border-white px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#1B5E20]"
            >
              Read Methodology
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
