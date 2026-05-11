import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /learn/sadaqah-distribution
 *
 * Coming-soon disclosure page. The full sadaqah/waqf distribution
 * disclosure (partners, fees, custodian, audit cadence) ships when
 * the founder has provided real values. Until then, this page
 * remains noindex,follow and intentionally carries no speculative
 * partner names, fee percentages, or custodian claims — donation
 * pages are the most trust-sensitive surface in the app and a
 * disclosure with TODO placeholders would be worse than no
 * disclosure at all.
 *
 * 2026-05-10 (TRUST-001 fix): the previous version of this page
 * showed literal "Partner organisation #1", "TODO: confirm 0%",
 * "TODO: confirm waqf custodian" labels in production HTML — even
 * with noindex, anyone landing here from /learn/zakat-recipients-2026
 * (an internal link) would see those placeholders. Replaced the
 * full body with a clean "coming soon" surface that:
 *   • Acknowledges donations are NOT yet live in Barakah.
 *   • Lists the three commitments we WILL keep when we go live.
 *   • Points to a contact channel for early-access interest.
 * No speculative partner / fee / custodian / 501(c)(3) claims.
 */

export const metadata: Metadata = {
  title: 'Sadaqah & Waqf Distribution Disclosure',
  description:
    'Barakah is preparing a verified sadaqah and waqf distribution disclosure. Donation flows are not live yet — this page will publish full partner, fee, and custodian detail before any donation feature ships.',
  alternates: {
    canonical: 'https://trybarakah.com/learn/sadaqah-distribution',
  },
  // Page is intentionally a "coming soon" landing surface. We keep
  // noindex so search engines do not surface a placeholder
  // disclosure, but follow so internal crawl signals to /methodology
  // and /contact still flow. Remove noindex once the full disclosure
  // ships with real partner/fee/custodian values.
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Sadaqah & Waqf Distribution Disclosure — Barakah',
    description:
      'Barakah is preparing a verified sadaqah and waqf distribution disclosure. The full document publishes before any donation feature goes live.',
    url: 'https://trybarakah.com/learn/sadaqah-distribution',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function SadaqahDistributionPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Sadaqah Distribution</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-4">
          Sadaqah &amp; Waqf Distribution
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Barakah is preparing a verified disclosure for how sadaqah and waqf
          donations made through the app will be processed, held, and disbursed.
        </p>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-amber-900 mb-2">
            Donations are not live yet in Barakah
          </h2>
          <p className="text-sm text-amber-900/90">
            Today, the dashboard tracks sadaqah and waqf you have already given
            elsewhere. Barakah does not yet collect donations on behalf of users.
            Before we add any donation flow, this page will publish the full
            partner directory, payment-processor fee schedule, disbursement
            cadence, and waqf custodian — verified, named, and dated.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            What this disclosure will cover
          </h2>
          <ul className="list-disc list-inside space-y-3 text-gray-800">
            <li>
              The named charity partners we route sadaqah to, with the basis on
              which each was vetted (audited financials, last-mile reporting,
              registration status).
            </li>
            <li>
              The exact payment-processor fee on each donation, and whether the
              donor or Barakah covers it.
            </li>
            <li>
              The disbursement cadence — how often funds move from the
              segregated donations account to partner charities.
            </li>
            <li>
              For waqf, the named custodial institution that holds the
              principal and the income-distribution mechanism.
            </li>
            <li>
              Tax-deductibility status (Barakah is not currently a 501(c)(3) —
              we will say so plainly when donations launch, and disclose any
              partnering registered charity that issues tax receipts on our
              behalf).
            </li>
            <li>
              A quarterly disbursement report once donations are live.
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Why this page is empty for now
          </h2>
          <p className="text-base text-gray-700 mb-3">
            Donation flows are the most trust-sensitive surface in any
            faith-based app. We would rather ship nothing than ship a
            disclosure with unconfirmed partner names or fee assumptions.
            This page intentionally carries no speculative figures. When
            verified values are ready, the full disclosure replaces this
            placeholder and the page is indexed.
          </p>
          <p className="text-base text-gray-700">
            See our{' '}
            <Link
              href="/methodology"
              className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium"
            >
              methodology page
            </Link>
            {' '}for the standards we use across zakat, sadaqah, waqf, and the
            riba detector.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Want a heads-up when donations launch?
          </h2>
          <p className="text-base text-gray-700">
            Email{' '}
            <a
              href="mailto:support@trybarakah.com"
              className="text-[#1B5E20] underline"
            >
              support@trybarakah.com
            </a>
            {' '}with the subject line &quot;Donations early access&quot; and
            we will let you know when the verified disclosure publishes and
            the donation flow becomes available in the app.
          </p>
        </section>
      </div>
    </main>
  );
}
