'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

type ArticleCard = {
  slug: string;
  category: 'Zakat' | 'Islamic Finance' | 'Halal Investing' | 'Planning' | 'Fiqh';
  title: string;
  description: string;
  readTime: number;
};

type LearnPageClientProps = {
  articles: ArticleCard[];
};

const categoryColors: Record<ArticleCard['category'], { bg: string; text: string }> = {
  Zakat: { bg: 'bg-green-100', text: 'text-[#1B5E20]' },
  'Islamic Finance': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Halal Investing': { bg: 'bg-purple-100', text: 'text-purple-700' },
  Planning: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Fiqh: { bg: 'bg-teal-100', text: 'text-teal-700' },
};

const categoryKeyMap: Record<ArticleCard['category'], string> = {
  Zakat: 'learnCategoryZakat',
  'Islamic Finance': 'learnCategoryIslamicFinance',
  'Halal Investing': 'learnCategoryHalalInvesting',
  Planning: 'learnCategoryPlanning',
  Fiqh: 'learnCategoryFiqh',
};

export default function LearnPageClient({ articles }: LearnPageClientProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex flex-col">
      {/* 2026-05-01: page-local <header> + breadcrumb <nav> removed.
          Global MarketingNav (mounted via root-layout MaybeMarketingNav,
          PR #77) provides the home-link, nav items, language switcher,
          sign in, and Start free button. The <h1> in the hero below
          provides "you are here" wayfinding. PR #77 stripped this
          pattern from the 19 individual learn/* subpages but missed
          the /learn index page — this PR closes that gap. */}

      <section className="bg-gradient-to-b from-[#1B5E20] to-[#2E7D32] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('learnPageTitle')}</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            {t('learnPageSubtitle')}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <section className="mb-12 max-w-3xl mx-auto text-center">
          <p className="text-gray-700 text-lg leading-relaxed dark:text-gray-300">
            {t('learnIntroBody')}
          </p>
        </section>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const colors = categoryColors[article.category];
            return (
              <Link
                key={article.slug}
                href={`/learn/${article.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-[#1B5E20]/20 transition-all duration-300 dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="p-6 h-full flex flex-col">
                  <div className={`${colors.bg} ${colors.text} inline-flex w-fit px-3 py-1 rounded-full text-xs font-semibold mb-4`}>
                    {t(categoryKeyMap[article.category])}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1B5E20] transition dark:text-gray-100">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 flex-grow dark:text-gray-400">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{article.readTime} {t('learnReadTime')}</span>
                    <span className="text-[#1B5E20] font-semibold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <section className="mt-16 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{t('learnCtaTitle')}</h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            {t('learnCtaBody')}
          </p>
          <Link
            href="/zakat-calculator"
            className="inline-block bg-white text-[#1B5E20] px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition dark:bg-gray-800"
          >
            {t('learnCtaButton')}
          </Link>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-6 mt-16 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-[#1B5E20] mb-4">Barakah</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('learnFooterBrandBody')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">{t('learnBreadcrumbLearn')}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/learn/zakat-on-gold" className="hover:text-[#1B5E20] transition">{t('learnFooterZakatOnGold')}</Link></li>
                <li><Link href="/learn/nisab" className="hover:text-[#1B5E20] transition">{t('learnFooterNisabThreshold')}</Link></li>
                <li><Link href="/learn/islamic-finance-basics" className="hover:text-[#1B5E20] transition">{t('learnFooterFinanceBasics')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">{t('homeFooterCompany')}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/" className="hover:text-[#1B5E20] transition">{t('learnBreadcrumbHome')}</Link></li>
                <li><Link href="/contact" className="hover:text-[#1B5E20] transition">{t('navContact')}</Link></li>
                <li><Link href="/disclaimer" className="hover:text-[#1B5E20] transition">{t('legalDisclaimer')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm dark:text-gray-100">{t('homeFooterLegal')}</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="/privacy" className="hover:text-[#1B5E20] transition">{t('legalPrivacy')}</Link></li>
                <li><Link href="/terms" className="hover:text-[#1B5E20] transition">{t('legalTerms')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-500 dark:text-gray-400 dark:border-gray-700">
            <p>&copy; {new Date().getFullYear()} Barakah. Islamic finance, household money, and estate planning knowledge hub.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
