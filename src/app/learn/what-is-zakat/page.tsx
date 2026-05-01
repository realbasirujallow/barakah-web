import type { Metadata } from 'next';
import Link from 'next/link';
import RamadanEmailCapture from '../../../components/RamadanEmailCapture';

export const metadata: Metadata = {
  title: 'What is Zakat? Complete 2026 Guide — Rules, Calculation & Who Must Pay',
  description:
    'What is zakat? The complete guide: definition, the five conditions, nisab threshold, how to calculate 2.5% on all asset types, who must pay, and when. Includes free calculator.',
  keywords: [
    'what is zakat',
    'zakat explained',
    'how does zakat work',
    'zakat rules',
    'who must pay zakat',
    'zakat calculation guide',
    'zakat percentage',
    'zakat 2.5 percent',
    'five pillars zakat',
    'zakat definition',
    'zakat conditions',
    'nisab zakat',
    'hawl zakat',
    'types of zakat',
    'how to pay zakat',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/what-is-zakat' },
  openGraph: {
    title: 'What is Zakat? Complete 2026 Guide — Rules, Calculation & Who Must Pay',
    description: 'Everything you need to know about zakat: the conditions, nisab threshold, how to calculate 2.5%, types of zakatable assets, and when to pay.',
    url: 'https://trybarakah.com/learn/what-is-zakat',
    siteName: 'Barakah',
    type: 'article',
    images: [{ url: 'https://trybarakah.com/og-zakat-calculator.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What is Zakat? Complete 2026 Guide',
    description: 'The conditions, nisab, calculation formula, types of zakatable assets, and everything else you need to know about zakat — with a free calculator.',
    images: ['https://trybarakah.com/og-zakat-calculator.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    { '@type': 'ListItem', position: 3, name: 'What is Zakat?', item: 'https://trybarakah.com/learn/what-is-zakat' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'What is Zakat? Complete 2026 Guide — Rules, Calculation & Who Must Pay',
  description: 'The complete guide to zakat: definition, the five conditions, nisab threshold, how to calculate 2.5%, types of zakatable assets, who must pay, and when.',
  url: 'https://trybarakah.com/learn/what-is-zakat',
  datePublished: '2024-01-20',
  dateModified: '2026-04-15',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  image: 'https://trybarakah.com/og-zakat-calculator.png',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is zakat in Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat is the third pillar of Islam — a mandatory annual charity paid by eligible Muslims on their qualifying wealth. The word "zakat" (زكاة) means purification and growth in Arabic. Muslims who meet the nisab threshold (minimum wealth) must pay 2.5% of their net zakatable wealth each lunar year (hawl).',
      },
    },
    {
      '@type': 'Question',
      name: 'How much is zakat? What percentage do I pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat on most assets is 2.5% of your net zakatable wealth. Agricultural produce has different rates (5-10% depending on irrigation). Business assets and trade goods are also 2.5%. For gold and silver, it is also 2.5% of the total value above the nisab threshold.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who must pay zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat is obligatory for every Muslim who: (1) is an adult (post-puberty), (2) is mentally competent (sane), (3) is free (not enslaved), (4) is a Muslim, and (5) possesses wealth equal to or above the nisab threshold for a full Islamic lunar year (hawl). Non-Muslims are not required to pay zakat.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is nisab for zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nisab is the minimum threshold of wealth above which zakat becomes obligatory. It is based on the current market value of either 85 grams of gold (gold nisab standard, used by AMJA) or 612 grams of silver (silver nisab standard, historically lower). The nisab changes daily as gold and silver prices fluctuate. Use Barakah\'s live nisab tracker to see today\'s threshold.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is hawl in zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hawl (حول) is the Islamic lunar year that must pass on your wealth before zakat is due. Your wealth must meet or exceed the nisab threshold for a full hawl — 354 days in the Islamic calendar — for zakat to be obligatory on it. If your wealth drops below nisab during the year, the hawl resets when it goes back above.',
      },
    },
    {
      '@type': 'Question',
      name: 'What assets are zakatable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakatable assets include: cash and bank balances, gold and silver (all forms), stocks and investments, business inventory and trade goods, agricultural produce, rental income, retirement accounts (varies by madhab), and cryptocurrency. Non-zakatable assets include: your primary home, personal vehicle, household furniture, and personal clothing.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I pay zakat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat is due once your hawl anniversary passes — the one-year anniversary of when your wealth first reached the nisab. Most Muslims calculate and pay zakat in Ramadan for the spiritual reward, though this is not a requirement. You can pay your zakat at any time once it becomes due. It is sinful to delay without a valid reason.',
      },
    },
  ],
};

