import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Muslim Household Budget Template 2026 — Free Islamic Family Finance Guide | Barakah',
  description:
    'Free Muslim household budget template for 2026. Build a family budget that covers zakat, sadaqah, Hajj savings, halal expenses, and Islamic obligations — with Barakah\'s free budgeting tool.',
  keywords: [
    'muslim household budget',
    'muslim family budget',
    'muslim household budget template',
    'islamic family finances',
    'halal household budget',
    'muslim family money management',
    'islamic household finance',
    'muslim budget template 2026',
    'family zakat calculator',
    'halal family budget plan',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/muslim-household-budget' },
  openGraph: {
    title: 'Muslim Household Budget Template 2026 — Free Islamic Family Finance',
    description:
      'A complete Muslim household budget template — covering zakat, sadaqah, Hajj savings, halal expenses, riba avoidance, and shared family goals.',
    url: 'https://trybarakah.com/learn/muslim-household-budget',
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
    { '@type': 'ListItem', position: 3, name: 'Muslim Household Budget Template', item: 'https://trybarakah.com/learn/muslim-household-budget' },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Muslim Household Budget Template 2026 — Free Islamic Family Finance Guide',
  description: 'A complete Muslim household budget template for Islamic families — covering zakat, sadaqah, Hajj savings, halal expenses, and family financial goals.',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: { '@type': 'Organization', name: 'Barakah', logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' } },
  datePublished: '2024-03-10',
  dateModified: '2026-04-15',
  image: 'https://trybarakah.com/og-image.png',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/muslim-household-budget' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does a Muslim household budget work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Muslim household budget is structured around Islamic financial obligations and values. It starts with calculating annual zakat on the household\'s total zakatable wealth. Then it allocates for essential needs (housing, food, education, healthcare), sadaqah goals, Hajj savings (if Hajj has not been performed), emergency fund, and halal investments — all in riba-free accounts. Shared household expenses are tracked together, while individual income may remain separate according to each spouse\'s ownership rights.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are husbands required to provide financially for the family in Islam?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Nafaqah (financial provision) is obligatory on the Muslim husband for his wife and minor children — covering housing, food, clothing, and healthcare. The wife\'s income, if she earns one, belongs exclusively to her and she has no obligation to contribute to household expenses (though she may choose to). This Islamic financial structure is often not reflected in conventional budgeting apps, but Barakah is designed with these roles in mind.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do Muslim families split finances?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In Islam, the husband is financially responsible for the household (nafaqah). However, many Muslim couples today choose to split household expenses based on mutual agreement, which is permissible. The key Islamic principle is that the wife's income is her own property — she cannot be obligated to contribute, though she may voluntarily. Barakah's family sharing feature lets couples and families track shared budgets while keeping individual finances separate.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do I include zakat in my household budget?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Calculate your annual zakat obligation at the start of each Islamic year (Muharram) or on your hawl anniversary. Divide by 12 to get a monthly budget line, or set aside the full amount in a dedicated savings pot. Zakat is payable on gold, silver, cash savings above nisab, business inventory, shares, rental property income, and other zakatable assets. Barakah calculates your exact zakat obligation across all asset categories with live gold and silver nisab prices.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a Muslim family save for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Muslim families should prioritize these savings goals: (1) Emergency fund — 3–6 months of essential expenses in a riba-free account; (2) Hajj fund — monthly savings toward the fard pilgrimage; (3) Children's Islamic education; (4) Halal home purchase (avoiding conventional mortgage interest where possible); (5) Islamic will and estate planning; (6) Retirement via halal investments. Barakah has built-in goal tracking for all of these.",
      },
    },
  ],
};

