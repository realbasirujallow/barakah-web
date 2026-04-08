import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices, { GoldNisabUSD, SilverNisabUSD } from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Is My 401(k) Zakatable? Complete Guide for 2026 | Barakah',
  description: 'Learn whether your 401(k) is subject to zakat with three scholarly positions (AMJA, employer-match only, on-withdrawal). Includes tax deductions, examples, and FAQs.',
  keywords: ['zakat on 401k', 'is 401k zakatable', 'retirement account zakat', 'zakat on retirement', 'zakat on 401k plan', 'zakat on IRA', 'islamic retirement planning'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/zakat-on-401k',
  },
  openGraph: {
    title: 'Is My 401(k) Zakatable? Complete Guide for 2026 | Barakah',
    description: 'Three scholarly positions on 401(k) zakat, with tax/penalty deductions, worked examples, and FAQs for American Muslims.',
    url: 'https://trybarakah.com/learn/zakat-on-401k',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is my 401(k) subject to zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There are three scholarly positions: (1) AMJA holds that the full accessible balance is zakatable each year, (2) some scholars say only the employer-match portion is zakatable, and (3) others hold zakat is due only upon withdrawal. The majority of contemporary scholars recommend paying zakat on the accessible portion annually.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I deduct taxes and penalties before calculating zakat on my 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Most scholars allow you to deduct estimated taxes and the 10% early withdrawal penalty (if applicable) from your 401(k) balance before calculating the 2.5% zakat, since these amounts are not truly accessible to you.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate zakat on a 401(k) with employer match?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If your employer match is fully vested, include it in your zakatable balance. If it is not yet vested, most scholars say you do not owe zakat on unvested portions since you do not have ownership rights over them yet.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a Roth 401(k) treated differently for zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Roth 401(k) is funded with after-tax dollars, so you do not need to deduct income tax from the balance. However, the 10% early withdrawal penalty on earnings still applies if you are under 59.5, so deduct that portion if applicable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What about zakat on a traditional IRA or Roth IRA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The same principles apply. For traditional IRAs, deduct estimated taxes and penalties. For Roth IRAs, contributions can be withdrawn tax-free and penalty-free, so zakat applies to the full contribution amount. Earnings follow the same rules as 401(k) earnings.',
      },
    },
  ],
};

