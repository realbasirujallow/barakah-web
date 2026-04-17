import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Mint Alternative for Muslims 2026 — Free Islamic Finance App | Barakah',
  description:
    'Mint shut down. The best Muslim alternative is Barakah: free zakat calculator, halal budget tracking, riba detection, and Islamic investing — all fiqh-aware. Start free today.',
  keywords: [
    'mint alternative for muslims',
    'mint alternative halal',
    'islamic mint alternative',
    'muslim budgeting app',
    'halal budget tracker',
    'free muslim finance app',
    'mint replacement halal',
    'islamic finance app mint',
    'muslim money tracker',
    'halal personal finance app',
    'best mint alternative 2026',
    'free islamic budgeting app',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/mint-alternative-for-muslims' },
  openGraph: {
    title: 'Best Mint Alternative for Muslims 2026 — Free Halal Finance App',
    description: 'Mint shut down. Switch to Barakah: the free Islamic finance app with zakat calculator, halal budgeting, riba detection, and more. No credit card needed.',
    url: 'https://trybarakah.com/learn/mint-alternative-for-muslims',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-image.png', width: 1200, height: 630, alt: 'Best Mint Alternative for Muslims — Barakah' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Mint Alternative for Muslims 2026',
    description: 'Mint is gone. Barakah is the free Islamic finance app that handles what Mint never could: zakat, halal investing, riba detection, and Islamic estate planning.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'Best Mint Alternative for Muslims 2026', item: 'https://trybarakah.com/learn/mint-alternative-for-muslims' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Mint Alternative for Muslims 2026 — Free Islamic Finance App',
  description: 'Mint shut down in December 2023. The best Muslim alternative is Barakah: free zakat calculator, halal budget tracking, riba detection, and Islamic investing — all fiqh-aware.',
  url: 'https://trybarakah.com/learn/mint-alternative-for-muslims',
  datePublished: '2024-01-10',
  dateModified: '2026-04-15',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/mint-alternative-for-muslims' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What happened to Mint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Intuit shut down Mint on January 1, 2024, after 17 years. Users were migrated to Credit Karma, but Credit Karma lacks full budgeting features and has no Islamic finance support whatsoever. Millions of users are looking for a proper Mint alternative.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best Mint alternative for Muslims?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah is the best Mint alternative for Muslims. Unlike general finance apps, Barakah includes a free zakat calculator, halal investment screener, riba (interest) detection, hawl tracker, and Islamic will planner — all with fiqh-aware rules built in. It connects to your bank via Plaid and categorizes transactions automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Barakah free like Mint was?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Barakah has a free plan that includes the full zakat calculator, manual transaction tracking, budgeting, and savings goals. The paid Plus plan ($9.99/month or less annually) adds bank account sync, halal stock screener, Faraid inheritance calculator, and the Barakah Score. There is a 7-day free trial of the Plus plan — no credit card required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Barakah connect to my bank account like Mint did?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Barakah uses Plaid — the same bank-level connection technology used by Venmo, Robinhood, and Coinbase — to securely connect to 12,000+ financial institutions. Your credentials are never stored by Barakah. Bank sync is available on the Plus plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is Barakah better than YNAB for Muslims?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'YNAB is a solid budgeting app but costs $109/year and has zero Islamic finance features. Barakah covers the same budgeting functionality plus zakat calculation, riba detection, halal investment screening, family Islamic estate planning, and more — at a lower price. Barakah is built specifically for Muslim household needs.',
      },
    },
  ],
};

const comparisonData = [
  { feature: 'Free to use', barakah: '✅ Free tier', mint: '❌ Shut down', ynab: '❌ $109/yr', credit_karma: '✅ Free' },
  { feature: 'Zakat calculator', barakah: '✅ Multi-madhab', mint: '❌', ynab: '❌', credit_karma: '❌' },
  { feature: 'Halal stock screener', barakah: '✅ 30,000+ stocks', mint: '❌', ynab: '❌', credit_karma: '❌' },
  { feature: 'Riba (interest) detection', barakah: '✅ Automatic', mint: '❌', ynab: '❌', credit_karma: '❌' },
  { feature: 'Bank account sync', barakah: '✅ Plaid-powered', mint: '✅ Was available', ynab: '✅', credit_karma: '✅' },
  { feature: 'Budget categories', barakah: '✅ Islamic categories', mint: '✅ Was available', ynab: '✅', credit_karma: '⚠️ Basic' },
  { feature: 'Hawl tracker', barakah: '✅', mint: '❌', ynab: '❌', credit_karma: '❌' },
  { feature: 'Islamic will planner', barakah: '✅ Wasiyyah', mint: '❌', ynab: '❌', credit_karma: '❌' },
  { feature: 'Family finance (up to 6)', barakah: '✅', mint: '❌', ynab: '✅ ($179/yr)', credit_karma: '❌' },
  { feature: 'Net worth tracking', barakah: '✅', mint: '✅ Was available', ynab: '⚠️ Basic', credit_karma: '✅' },
  { feature: 'Savings goals', barakah: '✅ Hajj template', mint: '✅ Was available', ynab: '✅', credit_karma: '❌' },
  { feature: 'Mobile app (iOS/Android)', barakah: '✅', mint: '❌ Shut down', ynab: '✅', credit_karma: '✅' },
  { feature: 'No data selling', barakah: '✅ Zero', mint: '❌ Sold data', ynab: '✅', credit_karma: '❌ Ad model' },
];

export default function MintAlternativeForMuslimsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-800 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold text-[#1B5E20]">🌙 Barakah</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Start Free — No Card
            </Link>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-gray-500 flex items-center gap-1.5 dark:text-gray-400">
            <Link href="/" className="text-[#1B5E20] hover:underline">Home</Link>
            <span>/</span>
            <Link href="/learn" className="text-[#1B5E20] hover:underline">Learn</Link>
            <span>/</span>
            <span>Mint Alternative for Muslims</span>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            Updated April 2026 · 8 min read
          </div>

          {/* H1 */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            Best Mint Alternative for Muslims 2026 — Free Islamic Finance App
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Mint shut down on <strong>January 1, 2024</strong>. Millions of Muslims relied on Mint for budgeting — but Mint never understood zakat, riba, halal investing, or Islamic estate planning. This is your chance to switch to something better. Here&apos;s why Barakah is the #1 Mint alternative for Muslim households.
          </p>

          {/* CTA box */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10">
            <p className="font-bold text-xl mb-1">🌙 Start Free Today — No Credit Card</p>
            <p className="text-green-200 text-sm mb-4">7 days of Plus free with every signup. Full zakat calculator, halal screener, bank sync — all included.</p>
            <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition dark:bg-gray-800">
              Create Free Account →
            </Link>
          </div>

          {/* Why Mint Failed Muslims */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Why Mint Was Never Enough for Muslims</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Mint was a great general budgeting tool — but it had a fundamental blind spot: it had absolutely no understanding of Islamic finance obligations.
          </p>
          <ul className="space-y-3 mb-6">
            {[
              'No zakat calculator or hawl tracking — you had to calculate your annual zakat obligation manually in a spreadsheet',
              'No riba (interest) detection — Mint actually encouraged linking credit cards and didn\'t flag interest payments as religiously significant',
              'No halal investment screening — couldn\'t tell you whether your stocks were Shariah-compliant',
              'No Islamic will (wasiyyah) planner — no concept of Islamic estate obligations',
              'Sold your financial data to advertisers — a concern for privacy-conscious Muslim households',
              'Shut down completely on January 1, 2024',
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* What Barakah Does */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">What Barakah Does That Mint Never Could</h2>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            Barakah is built from the ground up for Muslim households. Every feature is designed with fiqh awareness — the app knows the difference between zakatable and non-zakatable assets, flags riba automatically, and respects the difference between madhabs.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: '🟡', title: 'Free Zakat Calculator', desc: 'Multi-madhab: Hanafi, Shafi\'i, Maliki, Hanbali. Live gold & silver nisab prices. Calculate in 60 seconds.' },
              { icon: '🔴', title: 'Riba Detector', desc: 'Automatically scans your transactions and flags interest payments so you can eliminate them.' },
              { icon: '✅', title: 'Halal Stock Screener', desc: '30,000+ stocks screened against AAOIFI Standard 21. Know your portfolio\'s halal compliance instantly.' },
              { icon: '📜', title: 'Islamic Will Planner', desc: 'Record your wasiyyah, beneficiaries, and outstanding Islamic obligations — Zakat, Kaffarah, loans owed.' },
              { icon: '👨‍👩‍👧', title: 'Family Finance', desc: 'Shared budgets, group transactions, and family-level zakat visibility. Up to 6 members on one plan.' },
              { icon: '📊', title: 'Budgets & Analytics', desc: 'Bank sync via Plaid, transaction categorization, spending analytics — everything Mint did, but halal-aware.' },
              { icon: '🎯', title: 'Savings Goals', desc: 'Dedicated Hajj savings template. Set goals and track progress toward any milestone.' },
              { icon: '⭐', title: 'Barakah Score', desc: 'Your Islamic financial health score across zakat, riba-free living, sadaqah, and debt. A Mint "Financial Health" that actually matters.' },
            ].map((f) => (
              <div key={f.title} className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
                <p className="text-2xl mb-2">{f.icon}</p>
                <h3 className="font-bold text-[#1B5E20] mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Barakah vs Mint vs YNAB vs Credit Karma</h2>
          <p className="text-gray-600 mb-4 text-sm dark:text-gray-400">Feature-by-feature comparison as of April 2026.</p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-[#1B5E20] text-white">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="px-4 py-3 font-semibold text-center">🌙 Barakah</th>
                  <th className="px-4 py-3 font-semibold text-center text-gray-300">Mint</th>
                  <th className="px-4 py-3 font-semibold text-center">YNAB</th>
                  <th className="px-4 py-3 font-semibold text-center">Credit Karma</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-[#1B5E20] font-medium">{row.barakah}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{row.mint}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{row.ynab}</td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400">{row.credit_karma}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">Pricing: How Barakah Compares</h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="border-2 border-[#1B5E20] rounded-xl p-5">
              <p className="text-[#1B5E20] font-bold text-lg mb-1">Barakah Free</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-3 dark:text-gray-100">$0 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">forever</span></p>
              <ul className="text-sm text-gray-600 space-y-1.5 dark:text-gray-400">
                <li>✅ Full zakat calculator</li>
                <li>✅ Manual transactions (10/month)</li>
                <li>✅ Budgets & bills tracking</li>
                <li>✅ Hawl tracker</li>
                <li>✅ No data selling — ever</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-500 font-bold text-lg mb-1 dark:text-gray-400">Barakah Plus</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-3 dark:text-gray-100">$9.99 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/mo</span></p>
              <ul className="text-sm text-gray-600 space-y-1.5 dark:text-gray-400">
                <li>✅ Everything in Free</li>
                <li>✅ Bank account sync (Plaid)</li>
                <li>✅ Halal stock screener</li>
                <li>✅ Faraid calculator</li>
                <li>✅ Barakah Score</li>
                <li>✅ 7-day free trial</li>
              </ul>
            </div>
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-500 font-bold text-lg mb-1 dark:text-gray-400">YNAB</p>
              <p className="text-3xl font-extrabold text-gray-900 mb-3 dark:text-gray-100">$109 <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/yr</span></p>
              <ul className="text-sm text-gray-600 space-y-1.5 dark:text-gray-400">
                <li>✅ Bank sync</li>
                <li>✅ Budgeting</li>
                <li>❌ No zakat calculator</li>
                <li>❌ No halal screener</li>
                <li>❌ No Islamic features</li>
                <li>❌ No free tier</li>
              </ul>
            </div>
          </div>

          {/* How to migrate */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">How to Migrate from Mint to Barakah</h2>
          <ol className="space-y-4 mb-8">
            {[
              { step: '1', title: 'Create your free Barakah account', desc: 'Go to trybarakah.com and sign up. No credit card required. You get 7 days of Plus free automatically.' },
              { step: '2', title: 'Connect your bank accounts', desc: 'Use the Bank Accounts section in your dashboard. We support 12,000+ institutions via Plaid — the same technology used by Venmo and Robinhood.' },
              { step: '3', title: 'Run your first zakat calculation', desc: 'Head to the Zakat dashboard. Enter your assets and let Barakah calculate your obligation with live gold/silver nisab prices. Takes under 2 minutes.' },
              { step: '4', title: 'Set up your hawl anniversary', desc: 'Barakah tracks your hawl (Islamic lunar year) and notifies you when your next zakat is due.' },
              { step: '5', title: 'Screen your investments for halal compliance', desc: 'Use the Halal Screener to check your stocks, ETFs, and funds against AAOIFI Standard 21. Know your portfolio\'s compliance in seconds.' },
            ].map((item) => (
              <li key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B5E20] text-white font-bold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5 dark:text-gray-400">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* FAQ section */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-6 mb-10">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">{faq.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="bg-[#FFF8E1] border border-[#1B5E20] rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">Ready to switch?</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">Join Muslim households who&apos;ve moved from Mint to a finance app that actually understands their deen. Free to start. No card required.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition">
                Start Free — 7 Days Plus Included
              </Link>
              <Link href="/zakat-calculator" className="border border-[#1B5E20] text-[#1B5E20] px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition">
                Try Zakat Calculator
              </Link>
            </div>
          </div>

          {/* Related articles */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting Guide', desc: 'How to build a budget that respects Islamic principles.' },
                { href: '/learn/zakat-on-savings', title: 'Zakat on Savings', desc: 'Is your savings account zakatable? Learn the rules.' },
                { href: '/learn/halal-stocks', title: 'Halal Stocks Guide', desc: 'How to screen investments for Shariah compliance.' },
                { href: '/learn/riba-elimination', title: 'Riba Elimination', desc: 'Step-by-step guide to removing interest from your finances.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </article>
    </>
  );
}
