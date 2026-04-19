import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on 401(k), IRA & Retirement Accounts: 3 Scholarly Positions | Barakah',
  description: 'Comprehensive guide to zakat obligations on 401(k), IRA, Roth IRA, and retirement accounts. Three scholarly positions explained with practical examples.',
  keywords: ['zakat on 401k', 'zakat on IRA', 'zakat on retirement accounts', 'zakat on Roth IRA', 'zakat on HSA'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/zakat-on-retirement-accounts',
  },
  openGraph: {
    title: 'Zakat on 401(k), IRA & Retirement Accounts: 3 Scholarly Positions | Barakah',
    description: 'Navigate the complexity of zakat on retirement accounts with three major scholarly approaches.',
    url: 'https://trybarakah.com/learn/zakat-on-retirement-accounts',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is zakat due on 401(k) and IRA accounts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, but the method depends on your scholarly position. Some scholars require zakat on the full accessible balance minus penalties and taxes. Others only count employer contributions or apply the "locked wealth" concept. Consult a local imam for guidance on which position aligns with your school of thought.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a 401(k) and an IRA for zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For zakat purposes, both are treated similarly as retirement savings accounts. The main difference is that 401(k)s are employer-sponsored with potential matching contributions, while IRAs are individual accounts. Both may have early withdrawal penalties that factor into zakat calculations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay zakat on a Roth IRA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Roth IRAs are zakatable if they meet the nisab threshold, with a special consideration: you can withdraw contributions (but not earnings) penalty-free. Some scholars argue this makes Roth IRAs more "accessible" and therefore fully zakatable. Others apply standard rules. Use Barakah\'s calculator to compare approaches.',
      },
    },
  ],
};

export default function ZakatOnRetirementAccountsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }}
      />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 dark:bg-gray-800">
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
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Zakat on Retirement Accounts</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Zakat on 401(k), IRA & Retirement Accounts</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">Navigate three major scholarly positions on zakat for 401(k), IRA, Roth IRA, and other retirement savings accounts.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>10 min read</span>
                <span>Published: March 2026 • Last updated: April 3, 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#challenge" className="text-[#1B5E20] hover:underline">The Modern Challenge</Link></li>
                <li><Link href="#position1" className="text-[#1B5E20] hover:underline">Position 1: Full Accessible Balance (AMJA)</Link></li>
                <li><Link href="#position2" className="text-[#1B5E20] hover:underline">Position 2: Employer Match Only</Link></li>
                <li><Link href="#position3" className="text-[#1B5E20] hover:underline">Position 3: On Withdrawal Only</Link></li>
                <li><Link href="#special" className="text-[#1B5E20] hover:underline">HSA & 529 Accounts</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQs</Link></li>
              </ul>
            </nav>

            <section id="challenge" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">The Modern Challenge of Retirement Accounts</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Retirement accounts like 401(k)s and IRAs present a unique challenge in Islamic finance. Unlike cash savings or gold, retirement accounts have restricted access: withdrawing funds early triggers penalties and income taxes. This creates debate among scholars about how to calculate zakat.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The core question is: <strong>Is wealth &quot;accessible&quot; if accessing it incurs significant costs?</strong> Different schools of thought have reached different conclusions, all with legitimate scholarly backing.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-2">Important</h3>
                <p className="text-amber-900 text-sm">
                  Consult with your local imam or a qualified Islamic finance advisor to determine which position aligns with your school of thought (madhab) and personal circumstances. All three positions below are grounded in Islamic jurisprudence, but they differ in application.
                </p>
              </div>
            </section>

            <section id="position1" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Position 1: Full Accessible Balance (AMJA Recommendation)</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Endorsed by:</strong> American Muslim Jurists Association (AMJA), Fiqh Council of North America
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                This position treats retirement account balances as zakatable wealth after deducting penalties and taxes owed on withdrawal.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">The Approach</h3>
                <ol className="space-y-2 text-gray-700 text-sm dark:text-gray-300">
                  <li>1. Start with your current 401(k) or IRA balance</li>
                  <li>2. Calculate the estimated tax liability (typically 22-35% for federal income tax)</li>
                  <li>3. Add early withdrawal penalties (10% if under age 59½)</li>
                  <li>4. Subtract total from balance to find &quot;net accessible value&quot;</li>
                  <li>5. Pay zakat (2.5%) on the net value if it exceeds nisab</li>
                </ol>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-3">Example: 401(k) Balance $150,000</h3>
                <div className="space-y-2 text-sm font-mono text-gray-700 dark:text-gray-300">
                  <p>Current balance: <strong>$150,000</strong></p>
                  <p>Federal income tax (25%): <strong>-$37,500</strong></p>
                  <p>Early withdrawal penalty (10%): <strong>-$15,000</strong></p>
                  <p>Net accessible value: <strong>$97,500</strong></p>
                  <p>Zakat due (2.5%): <strong>$2,437.50</strong></p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4 dark:text-gray-300">
                <strong>Rationale:</strong> Wealth that can be accessed (even with costs) is considered your property and wealth. The penalties/taxes reduce your actual wealth, so they are deducted before calculating zakat.
              </p>
            </section>

            <section id="position2" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Position 2: Employer Match Only</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Supported by:</strong> Some contemporary Islamic finance scholars seeking to minimize double-taxation concerns.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                This position differentiates between your contributions (which you earned as income) and employer contributions (which are a form of employer compensation).
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3">The Approach</h3>
                <p className="text-blue-900 text-sm mb-3">
                  Only count employer contributions and investment gains as zakatable wealth. Your own contributions already had zakat paid on them when you earned the income, so including them again would constitute double-zakat.
                </p>
                <ol className="space-y-2 text-blue-900 text-sm">
                  <li>1. Identify employer contributions in your account</li>
                  <li>2. Calculate investment gains (from employer contributions only)</li>
                  <li>3. Pay zakat on this subtotal if it exceeds nisab</li>
                  <li>4. Your personal contributions are exempt (already taxed as income)</li>
                </ol>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-3">Example: Breakdown of $150,000 Balance</h3>
                <div className="space-y-1 text-sm font-mono text-gray-700 dark:text-gray-300">
                  <p>Your contributions over years: <strong>$80,000</strong> (Exempt from zakat)</p>
                  <p>Employer match contribution: <strong>$40,000</strong></p>
                  <p>Investment gains: <strong>$30,000</strong></p>
                  <p>Zakatable amount (employer + gains): <strong>$70,000</strong></p>
                  <p>Zakat due (2.5%): <strong>$1,750</strong></p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4 dark:text-gray-300">
                <strong>Rationale:</strong> Avoids the issue of paying zakat twice on the same income. Your salary was already subject to zakat obligations; employer contributions are new wealth added to your account.
              </p>
            </section>

            <section id="position3" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Position 3: On Withdrawal Only (Maal Ghayr Mustaqarr)</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Scholarly basis:</strong> The concept of &quot;māl ghayr mustaqarr&quot; (unstable/locked wealth)
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                This position treats locked retirement funds as wealth that is not yet fully yours until withdrawn. Zakat is only due on funds once they become accessible (during distribution years or after age 59½).
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-purple-900 mb-3">The Approach</h3>
                <p className="text-purple-900 text-sm mb-3">
                  Do not pay zakat on retirement account balances while they are locked. Pay zakat only on withdrawals as you receive them (treating the withdrawn amount as regular income).
                </p>
                <ul className="space-y-2 text-purple-900 text-sm">
                  <li>• No zakat on 401(k) while employed and before retirement age</li>
                  <li>• When you withdraw funds (at age 59½ or in retirement), treat the withdrawn amount as income and calculate zakat accordingly</li>
                  <li>• This aligns with the principle that unstable/restricted wealth has different zakat rules</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Rationale:</strong> Since you cannot freely access the funds without severe penalties, they are not equivalent to cash or fully liquid assets. Zakat becomes due when the restriction is lifted (upon withdrawal or reaching retirement age).
              </p>
            </section>

            <section id="special" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Special Cases: HSA & 529 Education Accounts</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-6 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-3">Health Savings Accounts (HSA)</h3>
                  <p className="text-gray-700 text-sm mb-3 dark:text-gray-300">
                    HSAs are treated similarly to retirement accounts, though they have unique characteristics:
                  </p>
                  <ul className="space-y-2 text-gray-700 text-sm dark:text-gray-300">
                    <li><strong>If unused:</strong> Follow one of the three positions above (most treat as zakatable retirement savings)</li>
                    <li><strong>If earmarked for near-term medical expenses:</strong> Some scholars exempt funds you reasonably expect to spend soon (like emergency medical costs)</li>
                    <li><strong>Recommendation:</strong> Treat as zakatable wealth using Position 1 (AMJA approach) to be conservative and compliant</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-6 rounded">
                  <h3 className="font-bold text-blue-900 mb-3">529 Education Savings Accounts</h3>
                  <p className="text-gray-700 text-sm mb-3 dark:text-gray-300">
                    These accounts have dedicated educational purposes and restricted access:
                  </p>
                  <ul className="space-y-2 text-gray-700 text-sm dark:text-gray-300">
                    <li><strong>Designated purpose:</strong> Funds are earmarked for a specific child&apos;s education, which is a valid Islamic obligation (providing for dependents)</li>
                    <li><strong>Many scholars exempt:</strong> Since funds cannot be freely withdrawn without penalty and are for a specific familial obligation, some scholars consider them outside the scope of regular zakat</li>
                    <li><strong>Conservative approach:</strong> If you want to ensure full compliance, apply Position 1 (with penalties deducted)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="roth" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Special Consideration: Roth IRA</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Roth IRAs have a unique feature: you can withdraw your contributions (but not earnings) penalty-free at any time. This makes them somewhat more &quot;accessible&quot; than traditional 401(k)s or IRAs.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-3">Roth IRA Approach</h3>
                <ul className="space-y-2 text-amber-900 text-sm">
                  <li><strong>Conservative (safest):</strong> Treat like a regular retirement account using Position 1, deducting any income tax owed on withdrawal</li>
                  <li><strong>More lenient:</strong> Some scholars argue that since you can access contributions freely, at least your contributions are zakatable without deductions</li>
                  <li><strong>Most lenient:</strong> Apply Position 3 (on withdrawal only) since Roth IRAs are still technically restricted until age 59½ for earnings</li>
                </ul>
              </div>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Which position should I follow?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Consult with your local imam or qualified Islamic finance advisor. AMJA (Position 1) is the most widely recommended by major Islamic organizations in North America. However, all three positions are legitimate. Choose based on your madhab (school) and advisor&apos;s guidance.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I backpay zakat if I haven&apos;t been calculating it?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Yes. If you realize you owe zakat on retirement accounts, you should backpay for as many years as you have clear records. However, for years beyond reasonable recollection, many scholars allow you to begin paying zakat going forward. Consult an imam for guidance based on your specific situation.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I take a loan against my 401(k)?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  If you have borrowed from your 401(k), the borrowed portion is technically no longer in the account. Calculate zakat on the remaining balance. When you repay the loan, it re-enters your account and becomes zakatable again. Consult Barakah&apos;s calculator for help tracking loan balances.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: How does employer match affect zakat?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  In Position 1, employer match is included. In Position 2, it&apos;s the only part that&apos;s zakatable. In Position 3, no zakat on employer match until withdrawal. Track your employer contributions separately for clarity when calculating zakat.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if my retirement account decreased in value?</h3>
                <p className="text-gray-700 text-sm dark:text-gray-300">
                  Use the current market value for zakat calculations. If your account has decreased below the nisab threshold, zakat is no longer due that year. If it increases back above nisab, zakat becomes due again (counting a new lunar year from when it exceeds nisab again).
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Simplify Your Retirement Account Zakat</h2>
              <p className="text-green-100">
                Barakah&apos;s calculator guides you through all three positions and helps you compute the correct amount based on your chosen approach.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800"
              >
                Try the Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/zakat-on-savings"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Savings</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Step-by-step guide to calculating zakat on savings accounts and cash.</p>
                </Link>
                <Link
                  href="/learn/nisab"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Nisab Threshold 2026</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Understand the minimum threshold and which standard applies to you.</p>
                </Link>
              </div>
            </section>

            {/* Author Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600 dark:text-gray-400 dark:border-gray-700">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Reviewed by:</strong> Islamic finance scholars and advisors</p>
              <p><strong>Last updated:</strong> April 3, 2026</p>
              <p className="mt-2">This article references positions held by AMJA, Fiqh Council of North America, and contemporary Islamic finance scholars. Always consult with a qualified advisor for personal guidance.</p>
            </footer>
          </article>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fiqh-aware household finance for modern Muslim families.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Learn</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/learn" className="hover:text-[#1B5E20] transition">All Guides</Link></li>
                  <li><Link href="/learn/nisab" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
                  <li><Link href="/learn/zakat-on-gold" className="hover:text-[#1B5E20] transition">Zakat on Gold</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                  <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                  <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500 dark:text-gray-400 dark:border-gray-700">
              <p>&copy; {new Date().getFullYear()} Barakah. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
