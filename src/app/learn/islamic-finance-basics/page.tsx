import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Islamic Finance 101: A Beginner\'s Guide to Halal Money Management | Barakah',
  description: 'Learn the core principles of Islamic finance: no riba, no gharar, no haram. Master halal investing, Islamic banking, and ethical financial planning.',
  keywords: ['islamic finance', 'halal finance', 'islamic banking', 'riba', 'gharar', 'what is halal investing', 'ethical investing'],
  alternates: {
    canonical: 'https://trybarakah.com/learn/islamic-finance-basics',
  },
  openGraph: {
    title: 'Islamic Finance 101: A Beginner\'s Guide to Halal Money Management | Barakah',
    description: 'Master Islamic finance principles and start your halal financial journey today.',
    url: 'https://trybarakah.com/learn/islamic-finance-basics',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Islamic finance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Islamic finance is a system of financial transactions based on Islamic principles (Sharia). Core principles include prohibition of riba (interest), gharar (uncertainty), and involvement in haram (forbidden) industries. It emphasizes ethics, fairness, and social responsibility.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is riba and why is it forbidden?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Riba is usury or interest. It is forbidden in Islam because it creates inequality: the lender gains without effort or risk while the borrower bears all responsibility. Islam promotes fair exchange and ethical lending practices instead.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is gharar in Islamic finance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gharar means excessive uncertainty or ambiguity in a contract. Islam forbids contracts where terms are unclear, risk is hidden, or one party has information the other lacks. This prevents fraud and ensures fair dealing.',
      },
    },
  ],
};