const budgetTemplate = [
  {
    category: 'ISLAMIC OBLIGATIONS',
    color: 'bg-green-700',
    items: [
      { name: 'Zakat al-Mal', example: '$250/mo', note: '2.5% of zakatable wealth ÷ 12 months (or lump sum on hawl date)' },
      { name: 'Zakat al-Fitr (Ramadan)', example: '$15/person', note: 'Approx. $15 per household member before Eid al-Fitr prayer' },
      { name: 'Sadaqah — Monthly Goal', example: '$100/mo', note: 'Set before discretionary spending. Even small amounts earn reward.' },
      { name: 'Masjid Donation', example: '$50/mo', note: 'Support your local masjid — Jumu\'ah and monthly contribution' },
    ],
  },
  {
    category: 'ESSENTIAL NEEDS (HALAL)',
    color: 'bg-blue-700',
    items: [
      { name: 'Halal Rent / Home Finance Payment', example: '$1,800/mo', note: 'Halal mortgage (murabaha/musharakah) or rent — the provider must ensure it is interest-free' },
      { name: 'Halal Groceries & Food', example: '$600/mo', note: 'Halal-certified meat, groceries from halal shops or verified halal sections' },
      { name: 'Utilities (Electricity, Water, Internet)', example: '$250/mo', note: 'Standard household utilities' },
      { name: 'Transportation', example: '$400/mo', note: 'Car payment (halal lease/purchase), fuel, public transit, insurance' },
      { name: 'Healthcare & Medical', example: '$200/mo', note: 'Insurance, medications, doctor visits — essential need' },
      { name: 'Clothing', example: '$150/mo', note: 'Modest, practical clothing — avoid israf and brand obsession' },
    ],
  },
  {
    category: 'ISLAMIC EDUCATION',
    color: 'bg-purple-700',
    items: [
      { name: "Children's Islamic School", example: '$500/mo', note: 'Islamic school tuition — a priority investment in the next generation' },
      { name: 'Quran Classes (Online or Local)', example: '$100/mo', note: 'Hifz programs, tajweed classes, Islamic education for children and adults' },
      { name: 'Islamic Books & Courses', example: '$50/mo', note: 'Books, online courses, halal educational subscriptions' },
    ],
  },
  {
    category: 'SAVINGS & GOALS',
    color: 'bg-amber-600',
    items: [
      { name: 'Emergency Fund', example: '$300/mo', note: 'Until you reach 3–6 months of expenses. Use a riba-free savings account.' },
      { name: 'Hajj / Umrah Fund', example: '$200/mo', note: 'Mandatory for those who have not performed Hajj. Set a target year.' },
      { name: 'Halal Investments', example: '$400/mo', note: 'Sharia-compliant ETFs, sukuk, or halal stocks — no haram sectors' },
      { name: "Children's Education Fund", example: '$200/mo', note: '529 plan or halal investment account for university costs' },
      { name: 'Halal Home Purchase Fund', example: '$300/mo', note: 'Saving toward a down payment to avoid or minimize conventional mortgage' },
    ],
  },
  {
    category: 'DISCRETIONARY (WITHIN LIMITS)',
    color: 'bg-gray-600',
    items: [
      { name: 'Halal Dining Out', example: '$200/mo', note: 'Halal restaurants only — avoid israf' },
      { name: 'Eid Celebrations & Gifts', example: '$100/mo', note: 'Save monthly for Eid al-Fitr and Eid al-Adha gifts and celebrations' },
      { name: 'Family Entertainment (Halal)', example: '$150/mo', note: 'Parks, museums, halal activities — no haram entertainment' },
      { name: 'Personal Care & Grooming', example: '$80/mo', note: 'Moderation over luxury brands' },
    ],
  },
];

