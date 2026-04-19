import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'How Much Zakat Do I Owe? 2026 Step-by-Step Calculation Guide | Barakah',
  description:
    'Find out exactly how much zakat you owe in 2026. Step-by-step guide covering nisab check, zakatable assets, deductible debts, and the 2.5% calculation — with free calculator.',
  keywords: [
    'how much zakat do i owe',
    'zakat calculation 2026',
    'how to calculate zakat',
    'zakat amount calculator',
    'zakat on savings',
    'zakat 2.5 percent',
    'calculate my zakat',
    'zakat eligibility',
    'nisab 2026',
    'zakat on gold and silver',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/how-much-zakat-do-i-owe' },
  openGraph: {
    title: 'How Much Zakat Do I Owe? 2026 Step-by-Step Guide',
    description: 'Calculate your exact zakat obligation — nisab check, zakatable assets, deductible debts, and 2.5% calculation explained.',
    url: 'https://trybarakah.com/learn/how-much-zakat-do-i-owe',
    siteName: 'Barakah',
    type: 'article',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'How Much Zakat Do I Owe?', item: 'https://trybarakah.com/learn/how-much-zakat-do-i-owe' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Much Zakat Do I Owe? 2026 Step-by-Step Calculation Guide',
  description: 'A step-by-step guide to calculating your exact zakat obligation in 2026 — covering nisab check, zakatable assets, deductible debts, and the 2.5% calculation.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-01-25',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/how-much-zakat-do-i-owe' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate how much zakat I owe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your zakat: (1) Add up all your zakatable assets — cash, gold, silver, stocks, business inventory, receivables. (2) Subtract short-term debts due within the year. (3) Check if the net total exceeds nisab (roughly $5,500 using gold nisab in 2026). (4) If yes, multiply the net total by 2.5%. That is your zakat. Example: $50,000 in assets − $5,000 in debts = $45,000 net. $45,000 × 0.025 = $1,125 zakat due.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is nisab and how does it affect my zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nisab is the minimum wealth threshold above which zakat becomes obligatory. If your net zakatable wealth is below nisab, you owe no zakat. There are two nisab standards: Gold nisab = 85 grams of gold (approximately $7,500–$8,500 in 2026 depending on gold price). Silver nisab = 595 grams of silver (approximately $450–$500 in 2026). Hanafi scholars use the silver nisab. Shafi\'i, Maliki, and Hanbali scholars use the gold nisab. Barakah lets you choose your madhab and uses live gold and silver prices.',
      },
    },
    {
      '@type': 'Question',
      name: 'What assets count toward zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakatable assets include: cash and bank savings, gold jewelry and coins held as savings, silver, stocks and investment funds (see zakat on stocks), business inventory and receivables, rental property income (the income, not the property itself), cryptocurrency, and commodities held for trade. Non-zakatable assets include: your primary home, personal vehicle, clothing, household furniture, and equipment used for work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I deduct debts from my zakat calculation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — debts due within the current lunar year can be deducted from your zakatable wealth. This includes credit card balances due now, loan installments due this year, rent due, and bills owed. Long-term debts like a 30-year mortgage: only the installments due within the current year are deductible, not the full mortgage balance (per the majority of Hanafi, Maliki, Hanbali scholars). Shafi\'i scholars generally allow deducting only the immediately due portion as well.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the hawl and how does it affect zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hawl is the one-year lunar cycle after which zakat becomes due on wealth that has remained above nisab throughout. If your wealth drops below nisab at any point during the year, the hawl resets. If you receive new wealth mid-year (a gift, inheritance, income), it joins your existing zakatable pool and the oldest hawl anniversary governs the entire amount. Barakah\'s hawl tracker alerts you when your annual zakat becomes due.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is zakat 2.5% of income or total wealth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat is 2.5% of your total net zakatable wealth — not your annual income. This is a key distinction. You calculate everything you own (savings, gold, investments, business assets) minus short-term debts, and apply 2.5% to that net figure. If your annual salary is $100,000 but you have only $10,000 in savings at your hawl date, your zakat is $10,000 × 2.5% = $250 — not $100,000 × 2.5%.',
      },
    },
  ],
};

