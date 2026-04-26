import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL } from '../../../lib/trial';

export const metadata: Metadata = {
  title: 'Best Islamic Budgeting App 2026 — Halal Budget Tracker for Muslim Families | Barakah',
  description:
    'The best Islamic budgeting app for Muslim households. Track halal expenses, automate zakat, avoid riba, set sadaqah goals, and budget by Islamic finance principles — all in one free app.',
  keywords: [
    'islamic budgeting app',
    'halal budget app',
    'muslim budgeting app',
    'best islamic budgeting app 2026',
    'muslim household budget',
    'halal budgeting',
    'islamic finance budget',
    'muslim money management',
    'riba free budgeting',
    'zakat budget tracker',
  ],
  alternates: { canonical: 'https://trybarakah.com/learn/islamic-budgeting-app' },
  openGraph: {
    title: 'Best Islamic Budgeting App 2026 — Barakah',
    description:
      'Budget the halal way — zakat automation, riba alerts, sadaqah tracking, and family finance for Muslim households.',
    url: 'https://trybarakah.com/learn/islamic-budgeting-app',
    siteName: 'Barakah',
    type: 'article',
    images: [
      {
        url: 'https://trybarakah.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Best Islamic Budgeting App 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Islamic Budgeting App 2026 — Barakah',
    description:
      'Budget the halal way — zakat automation, riba alerts, sadaqah tracking, and family finance.',
    images: ['https://trybarakah.com/og-image.png'],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com' },
    { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Best Islamic Budgeting App 2026',
      item: 'https://trybarakah.com/learn/islamic-budgeting-app',
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Best Islamic Budgeting App 2026 — Halal Budget Tracker for Muslim Families',
  description:
    'A complete guide to the best Islamic budgeting apps for Muslim households — covering zakat automation, riba detection, sadaqah tracking, and halal expense management.',
  image: 'https://trybarakah.com/og-image.png',
  author: { '@type': 'Organization', name: 'Barakah', url: 'https://trybarakah.com' },
  publisher: {
    '@type': 'Organization',
    name: 'Barakah',
    logo: { '@type': 'ImageObject', url: 'https://trybarakah.com/icon.png' },
  },
  datePublished: '2024-02-01',
  dateModified: '2026-04-15',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://trybarakah.com/learn/islamic-budgeting-app' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What makes an Islamic budgeting app different from a regular budget app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An Islamic budgeting app integrates fiqh-based rules into every layer of personal finance. This means built-in zakat calculation and reminders, riba (interest) detection on loans and savings accounts, sadaqah and waqf giving goals, halal income verification, and avoidance of haram categories like gambling and alcohol. Regular apps like Mint or YNAB have no concept of Islamic obligations or prohibitions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Barakah the best free Islamic budgeting app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Barakah is the most complete free Islamic budgeting app available. The free plan includes zakat calculation, expense tracking, category budgeting, and sadaqah goals. The Plus plan ($9.99/month) adds bank sync, halal stock screening, faraid calculator, and the Barakah Score. No other app combines all of these features in a single fiqh-aware platform.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does Barakah handle riba in budgeting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barakah flags riba-bearing accounts and transactions — including interest-bearing savings accounts, credit card interest charges, and conventional mortgage payments — and shows them separately in your budget. The app calculates how much interest income you have received (which must be donated, not kept) and tracks your journey toward becoming fully riba-free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Barakah be used for family or household budgeting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Barakah supports shared household finance for up to 6 family members. Each member has their own login but can see and contribute to shared budgets, track individual expenses, and receive individual zakat alerts. This makes it ideal for Muslim families managing finances together according to Islamic principles.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Islamic approach to budgeting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Islamic budgeting is rooted in avoiding israf (extravagance), fulfilling zakat obligations, giving sadaqah regularly, avoiding riba in all transactions, and planning for the akhirah (afterlife) through waqf and Islamic will. A common guideline derived from Islamic finance scholars is allocating roughly: needs (50%), savings/investments (30%), and giving/sadaqah (20%) — though these ratios vary by school of thought.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does Barakah sync with my bank account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, with the Barakah Plus plan. Bank sync automatically imports and categorizes your transactions, flags riba-bearing interest payments, and keeps your budget current without manual entry. The free plan supports manual transaction entry.',
      },
    },
  ],
};

const features = [
  {
    icon: '🧮',
    title: 'Zakat Automation',
    description:
      'Barakah calculates your zakat obligation in real time — including gold, silver, cash, business inventory, and investments. It tracks your hawl anniversary and alerts you when zakat becomes due.',
  },
  {
    icon: '🚫',
    title: 'Riba Detector',
    description:
      'Every transaction is checked for riba. Interest charges on credit cards, conventional mortgage payments, and savings interest income are all flagged — and shown separately in your budget.',
  },
  {
    icon: '💸',
    title: 'Sadaqah & Giving Tracker',
    description:
      'Set monthly sadaqah goals, log donations to masjids and charities, and see your annual giving history. Track your waqf contributions and charitable giving in one place.',
  },
  {
    icon: '📊',
    title: 'Halal Category System',
    description:
      'Budget categories are designed around Islamic life: Halal Food, Islamic Education, Hajj Savings, Mosque Donations, Sadaqah. No alcohol, gambling, or haram categories.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
    title: 'Family Sharing',
    description:
      'Up to 6 family members can share one household budget. Each person tracks their own expenses while contributing to shared goals like Hajj savings, home purchase, or charity targets.',
  },
  {
    icon: '📈',
    title: 'Barakah Score',
    description:
      'A unique Islamic financial health score (0–100) that measures your zakat compliance, riba exposure, sadaqah consistency, and emergency fund — against fiqh guidelines, not Western credit metrics.',
  },
  {
    icon: '📜',
    title: 'Islamic Will Planner',
    description:
      'Plan your wasiyyah (Islamic will) directly in the app. Allocate assets to heirs according to faraid rules, designate charitable bequest (up to 1/3 of estate), and keep your estate plan updated.',
  },
  {
    icon: '🕌',
    title: 'Hajj Savings Goal',
    description:
      'Set a Hajj savings goal with your target date, and Barakah automatically calculates how much you need to save each month. Track progress alongside your other financial goals.',
  },
];

const comparisonRows = [
  {
    feature: 'Free plan available',
    barakah: '✅ Yes',
    ynab: '❌ No ($14.99/mo)',
    mint: '❌ Shut down Jan 2024',
    monarch: '❌ No ($14.99/mo)',
    excel: '⚠️ Limited',
  },
  {
    feature: 'Zakat calculator',
    barakah: '✅ Multi-madhab, live prices',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '⚠️ Manual formula only',
  },
  {
    feature: 'Hawl tracking',
    barakah: '✅ Automatic alerts',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '❌ None',
  },
  {
    feature: 'Riba detection',
    barakah: '✅ Flags all interest',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '❌ None',
  },
  {
    feature: 'Halal stock screener',
    barakah: '✅ 30,000+ stocks (AAOIFI)',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '❌ None',
  },
  {
    feature: 'Sadaqah tracking',
    barakah: '✅ Goals + history',
    ynab: '⚠️ Generic category',
    mint: '❌ None',
    monarch: '⚠️ Generic category',
    excel: '⚠️ Manual',
  },
  {
    feature: 'Islamic will planner',
    barakah: '✅ Full wasiyyah + faraid',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '❌ None',
  },
  {
    feature: 'Family sharing',
    barakah: '✅ Up to 6 members',
    ynab: '✅ Partner sharing',
    mint: '❌ None',
    monarch: '✅ Shared budgets',
    excel: '⚠️ Manual sharing',
  },
  {
    feature: 'Bank sync',
    barakah: '✅ Plus plan',
    ynab: '✅ Yes',
    mint: '❌ Shut down',
    monarch: '✅ Yes',
    excel: '❌ None',
  },
  {
    feature: 'Hajj savings goal',
    barakah: '✅ Built-in',
    ynab: '⚠️ Generic goal',
    mint: '❌ None',
    monarch: '⚠️ Generic goal',
    excel: '⚠️ Manual',
  },
  {
    feature: 'Multi-currency',
    barakah: '✅ Global support',
    ynab: '✅ Yes',
    mint: '❌ USD only',
    monarch: '⚠️ Limited',
    excel: '✅ Yes',
  },
  {
    feature: 'Faraid calculator',
    barakah: '✅ Full inheritance calc',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '❌ None',
  },
  {
    feature: 'Islamic financial score',
    barakah: '✅ Barakah Score',
    ynab: '❌ None',
    mint: '❌ None',
    monarch: '❌ None',
    excel: '❌ None',
  },
];

const islamicBudgetingSteps = [
  {
    step: '1',
    title: 'Know Your Obligatory Payments First',
    description:
      'Before any other budgeting, calculate your zakat obligation for the year. Zakat is fard (obligatory) — it comes before discretionary spending. Enter your assets in Barakah and see your exact zakat amount.',
  },
  {
    step: '2',
    title: 'Separate Halal from Haram Income',
    description:
      'Any income from haram sources (interest, gambling, prohibited businesses) must be donated — not kept. Barakah flags these automatically and calculates the amount to purify.',
  },
  {
    step: '3',
    title: 'Allocate for Sadaqah Before Nafsi Spending',
    description:
      "Prophet Muhammad ﷺ encouraged giving in charity before spending on yourself. Set a sadaqah goal in Barakah — even $20/month — and let it auto-track every donation. 'Sadaqah does not decrease wealth.' (Sahih Muslim 2588)",
  },
  {
    step: '4',
    title: 'Avoid Israf in All Categories',
    description:
      'Allah says: "Indeed, the wasteful are brothers of the devils" (Quran 17:27). Review your spending categories monthly and flag anything excessive — restaurants, entertainment, clothing — and reduce israf (extravagance).',
  },
  {
    step: '5',
    title: 'Plan for the Akhirah',
    description:
      'Write your Islamic will (wasiyyah) — this is wajib (obligatory) according to most scholars. Use Barakah\'s will planner to designate charitable bequest (max 1/3 of estate) and ensure your assets are distributed by faraid.',
  },
  {
    step: '6',
    title: 'Build Your Hajj Fund',
    description:
      'Hajj is fard for every Muslim who is able. If you have not performed Hajj, open a dedicated Hajj savings goal in Barakah and contribute to it monthly alongside your other goals.',
  },
];

export default function IslamicBudgetingAppPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="min-h-screen bg-white px-6 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="text-green-700 hover:underline">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/learn" className="text-green-700 hover:underline">Learn</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">Best Islamic Budgeting App 2026</span>
          </nav>

          {/* Hero */}
          <header className="mb-10">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              ISLAMIC PERSONAL FINANCE
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight dark:text-gray-100">
              Best Islamic Budgeting App 2026 — Halal Budget Tracker for Muslim Families
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
              Regular budgeting apps like YNAB and Monarch were built for the Western financial system — no zakat, no riba detection, no sadaqah goals. Here is the complete guide to Islamic budgeting apps, and why Barakah is the only platform built entirely around fiqh.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>📅 Updated April 2026</span>
              <span>⏱ 12 min read</span>
              <span>✅ Reviewed for Islamic accuracy</span>
            </div>
          </header>

          {/* Quick Answer */}
          <div className="bg-green-50 border-l-4 border-green-700 rounded-r-xl p-6 mb-10">
            <p className="font-semibold text-green-900 mb-2">Quick Answer</p>
            <p className="text-green-800">
              <strong>Barakah</strong> is the best Islamic budgeting app for Muslim households. It is the only platform that combines zakat automation, riba detection, sadaqah tracking, halal stock screening, Islamic will planning, and family budgeting under one fiqh-aware roof — with a free plan and no credit card or debit card required.
            </p>
          </div>

          {/* Why Regular Apps Fail Muslims */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Why Regular Budgeting Apps Fail Muslims</h2>
            <p className="text-gray-700 mb-6 leading-relaxed dark:text-gray-300">
              Apps like Mint, YNAB, Monarch, and Copilot were designed for the conventional Western financial system. They are built around credit scores, interest-bearing savings, investment returns — and ignore the fundamental obligations and prohibitions of Islamic finance entirely.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                { problem: 'No Zakat Calculation', detail: 'No app calculates your zakat obligation, tracks your hawl, or alerts you when zakat is due. You are left guessing.' },
                { problem: 'No Riba Awareness', detail: 'Conventional apps celebrate interest income and ignore interest charges — the opposite of Islamic values.' },
                { problem: 'No Sadaqah Structure', detail: 'Charitable giving is just another budget line, with no concept of zakat, waqf, fidyah, or sadaqah jariyah.' },
                { problem: 'No Halal Filters', detail: 'Budgeting categories include alcohol, gambling, and other haram spending without any Islamic framework.' },
                { problem: 'No Family Islamic Finance', detail: 'No concept of shared zakat obligations, collective Hajj savings, or Islamic household financial planning.' },
                { problem: 'No End-of-Life Planning', detail: "No Islamic will, no faraid inheritance calculator, no concept of preparing for the akhirah." },
              ].map((item) => (
                <div key={item.problem} className="border border-red-100 bg-red-50 rounded-xl p-4">
                  <p className="font-semibold text-red-800 mb-1">❌ {item.problem}</p>
                  <p className="text-sm text-red-700">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Barakah Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Barakah: Built for Islamic Household Finance</h2>
            <p className="text-gray-600 mb-8 dark:text-gray-400">
              Every feature in Barakah is designed around the obligations and values of Islamic finance — not retrofitted Western tools.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
              {features.map((f) => (
                <div key={f.title} className="border border-gray-200 rounded-2xl p-5 hover:border-green-500 transition-colors dark:border-gray-700">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2 dark:text-gray-100">{f.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed dark:text-gray-400">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Islamic Budgeting App Comparison 2026</h2>
            <p className="text-gray-600 mb-6 dark:text-gray-400">How does Barakah compare to YNAB, Mint, Monarch Money, and manual spreadsheets?</p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="text-left p-3 font-semibold text-gray-700 border-b dark:text-gray-300">Feature</th>
                    <th className="p-3 font-semibold text-green-700 border-b">Barakah</th>
                    <th className="p-3 font-semibold text-gray-600 border-b dark:text-gray-400">YNAB</th>
                    <th className="p-3 font-semibold text-gray-600 border-b dark:text-gray-400">Mint</th>
                    <th className="p-3 font-semibold text-gray-600 border-b dark:text-gray-400">Monarch</th>
                    <th className="p-3 font-semibold text-gray-600 border-b dark:text-gray-400">Excel</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-700 border-b border-gray-100 dark:text-gray-300 dark:border-gray-700">{row.feature}</td>
                      <td className="p-3 text-center border-b border-gray-100 text-green-700 font-medium dark:border-gray-700">{row.barakah}</td>
                      <td className="p-3 text-center border-b border-gray-100 text-gray-600 dark:text-gray-400 dark:border-gray-700">{row.ynab}</td>
                      <td className="p-3 text-center border-b border-gray-100 text-gray-600 dark:text-gray-400 dark:border-gray-700">{row.mint}</td>
                      <td className="p-3 text-center border-b border-gray-100 text-gray-600 dark:text-gray-400 dark:border-gray-700">{row.monarch}</td>
                      <td className="p-3 text-center border-b border-gray-100 text-gray-600 dark:text-gray-400 dark:border-gray-700">{row.excel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Data current as of April 2026. Prices in USD.</p>
          </section>

          {/* Islamic Budgeting Principles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 dark:text-gray-100">How to Budget According to Islamic Finance Principles</h2>
            <p className="text-gray-600 mb-8 leading-relaxed dark:text-gray-400">
              Islamic budgeting is not just about tracking spending — it is about aligning your entire financial life with the commands of Allah and the Sunnah of the Prophet ﷺ. Here are the six steps to an Islamic household budget.
            </p>
            <div className="space-y-6">
              {islamicBudgetingSteps.map((step) => (
                <div key={step.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 dark:text-gray-100">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed dark:text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Barakah Pricing</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="border-2 border-gray-200 rounded-2xl p-6 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 mb-1 dark:text-gray-100">Free</div>
                <div className="text-gray-500 text-sm mb-4 dark:text-gray-400">Forever. No credit card or debit card required.</div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    'Zakat calculator (multi-madhab)',
                    'Hawl anniversary tracking',
                    'Manual expense tracking',
                    'Islamic budget categories',
                    'Sadaqah goals',
                    'Hajj savings goal',
                    'Islamic will basics',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center mt-6 border border-green-700 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-50 transition"
                >
                  Start Free
                </Link>
              </div>
              <div className="border-2 border-green-600 rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-6 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1 dark:text-gray-100">
                  $9.99 <span className="text-base font-normal text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <div className="text-gray-500 text-sm mb-4 dark:text-gray-400">Everything in Free, plus:</div>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {[
                    'Bank account sync',
                    'Auto transaction categorization',
                    'Riba detector & elimination plan',
                    'Halal stock screener (30,000+ stocks)',
                    'Faraid inheritance calculator',
                    'Full Islamic will + wasiyyah',
                    'Barakah Score',
                    'Family sharing (up to 6 members)',
                    'Priority support',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="block w-full text-center mt-6 bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                >
                  {`Start ${DEFAULT_ONBOARDING_TRIAL_WINDOW_LABEL} Free Trial`}
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-100">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {faqSchema.mainEntity.map((faq) => (
                <details key={faq.name} className="border border-gray-200 rounded-xl p-5 group dark:border-gray-700">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between dark:text-gray-100">
                    {faq.name}
                    <span className="text-green-700 ml-4 flex-shrink-0 text-lg">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed dark:text-gray-400">{faq.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-green-700 rounded-2xl p-8 text-center text-white mb-10">
            <h2 className="text-2xl font-bold mb-3">Start Your Islamic Budget Today — Free</h2>
            <p className="text-green-100 mb-6">
              Join thousands of Muslim families using Barakah to manage money the halal way.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition dark:bg-gray-800"
              >
                Create Free Account
              </Link>
              <Link
                href="/compare"
                className="border border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition"
              >
                Compare All Apps
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-5 dark:text-gray-100">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  href: '/learn/what-is-zakat',
                  title: 'What is Zakat?',
                  desc: 'Complete 2026 guide to zakat rules, calculation, and who must pay.',
                },
                {
                  href: '/learn/halal-investing-guide',
                  title: 'Halal Investing Guide',
                  desc: 'How to invest according to Islamic finance principles and AAOIFI standards.',
                },
                {
                  href: '/learn/mint-alternative-for-muslims',
                  title: 'Mint Alternative for Muslims',
                  desc: 'Why Mint failed Muslim users and the best Islamic replacement.',
                },
                {
                  href: '/learn/what-is-nisab',
                  title: 'What is Nisab?',
                  desc: 'Understand the gold and silver nisab threshold for 2026.',
                },
                {
                  href: '/learn/what-is-riba',
                  title: 'What is Riba?',
                  desc: "Islam's prohibition on interest and how to become riba-free.",
                },
                {
                  href: '/compare',
                  title: 'Islamic Finance App Comparison',
                  desc: 'Full breakdown of Barakah vs Zoya vs Wahed vs YNAB.',
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-4 border border-gray-200 rounded-xl hover:border-green-600 transition-colors dark:border-gray-700"
                >
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
              <Link href="/fiqh-terms" className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-900 border border-amber-200 hover:bg-amber-200 transition">All 14 terms →</Link>
            </div>
          </section>
      </article>
    </>
  );
}