export default function MuslimHouseholdBudgetPage() {
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
            <span className="text-gray-600 dark:text-gray-400">Muslim Household Budget Template</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              ISLAMIC FAMILY FINANCE
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Muslim Household Budget Template 2026 — Free Islamic Family Finance Guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              This is the complete Muslim household budget template for 2026 — covering every Islamic financial obligation from zakat and sadaqah to Hajj savings and Islamic estate planning, alongside practical halal expense categories for everyday family life.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Updated April 2026</span>
              <span>⏱ 12 min read</span>
              <span>✅ Reviewed for Islamic accuracy</span>
            </div>
          </header>

          {/* Quick Note */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 mb-10">
            <p className="font-semibold text-amber-900 mb-1">📌 Important Islamic Finance Principle</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              In Islam, a wife has no obligation to contribute her income to household expenses. Nafaqah (provision for the household) is the husband&apos;s responsibility. A wife may choose to contribute, but her income belongs to her alone. This guide presents a general household template — adjust based on your family&apos;s agreement and each partner&apos;s obligations.
            </p>
          </div>

          {/* Budget Template */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">Complete Muslim Household Budget Template</h2>
            <p className="text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
              Sample budget for a Muslim family of 4 with a combined household income of ~$7,500/month. Adjust numbers to your income — but keep the priorities and order.
            </p>
            <div className="space-y-6">
              {budgetTemplate.map((section) => (
                <div key={section.category} className="border border-gray-200 rounded-2xl overflow-hidden dark:border-gray-700">
                  <div className={`${section.color} text-white px-5 py-3`}>
                    <h3 className="font-bold text-sm tracking-wide">{section.category}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item) => (
                      <div key={item.name} className="px-5 py-3 flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm dark:text-gray-100">{item.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 dark:text-gray-400">{item.note}</p>
                        </div>
                        <div className="text-sm font-bold text-green-700 flex-shrink-0 whitespace-nowrap">
                          {item.example}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-green-50 rounded-xl p-4">
              <p className="font-bold text-green-900 text-sm">Total Budget Estimate (family of 4): ~$7,150/mo</p>
              <p className="text-xs text-green-700 mt-1">
                Remaining after this template should go to additional sadaqah, halal investments, or building your emergency fund faster. Avoid letting surplus accumulate in interest-bearing accounts without purpose.
              </p>
            </div>
          </section>

          {/* Islamic Finance Rules for Families */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Key Islamic Finance Rules for Muslim Families</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  rule: 'Nafaqah — Husband\'s Provision Duty',
                  detail: 'The husband must provide housing, food, clothing, and healthcare for his wife and minor children — regardless of whether the wife works.',
                  ref: 'Quran 65:6-7',
                },
                {
                  rule: 'Wife\'s Financial Independence',
                  detail: 'A Muslim wife\'s income and wealth are her own. She has no obligation to contribute to household expenses. Any contribution is a gift (hibah).',
                  ref: 'Scholarly consensus (ijma\')',
                },
                {
                  rule: 'Zakat on Individual Wealth',
                  detail: 'Zakat is calculated on each person\'s individual nisab — not jointly. Each spouse calculates their own zakat separately on their own wealth.',
                  ref: 'Quran 2:43',
                },
                {
                  rule: 'Avoiding Riba in All Accounts',
                  detail: 'Joint family savings must be in riba-free accounts. Interest earned in any account — even a child\'s savings account — must be donated, not kept.',
                  ref: 'Quran 2:275',
                },
                {
                  rule: 'Sadaqah Before Entertainment',
                  detail: 'Family charitable giving (masjid, sadaqah to poor relatives, Islamic causes) should be budgeted before entertainment and luxury spending.',
                  ref: 'Quran 2:267',
                },
                {
                  rule: 'Islamic Will Before Old Age',
                  detail: 'Every Muslim with assets should have a valid Islamic will (wasiyyah). Faraid (Islamic inheritance) must be followed. Up to 1/3 of the estate may go to non-heirs.',
                  ref: 'Hadith: Bukhari 2738',
                },
              ].map((item) => (
                <div key={item.rule} className="border border-gray-200 rounded-xl p-4 dark:border-gray-700">
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm dark:text-gray-100">{item.rule}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 dark:text-gray-400">{item.detail}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{item.ref}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Free Tools to Build Your Muslim Household Budget</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: '/zakat-calculator', icon: '🧮', title: 'Zakat Calculator', desc: 'Calculate your annual zakat across 8 asset categories with live gold and silver prices.' },
                { href: '/faraid-calculator', icon: '⚖️', title: 'Faraid Calculator', desc: 'Calculate Islamic inheritance shares for your family according to Sharia.' },
                { href: '/signup', icon: '📊', title: 'Household Budget Tracker', desc: 'Track all expenses, set category budgets, and manage family finances in Barakah.' },
                { href: '/signup', icon: '🕌', title: 'Hajj Savings Goal', desc: 'Set your Hajj target year and track monthly contributions toward the obligation.' },
              ].map((tool) => (
                <Link key={tool.href} href={tool.href} className="border border-gray-200 rounded-xl p-5 hover:border-green-600 transition-colors block dark:border-gray-700">
                  <div className="text-2xl mb-2">{tool.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">{tool.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tool.desc}</p>
                </Link>
              ))}
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

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Manage Your Muslim Household Budget — Free</h2>
            <p className="text-green-100 mb-6">
              Barakah auto-calculates zakat, tracks sadaqah, flags riba, and manages up to 6 family members — in one free Islamic finance app.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup" className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800">
                Start Free — No Credit Card
              </Link>
              <Link href="/learn/halal-budgeting" className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition">
                Halal Budgeting Guide
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { href: '/learn/halal-budgeting', title: 'Halal Budgeting Guide', desc: '6 Islamic principles for managing your money.' },
                { href: '/learn/what-is-zakat', title: 'What is Zakat?', desc: 'Complete 2026 guide to zakat rules and calculation.' },
                { href: '/learn/sadaqah-vs-zakat', title: 'Sadaqah vs Zakat', desc: "The difference between obligatory and voluntary charity." },
                { href: '/learn/islamic-budgeting-app', title: 'Islamic Budgeting App', desc: 'Best apps for halal household budgeting in 2026.' },
                { href: '/learn/hajj-savings-plan', title: 'Hajj Savings Plan', desc: 'How to save for Hajj and build your fund month by month.' },
                { href: '/learn/islamic-will', title: 'Islamic Will Guide', desc: 'How to write a valid wasiyyah according to Islamic law.' },
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
              <Link href="/fiqh-terms/zakat" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Zakat →</Link>
              <Link href="/fiqh-terms/riba" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Riba →</Link>
              <Link href="/fiqh-terms/sadaqah" className="rounded-full bg-white px-3 py-1 text-sm text-[#1B5E20] border border-[#1B5E20] hover:bg-[#1B5E20] hover:text-white transition">Sadaqah →</Link>
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
