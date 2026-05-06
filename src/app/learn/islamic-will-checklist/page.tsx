import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Islamic Will Checklist — 12 Things to Include in Your Wasiyyah | Barakah',
  description:
    'A practical 12-point checklist for writing or reviewing your Islamic will. Covers faraid shares, the 1/3 bequest rule, executors, guardianship, debts, and contingency cases.',
  keywords: [
    'islamic will checklist',
    'wasiyyah checklist',
    'how to write islamic will',
    'islamic will requirements',
    'wasiyyah template',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-will-checklist' },
  openGraph: {
    title: 'Islamic Will Checklist — 12 Things to Include',
    description:
      'A practical checklist for an Islamic will. Faraid shares, 1/3 bequest, executors, guardianship, debts.',
    url: 'https://trybarakah.com/learn/islamic-will-checklist',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function IslamicWillChecklistPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Islamic Will Checklist</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Islamic will checklist — 12 things to include
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · This is a planning checklist, not legal advice. Have your
          will reviewed by both a qualified Islamic scholar AND a licensed estate attorney in
          your jurisdiction before signing.
        </p>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <p className="text-sm text-amber-900">
            <strong>Why a separate Islamic will?</strong> A standard Western will distributes
            your estate however you direct. Faraid (Islamic inheritance) prescribes specific
            shares for specific heirs. An Islamic will is the document that aligns your estate
            with faraid while still being enforceable in your local probate court.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The 12-point checklist</h2>
          <ol className="list-decimal list-inside space-y-4 text-base text-gray-800">
            <li>
              <strong>Personal identification.</strong> Full legal name, date of birth, current
              address, marital status. Match exactly the name on government-issued ID.
            </li>
            <li>
              <strong>Declaration of faith.</strong> A statement affirming Islam — establishes
              the basis for applying faraid. Not strictly legally required in most jurisdictions
              but customary and useful for the executor.
            </li>
            <li>
              <strong>Debts and obligations.</strong> List outstanding debts, mahr (unpaid
              dower), missed zakat, and any kaffarat (expiations) owed. Faraid applies to the
              estate AFTER these are paid.
            </li>
            <li>
              <strong>Funeral and burial wishes.</strong> Janazah preferences, burial location,
              budget cap. Without a written instruction the family may default to local non-Islamic
              norms.
            </li>
            <li>
              <strong>The 1/3 bequest (wasiyyah).</strong> Up to one-third of the estate (after
              debts) can be willed to non-faraid recipients — non-Muslim relatives, charities,
              specific causes. The remaining two-thirds must go to faraid heirs.
            </li>
            <li>
              <strong>Faraid heir shares.</strong> Use the{' '}
              <Link href="/faraid-calculator" className="text-[#1B5E20] underline">faraid calculator</Link>
              {' '}to see exact shares for your heirs (spouse, parents, children, siblings) by
              madhab. Document each named heir and their relationship.
            </li>
            <li>
              <strong>Guardianship of minor children.</strong> Name a primary and secondary
              guardian. Most US courts honour parental nomination if the guardian is fit. Without
              a nomination the court chooses.
            </li>
            <li>
              <strong>Executor (wasi).</strong> Name a primary and a backup executor. Should be a
              trusted Muslim adult familiar with both faraid and your jurisdiction&apos;s probate
              process. Many couples name each other primary; pick the backup carefully.
            </li>
            <li>
              <strong>Specific bequests within the 1/3.</strong> Itemised list: charity X gets
              $Y, sibling Z gets car. Each item attributable to the 1/3 wasiyyah portion.
            </li>
            <li>
              <strong>Digital assets.</strong> Cryptocurrency wallets, online accounts, email,
              cloud storage. Provide access instructions in a sealed envelope referenced by the
              will (don&apos;t put passwords in the will itself — wills become public on probate).
            </li>
            <li>
              <strong>Witnesses + notarisation.</strong> Most US states require two witnesses;
              several states require notarisation. Witnesses should be adults who are NOT
              beneficiaries of the will.
            </li>
            <li>
              <strong>Storage and notification.</strong> Original signed will in a safe location
              (fireproof safe, attorney&apos;s office, or registered will deposit service). Tell
              your executor where to find it. A will stored where nobody can find it is no will.
            </li>
          </ol>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Edge cases worth thinking through</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Non-Muslim spouse / children.</strong> Faraid generally excludes non-Muslim heirs from forced shares. The 1/3 wasiyyah is the standard tool for providing for them — discuss with both your scholar and your attorney.</li>
            <li><strong>Adopted children.</strong> Adoption in the Islamic legal sense doesn&apos;t create faraid inheritance rights. Provide via the 1/3 bequest.</li>
            <li><strong>Step-children.</strong> No automatic faraid claim. Same approach as adopted children.</li>
            <li><strong>Out-of-state property.</strong> Real estate is governed by the state where it sits. May need ancillary probate; mention in the will.</li>
            <li><strong>Business interests.</strong> Sole proprietorship, partnership, LLC interests need explicit handling in the will to avoid the business itself being broken up.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Use Barakah to plan it</h2>
          <p className="text-base text-gray-700 mb-4">
            The Barakah dashboard&apos;s faraid surface lets you model heir scenarios across all
            four madhabs and export a heirs-and-shares summary you can take to your scholar /
            attorney for the formal will drafting.
          </p>
          <Link href="/faraid-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Open the faraid calculator →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/islamic-will" className="text-[#1B5E20] underline">How to write an Islamic will (full guide)</Link></li>
            <li>· <Link href="/learn/islamic-estate-planning" className="text-[#1B5E20] underline">Islamic estate planning</Link></li>
            <li>· <Link href="/learn/faraid-awl-radd-explained" className="text-[#1B5E20] underline">Faraid Awl &amp; Radd explained</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Methodology + sources</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
