import { Metadata } from 'next';
import Link from 'next/link';
import NisabLivePrices, { GoldNisabUSD } from '../../../components/NisabLivePrices';

export const metadata: Metadata = {
  title: 'Zakat on Savings & Bank Accounts: How to Calculate in 2026 | Barakah',
  description: 'Complete guide to calculating zakat on savings accounts, checking accounts, and emergency funds. Step-by-step calculator with Islamic fiqh references.',
  keywords: ['zakat on savings', 'zakat on bank account', 'do I pay zakat on savings', 'zakat on money in bank', 'emergency fund zakat'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/zakat-on-savings',
  },
  openGraph: {
    title: 'Zakat on Savings & Bank Accounts: How to Calculate in 2026 | Barakah',
    description: 'Master zakat calculations on savings with practical examples and Islamic scholarly guidance.',
    url: 'https://trybarakah.com/learn/zakat-on-savings',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is zakat due on savings accounts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, zakat is due on savings accounts if the balance reaches the nisab threshold and you have owned it for one complete Islamic (lunar) year. Unlike retirement accounts, savings are fully accessible, making them clearly zakatable wealth.',
      },
    },
    {
      '@type': 'Question',
      name: 'What about interest earned in conventional banks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Interest (riba) from conventional banks is haram and cannot be kept. You must separate the interest from the principal. Most scholars recommend donating earned interest to charity rather than keeping it. The principal remains zakatable.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I exclude my emergency fund from zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, emergency funds are still your wealth and are fully zakatable. However, they are legitimate savings. Include the full emergency fund balance in zakat calculations if it exceeds nisab.',
      },
    },
  ],
};

