import { Metadata } from 'next';
import LearnPageClient from './LearnPageClient';

export const metadata: Metadata = {
  title: 'Islamic Finance, Zakat & Estate Planning Guides | Barakah',
  description: 'Practical guides on zakat, halal investing, household finance, and Islamic estate planning backed by scholarly references and real-world examples.',
  keywords: ['islamic finance guide', 'zakat guide', 'halal investing', 'muslim finance', 'zakat rules', 'islamic banking'],
  alternates: {
    canonical: 'https://trybarakah.com/learn',
  },
  openGraph: {
    title: 'Islamic Finance, Zakat & Estate Planning Guides | Barakah',
    description: 'Practical guides on zakat, halal investing, household finance, and Islamic estate planning.',
    url: 'https://trybarakah.com/learn',
    type: 'website',
    images: [
      {
        url: 'https://trybarakah.com/og-learn.png',
        width: 1200,
        height: 630,
      },
    ],
  },
};

interface ArticleCard {
  slug: string;
  category: 'Zakat' | 'Islamic Finance' | 'Halal Investing' | 'Planning' | 'Fiqh';
  title: string;
  description: string;
  readTime: number;
}

const articles: ArticleCard[] = [
  // ── Zakat ──────────────────────────────────────────────────────────────
  {
    slug: 'what-is-zakat',
    category: 'Zakat',
    title: 'What Is Zakat? The Complete Guide',
    description: 'The fifth pillar of Islam explained — who owes it, what assets are zakatable, how to calculate it, and where to pay it.',
    readTime: 8,
  },
  {
    slug: 'how-much-zakat-do-i-owe',
    category: 'Zakat',
    title: 'How Much Zakat Do I Owe?',
    description: 'Step-by-step: nisab check, zakatable asset types, debt deductions, and the 2.5% calculation with worked examples.',
    readTime: 7,
  },
  {
    slug: 'nisab',
    category: 'Zakat',
    title: 'Nisab Threshold 2026: Live Gold vs Silver',
    description: 'Live nisab values, methodology differences, and which threshold fits your madhab or fiqh preference.',
    readTime: 7,
  },
  {
    slug: 'hawl',
    category: 'Zakat',
    title: 'Hawl: Your 354-Day Zakat Anniversary',
    description: 'How hawl starts, when it resets, and why madhab differences matter once wealth dips below nisab.',
    readTime: 7,
  },
  {
    slug: 'types-of-zakat',
    category: 'Zakat',
    title: 'Zakat and Related Giving Obligations',
    description: 'A clear guide to zakat al-mal, zakat al-fitr, plus the related obligations Muslims often ask about alongside them.',
    readTime: 6,
  },
  {
    slug: 'zakat-on-gold',
    category: 'Zakat',
    title: 'Zakat on Gold & Jewelry',
    description: 'Complete guide to calculating zakat on gold, jewelry, and silver with current nisab thresholds and scholarly positions.',
    readTime: 8,
  },
  {
    slug: 'zakat-on-gold-hanafi',
    category: 'Zakat',
    title: 'Zakat on Gold — Hanafi & All Four Madhabs',
    description: 'All four madhab rulings on gold zakat compared. Nisab in grams, jewelry exemptions, and the 85g gold standard for 2026.',
    readTime: 7,
  },
  {
    slug: 'zakat-on-savings-account',
    category: 'Zakat',
    title: 'Zakat on Savings Accounts 2026',
    description: 'Hawl year mechanics, combining multiple accounts, riba interest purification, and the nisab threshold for bank savings.',
    readTime: 7,
  },
  {
    slug: 'zakat-on-savings',
    category: 'Zakat',
    title: 'Zakat on Savings & Bank Accounts',
    description: 'Step-by-step guide to calculating zakat on savings accounts, checking accounts, and emergency funds.',
    readTime: 7,
  },
  {
    slug: 'zakat-on-401k',
    category: 'Zakat',
    title: 'Is My 401(k) Zakatable?',
    description: 'Three scholarly positions on 401(k) zakat with tax deduction calculations and practical examples for US Muslims.',
    readTime: 10,
  },
  {
    slug: 'zakat-on-retirement-accounts',
    category: 'Zakat',
    title: 'Zakat on 401(k), IRA & Retirement Accounts',
    description: 'Three scholarly positions on zakat obligations for retirement accounts, explained with practical examples.',
    readTime: 10,
  },
  {
    slug: 'zakat-on-stocks',
    category: 'Zakat',
    title: 'Zakat on Stocks & Investments',
    description: 'How to calculate zakat on stocks, mutual funds, ETFs, and cryptocurrency with the market value method.',
    readTime: 8,
  },
  {
    slug: 'zakat-on-stocks-and-etfs',
    category: 'Zakat',
    title: 'Zakat on Stocks and ETFs 2026',
    description: 'Market value vs AAOIFI Method 2 compared. How to calculate for individual stocks, index funds, and Islamic ETFs.',
    readTime: 9,
  },
  {
    slug: 'zakat-on-crypto',
    category: 'Zakat',
    title: 'Zakat on Cryptocurrency 2026',
    description: 'When is crypto zakatable? How to value Bitcoin, Ethereum, and altcoins on your hawl date and apply the 2.5% rate.',
    readTime: 7,
  },
  {
    slug: 'zakat-on-business-assets',
    category: 'Zakat',
    title: 'Zakat on Business Assets 2026',
    description: 'Inventory, cash, receivables, and the AAOIFI formula. Covers sole proprietors, LLCs, online sellers, and freelancers.',
    readTime: 9,
  },
  {
    slug: 'zakat-on-rental-property',
    category: 'Zakat',
    title: 'Zakat on Rental Property 2026',
    description: 'Is your rental property zakatable? Scholar consensus on residential vs commercial real estate and rental income zakat.',
    readTime: 7,
  },
  {
    slug: 'zakat-al-fitr',
    category: 'Zakat',
    title: 'Zakat al-Fitr 2026: Amount & Rules',
    description: 'Everything you need to know about zakat al-fitr, when to pay it, who must pay, and the 2026 amounts.',
    readTime: 5,
  },
  {
    slug: 'zakat-al-fitr-calculator',
    category: 'Zakat',
    title: 'Zakat al-Fitr Calculator 2026',
    description: 'Per-person amount, who must pay, payment deadline, and where to give. Free calculation tool for US Muslims.',
    readTime: 5,
  },
  {
    slug: 'ramadan-giving-tracker',
    category: 'Zakat',
    title: 'Ramadan Giving Tracker 2026',
    description: 'Track your Ramadan giving, calculate Zakat al-Fitr, and plan your Laylatul Qadr donations for maximum reward.',
    readTime: 6,
  },
  {
    slug: 'sadaqah-vs-zakat',
    category: 'Zakat',
    title: 'Sadaqah vs Zakat — What\'s the Difference?',
    description: 'When is charity obligatory vs voluntary, what counts as zakat vs sadaqah, and how to balance both in your giving plan.',
    readTime: 6,
  },
  // ── Islamic Finance ────────────────────────────────────────────────────
  {
    slug: 'islamic-finance-basics',
    category: 'Islamic Finance',
    title: 'Islamic Finance 101: Beginner\'s Guide',
    description: 'Core principles of Islamic finance, riba and gharar explained, and getting started with halal money management.',
    readTime: 9,
  },
  {
    slug: 'riba-elimination',
    category: 'Islamic Finance',
    title: 'How to Eliminate Riba from Your Finances',
    description: 'Identifying and removing interest from mortgages, credit cards, loans, and savings accounts. Halal alternatives included.',
    readTime: 10,
  },
  {
    slug: 'riba-free-mortgage',
    category: 'Islamic Finance',
    title: 'Riba-Free Mortgage Options 2026',
    description: 'Compare Guidance Residential, UIF, Devon Bank, and Ameen Housing on structure, rates, and eligibility.',
    readTime: 10,
  },
  {
    slug: 'is-my-mortgage-halal',
    category: 'Islamic Finance',
    title: 'Is My Mortgage Halal?',
    description: 'Conventional mortgage vs Islamic home financing — murabaha, ijara, and diminishing musharaka structures explained.',
    readTime: 9,
  },
  {
    slug: 'halal-mortgage-providers-usa',
    category: 'Islamic Finance',
    title: 'Halal Mortgage Providers in the USA (2025)',
    description: 'Compare Guidance Residential, UIF, Ameen Housing, Devon Bank, and Lariba on structure, availability, and Shariah credentials.',
    readTime: 8,
  },
  {
    slug: 'diminishing-musharaka-explained',
    category: 'Islamic Finance',
    title: 'Diminishing Musharaka Explained',
    description: 'Step-by-step: how the most popular Shariah-compliant home financing structure works, with a worked example and comparison table.',
    readTime: 10,
  },
  {
    slug: 'halal-budgeting',
    category: 'Islamic Finance',
    title: 'Halal Budgeting for Muslim Households',
    description: 'How to build a halal budget that accounts for zakat, sadaqah, Hajj savings, and avoids interest-bearing products.',
    readTime: 8,
  },
  {
    slug: 'muslim-household-budget',
    category: 'Islamic Finance',
    title: 'Muslim Household Budget Guide 2026',
    description: 'Practical family budgeting for zakat, charity, Ramadan giving, Hajj savings, and halal spending categories.',
    readTime: 8,
  },
  {
    slug: 'mint-alternative-for-muslims',
    category: 'Islamic Finance',
    title: 'Best Mint Alternative for Muslims 2026',
    description: 'Barakah vs Copilot vs YNAB — which budgeting apps work for Muslim households and respect Islamic finance rules?',
    readTime: 7,
  },
  {
    slug: 'islamic-budgeting-app',
    category: 'Islamic Finance',
    title: 'Best Islamic Budgeting App 2026',
    description: 'The top Islamic budgeting apps compared on zakat tools, halal screening, riba detection, and family finance features.',
    readTime: 7,
  },
  {
    slug: 'islamic-finance-app',
    category: 'Islamic Finance',
    title: 'Best Islamic Finance App 2026',
    description: 'Zakat calculator, halal stock screener, riba detector, and shariah-compliant budgeting.',
    readTime: 7,
  },
  // ── Halal Investing ────────────────────────────────────────────────────
  {
    slug: 'halal-stocks',
    category: 'Halal Investing',
    title: 'Halal Stocks List 2026',
    description: 'How to screen stocks for Shariah compliance using AAOIFI standards. Halal and haram sectors explained.',
    readTime: 9,
  },
  {
    slug: 'halal-stock-screener',
    category: 'Halal Investing',
    title: 'How to Use a Halal Stock Screener',
    description: 'AAOIFI vs MSCI methodology, financial ratios to check, prohibited business activities, and how to screen 30,000+ stocks.',
    readTime: 8,
  },
  {
    slug: 'halal-investing-guide',
    category: 'Halal Investing',
    title: 'Halal Investing Guide for Muslims',
    description: 'Complete guide to shariah-compliant investing — halal ETFs, sukuk, equities, and alternatives to interest-bearing bonds.',
    readTime: 10,
  },
  {
    slug: 'halal-etfs',
    category: 'Halal Investing',
    title: 'Best Halal ETFs 2026',
    description: 'Compare SPUS, HLAL, UMMA, IGDA, SPSK, and how they fit into a zakat-aware halal portfolio.',
    readTime: 8,
  },
  {
    slug: 'halal-401k',
    category: 'Halal Investing',
    title: 'Halal 401(k) Options in the US',
    description: 'How Muslim employees can handle 401(k) plans, ask HR for halal funds, and navigate retirement-account zakat.',
    readTime: 9,
  },
  // ── Planning ───────────────────────────────────────────────────────────
  {
    slug: 'islamic-will',
    category: 'Planning',
    title: 'How to Write an Islamic Will (Wasiyyah)',
    description: 'Complete guide to Islamic inheritance law, the 1/3 bequest rule, Faraid shares, and using Barakah\'s Wasiyyah planner.',
    readTime: 12,
  },
  {
    slug: 'islamic-will-template',
    category: 'Planning',
    title: 'Islamic Will Template 2026',
    description: 'Free Wasiyyah template — the 1/3 bequest rule, Faraid inheritance shares table, and executor guidance.',
    readTime: 10,
  },
  {
    slug: 'islamic-estate-planning',
    category: 'Planning',
    title: 'Islamic Estate Planning Guide',
    description: 'Three pillars: Wasiyyah (will), Faraid (inheritance), and Waqf (endowment). Protecting your family\'s future the Islamic way.',
    readTime: 11,
  },
  {
    slug: 'hajj-savings-plan',
    category: 'Planning',
    title: 'Hajj Savings Plan 2026',
    description: '2026 Hajj cost breakdown and monthly savings calculator. How to reach Hajj without interest-based financing.',
    readTime: 8,
  },
  // ── Fiqh ───────────────────────────────────────────────────────────────
  {
    slug: 'madhab-finance',
    category: 'Fiqh',
    title: 'How Your Madhab Affects Your Finances',
    description: 'Compare Hanafi, Shafi\'i, Maliki & Hanbali rulings on zakat, jewelry, hawl, debt deduction, and wasiyyah.',
    readTime: 8,
  },
];

export default function LearnPage() {
  // CollectionPage + ItemList schema for the learn hub — tells Google this is
  // a curated index of articles, which improves sitelink/breadcrumb rendering
  // in SERP and supports rich-result eligibility for the underlying articles.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Islamic Finance, Zakat & Estate Planning Guides',
    description:
      'Practical guides on zakat, halal investing, household finance, and Islamic estate planning backed by scholarly references and real-world examples.',
    url: 'https://trybarakah.com/learn',
    isPartOf: { '@type': 'WebSite', name: 'Barakah', url: 'https://trybarakah.com' },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://trybarakah.com/learn/${a.slug}`,
        name: a.title,
      })),
    },
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://trybarakah.com/' },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: 'https://trybarakah.com/learn' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LearnPageClient articles={articles} />
    </div>
  );
}
