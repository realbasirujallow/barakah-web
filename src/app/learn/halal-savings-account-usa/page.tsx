import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Savings Accounts in the USA (2026 Guide)',
  description:
    'How American Muslims can save without riba: a guide to halal savings options in the USA — Islamic banks, profit-sharing accounts, sukuk-based products, and how to track wealth growth without earning interest.',
  keywords: [
    'halal savings account usa',
    'halal savings account',
    'islamic savings account america',
    'no interest savings',
    'riba free savings',
    'muslim savings account',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-savings-account-usa' },
  openGraph: {
    title: 'Halal Savings Accounts in the USA (2026 Guide)',
    description: 'Islamic banks, profit-sharing accounts, sukuk-based products — how American Muslims save without riba.',
    url: 'https://trybarakah.com/learn/halal-savings-account-usa',
    type: 'article',
  },
};

const FaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are there fully halal savings accounts in the USA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — but they are limited. As of 2026, American Muslims have access to a small number of Islamic-bank profit-sharing accounts (notably University Islamic Financial / UIF and Lariba), a handful of credit unions with no-interest options, and sukuk-based investment accounts via brokerages. Many Muslims also use no-interest checking at conventional banks and direct excess cash into halal investment products instead of interest-bearing savings.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is keeping money in a regular bank account haram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Holding a checking account at a conventional bank is permitted by most contemporary scholars, since you are not earning interest on a non-interest-bearing checking balance. The issue arises with interest-bearing savings accounts (HYSA, CDs, money-market accounts). If you do earn interest by accident or default, scholars require donating the interest portion to charity without intention of reward, as purification.",
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do with cash I would have put in a high-yield savings account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most contemporary scholars recommend allocating short-term cash to halal money-market alternatives (sukuk-based funds, profit-sharing accounts) and longer-term cash to halal index funds or ETFs. Barakah helps you split idle cash across emergency-fund, nisab-aware savings, and growth allocations consistent with your fiqh settings.",
      },
    },
    {
      '@type': 'Question',
      name: 'Do Islamic banks in the USA pay returns on savings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — Islamic banks offer profit-sharing accounts (mudaraba structure) where the bank invests deposits in halal activities and shares profits with depositors. Returns are not guaranteed and are not interest; they reflect actual investment performance. Rates have historically been competitive with traditional HYSA rates, though they fluctuate.",
      },
    },
  ],
};