const zakatableAssets = [
  { category: 'Cash & Bank Savings', detail: 'All liquid cash, checking accounts, savings accounts (subtract riba interest — it must be donated separately)', zakatable: true },
  { category: 'Gold Jewelry (Savings)', detail: 'Gold held as investment or savings. Gold worn regularly as jewelry: Hanafi scholars exempt it; Shafi\'i/Maliki/Hanbali scholars include it', zakatable: true },
  { category: 'Silver', detail: 'All silver holdings — coins, bars, silverware held as investment', zakatable: true },
  { category: 'Stocks & ETFs', detail: 'Market value of your portfolio at the hawl date. For halal stocks: apply the liquid asset ratio. Consult the zakat on stocks guide.', zakatable: true },
  { category: 'Business Inventory', detail: 'Goods held for sale at market value. Not equipment, vehicles, or fixed assets used in operations', zakatable: true },
  { category: 'Cryptocurrency', detail: 'Market value of crypto held for investment at the hawl date', zakatable: true },
  { category: 'Rental Income', detail: 'Net rental income received (income, not the property value itself)', zakatable: true },
  { category: 'Receivables (Money Owed to You)', detail: 'Money others owe you that you expect to recover this year', zakatable: true },
  { category: 'Primary Home', detail: 'The home you live in is not zakatable', zakatable: false },
  { category: 'Personal Vehicle', detail: 'Your primary car for personal use is not zakatable', zakatable: false },
  { category: 'Household Furniture & Clothing', detail: 'Personal use items are not zakatable', zakatable: false },
  { category: 'Work Equipment & Tools', detail: 'Equipment used in your profession (computers, tools, machinery) is not zakatable', zakatable: false },
];

