'use client';

import Link from 'next/link';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { COMPETITOR_COMPARISON } from '../../lib/pricing';
import { useI18n } from '../../lib/i18n';
import PricingToggle from './PricingToggle';

const faqTranslationKeys = [
  ['pricingFaqTrialQ', 'pricingFaqTrialA'],
  ['pricingFaqSwitchQ', 'pricingFaqSwitchA'],
  ['pricingFaqCheaperQ', 'pricingFaqCheaperA'],
  ['pricingFaqPaymentsQ', 'pricingFaqPaymentsA'],
  ['pricingFaqCancelQ', 'pricingFaqCancelA'],
] as const;

export default function PricingPageClient() {
  const { t } = useI18n();

  return (
    <article className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-green-700 hover:text-green-800 font-medium">
              {t('pricingBreadcrumbHome')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{t('pricingBreadcrumbPricing')}</span>
          </div>
          <LanguageSwitcher compact />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {t('pricingHeroTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('pricingHeroSubtitle')}
          </p>
        </header>

        <PricingToggle />

        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {t('pricingCompareHeading')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('pricingCompareSubheading')}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    {t('pricingFeatureLabel')}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-white bg-green-700">
                    {t('pricingBarakahPlusColumn')}
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Monarch</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">YNAB</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Zoya</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Copilot</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_COMPARISON.map((row, idx) => {
                  const cell = (val: boolean | string, highlight = false) => (
                    <td className={`py-3 px-4 text-center ${highlight ? 'bg-green-50 font-semibold' : ''}`}>
                      {typeof val === 'boolean' ? (
                        val
                          ? <span className={`text-lg ${highlight ? 'text-green-700' : 'text-green-600'}`}>&#10003;</span>
                          : <span className="text-red-400 text-lg">&#10007;</span>
                      ) : (
                        <span className={highlight ? 'text-green-800 font-bold' : 'text-gray-700'}>{val}</span>
                      )}
                    </td>
                  );

                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-6 text-gray-700 font-medium">{row.feature}</td>
                      {cell(row.barakah, true)}
                      {cell(row.monarch)}
                      {cell(row.ynab)}
                      {cell(row.zoya)}
                      {cell(row.copilot)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
            {t('pricingFaqHeading')}
          </h2>

          <div className="space-y-0 divide-y divide-gray-200">
            {faqTranslationKeys.map(([questionKey, answerKey]) => (
              <details
                key={questionKey}
                className="group cursor-pointer py-6 hover:bg-gray-50 px-4 -mx-4"
              >
                <summary className="flex items-center justify-between font-semibold text-gray-900 text-lg select-none">
                  <span className="flex-1">{t(questionKey)}</span>
                  <span className="transition-transform group-open:rotate-180 text-green-700 ml-4">
                    &#9660;
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-gray-200 text-gray-700 leading-relaxed">
                  {t(answerKey)}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-800 to-green-900 rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('pricingBottomCtaTitle')}
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            {t('pricingBottomCtaBody')}
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-green-800 hover:bg-green-50 font-bold py-4 px-10 rounded-lg transition-colors text-lg"
          >
            {t('pricingGetStartedFree')}
          </Link>
        </section>
      </div>
    </article>
  );
}
