import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halal Budgeting 2026 — Complete Islamic Guide to Managing Money | Barakah',
  description:
    'Learn how to create a halal budget aligned with Islamic principles. Step-by-step guide covering zakat prioritization, riba avoidance, sadaqah goals, and Islamic expense categories.',
  keywords: [
    'halal budgeting',
    'islamic budgeting',
    'halal budget plan',
    'halal personal finance',
    'islamic personal finance',
    'muslim budgeting guide',
    'avoiding riba in budget',
    'zakat in household budget',
    'islamic money management',
    'halal finance tips',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/halal-budgeting' },
  openGraph: {
    title: 'Halal Budgeting 2026 — Complete Islamic Guide',
    description:
      'How to build a halal budget: zakat first, riba-free accounts, sadaqah goals, Islamic expense categories, and family savings targets.',
    url: 'https://trybarakah.com/learn/halal-budgeting',
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
    { '@type': 'ListItem', position: 3, name: 'Halal Budgeting', item: 'https://trybarakah.com/learn/halal-budgeting' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Halal Budgeting 2026 — Complete Islamic Guide to Managing Money',
  description: 'A comprehensive guide to building a halal budget aligned with Islamic finance principles — zakat, riba avoidance, sadaqah goals, and more.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-02-15',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/halal-budgeting' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is halal budgeting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Halal budgeting is the practice of managing your household finances in alignment with Islamic Sharia principles. It means: (1) paying zakat before discretionary spending; (2) avoiding riba (interest) on loans, credit cards, and savings accounts; (3) allocating for sadaqah as a priority rather than an afterthought; (4) spending in halal categories only; (5) avoiding israf (extravagance); and (6) planning for the akhirah through Islamic will and estate preparation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do Muslims budget money according to Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Islamic scholars recommend a prioritized approach: first, set aside your annual zakat obligation (2.5% of zakatable wealth above nisab). Then allocate for essential needs (housing, food, education, healthcare). Reserve sadaqah — even a small, consistent amount — before entertainment or luxuries. Avoid any income or account that earns or pays riba. Islam condemns israf (extravagance) and tabdhir (squandering), so review monthly spending against needs versus wants.",
      },
    },
    {
      '@type': 'Question',
      name: 'What percentage of income should Muslims give to charity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Zakat is the obligatory minimum: 2.5% of qualifying wealth held for one lunar year above nisab. Beyond that, there is no fixed requirement for sadaqah (voluntary charity) — scholars encourage giving as much as one is able. A common guideline among Islamic finance advisors is to budget 5–10% of income for sadaqah after zakat. The Prophet ﷺ said: "Protect your wealth by giving zakat, treat your sick with sadaqah, and prepare for calamity with du\'a." (Tabarani)',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I avoid riba in my budget?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To eliminate riba from your budget: (1) Move savings to an Islamic bank or a riba-free savings account (many credit unions and online banks offer no-interest accounts); (2) Pay off interest-bearing credit card balances in full each month; (3) Refinance a conventional mortgage to an Islamic home finance product (murabaha, diminishing musharakah) when financially feasible; (4) Purify any interest income you have received by donating it to charity — do not keep it. Barakah\'s riba detector automates this process.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are halal budget categories?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A halal budget should include: Zakat (2.5% of qualifying wealth annually), Sadaqah (voluntary giving goal), Halal Food & Groceries, Halal Transportation, Islamic Education (school fees, Quran classes), Housing (halal mortgage or rent), Healthcare, Hajj Savings (for those who have not performed Hajj), Eid Celebrations, Masjid Donations, Emergency Fund. Categories to exclude or flag: Alcohol/Entertainment at haram venues, Conventional interest-bearing savings, Lottery or gambling.',
      },
    },
  ],
};

const budgetAllocation = [
  { category: 'Zakat (Obligatory)', pct: '2.5%', note: 'Of zakatable wealth above nisab — due once per hawl year', color: 'bg-green-700' },
  { category: 'Sadaqah (Voluntary Giving)', pct: '5–10%', note: 'Give before luxuries — even $20/month is barakah', color: 'bg-green-600' },
  { category: 'Essential Needs', pct: '50%', note: 'Halal housing, food, healthcare, utilities, transportation', color: 'bg-blue-600' },
  { category: 'Islamic Education', pct: '5–10%', note: "Children's Islamic school, Quran classes, Islamic books", color: 'bg-purple-600' },
  { category: 'Hajj Savings', pct: '5%', note: 'Until Hajj is performed — set aside monthly toward the obligation', color: 'bg-amber-600' },
  { category: 'Emergency Fund', pct: '5–10%', note: 'Target 3–6 months of essential expenses in a riba-free account', color: 'bg-teal-600' },
  { category: 'Halal Investments', pct: '10–20%', note: 'Sharia-compliant ETFs, sukuk, halal stocks screened via AAOIFI', color: 'bg-indigo-600' },
  { category: 'Personal & Discretionary', pct: 'Remainder', note: 'Avoid israf — entertainment, clothing, travel should be reasonable', color: 'bg-gray-500' },
];

