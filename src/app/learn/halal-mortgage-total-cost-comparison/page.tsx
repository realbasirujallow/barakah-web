import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Mortgage vs Conventional — Total Cost Compared (2026)',
  description:
    'Run the numbers: a 30-year halal home-financing arrangement vs a conventional mortgage on the same house. Total cost, monthly payment, what changes when rates move.',
  keywords: [
    'halal mortgage cost',
    'halal mortgage vs conventional',
    'islamic mortgage total cost',
    'guidance residential cost',
    'riba-free home loan cost',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-mortgage-total-cost-comparison' },
  openGraph: {
    title: 'Halal Mortgage vs Conventional — Total Cost Compared',
    description: 'Side-by-side total-cost comparison of halal home financing vs a conventional mortgage.',
    url: 'https://trybarakah.com/learn/halal-mortgage-total-cost-comparison',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function HalalMortgageCostComparisonPage() {
  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1B5E20]">Home</Link>
          {' / '}
          <Link href="/learn" className="hover:text-[#1B5E20]">Learn</Link>
          {' / '}
          <span className="text-gray-700">Halal Mortgage Cost Comparison</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1B5E20] mb-3">
          Halal mortgage vs conventional — total cost compared
        </h1>
        <p className="text-base text-gray-600 mb-8">
          Last reviewed: 2026-05-06 · Comparison is illustrative, not legal or financial
          advice. Numbers depend on rate environment and provider; verify with the actual
          providers before deciding.
        </p>

        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <p className="text-sm text-amber-900">
            <strong>What &quot;halal mortgage&quot; actually is.</strong> Conventional mortgages
            charge interest, which is riba and not permissible in Islamic law. Halal home
            financing replaces interest with one of three structures: <em>Murabaha</em> (cost-plus
            sale), <em>Ijara</em> (lease-to-own), or <em>Diminishing Musharaka</em> (declining
            shared ownership). The economic outcome is similar to a conventional mortgage but
            the legal/contractual mechanism is different.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6 overflow-x-auto">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Illustrative comparison</h2>
          <p className="text-sm text-gray-600 mb-3">
            Hypothetical $400,000 home, 20% down ($80,000), 30-year term. Profit/interest rate
            ~7.0% (mid-2026 typical). Monthly numbers rounded.
          </p>
          <table className="w-full text-base text-gray-800">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Cost line</th>
                <th className="text-right py-2">Halal financing</th>
                <th className="text-right py-2">Conventional</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_tr]:border-b [&_tr]:border-gray-100">
              <tr>
                <td>Loan amount</td>
                <td className="text-right">$320,000</td>
                <td className="text-right">$320,000</td>
              </tr>
              <tr>
                <td>Monthly payment (P&amp;I)</td>
                <td className="text-right">~$2,128</td>
                <td className="text-right">~$2,128</td>
              </tr>
              <tr>
                <td>Total payments over 30 years</td>
                <td className="text-right">~$766,100</td>
                <td className="text-right">~$766,100</td>
              </tr>
              <tr>
                <td>&quot;Profit&quot; / interest portion</td>
                <td className="text-right">~$446,100</td>
                <td className="text-right">~$446,100</td>
              </tr>
              <tr>
                <td>Down payment</td>
                <td className="text-right">$80,000</td>
                <td className="text-right">$80,000</td>
              </tr>
              <tr>
                <td>Origination / acquisition fees (typical)</td>
                <td className="text-right">~$5,000–8,000</td>
                <td className="text-right">~$3,000–6,000</td>
              </tr>
              <tr>
                <td>Title / appraisal / legal fees</td>
                <td className="text-right">~$2,500</td>
                <td className="text-right">~$2,500</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">
            Sources: monthly P&amp;I calculated at 7.0% over 30 years on a $320k principal. Fee
            ranges drawn from Guidance Residential (typical halal provider) and conventional
            US lenders. Numbers will move with rate environment — this is a structural
            comparison, not a quote.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Where the costs actually differ</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Origination fees</strong> tend to be modestly higher with halal providers because the underwriting includes shariah-board review.</li>
            <li><strong>Refinancing</strong> is more constrained on a halal contract because the existing structure (e.g. Diminishing Musharaka) doesn&apos;t map cleanly to a conventional refi product. Some providers offer in-house re-pricing instead.</li>
            <li><strong>Late-payment terms</strong> are typically capped at the actual cost of collection in halal contracts (no interest-on-interest). Conventional mortgages compound late fees.</li>
            <li><strong>Early payoff</strong> is typically allowed without prepayment penalty on halal contracts; conventional mortgages vary.</li>
            <li><strong>Insurance handling</strong> sometimes requires takaful (Islamic insurance) on halal contracts where the provider holds the building until final transfer; conventional mortgages just require regular hazard insurance.</li>
          </ul>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Where the structures matter most</h2>
          <p className="text-base text-gray-700">
            The economic outcome over 30 years is similar by design — both structures give the
            customer a $400k home for ~$766k total over the term. The reason to pick the halal
            structure is the underlying contract, not the dollars. Riba is categorically
            forbidden in Islamic law (Quran 2:275-279); two contracts producing the same cash
            flow can be permissible or impermissible based on the underlying agreement.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Major US halal home-financing providers</h2>
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
            <li><strong>Guidance Residential</strong> — Diminishing Musharaka structure. Largest US halal home-financing provider, available in most states. Shariah board oversight.</li>
            <li><strong>UIF (University Islamic Financial)</strong> — Murabaha-based. Specific state availability.</li>
            <li><strong>Devon Bank</strong> — Murabaha and Ijara. Chicago-area focus, expanding.</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Each provider&apos;s offering changes — verify current rates, fees, state
            availability, and shariah board composition before applying.
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">Related</h2>
          <ul className="space-y-2 text-base">
            <li>· <Link href="/learn/halal-mortgage-providers-usa" className="text-[#1B5E20] underline">Halal mortgage providers in the US</Link></li>
            <li>· <Link href="/learn/halal-mortgage-vs-rent-2026" className="text-[#1B5E20] underline">Halal mortgage vs renting</Link></li>
            <li>· <Link href="/learn/diminishing-musharaka-explained" className="text-[#1B5E20] underline">Diminishing Musharaka explained</Link></li>
            <li>· <Link href="/learn/ijara-vs-murabaha-vs-musharaka-explained" className="text-[#1B5E20] underline">Ijara vs Murabaha vs Musharaka</Link></li>
            <li>· <Link href="/methodology" className="text-[#1B5E20] underline">Full methodology + sources</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
