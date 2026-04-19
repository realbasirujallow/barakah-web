import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Zakat on Savings Accounts 2026 — How to Calculate Zakat on Bank Savings | Barakah',
  description: 'Do you pay zakat on a savings account? Yes — here is how to calculate zakat on bank savings, what counts toward nisab, and how to handle interest (riba).',
  keywords: ['zakat on savings account', 'zakat bank savings', 'zakat on cash', 'is savings zakatable', 'zakat savings calculator', 'how to calculate zakat savings', 'zakat on checking account', 'zakat on bank balance', 'nisab savings'],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-savings-account' },
  openGraph: {
    title: 'Zakat on Savings Accounts 2026 — How to Calculate Zakat on Bank Savings | Barakah',
    description: 'Do you pay zakat on a savings account? Yes — here is how to calculate zakat on bank savings, what counts toward nisab, and how to handle interest (riba).',
    url: 'https://trybarakah.com/learn/zakat-on-savings-account',
    siteName: 'Barakah',
    type: 'article',
  },
};

export default function Page() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
      { '@type': 'ListItem', position: 3, name: 'Zakat on Savings Accounts', item: 'https://trybarakah.com/learn/zakat-on-savings-account' },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Zakat on Savings Accounts 2026 — How to Calculate Zakat on Bank Savings',
    description: 'Do you pay zakat on a savings account? Yes — here is how to calculate zakat on bank savings, what counts toward nisab, and how to handle interest (riba).',
    url: 'https://trybarakah.com/learn/zakat-on-savings-account',
    dateModified: '2026-04-15',
    publisher: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I pay zakat on my emergency fund?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, if your emergency fund is in a liquid account (savings, money market) and your total liquid wealth exceeds nisab after one hawl year, zakat is due on it. The emergency fund does not get a special exemption — it is still accessible wealth. The exception: if the emergency fund is earmarked for an imminent expense (e.g., you know you need $5,000 for a surgery next month), some scholars allow deducting those committed expenses from your zakatable wealth.',
        },
      },
      {
        '@type': 'Question',
        name: 'What if my savings balance fluctuates throughout the year?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "You assess your balance on your specific hawl date — not an average. If you have $15,000 on your hawl date, zakat is on $15,000. If you had $30,000 mid-year but withdrew for a house purchase and now have $8,000, you pay zakat on $8,000 (assuming it's above nisab). The hawl year resets only if your wealth goes BELOW nisab at some point.",
        },
      },
      {
        '@type': 'Question',
        name: 'Should I remove riba interest from my savings before calculating zakat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Interest income from a conventional savings account is riba and not your permissible property. Remove it first by donating it to a non-Islamic charity (not as zakat). Then calculate zakat on your principal balance only. If the interest is small (e.g., $5-10/year on a regular account), some scholars allow ignoring it for practical purposes. Barakah's Riba Detector helps identify and purify these amounts.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Zakat on Savings Accounts</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 dark:text-gray-100">Zakat on Savings Accounts 2026</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 dark:text-gray-300">
            Cash in a savings account is among the most clearly zakatable forms of wealth in Islamic law — there is no scholarly disagreement on this point. If your savings exceed the nisab threshold and have been held for a full hawl (lunar year), zakat of 2.5% is due. This guide explains how the hawl year works for savings, how to combine multiple accounts, and how to handle the complication of interest (riba) that many US savings accounts generate.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Yes — Cash and Savings Are Zakatable</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              All cash and liquid savings above the nisab threshold are zakatable after a full hawl (lunar year). This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4 dark:text-gray-300">
              <li>Checking account balances</li>
              <li>Savings account balances (high-yield or standard)</li>
              <li>Money market accounts</li>
              <li>Short-term CDs maturing within the year</li>
              <li>Cash kept at home in significant amounts</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The principle is foundational: zakat was originally paid on gold and silver coins — the monetary medium of the time. Modern cash is the direct equivalent. There is unanimous scholarly agreement that cash is zakatable. The only questions are about the hawl year, the nisab threshold, and how to handle impermissible interest.
            </p>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              The nisab threshold in April 2026 is approximately $8,473 using the gold standard (85g &times; ~$99.68/g). If your total liquid wealth — savings, checking, cash — exceeds this amount on your hawl date, zakat is due.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">The Hawl Year: When Does the Clock Start?</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              The hawl is the one-year lunar calendar period that must pass before zakat is due. Key rules:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-4 dark:text-gray-300">
              <li><strong>The hawl starts from the first day your wealth reaches the nisab threshold.</strong> If you had $8,500 in savings on January 15, 2026, your hawl started that day. One full lunar year later (approximately 354 days — around January 4, 2027), zakat is due if your balance is still above nisab.</li>
              <li><strong>You pay zakat on the balance at the end of the hawl</strong> — not on every dollar that passed through your account during the year. Money deposited and withdrawn does not all get taxed separately.</li>
              <li><strong>The hawl resets if wealth falls below nisab.</strong> If at any point during the year your savings drop to zero (or below the nisab), the hawl clock restarts when wealth rises back above nisab. Most scholars apply this strictly, though some say only a significant and prolonged drop below nisab resets the clock.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Practical tip: choose a consistent annual date — such as the 1st of Ramadan — and assess all your zakatable wealth on that date each year. This simplifies tracking significantly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Multiple Accounts: How to Combine</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              All your liquid accounts count <em>together</em> toward the nisab threshold on your hawl date. You do not evaluate each account separately. Combine:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4 dark:text-gray-300">
              <li>Primary savings account</li>
              <li>Checking account balance</li>
              <li>Emergency fund (if in a liquid account)</li>
              <li>Foreign currency accounts (convert to USD at the current exchange rate on your hawl date)</li>
              <li>Digital wallets with significant balances (PayPal, Venmo, Zelle balance)</li>
            </ul>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              <p className="font-semibold mb-2">Example:</p>
              <p>$5,000 high-yield savings + $2,000 checking + $3,000 emergency fund = <strong>$10,000 total liquid wealth</strong></p>
              <p className="mt-2">Above nisab (~$8,473): Zakat = $10,000 &times; 2.5% = <strong>$250</strong></p>
            </div>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              Note: if you have earmarked specific funds for an imminent debt or expense (e.g., rent due tomorrow, a bill you&apos;ve committed to pay), some scholars allow deducting immediately due liabilities. Most scholars, however, say you deduct only debts that are actually due and payable — not future planned expenses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Interest (Riba) in Your Savings Account</h2>
            <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
              Most US savings accounts — including high-yield savings accounts — earn interest. Islam prohibits riba (interest). If your account pays interest, here is how to handle it:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700 mb-4 dark:text-gray-300">
              <li><strong>Do NOT include the interest amount in your zakatable wealth.</strong> Interest is not your rightful property under Islamic law — it is riba that you received but did not earn permissibly.</li>
              <li><strong>Remove the interest by donating it to a general charity.</strong> This is called &quot;purification&quot; (tathheer). You do not receive the spiritual reward of sadaqah for this donation — it is simply removing impermissible wealth. Do not count it as your zakat.</li>
              <li><strong>Calculate zakat on your principal balance only</strong> — the amount you deposited, minus any interest credits. Barakah&apos;s Riba Detector identifies interest credits in your linked accounts and shows you the net principal balance automatically.</li>
              <li><strong>Consider halal alternatives.</strong> Some credit unions and Islamic financial institutions offer mudarabah profit-sharing accounts that work like savings accounts but pay a profit share instead of interest. If one is accessible to you, this eliminates the riba complication entirely.</li>
            </ol>
            <p className="text-gray-700 leading-relaxed dark:text-gray-300">
              For most standard savings accounts paying 0.01%–0.05% annual interest, the interest amount is trivial (a few dollars). Many scholars have a pragmatic view for very small amounts. But high-yield savings accounts paying 4%–5% APY generate meaningful interest that should be purified before assessing zakat.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  Do I pay zakat on my emergency fund?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  Yes, if your emergency fund is in a liquid account (savings, money market) and your total liquid wealth exceeds nisab after one hawl year, zakat is due on it. The emergency fund does not get a special exemption — it is still accessible wealth. The exception: if the emergency fund is earmarked for an imminent expense (e.g., you know you need $5,000 for a surgery next month), some scholars allow deducting those committed expenses from your zakatable wealth.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  What if my savings balance fluctuates throughout the year?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  You assess your balance on your specific hawl date — not an average across the year. If you have $15,000 on your hawl date, zakat is on $15,000. If you had $30,000 mid-year but withdrew for a house purchase and now have $8,000, you pay zakat on $8,000 (assuming it&apos;s above nisab). The hawl year resets only if your wealth goes BELOW nisab at some point during the year.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700 dark:text-gray-100">
                  Should I remove riba interest from my savings before calculating zakat?
                </summary>
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">
                  Yes. Interest income from a conventional savings account is riba and not your permissible property. Remove it first by donating it to a non-Islamic charity (not as zakat). Then calculate zakat on your principal balance only. If the interest is small (e.g., $5–10/year on a regular account), some scholars allow ignoring it for practical purposes. Barakah&apos;s Riba Detector helps identify and purify these amounts automatically when you link your accounts.
                </div>
              </details>
            </div>
          </section>

          <RamadanEmailCapture source="learn-zakat-on-savings-account" variant="inline" />

          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Calculate Savings Zakat — Free</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">Link your accounts or enter balances manually. Barakah calculates your zakat, flags riba interest, and shows your hawl date tracker — all free.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">Calculate Savings Zakat — Free</Link>
              <Link href="/dashboard/zakat" className="border border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">Open Zakat Calculator</Link>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/learn/nisab" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Nisab Threshold</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">Gold vs. silver nisab — current values and how to choose.</p>
            </Link>
            <Link href="/learn/what-is-zakat" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">What Is Zakat?</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">The fundamentals of zakat — pillars, eligibility, and timing.</p>
            </Link>
            <Link href="/learn/riba-elimination" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Riba Elimination</h3>
              <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">How to identify, purify, and avoid riba in your finances.</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