export default function HalalSavingsAccountUsaPage() {
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
              <span className="text-[#1B5E20] font-medium">Halal Savings Accounts (USA)</span>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          <article className="space-y-8">
            <header className="space-y-4">
              <div className="inline-block bg-green-100 text-[#1B5E20] px-3 py-1 rounded-full text-xs font-semibold mb-2">
                Halal Banking Guide
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1B5E20]">Halal Savings Accounts in the USA (2026 Guide)</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Where American Muslims can save without earning riba — Islamic banks, profit-sharing accounts, sukuk products, and practical workarounds.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-200 pt-4 dark:text-gray-400 dark:border-gray-700">
                <span>By Barakah Editorial Team</span>
                <span>9 min read</span>
                <span>Published: May 2026 • Last updated: May 17, 2026</span>
              </div>
            </header>

            <nav className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h2 className="font-bold text-[#1B5E20] mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li><Link href="#why" className="text-[#1B5E20] hover:underline">Why traditional savings accounts are problematic</Link></li>
                <li><Link href="#options" className="text-[#1B5E20] hover:underline">Halal savings options available in the USA</Link></li>
                <li><Link href="#islamic-banks" className="text-[#1B5E20] hover:underline">Islamic banks and credit unions</Link></li>
                <li><Link href="#alternatives" className="text-[#1B5E20] hover:underline">Sukuk and money-market alternatives</Link></li>
                <li><Link href="#how-to" className="text-[#1B5E20] hover:underline">How to structure your cash without riba</Link></li>
                <li><Link href="#faq" className="text-[#1B5E20] hover:underline">FAQ</Link></li>
              </ul>
            </nav>

            <section id="why" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Why traditional savings accounts are problematic</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A conventional high-yield savings account (HYSA), certificate of deposit (CD), or money-market account pays{' '}
                <strong>interest</strong> — a fixed, guaranteed return on your deposit. In Islamic finance this is{' '}
                <Link href="/fiqh-terms/riba" className="text-[#1B5E20] underline">riba</Link>, and earning it is impermissible
                regardless of the rate. The Qur&apos;an is explicit (Al-Baqarah 2:275): &ldquo;Allah has permitted trade and
                forbidden riba.&rdquo;
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The challenge for American Muslims is that the U.S. retail-banking system is built around interest. Even
                checking accounts at large banks sometimes pay token interest by default. The good news: a checking balance that
                pays $0 interest is permissible, and a small but growing set of halal savings alternatives now exist.
              </p>
            </section>

            <section id="options" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Halal savings options available in the USA</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm rounded-lg bg-white shadow-sm dark:bg-gray-800">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left dark:border-gray-700">
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Option</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Structure</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">Typical return</th>
                      <th className="p-3 font-semibold text-gray-700 dark:text-gray-200">FDIC?</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-800 dark:text-gray-300">
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Islamic-bank profit-sharing</td><td className="p-3">Mudaraba</td><td className="p-3">Variable, 2–5%</td><td className="p-3">Often yes (partner bank)</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">No-interest checking</td><td className="p-3">Custody</td><td className="p-3">0%</td><td className="p-3">Yes</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Sukuk-based funds</td><td className="p-3">Sukuk certificates</td><td className="p-3">3–5%</td><td className="p-3">No (SIPC)</td></tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700"><td className="p-3 font-semibold">Halal money-market funds</td><td className="p-3">Halal liquidity instruments</td><td className="p-3">3–5%</td><td className="p-3">No (SIPC)</td></tr>
                    <tr><td className="p-3 font-semibold">Halal index funds (long-term)</td><td className="p-3">Equity</td><td className="p-3">7–10% (long-run avg)</td><td className="p-3">No (SIPC)</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                Returns shown are illustrative ranges from recent years, not guarantees. SIPC protects against broker
                failure but not against investment loss; FDIC protects deposits at insured banks up to $250k per depositor.
              </p>
            </section>

            <section id="islamic-banks" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Islamic banks and credit unions in the USA</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                The U.S. has a small but growing set of Islamic financial institutions:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-gray-700 dark:text-gray-300">
                <li><strong>University Islamic Financial (UIF)</strong> — division of University Bank in Michigan; offers profit-sharing deposit accounts and halal home financing.</li>
                <li><strong>Lariba (American Finance House)</strong> — California-based; offers halal financing and partnership accounts.</li>
                <li><strong>Guidance Residential</strong> — primarily known for home financing but partners with banks for halal deposit products.</li>
                <li><strong>Various local credit unions</strong> — a handful of Muslim-community credit unions in major metro areas (Detroit, Houston, Northern Virginia) offer no-interest checking and Islamic-financing services.</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-2">What to verify before opening an account</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 text-blue-900">
                  <li>Is the deposit structure a mudaraba (profit-sharing), or is it a marketing label on a conventional interest account?</li>
                  <li>Does the bank have an active Shariah Supervisory Board?</li>
                  <li>What share of profits flows to depositors vs. the bank? (The mudaraba ratio is usually disclosed.)</li>
                  <li>Is the deposit FDIC-insured through a partner bank?</li>
                </ul>
              </div>
            </section>

            <section id="alternatives" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">Sukuk and money-market alternatives</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                If you don&apos;t have access to a local Islamic bank, the most practical halal alternative for short-term
                cash is a sukuk-based fund or a halal money-market fund held in a regular brokerage account.{' '}
                <Link href="/fiqh-terms/sukuk" className="text-[#1B5E20] underline">Sukuk</Link> are
                certificates representing partial ownership of a real asset (e.g., infrastructure, real estate, leasing
                portfolios) — the holder receives a share of the underlying revenue rather than interest on a loan.
              </p>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                See our deeper guide on{' '}
                <Link href="/learn/halal-money-market-funds" className="text-[#1B5E20] underline">
                  halal money-market funds
                </Link>{' '}
                for specific tickers and considerations.
              </p>
            </section>

            <section id="how-to" className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1B5E20]">How to structure your cash without riba</h2>
              <p className="text-gray-700 leading-relaxed dark:text-gray-300">
                A practical structure many American Muslim households use:
              </p>
              <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
                <li><strong>Day-to-day money (1 month of expenses):</strong> No-interest checking account at any major bank.</li>
                <li><strong>Emergency fund (3–6 months):</strong> Profit-sharing account at an Islamic bank, or a sukuk-based fund.</li>
                <li><strong>Sinking funds (Hajj, qurbani, school fees):</strong> Sukuk fund or halal money-market fund for goals within 1–3 years.</li>
                <li><strong>Long-term growth:</strong> Halal index funds and ETFs (Wahed, Saturna, Iman Fund). See our{' '}
                  <Link href="/learn/halal-index-funds-2026" className="text-[#1B5E20] underline">halal index funds guide</Link>.
                </li>
                <li><strong>Track zakat on all of the above:</strong> Cash, profit-sharing accounts, and fund balances are all zakatable at 2.5% per lunar year once you cross{' '}
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
              <h2 className="text-2xl font-bold">Track your halal cash and growth in one place</h2>
              <p className="text-green-100">
                Barakah links checking, profit-sharing, and brokerage accounts in a single fiqh-aware dashboard — and helps you compute zakat across the full picture based on your madhab settings.
              </p>
              <Link href="/signup" className="inline-block bg-white text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800">
                Get started free
              </Link>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/learn/halal-money-market-funds" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Halal Money-Market Funds</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">Sukuk-based liquidity funds you can hold inside a regular brokerage.</p>
                </Link>
                <Link href="/learn/islamic-banking-vs-conventional" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="font-bold text-[#1B5E20] mb-2">Islamic vs Conventional Banking</h3>
                  <p className="text-gray-600 text-sm dark:text-gray-400">How profit-sharing structures differ from interest-bearing accounts.</p>
                </Link>
              </div>
            </section>
          </article>
        </main>
      </div>
    </>
  );
}