const islamicBudgetPrinciples = [
  {
    icon: '🧮',
    title: 'Zakat Comes First',
    quran: 'Quran 2:43',
    description:
      'Zakat is not a budget "expense" — it is a right of the poor upon your wealth. Calculate it first, before any discretionary allocation. Barakah automates this with live nisab prices.',
  },
  {
    icon: '🚫',
    title: 'Eliminate Riba Sources',
    quran: 'Quran 2:275',
    description:
      "Any interest-bearing account or loan is riba. Move savings to no-interest accounts, pay credit cards in full, and work toward a halal mortgage. Allah has declared war on those who consume riba.",
  },
  {
    icon: '💸',
    title: 'Give Sadaqah Before Luxuries',
    quran: 'Quran 2:267',
    description:
      'Sadaqah should come before entertainment, dining out, or discretionary spending. "Give of the good things which you have earned" — from your best income, not what is left over.',
  },
  {
    icon: '⚖️',
    title: 'Avoid Israf',
    quran: 'Quran 17:26–27',
    description:
      'Allah condemns wasteful spending (israf) and squandering (tabdhir). Review monthly spending for excessive restaurants, fashion, or entertainment. Moderation is a core Islamic value.',
  },
  {
    icon: '🕌',
    title: 'Plan for the Akhirah',
    quran: 'Quran 59:18',
    description:
      'Write your Islamic will (wasiyyah). Allocate up to 1/3 of your estate to charity. Ensure faraid (Islamic inheritance) is honored. The akhirah is the ultimate financial goal.',
  },
  {
    icon: '👨‍👩‍👧',
    title: 'Provide for Your Family',
    quran: 'Quran 2:233',
    description:
      'Nafaqah (providing for spouse and children) is obligatory on the Muslim man. A halal budget ensures this obligation is met before personal luxuries. Women\'s income belongs to them alone.',
  },
];

