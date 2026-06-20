import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on a 401(k) — Three Methodologies Compared',
  description:
    'Should you pay zakat on the gross balance, the accessible value after taxes and penalties, or only when you actually withdraw? AMJA-aligned methodology and worked examples.',
  keywords: [
    'zakat on 401k',
    'zakat on retirement accounts',
    'zakat on IRA',
    'amja zakat retirement',
    'how to calculate zakat on 401k',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-401k-methodology' },
  openGraph: {
    title: 'Zakat on a 401(k) — Three Methodologies Compared',
    description: 'Three scholarly positions on zakat for retirement accounts, with worked examples for each.',
    url: 'https://trybarakah.com/learn/zakat-on-401k-methodology',
    siteName: 'Barakah',
    type: 'article',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I pay zakat on my 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, most contemporary scholars consider 401(k) and IRA balances zakatable, because they are wealth held by you even though access is restricted. The disagreement is about HOW to value them — gross, net of penalties, or only when withdrawn.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the AMJA position on zakat for 401(k) accounts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AMJA&apos;s published guidance — its retirement-account fatwas and the 16th Annual Imams&apos; Conference recommendation on retirement accounts — supports the accessible-value approach: the zakat base is the amount you could actually access after subtracting estimated income tax + early-withdrawal penalty. The reasoning is that the inaccessible portion (taxes you owe to the government, penalties) isn&apos;t truly your wealth.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Barakah use by default?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah uses the accessible-value approach by default, aligned with AMJA&apos;s published accessible-value guidance for retirement accounts. In your dashboard you can override this to use the gross-balance approach (more conservative, follows the strictest position) or the deferred approach (only at withdrawal, simpler but disputed).',
      },
    },
  ],
};

export default function Zakat401kMethodologyPage() {
  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Zakat on 401(k)</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Zakat on a 401(k) — three methodologies compared
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · This is a methodology comparison, not a binding ruling. See our{' '}
          <Link href="/methodology" className="underline text-[#1B5E20] hover:text-[#0d3a14] font-medium">
            full methodology
          </Link>
          {' '}for citations. Consult a qualified scholar for your specific case.
        </p>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">The three positions</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-[#1B5E20] pl-4">
              <h3 className="font-bold text-gray-900">1. Accessible value (Barakah default — AMJA-aligned)</h3>
              <p className="text-base text-gray-700 mt-1">
                Zakat base = balance − (estimated income tax on early withdrawal) − (10% early-withdrawal
                penalty if under 59½). Reasoning: you don&apos;t actually own the tax-and-penalty portion;
                the government does.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 pl-4">
              <h3 className="font-bold text-gray-900">2. Gross balance (most conservative)</h3>
              <p className="text-base text-gray-700 mt-1">
                Zakat base = full balance, no deductions. Reasoning: it&apos;s your wealth, even if access
                is restricted. The most conservative position; pay more, never under-pay.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-900">3. Deferred (only at withdrawal)</h3>
              <p className="text-base text-gray-700 mt-1">
                No zakat is due while funds are locked. Pay zakat once you actually withdraw. Reasoning:
                inaccessible wealth isn&apos;t zakatable until it becomes accessible. This position is held
                by a minority of contemporary scholars and is disputed.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Worked example</h2>
          <p className="text-base text-gray-700 mb-3">
            Suppose you have a $100,000 traditional 401(k) balance, you&apos;re 35 years old (so the 10%
            early-withdrawal penalty applies), and your effective federal+state marginal income tax rate
            is 30%. Net wealth above nisab. The three positions yield:
          </p>
          <table className="w-full text-base text-gray-800">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Position</th>
                <th className="text-left py-2">Zakat base</th>
                <th className="text-left py-2">Zakat (2.5%)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2">1. Accessible value (Barakah default)</td>
                <td className="py-2">$60,000</td>
                <td className="py-2"><strong>$1,500</strong></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2">2. Gross balance</td>
                <td className="py-2">$100,000</td>
                <td className="py-2"><strong>$2,500</strong></td>
              </tr>
              <tr>
                <td className="py-2">3. Deferred</td>
                <td className="py-2">$0 (until withdrawal)</td>
                <td className="py-2"><strong>$0</strong></td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Note: Roth 401(k) treatment differs — see your scholar. Barakah&apos;s dashboard handles both
            traditional and Roth, with separate accessible-value calculations.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">How to switch positions in Barakah</h2>
          <p className="text-base text-gray-700 mb-3">
            Signed-in users can change methodology from{' '}
            <span className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono">
              Settings → Fiqh → Retirement zakat methodology
            </span>
            . The choice persists across calculations and is reflected in the in-app dashboard.
          </p>
          <Link href="/zakat-calculator" className="inline-block bg-[#1B5E20] hover:bg-[#0d3a14] text-white font-semibold px-6 py-3 rounded-lg transition">
            Try the zakat calculator →
          </Link>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/learn/nisab-gold-vs-silver" className="text-[#1B5E20] underline">Gold vs silver nisab</Link></li>
            <li>· <Link href="/learn/zakat-on-stocks" className="text-[#1B5E20] underline">Zakat on stocks (active vs long-term)</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Full methodology + scholarly references</Link></li>
            <li>· <Link href="/disclaimer" className="text-[#1B5E20] underline">Why Barakah is not a fatwa</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