export default function ZakatOn401kPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <div className="flex items-center gap-3">
              <Link href="/learn" className="text-sm text-[#1B5E20] font-medium hover:underline">Learn</Link>
              <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
              <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-100 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Zakat on 401(k)</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Is My 401(k) Zakatable? Complete Guide for 2026</h1>
              <p className="text-lg text-gray-700">Understand the three major scholarly positions on zakat for 401(k) plans, IRAs, and other retirement accounts, with step-by-step calculations and real examples.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <span>By Barakah Editorial Team</span>
                <span>10 min read</span>
                <span>Published: April 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#overview" className="text-[#1B5E20] hover:underline">Why 401(k) Zakat Is Complicated</Link></li>
                <li><Link href="#positions" className="text-[#1B5E20] hover:underline">Three Scholarly Positions</Link></li>
                <li><Link href="#tax-deductions" className="text-[#1B5E20] hover:underline">Deducting Taxes & Penalties</Link></li>
                <li><Link href="#calculation" className="text-[#1B5E20] hover:underline">Step-by-Step Calculation</Link></li>
                <li><Link href="#examples" className="text-[#1B5E20] hover:underline">Worked Examples</Link></li>
                <li><Link href="#roth-ira" className="text-[#1B5E20] hover:underline">Roth 401(k) & IRA Differences</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">Frequently Asked Questions</Link></li>
              </ul>
            </nav>

            {/* Main Content */}
            <section id="overview" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Why 401(k) Zakat Is Complicated</h2>
              <p className="text-gray-700 leading-relaxed">
                Retirement accounts like 401(k) plans, 403(b) plans, and IRAs did not exist during the time of the Prophet (peace be upon him), so scholars must apply the principles of zakat to these modern financial instruments through ijtihad (scholarly reasoning).
              </p>
              <p className="text-gray-700 leading-relaxed">
                The core question is one of <strong>accessibility and ownership</strong>. Zakat is generally due on wealth you own and can access. With a 401(k), your money is technically yours, but accessing it before age 59.5 triggers taxes and a 10% penalty. This restriction is what creates scholarly disagreement.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your 401(k) balance must still meet the nisab threshold for zakat to be obligatory. The current nisab based on gold (85g) is approximately <GoldNisabUSD />, and based on silver (595g) is approximately <SilverNisabUSD />.
              </p>
              <NisabLivePrices />
            </section>

            <section id="positions" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Three Scholarly Positions</h2>
              <p className="text-gray-700 leading-relaxed">
                Contemporary scholars have taken three main positions on whether and how to pay zakat on 401(k) accounts:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Position 1: Full Accessible Balance (AMJA Recommendation)</h3>
                  <p className="text-gray-700 text-sm">
                    The Assembly of Muslim Jurists of America (AMJA) and many contemporary scholars hold that <strong>zakat is due annually on the full accessible balance</strong> of your 401(k), after deducting estimated taxes and penalties. The reasoning is that you technically own this wealth and can access it (even at a cost), and the penalty does not negate ownership. This is the most cautious and widely recommended position.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Position 2: Employer Match Only</h3>
                  <p className="text-gray-700 text-sm">
                    Some scholars distinguish between your own contributions and the employer match. Under this view, your contributions are considered restricted wealth (like a debt owed to you by the plan), and only the <strong>employer-match portion</strong> (which is essentially a gift) is zakatable. This position is less common but has scholarly support.
                  </p>
                </div>

                <div className="border-l-4 border-amber-600 bg-amber-50 p-4 rounded">
                  <h3 className="font-bold text-amber-900 mb-2">Position 3: Zakat on Withdrawal Only</h3>
                  <p className="text-gray-700 text-sm">
                    A third group of scholars holds that 401(k) funds are analogous to a <strong>debt that is unlikely to be recovered</strong> (al-dayn al-marju). Under this view, zakat is only due when you actually withdraw the funds, and you pay zakat for one year only at the time of withdrawal. This position is followed by some Hanafi scholars.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed font-semibold bg-yellow-50 border border-yellow-200 p-4 rounded">
                <strong>Recommendation:</strong> Barakah follows the AMJA position (Position 1) as the default, since it is the safest approach and ensures your zakat obligation is fulfilled. You can adjust your calculation method in your <Link href="/dashboard" className="text-[#1B5E20] underline">Barakah dashboard</Link>.
              </p>
            </section>

            <section id="tax-deductions" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Deducting Taxes & Penalties</h2>
              <p className="text-gray-700 leading-relaxed">
                Most scholars who follow Position 1 agree that you should deduct amounts you would never actually receive. For a traditional 401(k), this means:
              </p>
              <ul className="space-y-3 text-gray-700 list-disc list-inside">
                <li><strong>Federal income tax:</strong> Estimate your marginal tax rate (commonly 22-32% for most earners) and deduct that percentage from your balance.</li>
                <li><strong>State income tax:</strong> If your state has income tax, deduct that as well (varies by state, typically 0-13%).</li>
                <li><strong>10% early withdrawal penalty:</strong> If you are under 59.5, deduct an additional 10% penalty on the full balance.</li>
              </ul>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">Important Note on Deductions</h3>
                <p className="text-blue-900 text-sm">
                  These deductions only apply to traditional (pre-tax) 401(k) accounts. Roth 401(k) contributions were made with after-tax dollars, so you do not deduct income tax from those contributions. See the Roth section below for details.
                </p>
              </div>
            </section>

            <section id="calculation" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Step-by-Step Calculation</h2>
              <p className="text-gray-700 leading-relaxed">
                Follow these steps to calculate zakat on your traditional 401(k) under the AMJA position:
              </p>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li><strong>Find your total vested balance.</strong> Log in to your 401(k) provider and note the total vested balance (exclude unvested employer match).</li>
                <li><strong>Determine your estimated tax rate.</strong> Use your marginal federal + state tax rate. For most Americans, this is between 25-40%.</li>
                <li><strong>Deduct taxes.</strong> Multiply your balance by (1 - tax rate). If under 59.5, also subtract the 10% penalty.</li>
                <li><strong>Check against nisab.</strong> Verify the net amount meets the nisab threshold.</li>
                <li><strong>Calculate 2.5%.</strong> Multiply the net accessible amount by 0.025.</li>
              </ol>
            </section>

            <section id="examples" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Worked Examples</h2>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example 1: Under 59.5, Traditional 401(k)</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Total vested balance: <strong>$120,000</strong></p>
                  <p>Estimated tax rate (federal + state): <strong>30%</strong></p>
                  <p>Early withdrawal penalty: <strong>10%</strong></p>
                  <p>Deductions: $120,000 x (30% + 10%) = $48,000</p>
                  <p>Net accessible amount: $120,000 - $48,000 = <strong>$72,000</strong></p>
                  <p>Zakat due: $72,000 x 2.5% = <strong>$1,800</strong></p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example 2: Over 59.5, Traditional 401(k)</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Total vested balance: <strong>$250,000</strong></p>
                  <p>Estimated tax rate (federal + state): <strong>28%</strong></p>
                  <p>Early withdrawal penalty: <strong>$0</strong> (over 59.5)</p>
                  <p>Deductions: $250,000 x 28% = $70,000</p>
                  <p>Net accessible amount: $250,000 - $70,000 = <strong>$180,000</strong></p>
                  <p>Zakat due: $180,000 x 2.5% = <strong>$4,500</strong></p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example 3: Roth 401(k), Under 59.5</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Total balance: <strong>$80,000</strong></p>
                  <p>Your contributions: <strong>$60,000</strong></p>
                  <p>Earnings: <strong>$20,000</strong></p>
                  <p>Tax on contributions: $0 (already taxed)</p>
                  <p>Penalty on early earnings withdrawal: $20,000 x 10% = $2,000</p>
                  <p>Net accessible: $80,000 - $2,000 = <strong>$78,000</strong></p>
                  <p>Zakat due: $78,000 x 2.5% = <strong>$1,950</strong></p>
                </div>
                <p className="text-xs text-amber-700 mt-3">Use Barakah&apos;s <Link href="/zakat-calculator" className="underline">zakat calculator</Link> for automatic calculations with your exact tax bracket.</p>
              </div>
            </section>

            <section id="roth-ira" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Roth 401(k) & IRA Differences</h2>
              <p className="text-gray-700 leading-relaxed">
                Roth accounts are funded with after-tax dollars, which changes the zakat calculation significantly:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left">Account Type</th>
                      <th className="border border-gray-300 p-3 text-left">Tax Deduction?</th>
                      <th className="border border-gray-300 p-3 text-left">Penalty Deduction?</th>
                      <th className="border border-gray-300 p-3 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Traditional 401(k)</td>
                      <td className="border border-gray-300 p-3">Yes (est. marginal rate)</td>
                      <td className="border border-gray-300 p-3">Yes (if under 59.5)</td>
                      <td className="border border-gray-300 p-3 text-sm">Contributions were pre-tax</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Roth 401(k)</td>
                      <td className="border border-gray-300 p-3">No (already taxed)</td>
                      <td className="border border-gray-300 p-3">Only on earnings (if under 59.5)</td>
                      <td className="border border-gray-300 p-3 text-sm">Contributions withdraw tax/penalty-free</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Traditional IRA</td>
                      <td className="border border-gray-300 p-3">Yes (est. marginal rate)</td>
                      <td className="border border-gray-300 p-3">Yes (if under 59.5)</td>
                      <td className="border border-gray-300 p-3 text-sm">Same as traditional 401(k)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Roth IRA</td>
                      <td className="border border-gray-300 p-3">No (already taxed)</td>
                      <td className="border border-gray-300 p-3">Only on earnings (if under 59.5)</td>
                      <td className="border border-gray-300 p-3 text-sm">Contributions always accessible</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Key Takeaway</h3>
                <p className="text-gray-700">
                  The fundamental principle is the same across all account types: calculate zakat on the <strong>net amount you could actually access today</strong>, after deducting any taxes and penalties that would apply. Roth contributions are more straightforward because taxes have already been paid.
                </p>
              </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Is my 401(k) subject to zakat?</h3>
                <p className="text-gray-700 text-sm">
                  Yes, according to the majority of contemporary scholars (including AMJA). The full accessible balance, after deducting estimated taxes and penalties, is zakatable. Some scholars hold alternative positions (employer-match only or on-withdrawal only), but the safest approach is to pay annually on the net accessible amount.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I deduct taxes and penalties before calculating zakat?</h3>
                <p className="text-gray-700 text-sm">
                  Yes. Most scholars permit deducting estimated federal and state income taxes, plus the 10% early withdrawal penalty if you are under 59.5. This reflects the actual amount you could access, which is the basis for zakat.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What about unvested employer match?</h3>
                <p className="text-gray-700 text-sm">
                  Unvested employer contributions are not yet your property, so you do not owe zakat on them. Once they vest (become yours), include them in your zakatable balance going forward.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: I have both a 401(k) and an IRA. Do I combine them?</h3>
                <p className="text-gray-700 text-sm">
                  Yes. For zakat purposes, combine all your retirement account balances (after respective tax/penalty deductions) along with your other zakatable assets (cash, gold, investments) to determine if you meet the nisab and to calculate total zakat due.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I took a 401(k) loan?</h3>
                <p className="text-gray-700 text-sm">
                  If you took a loan from your 401(k), the loan amount reduces your balance. Calculate zakat on the remaining balance in the account. The loan proceeds that you now hold as cash are zakatable as cash savings.
                </p>
              </div>
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Calculate Zakat on Your Retirement Accounts</h2>
              <p className="text-green-100">
                Barakah automatically handles tax and penalty deductions for 401(k), IRA, and Roth accounts. Get your exact zakat obligation in seconds.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Open Zakat Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/zakat-on-stocks"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Stocks & Investments</h3>
                  <p className="text-gray-600 text-sm">Learn how to calculate zakat on stocks, mutual funds, and cryptocurrency.</p>
                </Link>
                <Link
                  href="/learn/zakat-on-savings"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Savings</h3>
                  <p className="text-gray-600 text-sm">Step-by-step guide to calculating zakat on savings accounts and cash.</p>
                </Link>
              </div>
            </section>

            {/* Author & Update Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last reviewed:</strong> April 2026</p>
              <p className="mt-2">This article is based on rulings and guidance from AMJA (Assembly of Muslim Jurists of America), Fiqh Council of North America, and Dr. Monzer Kahf&apos;s research on zakat and modern financial instruments. Hadith references include Sahih Bukhari and Sahih Muslim.</p>
            </footer>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600">Fiqh-aware household finance for modern Muslim families.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/nisab-threshold" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                  <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">Finance 101</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