export default function HalalBudgetingPage() {
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
            <span className="text-gray-600 dark:text-gray-400">Halal Budgeting</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              ISLAMIC PERSONAL FINANCE
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Halal Budgeting 2026 — The Complete Islamic Guide to Managing Money
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              Halal budgeting is not just about what you spend money on — it is about structuring your entire financial life around the commands of Allah and the Sunnah. This guide covers the six principles of Islamic financial management and how to build a budget that earns barakah.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Updated April 2026</span>
              <span>⏱ 10 min read</span>
              <span>✅ Reviewed for Islamic accuracy</span>
            </div>
          </header>

          {/* Definition box */}
          <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-6 mb-10">
            <p className="font-semibold text-green-900 mb-1">What is Halal Budgeting?</p>
            <p className="text-green-800 text-sm leading-relaxed">
              Halal budgeting is the practice of managing your household income and expenses according to Islamic Sharia — prioritizing zakat and sadaqah, eliminating riba, spending only in permissible categories, avoiding extravagance (israf), and planning for both this life and the akhirah.
            </p>
          </div>

          {/* Islamic Principles Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">6 Islamic Principles of Halal Budgeting</h2>
            <p className="text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
              The Quran and Sunnah provide a complete framework for financial management. Every halal budget should be built on these six foundations.
            </p>
            <div className="space-y-5">
              {islamicBudgetPrinciples.map((p) => (
                <div key={p.title} className="border border-gray-200 rounded-2xl p-5 flex gap-4 dark:border-gray-700">
                  <div className="text-3xl flex-shrink-0">{p.icon}</div>
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-gray-100">{p.title}</h3>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{p.quran}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed dark:text-gray-400">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Budget Allocation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Recommended Islamic Budget Allocation</h2>
            <p className="text-gray-600 mb-6 leading-relaxed dark:text-gray-400">
              There is no single prescribed budget ratio in Islam, but scholars and Islamic finance advisors recommend this prioritized allocation based on Quranic guidance and scholarly consensus:
            </p>
            <div className="space-y-3">
              {budgetAllocation.map((item) => (
                <div key={item.category} className="flex items-center gap-4">
                  <div className={`w-2 h-10 rounded-full flex-shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm dark:text-gray-100">{item.category}</span>
                      <span className="font-bold text-green-700">{item.pct}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate dark:text-gray-400">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              * Percentages are guidelines based on Islamic finance scholarship. Individual circumstances vary. Consult a qualified Islamic finance scholar for your specific situation.
            </p>
          </section>

          {/* Step by Step */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">How to Build a Halal Budget in 5 Steps</h2>
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: 'Calculate Your Zakat Obligation',
                  body: 'Before anything else, use Barakah\'s free zakat calculator to find your exact annual zakat amount. This is your first obligatory "budget line." If your zakatable wealth is above nisab and you have held it for one lunar year, you owe 2.5%.',
                  action: { text: 'Calculate Zakat Free →', href: '/zakat-calculator' },
                },
                {
                  step: '2',
                  title: 'Audit Your Accounts for Riba',
                  body: 'List every bank account, loan, mortgage, and credit card. Flag any that earn or pay interest. Priority order: (1) Stop any new riba debt; (2) Pay off interest-bearing credit card balances in full each cycle; (3) Work toward eliminating conventional mortgage and replacing with halal home finance.',
                  action: null,
                },
                {
                  step: '3',
                  title: 'Set Your Sadaqah Goal',
                  body: 'Decide on a monthly sadaqah amount before you budget for discretionary spending. Even $25/month is meaningful and builds consistency. Use Barakah to track donations to your masjid, Islamic organizations, and individual charitable giving.',
                  action: null,
                },
                {
                  step: '4',
                  title: 'Map Your Expenses to Halal Categories',
                  body: 'Go through last month\'s transactions and assign each to a halal or haram category. Flag any haram spending (alcohol, entertainment at haram venues, lottery) and create a plan to eliminate it. Replace conventional budget categories with Islamic ones: "Dining Out" becomes "Halal Restaurants," "Entertainment" is filtered for permissible content.',
                  action: null,
                },
                {
                  step: '5',
                  title: 'Open Your Hajj Savings Goal',
                  body: 'Hajj is fard for every Muslim who is able. If you have not performed Hajj, open a Hajj savings goal in Barakah today. Enter your target year and the app calculates your monthly contribution. Keep this fund in a riba-free savings account.',
                  action: null,
                },
              ].map((step) => (
                <div key={step.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2 dark:text-gray-400">{step.body}</p>
                    {step.action && (
                      <Link href={step.action.href} className="text-green-700 font-semibold text-sm hover:underline">
                        {step.action.text}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Halal Budget Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Halal Budget Category List</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-green-200 rounded-2xl p-5">
                <h3 className="font-bold text-green-800 mb-3">✅ Recommended Categories</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {['Zakat (annual)', 'Sadaqah / masjid donations', 'Halal groceries & food', 'Housing (halal mortgage or rent)', 'Islamic education & Quran classes', "Children's Islamic school fees", 'Halal healthcare', 'Hajj savings fund', 'Emergency fund (riba-free account)', 'Halal investments (ETFs, sukuk)', 'Eid celebrations & gifts', 'Halal travel & umrah fund', 'Islamic books & courses'].map((c) => (
                    <li key={c} className="flex gap-2"><span className="text-green-600 flex-shrink-0">✓</span>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="border border-red-200 rounded-2xl p-5">
                <h3 className="font-bold text-red-800 mb-3">⚠️ Flag or Avoid</h3>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {['Alcohol, bars, nightclubs', 'Conventional interest savings', 'Lottery, gambling, casinos', 'Haram entertainment (adult content, etc.)', 'Tobacco and vaping', 'Interest-bearing credit card debt', 'Conventional mortgage interest', 'Investments in haram industries', 'Excessive luxury (israf)', 'Wasteful spending (tabdhir)'].map((c) => (
                    <li key={c} className="flex gap-2"><span className="text-red-400 flex-shrink-0">✗</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Start Your Halal Budget Today — Free</h2>
            <p className="text-green-100 mb-6">Zakat automation, riba detection, sadaqah goals, and Islamic budget categories — all in one free app.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Create Free Account
              </Link>
              <Link href="/zakat-calculator" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">
                Calculate Zakat
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/islamic-budgeting-app', title: 'Islamic Budgeting App', desc: 'Best app for Muslim household budgeting in 2026.' },
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'Complete guide — rules, calculation, who must pay.' },
                { href: '/learn/muslim-household-budget', title: 'Muslim Household Budget', desc: 'Free template for family budgeting the Islamic way.' },
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: "What's the difference between obligatory and voluntary giving?" },
                { href: '/learn/what-is-riba', title: 'What is Riba?', desc: 'Understanding and eliminating interest from your finances.' },
                { href: '/learn/mint-alternative-for-muslims', title: 'Mint Alternative', desc: 'The best Islamic replacement for Mint money tracker.' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700">
                  <h3 className="font-semibold text-green-700 mb-1">{link.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
          <section className="mt-10 rounded-2xl bg-amber-50 border border-amber-200 p-6">
            <h2 className="mb-3 text-lg font-bold text-amber-900">Related fiqh terms</h2>
            <p className="text-sm text-amber-900 mb-3">Scholar-aligned glossary entries covering the Islamic legal terms used on this page.</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
