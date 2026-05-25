import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Islamic Banking vs Conventional Banking: A 2026 Comparison',
  description:
    'How Islamic banking differs from conventional banking — riba, profit-sharing, mudaraba, ijara, real-asset backing, and what it means for your everyday account, savings, and mortgage.',
  keywords: [
    'islamic banking vs conventional',
    'islamic banking explained',
    'mudaraba vs interest',
    'shariah banking',
    'no interest banking',
    'how islamic banks make money',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-banking-vs-conventional' },
  openGraph: {
    title: 'Islamic Banking vs Conventional Banking: A 2026 Comparison',
    description: 'Riba, profit-sharing, mudaraba, ijara — the core structural differences and what they mean for everyday banking.',
    url: 'https://trybarakah.com/learn/islamic-banking-vs-conventional',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the core difference between Islamic and conventional banking?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Conventional banking is built on lending money at interest (riba). Islamic banking is built on profit-and-loss sharing and real-asset transactions. Instead of lending you money to buy a house, an Islamic bank co-buys the house with you (musharaka) or buys it and leases it to you (ijara). Instead of paying you interest on a savings account, it invests your deposit and shares the profits (mudaraba).",
      },
    },
    {
      '@type': 'Question',
      name: 'How does an Islamic bank make money if it cannot charge interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Islamic banks earn revenue from trading margins (murabaha — markup on a real-asset sale), rental income (ijara — leasing assets to customers), profit shares (mudaraba and musharaka — equity in customer ventures), and service fees. The economics often look similar to conventional banking on the surface, but the underlying contracts are structurally different: each transaction must be backed by a real asset or a genuine partnership.",
      },
    },
    {
      '@type': 'Question',
      name: 'Are Islamic banks safer than conventional banks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Islamic banks are typically subject to the same prudential regulation as conventional banks (capital ratios, liquidity rules, deposit insurance). The 2008 financial crisis caused noticeably less damage to Islamic banks because their balance sheets cannot include the derivative and securitization products that amplified the crisis — but they are not immune to economic downturns and still face credit risk on their financing portfolios.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch from conventional to Islamic banking gradually?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — most Muslims transition incrementally. Common path: (1) move daily checking to a no-interest account, (2) move savings to a profit-sharing or sukuk-based account, (3) refinance any conventional mortgage with an Islamic home-financing provider, (4) move investments to halal index funds, (5) move credit-card usage to debit or charge-card alternatives. Each step is independent.",
      },
    },
  ],
};

export default function IslamicBankingVsConventionalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FaqSchema) }} />
      <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
        <nav className="bg-white border-b border-gray-100 px-6 py-3 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/learn" className="hover:text-[#1B5E20] transition">Learn</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#1B5E20] font-medium">Islamic vs Conventional Banking</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Islamic Finance Basics
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Islamic Banking vs Conventional Banking</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Riba, profit-sharing, real-asset backing — the structural differences and what they mean for everyday banking in 2026.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>11 min read</span>
                <span>Published: May 2026 • Last updated: May 17, 2026</span>
              </div>
            </header>

            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#core" className="text-[#1B5E20] hover:underline">The core difference: riba vs profit-sharing</Link></li>
                <li><Link href="#side-by-side" className="text-[#1B5E20] hover:underline">Side-by-side comparison</Link></li>
                <li><Link href="#products" className="text-[#1B5E20] hover:underline">How common products differ</Link></li>
                <li><Link href="#contracts" className="text-[#1B5E20] hover:underline">The contracts behind Islamic banking</Link></li>
                <li><Link href="#regulation" className="text-[#1B5E20] hover:underline">Regulation, risk, and deposit insurance</Link></li>
                <li><Link href="#switch" className="text-[#1B5E20] hover:underline">How to switch gradually</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQ</Link></li>
              </ul>
            </nav>

            <section id="core" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">The core difference: riba vs profit-sharing</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A conventional bank lends you money and charges{' '}
                <Link href="/fiqh-terms/riba" className="text-[#1B5E20] underline">riba (interest)</Link>:
                a fixed, predetermined return on the principal. The bank&apos;s profit is the gap between the interest it pays
                depositors and the interest it charges borrowers. The transaction is purely monetary — no real asset has to
                change hands.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Islamic banking is forbidden from earning interest. Instead it earns by:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li><strong>Co-investing</strong> — sharing in your profits and losses (mudaraba, musharaka)</li>
                <li><strong>Trading</strong> — buying an asset and reselling to you at a transparent markup (murabaha)</li>
                <li><strong>Leasing</strong> — buying an asset and leasing it to you (ijara)</li>
                <li><strong>Fees</strong> — charging for genuine services (account management, advisory, transfers)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                Every Islamic-banking transaction must be backed by a real asset or a genuine partnership. This is not just a
                cosmetic difference — it constrains what an Islamic bank can put on its balance sheet, and it ties banking
                profitability to the productive economy.
              </p>
            </section>

            <section id="side-by-side" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Side-by-side comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-lg bg-white shadow-sm dark:bg-gray-800">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Dimension</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Conventional</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Islamic</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Return basis</td><td className="p-3">Interest (fixed, predetermined)</td><td className="p-3">Profit-share or asset-backed margin (variable)</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Risk on deposits</td><td className="p-3">Bank bears all (deposits guaranteed)</td><td className="p-3">Shared (mudaraba is profit-and-loss)</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Asset backing</td><td className="p-3">Not required</td><td className="p-3">Required for each transaction</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Permitted activities</td><td className="p-3">Almost all sectors</td><td className="p-3">Halal sectors only (no alcohol, gambling, weapons, conventional finance, etc.)</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Derivatives &amp; speculation</td><td className="p-3">Allowed</td><td className="p-3">Restricted (gharar/maysir prohibition)</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Oversight</td><td className="p-3">Banking regulator</td><td className="p-3">Banking regulator + Shariah Supervisory Board</td></tr>
                    <tr><td className="p-3 font-semibold">Late-payment penalty</td><td className="p-3">Additional interest</td><td className="p-3">Typically donated to charity (cannot be revenue)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="products" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How common products differ</h2>

              <h3 className="text-xl font-semibold text-[#1B5E20] mt-4">Savings account</h3>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Conventional:</strong> Bank pays a stated APY on your deposit. <strong>Islamic:</strong> Bank invests
                your deposit (mudaraba) and shares the realized profits, typically quarterly. Returns are not guaranteed and
                reflect actual investment performance.
              </p>

              <h3 className="text-xl font-semibold text-[#1B5E20] mt-4">Home financing</h3>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Conventional:</strong> Bank lends you money at interest; you own the home and owe the loan.
                <strong>Islamic:</strong> Bank either (a) buys the home and resells to you at a transparent markup{' '}
                (<Link href="/fiqh-terms/murabaha" className="text-[#1B5E20] underline">murabaha</Link>),
                (b) co-buys with you and you progressively purchase the bank&apos;s share{' '}
                (<Link href="/learn/diminishing-musharaka-explained" className="text-[#1B5E20] underline">diminishing musharaka</Link>), or
                (c) buys the home and leases it to you{' '}
                (<Link href="/fiqh-terms/ijara" className="text-[#1B5E20] underline">ijara</Link>).
              </p>

              <h3 className="text-xl font-semibold text-[#1B5E20] mt-4">Auto financing</h3>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Conventional:</strong> Interest-bearing loan. <strong>Islamic:</strong> Murabaha (bank buys car, resells
                to you at markup with installment plan) or ijara (bank leases car to you with optional purchase).
              </p>

              <h3 className="text-xl font-semibold text-[#1B5E20] mt-4">Credit card</h3>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                <strong>Conventional:</strong> Revolving credit at interest if not paid in full. <strong>Islamic:</strong> Few
                fully halal options; some Islamic banks offer charge-card alternatives (must be paid in full) or fee-based
                cards with no interest. See our{' '}
                <Link href="/learn/halal-credit-card-alternatives-2026" className="text-[#1B5E20] underline">
                  halal credit card alternatives guide
                </Link>.
              </p>
            </section>

            <section id="contracts" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">The contracts behind Islamic banking</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The five most common Islamic-finance contracts:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Mudaraba</strong> — one party provides capital, the other provides labor; profits are shared by a pre-agreed ratio, losses are borne by the capital provider.</li>
                <li><strong>Musharaka</strong> — joint venture; both parties contribute capital and share profits and losses by ownership share.</li>
                <li><strong>Murabaha</strong> — bank buys an asset and resells to customer at a transparent markup with deferred payment.</li>
                <li><strong>Ijara</strong> — leasing; bank owns the asset, customer pays rent for use.</li>
                <li><strong>Sukuk</strong> — Islamic bond equivalent; certificate of ownership in a tangible asset or project, paying a share of the asset&apos;s revenue.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                See our{' '}
                <Link href="/learn/ijara-vs-murabaha-vs-musharaka-explained" className="text-[#1B5E20] underline">
                  ijara vs murabaha vs musharaka deep dive
                </Link>{' '}
                for a worked example of each.
              </p>
            </section>

            <section id="regulation" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Regulation, risk, and deposit insurance</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                In the USA, UK, Canada, and EU, Islamic banks are typically chartered under the same regulator as
                conventional banks (FDIC, FCA, OSFI, etc.) and subject to the same capital and liquidity rules. Deposits in
                profit-sharing accounts at FDIC-insured Islamic banks are insured up to $250k.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The structural risk picture differs in two ways:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Islamic banks cannot hold most derivative and securitization products, so they were less exposed to the 2008 crisis triggers.</li>
                <li>Mudaraba accounts technically share losses with the bank — though in practice, regulators and Shariah boards usually require banks to maintain a stabilization reserve so depositors don&apos;t take losses in normal conditions.</li>
              </ul>
            </section>

            <section id="switch" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How to switch gradually</h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Open a no-interest checking account for daily money flow.</li>
                <li>Move emergency-fund cash to a profit-sharing or sukuk-based account.</li>
                <li>Refinance any conventional mortgage with an Islamic home-finance provider (Guidance Residential, UIF in the US; Al Rayan, Gatehouse in the UK).</li>
                <li>Move investment accounts to halal ETFs and funds.</li>
                <li>Replace credit-card revolving debt with debit, charge cards, or fully-paid-each-month credit cards.</li>
                <li>Track zakat across all of the above at 2.5% per lunar year once you cross{' '}
                  <Link href="/learn/nisab" className="text-[#1B5E20] underline">nisab</Link>.</li>
              </ol>
            </section>

            <section id="faq" className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Frequently Asked Questions</h2>
              {FaqSchema.mainEntity.map((q) => (
                <div key={q.name} className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Q: {q.name}</h3>
                  <p className="text-gray-700 text-sm dark:text-gray-300">{q.acceptedAnswer.text}</p>
                </div>
              ))}
            </section>

            <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-xl p-8 text-white mt-12 space-y-4">
              <h2 className="text-2xl font-bold">Plan your switch — fiqh-aware</h2>
              <p className="text-green-100">
                Barakah models your full balance sheet with your madhab&apos;s rules and helps prioritize riba-elimination steps.
              </p>
              <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Get started free
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/riba-elimination" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Riba Elimination</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">A step-by-step path to removing interest from your household finances.</p>
                </Link>
                <Link href="/learn/halal-savings-account-usa" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Savings Accounts (USA)</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Specific halal savings options available to American Muslims in 2026.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