export default function IslamicFinanceBasicsPage() {
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
              <span className="text-[#1B5E20] font-medium">Islamic Finance 101</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Islamic Finance Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Islamic Finance 101: A Beginner's Guide to Halal Money</h1>
              <p className="text-lg text-gray-700">Master the core principles of Islamic finance and learn how to manage your money ethically according to Islamic values.</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4">
                <span>By Barakah Editorial Team</span>
                <span>9 min read</span>
                <span>Published: March 2026 • Last updated: April 3, 2026</span>
              </div>
            </header>

            {/* Table of Contents */}
            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#what-is" className="text-[#1B5E20] hover:underline">What is Islamic Finance?</Link></li>
                <li><Link href="#core-principles" className="text-[#1B5E20] hover:underline">Three Core Principles</Link></li>
                <li><Link href="#riba" className="text-[#1B5E20] hover:underline">No Riba (Interest)</Link></li>
                <li><Link href="#gharar" className="text-[#1B5E20] hover:underline">No Gharar (Uncertainty)</Link></li>
                <li><Link href="#haram" className="text-[#1B5E20] hover:underline">No Haram Industries</Link></li>
                <li><Link href="#halal-investing" className="text-[#1B5E20] hover:underline">Halal Investing</Link></li>
                <li><Link href="#banking" className="text-[#1B5E20] hover:underline">Islamic Banking</Link></li>
                <li><Link href="#getting-started" className="text-[#1B5E20] hover:underline">Getting Started</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQs</Link></li>
              </ul>
            </nav>

            <section id="what-is" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">What is Islamic Finance?</h2>
              <p className="text-gray-700 leading-relaxed">
                Islamic finance is a comprehensive system of financial transactions and money management based on Islamic law (Sharia). Rather than viewing finance as purely technical and amoral, Islamic finance integrates ethics, fairness, and social responsibility into every financial decision.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The core philosophy is: <strong>Money is a means to achieve life goals, not the ultimate goal itself.</strong> Wealth should be earned ethically, managed responsibly, and shared generously through mechanisms like zakat.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Why Islamic Finance Matters</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong className="text-[#1B5E20]">Ethical alignment:</strong> Your money works in accordance with your Islamic values</li>
                  <li><strong className="text-[#1B5E20]">Fairness:</strong> Transactions are transparent and equitable for all parties</li>
                  <li><strong className="text-[#1B5E20]">Social impact:</strong> Wealth creation benefits the broader community, not just the individual</li>
                  <li><strong className="text-[#1B5E20]">Long-term stability:</strong> Islamic finance avoids speculative excesses that destabilize economies</li>
                </ul>
              </div>
            </section>

            <section id="core-principles" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Three Core Principles</h2>
              <p className="text-gray-700 leading-relaxed">
                Islamic finance is built on three foundational principles that guide all financial decisions:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="text-lg font-bold text-[#1B5E20] mb-2">1. No Riba (Usury/Interest)</h3>
                  <p className="text-gray-700 text-sm">
                    Riba is forbidden because it creates unjust enrichment. The lender gains without effort while the borrower bears all risk. Islam promotes fair, shared responsibility in financial contracts.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="text-lg font-bold text-blue-900 mb-2">2. No Gharar (Uncertainty/Fraud)</h3>
                  <p className="text-gray-700 text-sm">
                    Gharar means excessive ambiguity or hidden risk in a contract. Islam prohibits transactions where one party has unfair information advantage or where terms are unclear, preventing fraud and ensuring informed consent.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
                  <h3 className="text-lg font-bold text-purple-900 mb-2">3. No Haram (Forbidden) Industries</h3>
                  <p className="text-gray-700 text-sm">
                    Money earned from prohibited activities (alcohol, pork, gambling, weapons, interest-based finance) is haram. Islamic finance restricts investment in industries that violate Islamic principles or harm society.
                  </p>
                </div>
              </div>
            </section>

            <section id="riba" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">No Riba: Interest & Usury</h2>
              <p className="text-gray-700 leading-relaxed">
                Riba literally means "excess" or "growth." In Islamic finance, it refers to interest — the predetermined increase in money that creates inequality between lender and borrower.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-red-600 mb-3">Why Riba is Forbidden</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong className="text-red-600">Inequity:</strong> The lender profits without risk; the borrower bears all burden</li>
                  <li><strong className="text-red-600">Exploitation:</strong> Those in need are forced to accept unfair terms</li>
                  <li><strong className="text-red-600">Social harm:</strong> Riba concentrates wealth in the hands of lenders, widening inequality</li>
                  <li><strong className="text-red-600">Economic instability:</strong> Excessive debt from riba contributes to financial crises</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">Islamic Alternatives to Interest</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong className="text-[#1B5E20]">Mudaraba (Profit-sharing):</strong> Investor and entrepreneur share profits/losses based on actual performance</li>
                  <li><strong className="text-[#1B5E20]">Musharaka (Partnership):</strong> All parties contribute capital and share profits/losses</li>
                  <li><strong className="text-[#1B5E20]">Murabaha (Cost-plus sale):</strong> Lender buys item and sells to borrower at marked-up price (known cost)</li>
                  <li><strong className="text-[#1B5E20]">Ijara (Leasing):</strong> Instead of a loan, you lease an asset with option to own</li>
                </ul>
              </div>
            </section>

            <section id="gharar" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">No Gharar: Transparency & Fairness</h2>
              <p className="text-gray-700 leading-relaxed">
                Gharar means uncertainty or ambiguity that prevents informed decision-making. Islam prohibits contracts where:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Terms are unclear or ambiguous</li>
                <li>One party has hidden information the other lacks</li>
                <li>Risk is concealed or unknown</li>
                <li>The subject matter doesn't exist or cannot be verified</li>
              </ul>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-3">Examples of Gharar</h3>
                <ul className="space-y-2 text-amber-900 text-sm">
                  <li><strong>Selling fruit before it ripens</strong> without knowing if it will yield well</li>
                  <li><strong>Selling a car</strong> without disclosure of major mechanical issues</li>
                  <li><strong>Insurance with hidden exclusions</strong> that the customer cannot verify</li>
                  <li><strong>Speculative investments</strong> where risk is unknown or misrepresented</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                The prohibition of gharar ensures <strong>informed consent, transparency, and fairness</strong> in all financial dealings.
              </p>
            </section>

            <section id="haram" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">No Haram Industries</h2>
              <p className="text-gray-700 leading-relaxed">
                Islamic finance restricts investment in industries or activities that are haram (forbidden) under Islamic law. This includes:
              </p>

              <div className="overflow-x-auto my-6">
                <table className="w-full border border-gray-300">
                  <thead className="bg-[#1B5E20] text-white">
                    <tr>
                      <th className="border border-gray-300 p-3 text-left">Forbidden Category</th>
                      <th className="border border-gray-300 p-3 text-left">Examples</th>
                      <th className="border border-gray-300 p-3 text-left">Why Prohibited</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Intoxicants</td>
                      <td className="border border-gray-300 p-3">Alcohol, tobacco companies</td>
                      <td className="border border-gray-300 p-3">Harms physical & mental health</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Gambling</td>
                      <td className="border border-gray-300 p-3">Casinos, betting companies</td>
                      <td className="border border-gray-300 p-3">Wealth through chance, not effort</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Pork & non-halal meat</td>
                      <td className="border border-gray-300 p-3">Pork processors, haram slaughter</td>
                      <td className="border border-gray-300 p-3">Prohibited by Islamic law</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold">Weaponry</td>
                      <td className="border border-gray-300 p-3">Arms manufacturers, defense contractors</td>
                      <td className="border border-gray-300 p-3">Cause harm and suffering</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="border border-gray-300 p-3 font-semibold">Interest-based finance</td>
                      <td className="border border-gray-300 p-3">Traditional banks, payday lenders</td>
                      <td className="border border-gray-300 p-3">Riba is explicitly forbidden</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-gray-700 leading-relaxed">
                By avoiding these industries, Islamic finance aligns wealth-building with ethical principles and contributes to a healthier, more equitable society.
              </p>
            </section>

            <section id="halal-investing" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Halal Investing: Building Wealth Ethically</h2>
              <p className="text-gray-700 leading-relaxed">
                Halal investing means building a portfolio of stocks, funds, and assets that comply with Islamic principles. Rather than restricting opportunity, Islamic screening opens new markets and opportunities.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-[#1B5E20] mb-3">How to Invest Halal</h3>
                <ol className="space-y-2 text-gray-700 text-sm">
                  <li>1. <strong className="text-[#1B5E20]">Screen companies:</strong> Research whether the company operates in halal industries (tech, healthcare, retail, energy, etc.)</li>
                  <li>2. <strong className="text-[#1B5E20]">Check financial metrics:</strong> Avoid companies with excessive debt, riba-based financing, or gambling revenues</li>
                  <li>3. <strong className="text-[#1B5E20]">Use Islamic indexes:</strong> Invest in funds that track Sharia-compliant indexes (Dow Jones Islamic Index, MSCI Islamic indexes)</li>
                  <li>4. <strong className="text-[#1B5E20]">Diversify:</strong> Spread investments across sectors to manage risk and align with Islamic principles</li>
                </ol>
              </div>

              <p className="text-gray-700 leading-relaxed">
                <strong>Barakah's halal screener</strong> helps you identify which stocks are Sharia-compliant and build an ethical portfolio aligned with your values.
              </p>
            </section>

            <section id="banking" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Islamic Banking Alternatives</h2>
              <p className="text-gray-700 leading-relaxed">
                Many modern banks now offer Islamic banking products that replace interest with ethical alternatives:
              </p>

              <div className="space-y-4 my-6">
                <div className="border-l-4 border-[#1B5E20] bg-green-50 p-4 rounded">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Islamic Savings & Checking</h3>
                  <p className="text-gray-700 text-sm">
                    Instead of interest, your deposits may earn returns through profit-sharing (Mudaraba) where the bank invests your money in halal ventures and shares profits with you.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <h3 className="font-bold text-blue-900 mb-2">Islamic Mortgages (Ijara)</h3>
                  <p className="text-gray-700 text-sm">
                    Rather than borrowing at interest, the bank purchases your home and you lease it with an option to eventually own it. You own the asset; the bank earns rental income.
                  </p>
                </div>

                <div className="border-l-4 border-purple-600 bg-purple-50 p-4 rounded">
                  <h3 className="font-bold text-purple-900 mb-2">Islamic Auto Financing</h3>
                  <p className="text-gray-700 text-sm">
                    Using Murabaha, the bank buys the car and sells it to you at a marked-up price. You pay in installments with no interest, just a transparent profit margin.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Major banks like Bank of America, Citi, and others now offer Islamic financing products. Check if your local bank has Islamic services.
              </p>
            </section>

            <section id="getting-started" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Getting Started with Islamic Finance</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-4">5 Steps to Align Your Finances</h3>
                <ol className="space-y-3 text-gray-700 text-sm">
                  <li>
                    <strong className="text-amber-900">1. Educate yourself:</strong> Learn Islamic finance principles (you're doing this now!)
                  </li>
                  <li>
                    <strong className="text-amber-900">2. Audit your accounts:</strong> Review your current bank accounts, investments, and loans. Are they halal?
                  </li>
                  <li>
                    <strong className="text-amber-900">3. Calculate your zakat:</strong> Use Barakah's calculator to determine what you owe and plan to pay it
                  </li>
                  <li>
                    <strong className="text-amber-900">4. Transition gradually:</strong> Don't try to change everything overnight. Start with new savings accounts or investments
                  </li>
                  <li>
                    <strong className="text-amber-900">5. Build a plan:</strong> Create a personal Islamic finance plan aligned with your goals and values
                  </li>
                </ol>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Remember: Islamic finance is a journey, not a destination. Even partial compliance is valued; do your best with the resources available to you.
              </p>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Is all interest (riba) the same?</h3>
                <p className="text-gray-700 text-sm">
                  Strictly speaking, any predetermined interest is riba. However, some Islamic scholars differentiate between commercial riba (interest on loans) and consumer riba. The core principle is that wealth should be earned through productive activity or fair partnership, not through the mere passage of time.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Can I use a conventional bank while I transition to Islamic finance?</h3>
                <p className="text-gray-700 text-sm">
                  Yes. Many Muslims use both conventional and Islamic banking as they transition. Ideally, shift new savings and investments to Islamic institutions. Interest earned in conventional accounts should be separated and donated to charity.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Are Islamic finance products more expensive?</h3>
                <p className="text-gray-700 text-sm">
                  Not necessarily. While Islamic mortgages may have different fee structures than conventional ones, they often result in similar overall costs. Islamic investing fees are comparable to conventional funds. The advantage is alignment with values, not necessarily lower costs.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: What if I inherit money from interest-based sources?</h3>
                <p className="text-gray-700 text-sm">
                  You can accept your inheritance (as it is your legal right), but separate any interest earned on it and donate that interest to charity. Use the principal for your needs. This purifies your wealth while respecting family obligations.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#1B5E20] mb-2">Q: Is Islamic finance just for Muslims?</h3>
                <p className="text-gray-700 text-sm">
                  No. Islamic finance principles appeal to anyone interested in ethical, socially responsible investing. Non-Muslims increasingly use Islamic financial products because they value transparency, fairness, and sustainable investing practices.
                </p>
              </div>
            </section>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Start Your Islamic Finance Journey</h2>
              <p className="text-green-100">
                Use Barakah to calculate your zakat, screen halal investments, and manage your wealth according to Islamic principles.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Related Articles */}
            <section className="mt-12 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  href="/learn/zakat-on-gold"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat on Gold</h3>
                  <p className="text-gray-600 text-sm">Calculate zakat on your precious metals and jewelry.</p>
                </Link>
                <Link
                  href="/learn/nisab-threshold"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Nisab Threshold</h3>
                  <p className="text-gray-600 text-sm">Understand the minimum wealth threshold for zakat obligation.</p>
                </Link>
                <Link
                  href="/learn/zakat-al-fitr"
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-[#1B5E20] mb-2">Zakat al-Fitr</h3>
                  <p className="text-gray-600 text-sm">Master zakat al-fitr for Eid with complete 2026 guidance.</p>
                </Link>
              </div>
            </section>

            {/* Author Info */}
            <footer className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-600">
              <p><strong>By:</strong> Barakah Editorial Team</p>
              <p><strong>Last updated:</strong> April 3, 2026</p>
              <p className="mt-2">Content based on Islamic fiqh from AMJA, Fiqh Council of North America, and classical Islamic jurisprudence sources. Islamic finance principles reference Quranic verses and hadith traditions.</p>
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
                  <li><Link href="/learn/zakat-on-gold" className="hover:text-[#1B5E20] transition">Zakat on Gold</Link></li>
                  <li><Link href="/learn/nisab-threshold" className="hover:text-[#1B5E20] transition">Nisab</Link></li>
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
