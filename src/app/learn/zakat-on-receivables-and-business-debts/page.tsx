import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Zakat on Receivables and Business Debts 2026 | Barakah',
  description:
    'How to pay zakat on money owed to you. Strong vs weak receivables, deductibility of debts you owe, and AAOIFI guidance for business owners in 2026.',
  keywords: [
    'zakat on receivables',
    'zakat on debts owed',
    'zakat on accounts receivable',
    'zakat business debts',
    'aaoifi receivables',
    'zakat money owed',
    'zakat freelancer invoices',
    'zakat strong weak debts',
    'business zakat 2026',
    'islamic ruling receivables',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/zakat-on-receivables-and-business-debts' },
  openGraph: {
    title: 'Zakat on Receivables and Business Debts — When and How to Pay',
    description: 'Strong vs weak receivables, deductibility of debts you owe, and AAOIFI Standard 35 guidance for Muslim freelancers and business owners.',
    url: 'https://trybarakah.com/learn/zakat-on-receivables-and-business-debts',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakat on Receivables and Business Debts',
    description: 'Strong vs weak receivables, deductibility, and AAOIFI guidance for 2026.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Zakat on Receivables and Business Debts', item: 'https://trybarakah.com/learn/zakat-on-receivables-and-business-debts' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Zakat on Receivables and Business Debts',
  description: 'A practical zakat guide for freelancers and business owners on receivables, payables, and AAOIFI methodology.',
  url: 'https://trybarakah.com/learn/zakat-on-receivables-and-business-debts',
  datePublished: '2026-04-26',
  dateModified: '2026-04-26',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
};

export default function ZakatReceivablesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Calculate Business Zakat →
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">

          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Zakat on Receivables and Business Debts</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Last reviewed April 26, 2026 · 8 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Zakat on Receivables and Business Debts — A Practical 2026 Guide
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            If you are a freelancer with unpaid invoices, a small-business owner with accounts receivable, or someone who lent money to a friend, this question lands on you every Ramadan: do I owe zakat on money I do not yet have? The classical fiqh has a clean framework. AAOIFI Standard 35 codifies it for the modern world. Here is the working version.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">The core principle</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Zakat applies to wealth you own and have the ability to use. A receivable is wealth you own — the debtor owes it to you and you have a legal claim — but your ability to use it depends on whether you can actually collect. Classical Hanafi fiqh splits receivables into three categories based on collectability. Other madhabs use simpler binary tests but reach similar conclusions in practice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Strong, medium, and weak debts (Hanafi framework)</h2>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Strong debt (dayn qawi)</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Money owed to you in exchange for goods sold or services rendered, or cash you lent, where the debtor is solvent and willing. Examples: a paying customer on net-30 terms, a sibling who borrowed $5,000 and is good for it.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Treatment:</strong> zakat is due on it every hawl. You can either pay zakat each year as it accrues, or defer payment until you collect, then pay the cumulative zakat for all the years it was owed. Mufti Taqi Usmani prefers the &quot;pay each year&quot; approach for cleanliness.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Medium debt (dayn mutawassit)</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Money owed to you that came from sale of non-trade assets you owned (e.g., you sold your personal car on installments). Hanafis treat this as zakatable only when you collect, then for one year forward. Other madhabs typically treat all receivables uniformly with the strong-debt rule.
          </p>
          <h3 className="text-lg font-bold text-gray-900 mt-6 mb-3 dark:text-gray-100">Weak debt (dayn da&apos;if)</h3>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Money owed to you as compensation for services where the debtor is delaying or potentially insolvent. Examples: a client who is months overdue and dodging your emails, an inheritance share tied up in court, a debt to an entity in bankruptcy.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Treatment:</strong> no zakat until collection. Once you actually collect, pay zakat for one year forward (Hanafi), or for all prior years if you assessed it as a strong debt initially that turned bad (other views).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Practical test for which bucket your receivable is in</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Sheikh Joe Bradford&apos;s pragmatic version of the Hanafi test:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Is the debtor solvent and willing to pay? If yes, treat as strong.</li>
            <li>Is collection delayed but reasonably expected within 12 months? Strong.</li>
            <li>Is the debtor refusing, missing, or in serious financial distress? Weak. Defer until collection.</li>
            <li>Is it a long-term installment with a reliable counterparty? Strong on each year&apos;s expected receipt.</li>
          </ol>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Deductibility of debts you owe</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The flip side. If you owe money, can you subtract it from your zakatable wealth? The dominant view among contemporary scholars (and AAOIFI Standard 35): yes, but only the portion of your debts that is due within the current year, and only against zakatable assets.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Practical example. You have $50,000 in cash, a halal mortgage with $300,000 outstanding (monthly payment $2,000). On your hawl date:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>Zakatable wealth: $50,000 cash.</li>
            <li>Deductible debt: $24,000 (12 months of mortgage payments). Not the full $300,000 — that is amortized over decades.</li>
            <li>Net zakatable amount: $26,000.</li>
            <li>Zakat owed: $26,000 x 2.5% = $650.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            AMJA Resolution 6/2 specifically addresses long-term debt deductibility and lands at the &quot;current year only&quot; rule. Mufti Taqi Usmani allows a more generous deduction in cases of business operating debts that revolve continuously.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Worked example: a freelance designer</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            You are a freelancer. On your hawl date in Ramadan 1447H you have:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 pl-2 dark:text-gray-300">
            <li>$15,000 in your business checking. Zakatable.</li>
            <li>$8,000 from a paying client (Net-15, will pay next week). Strong receivable. Add to the pool.</li>
            <li>$3,500 from a startup client that has been ghosting you for three months. Weak receivable. Exclude until collection.</li>
            <li>$500 owed to your accountant for tax filing services next month. Deductible (current period).</li>
            <li>$12,000 on your business credit card from haram inventory financing — you have already paid the haram contract off, this is an outstanding payable. Deductible.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Zakatable pool: $15,000 + $8,000 - $500 - $12,000 = $10,500. If this is above nisab (~$8,500), pay 2.5% = $263. When the ghost client eventually pays you, pay one year of zakat on that $3,500 ($88) at that point.
          </p>

          <section className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-2 text-lg font-bold text-amber-900">Bottom line</h2>
            <p className="text-sm text-amber-900 leading-relaxed">
              Strong receivables (paying client, solvent debtor) are zakatable each year. Weak receivables (delinquent, bankrupt) are zakatable only when you collect. Deduct only the current 12 months of any long-term debt you owe. AAOIFI Standard 35 and AMJA Resolution 6/2 are the modern references. When in doubt, document your reasoning each year so you can true up later.
            </p>
          </section>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/zakat-on-business-assets', title: 'Zakat on Business Assets', desc: 'Inventory, equipment, and trade goods.' },
                { href: '/learn/zakat-on-savings', title: 'Zakat on Savings', desc: 'How 2.5% applies to your cash.' },
                { href: '/learn/how-much-zakat-do-i-owe', title: 'How Much Zakat Do I Owe?', desc: 'Step-by-step calculation walkthrough.' },
                { href: '/learn/hawl', title: 'Hawl (Lunar Year)', desc: 'Why 354 days matters for receivables.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Track receivables and zakat in Barakah</h2>
            <p className="text-green-200 mb-6">Tag invoices as strong or weak receivables. Barakah handles the zakat math, tracks your hawl, and projects payment so you are never caught off guard.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Zakat Calculator
              </Link>
              <Link href="/learn/zakat-on-business-assets" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Business Zakat →
              </Link>
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