export default function HowMuchZakatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">How Much Zakat Do I Owe?</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">ZAKAT CALCULATION</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              How Much Zakat Do I Owe? 2026 Step-by-Step Calculation Guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              Zakat is 2.5% of your net zakatable wealth above nisab — but knowing which assets count, which debts you can deduct, and when it is due requires a careful calculation. This guide walks you through every step.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Updated April 2026</span>
              <span>⏱ 8 min read</span>
              <span>✅ Multi-madhab guidance</span>
            </div>
          </header>

          {/* Quick Formula */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10">
            <p className="font-bold text-green-900 mb-3 text-lg">The Zakat Formula</p>
            <div className="space-y-2 text-green-800 font-mono text-sm">
              <p>Zakatable Assets − Short-Term Debts = Net Zakatable Wealth</p>
              <p className="border-t border-green-200 pt-2 font-bold text-base">Net Zakatable Wealth × 2.5% = Zakat Due</p>
              <p className="text-xs text-green-700 font-sans mt-2">Only if Net Zakatable Wealth ≥ Nisab (≈ $7,500 gold / ≈ $450 silver for 2026)</p>
            </div>
          </div>

          {/* CTA to Calculator */}
          <div className="bg-green-700 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 text-white">
              <p className="font-bold text-lg">Skip the math — use Barakah&apos;s free calculator</p>
              <p className="text-green-100 text-sm">Multi-madhab, live gold and silver prices, 8 asset categories. Result in 60 seconds.</p>
            </div>
            <Link href="/zakat-calculator" className="flex-shrink-0 bg-white text-green-800 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition whitespace-nowrap dark:bg-gray-800">
              Calculate Free →
            </Link>
          </div>

          {/* 5-Step Guide */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">How to Calculate Zakat: 5 Steps</h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Choose Your Nisab Standard',
                  body: 'Your madhab determines which nisab threshold you use. Hanafi: silver nisab (595g silver ≈ $450–$500). Shafi\'i, Maliki, Hanbali: gold nisab (85g gold ≈ $7,500–$8,500). Most scholars today recommend using the gold nisab as it better reflects the purpose of zakat — ensuring only those with significant wealth pay. Barakah shows you both and lets you choose.',
                },
                {
                  step: '2',
                  title: 'Calculate Your Total Zakatable Assets',
                  body: 'Add up all your zakatable wealth at your hawl date (annual anniversary). Include: cash in all accounts, gold and silver, the zakatable portion of your stock portfolio, business inventory, cryptocurrency, and receivables. See the full asset list below.',
                },
                {
                  step: '3',
                  title: 'Subtract Deductible Short-Term Debts',
                  body: 'Deduct debts that are immediately due or will be due within the current lunar year. This includes: credit card balance due this cycle, rent owed, utility bills due, loan installments due this year. Do NOT deduct the full mortgage balance — only payments due this year.',
                },
                {
                  step: '4',
                  title: 'Check Against Nisab',
                  body: 'If your net total is below nisab, you owe no zakat this year. If it equals or exceeds nisab, you must pay zakat on the entire amount — not just the excess. The nisab is a threshold, not a deductible.',
                },
                {
                  step: '5',
                  title: 'Multiply by 2.5%',
                  body: 'Multiply your net zakatable wealth by 0.025 (2.5%). This is your zakat obligation. Pay it before your next hawl anniversary. It can be paid to any of the 8 categories of zakat recipients (asnaf) including local masjids that distribute to the poor.',
                },
              ].map((step) => (
                <div key={step.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold">{step.step}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Worked Example */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Worked Example: Complete Zakat Calculation</h2>
            <div className="border border-gray-200 rounded-2xl overflow-hidden dark:border-gray-700">
              <div className="bg-gray-50 px-5 py-3 border-b dark:bg-gray-800">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Example: Ahmed, married with 2 children — hawl date: April 15, 2026</p>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { label: 'Cash in checking account', amount: '+$8,000' },
                  { label: 'Savings account (remove riba interest)', amount: '+$22,000' },
                  { label: 'Gold jewelry (wife\'s savings gold, 100g)', amount: '+$9,200' },
                  { label: 'Stock portfolio (30% liquid asset ratio)', amount: '+$6,000' },
                  { label: 'Business inventory (sole proprietor)', amount: '+$4,500' },
                  { label: '— Credit card balance due', amount: '−$1,200' },
                  { label: '— Rent due next month', amount: '−$1,800' },
                  { label: '— Car loan payment due this year', amount: '−$4,800' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between px-5 py-3 text-sm">
                    <span className="text-gray-700 dark:text-gray-300">{row.label}</span>
                    <span className={`font-mono font-medium ${row.amount.startsWith('+') ? 'text-green-700' : 'text-red-600'}`}>{row.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between px-5 py-4 bg-green-50 font-bold">
                  <span className="text-green-900">Net Zakatable Wealth</span>
                  <span className="text-green-900 font-mono">$41,900</span>
                </div>
                <div className="flex justify-between px-5 py-4 bg-green-700 text-white font-bold">
                  <span>Zakat Due (2.5% × $41,900)</span>
                  <span className="font-mono">$1,047.50</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Gold price used: $92/gram (approx April 2026). Stock ratio: 30% liquid assets — varies by company. Use Barakah for live prices.</p>
          </section>

          {/* Asset Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">What Counts as Zakatable Wealth?</h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Asset Category</th>
                    <th className="p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Zakatable?</th>
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {zakatableAssets.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-800 border-b border-gray-100 dark:text-gray-100 dark:border-gray-700">{row.category}</td>
                      <td className="p-3 text-center border-b border-gray-100 dark:border-gray-700">
                        <span className={`text-sm font-semibold ${row.zakatable ? 'text-green-700' : 'text-red-500'}`}>
                          {row.zakatable ? '✅ Yes' : '❌ No'}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-xs border-b border-gray-100 dark:text-gray-400 dark:border-gray-700">{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Ramadan email capture */}
          <RamadanEmailCapture source="learn-how-much-zakat" variant="inline" />

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Calculate Your Exact Zakat — Free</h2>
            <p className="text-green-100 mb-6">
              Barakah&apos;s multi-madhab zakat calculator handles gold prices, stock ratios, debt deductions, and hawl tracking automatically.
            </p>
            <Link href="/zakat-calculator" className="inline-block bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
              Open Zakat Calculator →
            </Link>
          </div>

          {/* Related Articles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Zakat Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'Complete 2026 guide — the 5 conditions and 8 recipients.' },
                { href: '/learn/nisab', title: 'Nisab Threshold 2026', desc: 'Current gold and silver nisab values with live prices.' },
                { href: '/learn/zakat-on-gold', title: 'Zakat on Gold', desc: 'How to calculate zakat on gold jewelry and coins.' },
                { href: '/learn/zakat-on-stocks', title: 'Zakat on Stocks', desc: 'Using liquid asset ratios to calculate stock zakat.' },
                { href: '/learn/zakat-on-savings', title: 'Zakat on Savings', desc: 'Which savings accounts are zakatable and how to calculate.' },
                { href: '/learn/zakat-on-crypto', title: 'Zakat on Crypto', desc: 'How to calculate zakat on Bitcoin and digital assets.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700">
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
