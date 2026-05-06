import type { Metadata } from 'next';
import Link from 'next/link';

/**
 * /learn/sadaqah-distribution
 *
 * Required disclosure page: when a user clicks "Donate via Barakah" on
 * the dashboard or the public Sadaqah surface, they are charged via
 * Stripe and the funds flow to verified causes. This page exists to
 * make that flow transparent — what % stays with Barakah for
 * processing, which causes receive funds, when, and how.
 *
 * NOTE TO FOUNDER (Basiru): the placeholders below labelled with
 * <!-- TODO: confirm --> need real values before this page goes live.
 * Do NOT invent percentages or partner names — readers will trust this
 * page literally. If a value is unconfirmed, leave the TODO and ship
 * the page once it's filled in.
 */

export const metadata: Metadata = {
  title: 'How Barakah Distributes Sadaqah & Waqf Donations | Barakah',
  description:
    'When you donate via Barakah, where does the money go? Full disclosure on partner charities, processing fees, and disbursement timing for sadaqah and waqf giving.',
  alternates: {
    canonical: 'https://trybarakah.com/learn/sadaqah-distribution',
  },
  openGraph: {
    title: 'Where Your Sadaqah Goes — Barakah Disbursement Disclosure',
    description:
      'Full transparency on how Barakah collects, holds, and distributes sadaqah and waqf donations.',
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
          Where your sadaqah goes
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · This is a disbursement disclosure, not a fatwa. See our{' '}
          <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
            methodology
          </Link>
          {' '}for the rules behind sadaqah, waqf, and zakat tracking.
        </p>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-amber-900 mb-2">⚠️ Page in review</h2>
          <p className="text-sm text-amber-900/90">
            This disclosure page is being finalized with our payment processor and partner
            charities. The accurate numbers and partners will replace the {/* TODO */} markers
            below before the page is linked from the dashboard donate flow.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            What happens when you click &quot;Donate via Barakah&quot;
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-800">
            <li>
              You enter an amount and select a cause (general sadaqah, water, orphan care,
              shelter, mosque, disaster relief, dawah, or waqf).
            </li>
            <li>
              Stripe processes the charge on your card. Stripe&apos;s processing fee is
              {' '}<strong>{/* TODO: confirm */} 2.9% + $0.30</strong>{' '}per transaction.
            </li>
            <li>
              Barakah receives the net amount and holds it in a segregated donations account
              with our payment processor.
            </li>
            <li>
              Funds are disbursed to verified partner charities on a{' '}
              <strong>{/* TODO: confirm cadence */} monthly</strong> schedule.
            </li>
            <li>
              You receive a receipt by email. {/* TODO: confirm */} Barakah is not a 501(c)(3)
              and donations are not currently tax-deductible. We are working on partnering
              with a registered 501(c)(3) so future donations qualify.
            </li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Partner charities
          </h2>
          <p className="text-base text-gray-700 mb-4">
            {/* TODO: replace with real partners + verification basis */}
            Barakah disburses to a vetted set of Islamic relief organisations with track
            records of last-mile delivery. The current partners are:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-800">
            <li>{/* TODO: name partner #1, e.g. "Islamic Relief USA" */} Partner organisation #1</li>
            <li>{/* TODO: name partner #2 */} Partner organisation #2</li>
            <li>{/* TODO: name partner #3 */} Partner organisation #3</li>
          </ul>
          <p className="text-sm text-gray-600 mt-4">
            We add or rotate partners as their published audits and field reports change.
            See our{' '}
            <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
              methodology page
            </Link>
            {' '}for our vetting criteria.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Operational fee
          </h2>
          <p className="text-base text-gray-700">
            Barakah retains{' '}
            <strong>{/* TODO: confirm */} 0%</strong>{' '}of donations for operational costs.
            Stripe processing fees are paid out of the donation amount unless you opt to
            cover them at checkout.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Waqf donations
          </h2>
          <p className="text-base text-gray-700 mb-3">
            Waqf — perpetual endowment giving — is structured differently from sadaqah.
            When you donate to a waqf cause through Barakah, the principal is held in a
            named endowment with{' '}
            <strong>{/* TODO: confirm waqf custodian */} a partnering custodial waqf institution</strong>,
            and only the income from the principal is disbursed to the named recipient.
          </p>
          <p className="text-base text-gray-700">
            Waqf records on the dashboard track your contribution amounts and the
            cause. The actual fund management and reporting happens with the custodian.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">
            Auditability
          </h2>
          <p className="text-base text-gray-700">
            We publish a quarterly disbursement report at{' '}
            <Link href="/learn/sadaqah-distribution" className="text-[#1B5E20] underline">
              /learn/sadaqah-distribution
            </Link>
            {' '}showing total collected, total disbursed by partner, and any
            balance carrying over. {/* TODO: link first quarterly report once published */}
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Questions?</h2>
          <p className="text-base text-gray-700">
            If you donated and want to confirm where your specific contribution went,
            email{' '}
            <a href="mailto:support@trybarakah.com" className="text-[#1B5E20] underline">
              support@trybarakah.com
            </a>
            {' '}with your receipt.
          </p>
        </section>
      </div>
    </main>
  );
}
