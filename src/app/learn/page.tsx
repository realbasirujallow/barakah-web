import { Metadata } from 'next';
import Link from 'next/link';

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
    slug: 'nisab-threshold',
    category: 'Zakat',
    title: 'Nisab Threshold 2026: Gold vs Silver',
    description: 'Understanding the nisab threshold, comparing gold and silver standards, and which to use according to your madhab.',
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
    description: 'Conventional mortgage vs Islamic home financing — murabaha, ijara, and diminishing musharakah structures explained.',
    readTime: 9,
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
    description: 'Zakat calculator, halal stock screener, riba detector, and shariah-compliant budgeting — all in one platform.',
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

const categoryColors: Record<ArticleCard['category'], { bg: string; text: string }> = {
  Zakat: { bg: 'bg-green-100', text: 'text-[#1B5E20]' },
  'Islamic Finance': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Halal Investing': { bg: 'bg-purple-100', text: 'text-purple-700' },
  Planning: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Fiqh: { bg: 'bg-teal-100', text: 'text-teal-700' },
};

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#1B5E20]">🌙 Barakah</Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#1B5E20] font-medium hover:underline">Sign In</Link>
            <Link href="/signup" className="bg-[#1B5E20] text-white text-sm px-4 py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#1B5E20] transition">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1B5E20] font-medium">Learn</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1B5E20] to-[#2E7D32] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Knowledge Layer Behind Barakah</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Study the fiqh and practical reasoning behind zakat, halal investing, household money decisions, and Islamic estate planning with guides backed by trusted references.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Intro Paragraph */}
        <section className="mb-12 max-w-3xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            These guides are built to help Muslim households make better financial decisions with clarity and confidence. We break down complex topics like zakat, nisab, retirement accounts, halal investing, and wasiyyah into practical explanations grounded in established fiqh and contemporary scholarly guidance.
          </p>
        </section>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const colors = categoryColors[article.category];
            return (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#1B5E20]/20 transition-all duration-300"
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Category Tag */}
                  <div className={`${colors.bg} ${colors.text} inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4`}>
                    {article.category}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1B5E20] transition">
                    {article.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {article.description}
                  </p>

                  {/* Footer: Read Time & Arrow */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">{article.readTime} min read</span>
                    <span className="text-[#1B5E20] font-semibold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured CTA */}
        <section className="mt-16 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to put this knowledge into practice?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Use Barakah to move from reading to action with fiqh-aware tools for zakat, hawl, budgeting, family visibility, and estate planning.
          </p>
          <Link
            href="/zakat-calculator"
            className="inline-block bg-white text-[#1B5E20] px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Try the Zakat Calculator
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
              <p className="text-sm text-gray-600">Fiqh-aware household finance for modern Muslim families.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/learn/zakat-on-gold" className="hover:text-[#1B5E20] transition">Zakat on Gold</Link></li>
                <li><Link href="/learn/nisab-threshold" className="hover:text-[#1B5E20] transition">Nisab Threshold</Link></li>
                <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">Finance Basics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/" className="hover:text-[#1B5E20] transition">Home</Link></li>
                <li><Link href="/contact" className="hover:text-[#1B5E20] transition">Contact</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-[#1B5E20] transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Barakah. Islamic finance, household money, and estate planning knowledge hub.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