export default function WhatIsZakatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="min-h-screen bg-white dark:bg-gray-800">

        {/* Page-local header removed 2026-05-01 — global MarketingNav handles
            home-link + signup CTA from root layout. */}

        <div className="max-w-3xl mx-auto px-6 py-10">

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-xs font-semibold text-amber-700 mb-4">
            Updated April 2026 · 10 min read
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4 dark:text-gray-100">
            What is Zakat? Complete Guide 2026 — Rules, Calculation &amp; Who Must Pay
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8 dark:text-gray-400">
            Zakat (زكاة) is the <strong>third pillar of Islam</strong> and one of the most important financial obligations in Muslim life. This complete guide covers everything: what zakat means, who must pay it, how to calculate it, what assets are zakatable, and when it is due.
          </p>

          {/* Quick calculator CTA */}
          <div className="bg-[#FFF8E1] border border-[#1B5E20] rounded-2xl p-6 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-[#1B5E20] text-lg">Calculate your zakat in 60 seconds</p>
                <p className="text-gray-600 text-sm mt-1 dark:text-gray-400">Free multi-madhab calculator with live gold &amp; silver nisab prices.</p>
              </div>
              <Link href="/zakat-calculator" className="shrink-0 bg-[#1B5E20] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2E7D32] transition text-sm">
                Open Zakat Calculator →
              </Link>
            </div>
          </div>

          {/* Definition */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">Definition: What Does Zakat Mean?</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The word <strong>zakat</strong> comes from the Arabic root <em>z-k-y</em> (ز-ك-ي), meaning purification, growth, and blessing. In Islamic law (fiqh), zakat refers to the mandatory annual alms-tax that every eligible Muslim must pay on their qualifying wealth.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Allah mentions zakat alongside salah (prayer) over 30 times in the Quran, underscoring its equal importance in Muslim practice. It is described as a right of the poor over the wealth of the rich — not a voluntary donation, but an obligation of faith.
          </p>
          <blockquote className="border-l-4 border-[#1B5E20] pl-4 py-2 my-6 text-gray-700 italic bg-green-50 rounded-r-lg pr-4 dark:text-gray-300">
            &ldquo;And establish prayer and give zakat and bow with those who bow [in worship].&rdquo; — Quran 2:43
          </blockquote>

          {/* The Five Pillars */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">Zakat as the Third Pillar of Islam</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Islam is built on five pillars (<em>arkan al-Islam</em>). Zakat is the third, standing alongside:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6 pl-2 dark:text-gray-300">
            <li><strong>Shahada</strong> — The declaration of faith</li>
            <li><strong>Salah</strong> — The five daily prayers</li>
            <li><strong>Zakat</strong> — Mandatory annual almsgiving ← <em>this guide</em></li>
            <li><strong>Sawm</strong> — Fasting in Ramadan</li>
            <li><strong>Hajj</strong> — Pilgrimage to Mecca for those able</li>
          </ol>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Unlike sadaqah (voluntary charity), zakat is <strong>fard</strong> (obligatory). Denying that zakat is obligatory is considered apostasy by most scholars. Failing to pay it when it is due is a major sin.
          </p>

          {/* Five Conditions */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">The Five Conditions for Zakat to Be Obligatory</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">Zakat is only obligatory when all five of the following conditions are met:</p>
          <div className="space-y-4 mb-8">
            {[
              { num: '1', title: 'Islam', desc: 'The person must be a Muslim. Non-Muslims are not required to pay zakat.' },
              { num: '2', title: 'Adulthood (Bulugh)', desc: 'The person must have reached puberty. There is a scholarly difference of opinion on whether zakat is obligatory on a child\'s wealth, with the Shafi\'i, Maliki, and Hanbali schools saying yes (paid by the guardian); the Hanafi school says zakat becomes obligatory only after puberty.' },
              { num: '3', title: 'Mental competence', desc: 'The person must be sane (aqil). If someone is permanently incapacitated, most scholars exempt them.' },
              { num: '4', title: 'Complete ownership (Nisab)', desc: 'The person must own wealth equal to or above the nisab threshold — free from debt — for a complete lunar year (hawl).' },
              { num: '5', title: 'Passage of one lunar year (Hawl)', desc: 'The wealth must have remained at or above the nisab for a complete Islamic lunar year (354 days). If wealth drops below nisab during the year, the hawl restarts when it rises back above.' },
            ].map((c) => (
              <div key={c.num} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1B5E20] text-white font-bold text-sm flex items-center justify-center">{c.num}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{c.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5 dark:text-gray-400">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Nisab */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">Nisab: The Minimum Wealth Threshold</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Nisab</strong> is the minimum amount of wealth you must own before zakat becomes obligatory. It is traditionally defined as the value of either:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#FFF8E1] rounded-xl p-5 border border-green-100">
              <p className="font-bold text-[#1B5E20] text-lg mb-1">🟡 Gold Nisab</p>
              <p className="text-2xl font-extrabold text-gray-900 mb-1 dark:text-gray-100">85 grams</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">of pure gold at current market price. Recommended by AMJA and used by most Muslim scholars globally. Changes daily with gold prices.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <p className="font-bold text-gray-700 text-lg mb-1 dark:text-gray-300">⚪ Silver Nisab</p>
              <p className="text-2xl font-extrabold text-gray-900 mb-1 dark:text-gray-100">612 grams</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">of silver at current market price. Historically lower than gold nisab. Some scholars prefer this as more inclusive for those with modest wealth.</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            The nisab amount changes daily because gold and silver prices fluctuate. Use Barakah&apos;s{' '}
            <Link href="/learn/nisab" className="text-[#1B5E20] underline">live nisab tracker</Link>{' '}
            or the{' '}
            <Link href="/zakat-calculator" className="text-[#1B5E20] underline">zakat calculator</Link>{' '}
            to see today&apos;s exact nisab in your currency.
          </p>

          {/* Calculation */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">How to Calculate Zakat: The Formula</h2>
          <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-6">
            <p className="text-lg font-bold mb-2">Zakat Formula</p>
            <p className="text-3xl font-extrabold text-green-200">Zakat = Net Zakatable Wealth × 2.5%</p>
            <p className="text-green-300 text-sm mt-2">Where net zakatable wealth = (zakatable assets) − (short-term debts due within the year)</p>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Step 1:</strong> List all your zakatable assets (see categories below).
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Step 2:</strong> Subtract any short-term debts that are due within the next year (e.g., credit card balance, upcoming rent, bills). Long-term debts like mortgages and car loans are treated differently across madhabs.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Step 3:</strong> If the result exceeds the nisab threshold, multiply by 2.5% (0.025) to get your zakat amount.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 dark:text-gray-300">
            <strong>Example:</strong> You have $50,000 in savings, $8,000 in stocks, and $2,000 gold jewelry. Your debts due this year are $5,000. Net zakatable wealth = $50,000 + $8,000 + $2,000 − $5,000 = $55,000. Zakat = $55,000 × 2.5% = <strong>$1,375</strong>.
          </p>

          {/* Asset categories */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 dark:text-gray-100">What Assets are Zakatable? (Complete List)</h2>
          <div className="space-y-3 mb-8">
            {[
              { emoji: '🏦', title: 'Cash & bank balances', desc: 'All cash on hand and money in checking, savings, or money market accounts. Fully zakatable at 2.5%.', link: '/learn/zakat-on-savings' },
              { emoji: '🟡', title: 'Gold & silver', desc: 'Coins, bars, jewelry (depending on madhab), and gold/silver-backed instruments. Calculated by weight × current market price.', link: '/learn/zakat-on-gold' },
              { emoji: '📈', title: 'Stocks & investments', desc: 'Shares in companies. Calculate using the underlying zakatable assets method or current market value, depending on how you hold them.', link: '/learn/zakat-on-stocks' },
              { emoji: '🔐', title: 'Retirement accounts (401k, IRA)', desc: 'Zakatable with some nuance. Most scholars hold that you pay on the accessible/vested amount, though there are different positions.', link: '/learn/zakat-on-401k' },
              { emoji: '₿', title: 'Cryptocurrency', desc: 'Treated as a commodity by most contemporary scholars. Zakatable at 2.5% of market value on your hawl date.', link: '/learn/zakat-on-crypto' },
              { emoji: '🏪', title: 'Business inventory & trade goods', desc: 'Products held for sale. Stock them at cost price on the hawl date and pay 2.5%.', link: '/learn/zakat-on-business-assets' },
              { emoji: '🏠', title: 'Rental property income', desc: 'Rental income collected is zakatable. The property itself is generally not zakatable unless held for resale.', link: '/learn/zakat-on-rental-property' },
            ].map((asset) => (
              <Link key={asset.title} href={asset.link} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:border-[#1B5E20] transition group dark:border-gray-700">
                <span className="text-2xl shrink-0">{asset.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-[#1B5E20] dark:text-gray-100">{asset.title} →</p>
                  <p className="text-sm text-gray-600 mt-0.5 dark:text-gray-400">{asset.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Non-zakatable */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">What is NOT Zakatable</h2>
          <ul className="space-y-2 mb-8">
            {[
              'Your primary residence (the home you live in)',
              'Personal vehicle used for transportation',
              'Household furniture and appliances',
              'Personal clothing and everyday items',
              'Tools used for earning a living',
              'Long-term debts (scholars differ on how much to deduct)',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-gray-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Hawl */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-3 dark:text-gray-100">Hawl: The One-Year Condition Explained</h2>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            <strong>Hawl</strong> (حول) is the Islamic lunar year that must elapse on your wealth before zakat is due. The key rule:
          </p>
          <ul className="space-y-2 mb-4 text-gray-700 dark:text-gray-300">
            <li className="flex gap-2"><span className="text-[#1B5E20]">→</span> Your wealth must first reach or exceed nisab on a specific date — this is when your <em>hawl begins</em></li>
            <li className="flex gap-2"><span className="text-[#1B5E20]">→</span> If your wealth stays at or above nisab for a full lunar year (354 days), zakat is due on your hawl anniversary</li>
            <li className="flex gap-2"><span className="text-[#1B5E20]">→</span> If wealth drops below nisab during the year, the hawl resets when it rises above nisab again</li>
            <li className="flex gap-2"><span className="text-[#1B5E20]">→</span> You calculate zakat on your total wealth at the hawl anniversary — not the average over the year</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mb-4 dark:text-gray-300">
            Barakah automatically tracks your hawl anniversary and notifies you when your next zakat is due. You don&apos;t need to remember dates manually.
          </p>

          {/* FAQ */}
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
          <div className="space-y-5 mb-10">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-gray-100">{faq.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>

          {/* Ramadan email capture */}
          <RamadanEmailCapture source="learn-what-is-zakat" variant="inline" />

          {/* CTA */}
          <div className="bg-[#1B5E20] text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to calculate your zakat?</h2>
            <p className="text-green-200 mb-6">Use Barakah&apos;s free calculator — multi-madhab, live nisab prices, all asset types. Takes 60 seconds.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/zakat-calculator" className="bg-white text-[#1B5E20] px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Calculate My Zakat Free
              </Link>
              <Link href="/signup" className="border border-white text-white px-6 py-3 rounded-xl font-bold hover:bg-green-800 transition">
                Create Free Account
              </Link>
            </div>
          </div>

          {/* Related */}
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 mb-4 dark:text-gray-100">Learn More About Zakat</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/learn/nisab', title: 'What is Nisab?', desc: "Today's nisab in USD, GBP, and EUR with live prices." },
                { href: '/learn/zakat-on-gold', title: 'Zakat on Gold', desc: 'Complete guide with live gold price nisab calculator.' },
                { href: '/learn/zakat-on-savings', title: 'Zakat on Savings', desc: 'Which savings accounts are zakatable and how to calculate.' },
                { href: '/learn/zakat-al-fitr', title: 'Zakat al-Fitr', desc: 'Fitrah amount in Ramadan — who pays it and how much.' },
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: 'Key differences between obligatory zakat and voluntary sadaqah.' },
                { href: '/learn/how-much-zakat-do-i-owe', title: 'How Much Zakat Do I Owe?', desc: 'Quick reference calculator and guide to your exact obligation.' },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="block border border-gray-100 rounded-xl p-4 hover:border-[#1B5E20] transition dark:border-gray-700">
                  <p className="font-medium text-[#1B5E20] mb-1">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/nisab" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Nisab →</Link>
              <Link href="/fiqh-terms/hawl" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Hawl →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