export default function ZakatOnSavingsPage() {
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
              <span className="text-[#1B5E20] font-medium">Zakat on Savings</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Zakat Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Zakat on Savings & Bank Accounts: How to Calculate</h1>
              <p className="text-lg text-gray-700">Master the simple rules for calculating zakat on checking accounts, savings accounts, and cash with practical examples.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <span>By Barakah Editorial Team</span>
                <span>7 min read</span>
                <span>Published: March 2026 • Last updated: April 3, 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#is-zakat-due" className="text-[#1B5E20] hover:underline">Is Zakat Due on Savings?</Link></li>
                <li><Link href="#calculation-steps" className="text-[#1B5E20] hover:underline">Step-by-Step Calculation</Link></li>
                <li><Link href="#types-accounts" className="text-[#1B5E20] hover:underline">Checking vs Savings vs CD</Link></li>
                <li><Link href="#interest" className="text-[#1B5E20] hover:underline">Handling Interest & Riba</Link></li>
                <li><Link href="#emergency-fund" className="text-[#1B5E20] hover:underline">Emergency Funds</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQs</Link></li>
              </ul>
            </nav>

            <section id="is-zakat-due" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Is Zakat Due on Savings Accounts?</h2>
              <p className="text-gray-700 leading-relaxed">
                <strong>Yes.</strong> If you have savings in a bank account that reaches the nisab threshold and you have held it for one complete Islamic (lunar) year, zakat is due.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Savings accounts are among the clearest examples of zakatable wealth because:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>They are liquid:</strong> You can access them immediately without restrictions or penalties</li>
                <li><strong>They are in your possession:</strong> The funds are clearly under your control</li>
                <li><strong>They are wealth:</strong> They represent monetary value you own</li>
              </ul>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">The Nisab Rule</h3>
                <p className="text-gray-700 text-sm">
                  If your savings balance is <strong>below the nisab threshold</strong> (currently <GoldNisabUSD /> based on 85g of gold), you do not owe zakat. If it is <strong>above nisab</strong> and you&apos;ve owned it for one lunar year, you owe 2.5% in zakat.
                </p>
              </div>
            </section>

            <section id="calculation-steps" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Step-by-Step Calculation</h2>
              <p className="text-gray-700 leading-relaxed">
                Calculating zakat on savings is simple:
              </p>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-[#1B5E20]">1</span>
                  <div>
                    <p className="font-semibold text-gray-900">Check your savings balance</p>
                    <p className="text-gray-600 text-sm">Look at the current total in your account(s)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-[#1B5E20]">2</span>
                  <div>
                    <p className="font-semibold text-gray-900">Verify it exceeds nisab</p>
                    <p className="text-gray-600 text-sm">Compare to the current nisab threshold (<GoldNisabUSD /> or 85g of gold value)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-[#1B5E20]">3</span>
                  <div>
                    <p className="font-semibold text-gray-900">Count one lunar year</p>
                    <p className="text-gray-600 text-sm">Ensure you have owned it for 12 Islamic months (approximately 354 days)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-[#1B5E20]">4</span>
                  <div>
                    <p className="font-semibold text-gray-900">Calculate 2.5%</p>
                    <p className="text-gray-600 text-sm">Multiply your balance by 0.025 (or divide by 40)</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-[#1B5E20]">5</span>
                  <div>
                    <p className="font-semibold text-gray-900">Pay the amount due</p>
                    <p className="text-gray-600 text-sm">Distribute to qualified recipients or use Barakah to donate</p>
                  </div>
                </li>
              </ol>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">Example: $10,000 in Savings</h3>
                <div className="space-y-2 text-sm text-amber-900 font-mono">
                  <p>Current balance: <strong>$10,000</strong></p>
                  <p>Nisab threshold: <GoldNisabUSD /> (live)</p>
                  <p>Does it exceed nisab? <strong>YES ✓</strong></p>
                  <p>Lunar year held? <strong>YES ✓</strong></p>
                  <p>Zakat due (2.5%): <strong>$10,000 × 0.025 = $250</strong></p>
                </div>
              </div>
            </section>

            <section id="types-accounts" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Checking vs Savings vs Certificates of Deposit</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Checking Accounts</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Fully zakatable.</strong> Checking account balances are liquid and immediately accessible. Include the full balance in your zakat calculation if it exceeds nisab after holding for one lunar year.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Savings Accounts</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Fully zakatable.</strong> Savings accounts are also liquid wealth. Although there may be withdrawal limits, you can access funds without penalties. Include in your zakat calculation.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
                  <h3 className="font-bold text-purple-900 mb-2">Certificates of Deposit (CDs)</h3>
                  <p className="text-gray-700 text-sm">
                    <strong>Zakatable with consideration for early withdrawal penalties.</strong> CDs are more restricted than savings accounts. Most scholars recommend:
                  </p>
                  <ul className="mt-2 space-y-1 text-purple-900 text-sm list-disc pl-6">
                    <li>If accessible before maturity: Include full balance minus early withdrawal penalty</li>
                    <li>If truly locked until maturity: Some scholars exempt until maturity, others apply full balance</li>
                    <li>Conservative approach: Calculate zakat on the full balance to ensure compliance</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="interest" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Interest Earned in Conventional Accounts (Riba)</h2>
              <p className="text-gray-700 leading-relaxed">
                Interest (riba) earned from conventional bank accounts is prohibited in Islam. You cannot keep this money or include it in your permanent wealth.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-red-600 mb-3">What to Do with Interest</h3>
                <ol className="space-y-2 text-gray-700 text-sm">
                  <li>1. <strong>Separate the interest</strong> from your principal balance</li>
                  <li>2. <strong>Do not use it</strong> for yourself or your family</li>
                  <li>3. <strong>Donate it to charity</strong> (sadaqah) to purify your wealth</li>
                  <li>4. Give to those in genuine need, masajid, Islamic organizations, or other charitable causes</li>
                </ol>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>For zakat calculation:</strong> Only include your principal deposit, not the interest earned. The interest should be donated separately to charity.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Example: Interest Handling</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Principal deposit: <strong>$5,000</strong></p>
                  <p>Interest earned: <strong>$50</strong></p>
                  <p>Current balance: <strong>$5,050</strong></p>
                  <p className="border-t border-green-200 pt-2 font-semibold">For zakat: Use only <strong>$5,000</strong></p>
                  <p>Donate the <strong>$50</strong> interest to charity separately</p>
                </div>
              </div>
            </section>

            <section id="emergency-fund" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What About Emergency Funds?</h2>
              <p className="text-gray-700 leading-relaxed">
                Many Muslims set aside emergency funds (often 3-6 months of living expenses) for unexpected hardships. A common question is: "Can I exclude my emergency fund from zakat?"
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold">
                <strong className="text-red-600">Short answer: No.</strong> Emergency funds are still your wealth and are fully zakatable.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-3">The Islamic Position</h3>
                <p className="text-gray-700 text-sm mb-3">
                  While having an emergency fund is wise and encouraged, it remains your wealth. Islamic law does not allow exempting it from zakat simply because it is reserved for emergencies. The purpose of the fund does not change its nature as zakatable wealth.
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>However:</strong> Having an emergency fund is a legitimate financial need. After paying zakat, maintaining your emergency fund is important for family stability and meeting obligations.
                </p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>Include your full emergency fund balance in zakat calculations</strong> if it exceeds nisab after holding for one lunar year.
              </p>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: If my balance fluctuates during the year, which amount do I use for zakat?</h3>
                <p className="text-gray-700 text-sm">
                  Most scholars recommend using the balance on your zakat anniversary date (the date you reach one lunar year). However, if your balance regularly fluctuates, some allow averaging throughout the year. Use the anniversary method as the standard approach.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if my savings dip below nisab partway through the year?</h3>
                <p className="text-gray-700 text-sm">
                  If you drop below nisab, you do not owe zakat that year. However, when you return above nisab, a new one-year period starts. This is called the "gap rule" in Islamic jurisprudence.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I combine multiple accounts for calculating nisab?</h3>
                <p className="text-gray-700 text-sm">
                  Yes, absolutely. Combine all your liquid savings (checking, savings, money market accounts) when calculating whether you meet nisab. Then calculate 2.5% zakat on the combined total.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Do I owe zakat on money I'm holding for someone else?</h3>
                <p className="text-gray-700 text-sm">
                  No. If you are holding savings on trust for another person (like money for a child or as a custodian), you are not responsible for zakat. The owner of the funds must pay zakat. However, if the money is yours, you must include it.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: How do I calculate zakat if I add money partway through the year?</h3>
                <p className="text-gray-700 text-sm">
                  New deposits start their own one-year countdown. On your zakat anniversary, calculate zakat on:
                  <br />1. Your original balance (which has now completed one year)
                  <br />2. New deposits that have completed their own year
                  <br />Some scholars allow a simpler method: use the current balance and multiply by 2.5%. Consult an imam for guidance on which method fits your situation.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Calculate Your Savings Zakat Today</h2>
              <p className="text-green-100">
                Barakah's zakat calculator makes it easy to determine your obligation on savings accounts and other assets.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Open Calculator
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/learn/zakat-on-gold"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Gold & Jewelry</h3>
                  <p className="text-gray-600 text-sm">Calculate zakat on gold with current market prices and scholarly guidance.</p>
                </Link>
                <Link
                  href="/learn/nisab-threshold"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Nisab Threshold 2026</h3>
                  <p className="text-gray-600 text-sm">Understand the minimum threshold and whether you must pay zakat.</p>
                </Link>
              </div>
            </section>

            {/* Author Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last updated:</strong> April 3, 2026</p>
              <p className="mt-2">Content based on Islamic fiqh from AMJA, Fiqh Council of North America, and classical Islamic jurisprudence.</p>
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
                  <li><Link href="/learn/zakat-al-fitr" className="hover:text-[#1B5E20] transition">Zakat al-Fitr</Link></li>
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
