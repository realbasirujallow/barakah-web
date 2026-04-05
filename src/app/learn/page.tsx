import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Islamic Finance & Zakat Guide — Learn | Barakah',
  description: 'Your complete guide to Islamic finance, zakat calculation, halal investing, and Muslim financial planning. Expert guides backed by scholarly references.',
  keywords: ['islamic finance guide', 'zakat guide', 'halal investing', 'muslim finance', 'zakat rules', 'islamic banking'],
  alternates: {
    canonical: 'https://trybarakah.com/learn',
  },
  openGraph: {
    title: 'Islamic Finance & Zakat Guide — Learn | Barakah',
    description: 'Your complete guide to Islamic finance, zakat calculation, halal investing, and Muslim financial planning.',
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
  category: 'Zakat' | 'Islamic Finance' | 'Halal Investing' | 'Planning';
  title: string;
  description: string;
  readTime: number;
}

const articles: ArticleCard[] = [
  {
    slug: 'zakat-on-gold',
    category: 'Zakat',
    title: 'Zakat on Gold & Jewelry',
    description: 'Complete guide to calculating zakat on gold, jewelry, and silver with current nisab thresholds and scholarly positions.',
    readTime: 8,
  },
  {
    slug: 'zakat-on-retirement-accounts',
    category: 'Zakat',
    title: 'Zakat on 401(k), IRA & Retirement Accounts',
    description: 'Three scholarly positions on zakat obligations for retirement accounts, explained with practical examples.',
    readTime: 10,
  },
  {
    slug: 'zakat-on-savings',
    category: 'Zakat',
    title: 'Zakat on Savings & Bank Accounts',
    description: 'Step-by-step guide to calculating zakat on savings accounts, checking accounts, and emergency funds.',
    readTime: 7,
  },
  {
    slug: 'nisab-threshold',
    category: 'Zakat',
    title: 'Nisab Threshold 2026: Gold vs Silver',
    description: 'Understanding the nisab threshold, comparing gold and silver standards, and which to use according to your school of fiqh.',
    readTime: 6,
  },
  {
    slug: 'zakat-al-fitr',
    category: 'Zakat',
    title: 'Zakat al-Fitr 2026: Amount & Rules',
    description: 'Everything you need to know about zakat al-fitr, when to pay it, who must pay, and the 2026 amounts.',
    readTime: 5,
  },
  {
    slug: 'islamic-finance-basics',
    category: 'Islamic Finance',
    title: 'Islamic Finance 101: Beginner\'s Guide',
    description: 'Core principles of Islamic finance, understanding riba and gharar, and getting started with halal money management.',
    readTime: 9,
  },
  {
    slug: 'zakat-on-401k',
    category: 'Zakat',
    title: 'Is My 401(k) Zakatable?',
    description: 'Three scholarly positions on 401(k) zakat with tax deduction calculations and practical examples for US Muslims.',
    readTime: 10,
  },
  {
    slug: 'zakat-on-stocks',
    category: 'Zakat',
    title: 'Zakat on Stocks & Investments',
    description: 'How to calculate zakat on stocks, mutual funds, ETFs, and cryptocurrency with market value method.',
    readTime: 8,
  },
  {
    slug: 'halal-stocks',
    category: 'Halal Investing',
    title: 'Halal Stocks List 2026',
    description: 'How to screen stocks for Shariah compliance using AAOIFI standards. Common halal and haram sectors explained.',
    readTime: 9,
  },
  {
    slug: 'islamic-will',
    category: 'Planning',
    title: 'How to Write an Islamic Will (Wasiyyah)',
    description: 'Complete guide to Islamic inheritance law, the 1/3 bequest rule, Faraid shares, and using Barakah\'s Wasiyyah planner.',
    readTime: 12,
  },
];

const categoryColors: Record<ArticleCard['category'], { bg: string; text: string }> = {
  Zakat: { bg: 'bg-green-100', text: 'text-[#1B5E20]' },
  'Islamic Finance': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Halal Investing': { bg: 'bg-purple-100', text: 'text-purple-700' },
  Planning: { bg: 'bg-amber-100', text: 'text-amber-700' },
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Islamic Finance Knowledge Hub</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Master Islamic finance principles, zakat calculation, halal investing, and Muslim financial planning with expert guides backed by scholarly references.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Intro Paragraph */}
        <section className="mb-12 max-w-3xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed">
            Whether you're calculating zakat, exploring Islamic finance principles, or learning about halal investing, Barakah's comprehensive guides break down complex concepts with practical examples and scholarly references. All content is aligned with established Islamic fiqh and trusted sources like AMJA, Fiqh Council, and classical hadith collections.
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
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Calculate Your Zakat?</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Use Barakah's intelligent zakat calculator to determine your zakat obligations across all asset classes in minutes.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-[#1B5E20] px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
          >
            Go to Calculator
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
              <p className="text-sm text-gray-600">Islamic finance tools for modern Muslims.</p>
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
            <p>&copy; {new Date().getFullYear()} Barakah. Islamic Finance Knowledge Hub.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
