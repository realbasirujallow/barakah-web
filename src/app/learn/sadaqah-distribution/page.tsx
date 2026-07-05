import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /learn/sadaqah-distribution
 *
 * Current-state disclosure page. Barakah does not collect, custody,
 * route, or disburse sadaqah/waqf donations today, so the honest
 * disclosure is to say exactly that and list the launch gates that
 * must be satisfied before any donation flow ships.
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
 * 2026-07-04 (GSC noindex cleanup): changed from a noindex placeholder
 * to an indexable transparency page with current-state facts. It still
 * makes no speculative partner / fee / custodian / 501(c)(3) claims.
 */

export const metadata: Metadata = {
  title: 'Sadaqah & Waqf Transparency Disclosure',
  description:
    'Current status of sadaqah and waqf in Barakah: donations are not collected or disbursed by Barakah today. See what will be verified before any donation flow launches.',
  alternates: {
    canonical: 'https://trybarakah.com/learn/sadaqah-distribution',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sadaqah & Waqf Transparency Disclosure — Barakah',
    description:
      'Barakah does not collect or disburse donations today. This page documents the current status and the verification gates required before launch.',
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
          Sadaqah &amp; Waqf Transparency
        </h1>
        <p className="text-base text-gray-600 mb-8">
          This page documents what Barakah does and does not do with sadaqah
          and waqf today, and what must be verified before any in-app donation
          collection launches.
        </p>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-amber-900 mb-2">
            Current status: donations are not live
          </h2>
          <p className="text-sm text-amber-900/90">
            Today, the dashboard tracks sadaqah and waqf you have already given
            elsewhere. Barakah does not collect donations, hold donation funds,
            route money to charities, issue tax receipts, or operate a waqf
            custodian account.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Current disclosure
          </h2>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <dl className="divide-y divide-gray-200 text-sm">
              <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-gray-900">Donation collection</dt>
                <dd className="text-gray-700">Not live. Barakah does not accept sadaqah or waqf payments today.</dd>
              </div>
              <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-gray-900">Charity partners</dt>
                <dd className="text-gray-700">None currently routed through Barakah, because Barakah is not collecting donations.</dd>
              </div>
              <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-gray-900">Fees</dt>
                <dd className="text-gray-700">No Barakah donation fee exists today. Any future payment-processing fee will be named before launch.</dd>
              </div>
              <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-gray-900">Custody and disbursement</dt>
                <dd className="text-gray-700">Not applicable today. Barakah does not hold donation funds or disburse them to third parties.</dd>
              </div>
              <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-gray-900">Waqf custody</dt>
                <dd className="text-gray-700">No waqf custodian is active in Barakah today. A named custodian and income-distribution method must be published before any waqf flow launches.</dd>
              </div>
              <div className="grid gap-2 p-4 md:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-gray-900">Tax receipts</dt>
                <dd className="text-gray-700">Barakah does not issue donation tax receipts today because it does not collect donations.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            What must be published before donations launch
          </h2>
          <ul className="list-disc space-y-3 pl-5 text-gray-800">
            <li>Named charity partners, with registration status and vetting basis.</li>
            <li>The exact payment processor, fee schedule, and who pays each fee.</li>
            <li>The account structure used to hold funds before disbursement.</li>
            <li>The cadence for sending funds to partners and publishing reports.</li>
            <li>For waqf, the named custodian, principal policy, and income-distribution method.</li>
            <li>Tax receipt handling, including which organization issues receipts if receipts are available.</li>
          </ul>
          <p className="mt-4 text-base text-gray-700">
            We will not publish placeholder partner names, estimated fees, or
            unverified custody claims. See our{' '}
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
            How Barakah helps today
          </h2>
          <p className="text-base text-gray-700 mb-3">
            Barakah can help you record and categorize sadaqah or waqf you give
            elsewhere, so your household can understand charitable giving
            alongside budgeting, zakat, and cash flow. Those entries are user
            records only; they are not payments to Barakah.
          </p>
          <p className="text-base text-gray-700">
            Questions or early-access interest? Email{' '}
            <a
              href="mailto:support@trybarakah.com"
              className="text-[#1B5E20] underline"
            >
              support@trybarakah.com
            </a>
            {' '}with the subject line &quot;Donations disclosure&quot;.
          </p>
        </section>
      </div>
    </main>
  );
}
