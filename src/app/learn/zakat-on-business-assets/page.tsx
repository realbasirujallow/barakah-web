import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'Zakat on Business Assets 2026 — How to Calculate Zakat If You Own a Business | Barakah',
  description: 'Step-by-step guide to calculating zakat on business assets for self-employed Muslims and business owners. What inventory, cash, and receivables are zakatable.',
  keywords: ['zakat on business', 'zakat business assets', 'zakat self employed', 'business zakat calculator', 'zakat for business owners', 'zakat on inventory', 'calculating business zakat', 'zakat on sole proprietorship'],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-business-assets' },
  openGraph: {
    title: 'Zakat on Business Assets 2026 — How to Calculate Zakat If You Own a Business | Barakah',
    description: 'Step-by-step guide to calculating zakat on business assets for self-employed Muslims and business owners. What inventory, cash, and receivables are zakatable.',
    url: 'https://trybarakah.com/learn/zakat-on-business-assets',
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
      { '@type': 'ListItem', position: 3, name: 'Zakat on Business Assets', item: 'https://trybarakah.com/learn/zakat-on-business-assets' },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Zakat on Business Assets 2026 — How to Calculate Zakat If You Own a Business',
    description: 'Step-by-step guide to calculating zakat on business assets for self-employed Muslims and business owners.',
    url: 'https://trybarakah.com/learn/zakat-on-business-assets',
    dateModified: '2026-04-15',
    publisher: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do I pay zakat on business equipment and computers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Equipment, machinery, computers, vehicles, and other fixed assets used to run the business are not zakatable. They are considered tools of trade — instruments for generating wealth, not wealth itself. Only assets held FOR SALE — inventory, cash, receivables — are zakatable. If you buy electronics to resell them, they become inventory and ARE zakatable. If you buy a laptop to work on, it is not.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I calculate zakat on accounts receivable?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Accounts receivable (money owed to your business by customers) are zakatable if you have a reasonable expectation of collecting them. If an invoice is 30 days old and from a reliable customer, it is fully zakatable. If a debt has been outstanding for years and recovery is uncertain, most scholars say you may defer zakat on it until you actually collect the money, then pay zakat on the collected amount for one year.',
        },
      },
      {
        '@type': 'Question',
        name: "What is the hawl year for business zakat — the business's anniversary or mine?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For a sole proprietor, your personal hawl date applies to business assets as well. Track your total wealth (personal + business zakatable assets) as of your annual hawl date. For partnerships, each partner may have a different hawl date based on when their nisab was first met. A practical approach is to pick a single annual date (e.g., Ramadan 1st) and assess all zakatable assets — personal and business — on that date.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <article className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <nav className="mb-6 text-sm">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">Zakat on Business Assets</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">Zakat on Business Assets 2026</h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            If you own a business — whether a sole proprietorship, LLC, or partnership — zakat applies to certain business assets. The key principle is simple: zakat falls on wealth held for growth and trade, not on tools you use to run the business. This guide walks through exactly what is zakatable, how to calculate the amount, and how to handle special cases like online sellers, freelancers, and business partners.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">What Business Assets Are Zakatable?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The dividing line is between assets held <em>for trade</em> and assets used <em>as tools</em>. Zakatable business assets include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li><strong>Inventory</strong> — goods held for sale are the core zakatable business asset. Whether you stock physical products, raw materials for manufacturing, or finished goods, these are zakatable at their current value.</li>
              <li><strong>Cash and bank balances</strong> — all business cash accounts, operating accounts, and reserve funds held by the business.</li>
              <li><strong>Accounts receivable</strong> — money owed to your business that you have a reasonable expectation of collecting within the year.</li>
              <li><strong>Short-term investments</strong> — liquid investments (money market, short-term securities) held by the business.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-3">NOT zakatable:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Fixed assets used in the business</strong> — machinery, computers, vehicles, office furniture, and real estate used to operate the business are tools of production, not trade goods. A delivery truck is not zakatable. A fleet of trucks you sell as inventory is.</li>
              <li><strong>Intellectual property and goodwill</strong> — brand value, patents, and goodwill are not tangible wealth that can be assigned a zakat-triggering value under classical fiqh.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How to Calculate Business Zakat</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The formula accepted by the majority of contemporary scholars and endorsed by AAOIFI is:
            </p>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 font-mono text-sm text-gray-800 leading-relaxed">
              <p>(Inventory at market/cost value)</p>
              <p>+ (Cash + bank balances)</p>
              <p>+ (Receivables expected to be collected)</p>
              <p>&#8722; (Short-term liabilities/payables due within the hawl year)</p>
              <p className="mt-2 font-bold">= Net Zakatable Business Assets</p>
              <p className="mt-2">Zakat = Net Zakatable Business Assets &times; 2.5%</p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Worked example:</strong> A halal food supplier has $50,000 in inventory, $30,000 in the business bank account, and $20,000 in outstanding invoices from reliable clients. They owe $15,000 in supplier payables due this month.
            </p>
            <div className="bg-gray-50 border rounded-lg p-5 mb-4 text-gray-800">
              <p>$50,000 + $30,000 + $20,000 &#8722; $15,000 = <strong>$85,000 net zakatable assets</strong></p>
              <p className="mt-2">Zakat = $85,000 &times; 2.5% = <strong>$2,125</strong></p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Zakat is due only after one full hawl year above the nisab threshold. You deduct current liabilities — amounts due within the year — from your assets before applying the 2.5% rate.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Inventory Valuation: Cost vs. Market Price</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Which figure do you use for your inventory — what you paid for it (cost) or what it sells for (market price)? The madhabs differ:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-4">
              <li><strong>Hanafi madhab:</strong> Use the current market selling price. Rationale: that is the real, present value of the wealth.</li>
              <li><strong>Shafi&apos;i, Maliki, Hanbali (majority view):</strong> Use the lower of cost or market value. This is the more conservative approach and is widely followed.</li>
              <li><strong>AAOIFI and contemporary scholars:</strong> Recommend current market value for simplicity and consistency across business types.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              In practice: if your goods have declined in value since purchase (e.g., seasonal products, perishables), use cost — the lower figure. If goods have appreciated (e.g., gold jewelry inventory, luxury goods), use the current market price. When in doubt, the conservative (lower) value is safer and widely accepted by all four madhabs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Special Cases: Online Sellers, Freelancers, Partnerships</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The same principles apply across business types, with a few specific notes:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-gray-700">
              <li><strong>Online sellers (Amazon, Etsy, Shopify):</strong> Count all unsold inventory held as of your hawl date — including stock in Amazon FBA warehouses. Cash in your seller account is also zakatable. Deduct seller fees and platform payables due within the year.</li>
              <li><strong>Freelancers and consultants:</strong> You have no physical inventory. Your zakatable wealth is your accounts receivable (unpaid invoices from reliable clients) plus cash and savings. Time you have worked but not yet billed is not zakatable until invoiced and expected to be collected.</li>
              <li><strong>LLC / S-Corp owners:</strong> If the business is closely held (you own &gt;50%), calculate zakat on your proportional share of the business&apos;s net zakatable assets. If the business distributes profits and retains little, assess on the distributed amounts in your personal accounts.</li>
              <li><strong>Partnerships:</strong> Each partner calculates and pays zakat on their own share of the partnership&apos;s zakatable assets. One partner&apos;s payment does not cover another&apos;s obligation. Coordinate on the valuation date for consistency.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">
                  Do I pay zakat on business equipment and computers?
                </summary>
                <div className="px-4 pb-4 text-gray-700">
                  No. Equipment, machinery, computers, vehicles, and other fixed assets used to run the business are not zakatable. They are considered &quot;tools of trade&quot; — instruments for generating wealth, not wealth itself. Only assets held FOR SALE — inventory, cash, receivables — are zakatable. If you buy electronics to resell them, they become inventory and ARE zakatable. If you buy a laptop to work on, it is not.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">
                  How do I calculate zakat on accounts receivable?
                </summary>
                <div className="px-4 pb-4 text-gray-700">
                  Accounts receivable (money owed to your business by customers) are zakatable if you have a reasonable expectation of collecting them. If an invoice is 30 days old and from a reliable customer, it is fully zakatable. If a debt has been outstanding for years and recovery is uncertain, most scholars say you may defer zakat on it until you actually collect the money, then pay zakat on the collected amount for one year.
                </div>
              </details>
              <details className="border rounded-lg">
                <summary className="p-4 cursor-pointer font-semibold text-gray-900 hover:text-green-700">
                  What is the hawl year for business zakat — the business&apos;s anniversary or mine?
                </summary>
                <div className="px-4 pb-4 text-gray-700">
                  For a sole proprietor, your personal hawl date applies to business assets as well. Track your total wealth (personal + business zakatable assets) as of your annual hawl date. For partnerships, each partner may have a different hawl date based on when their nisab was first met. A practical approach is to pick a single annual date (e.g., Ramadan 1st) and assess all zakatable assets — personal and business — on that date.
                </div>
              </details>
            </div>
          </section>

          <RamadanEmailCapture source="learn-zakat-on-business-assets" variant="inline" />

          <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Calculate Business Zakat Free</h2>
            <p className="text-gray-600 mb-6">Barakah&apos;s zakat calculator handles inventory, receivables, and liabilities — so your business zakat is accurate and effortless.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-green-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">Calculate Business Zakat Free</Link>
              <Link href="/dashboard/zakat" className="border border-green-700 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition">Open Zakat Calculator</Link>
            </div>
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <Link href="/learn/what-is-zakat" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">What Is Zakat?</h3>
              <p className="text-sm text-gray-500 mt-1">The fundamentals of zakat — who owes it and when.</p>
            </Link>
            <Link href="/learn/zakat-on-savings-account" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Zakat on Savings</h3>
              <p className="text-sm text-gray-500 mt-1">How to calculate zakat on cash and bank balances.</p>
            </Link>
            <Link href="/learn/zakat-on-retirement-accounts" className="block p-4 border rounded-lg hover:border-green-700 transition">
              <h3 className="font-semibold text-green-700">Zakat on Retirement Accounts</h3>
              <p className="text-sm text-gray-500 mt-1">Navigating 401(k), IRA, and Roth IRA zakat obligations.</p>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
