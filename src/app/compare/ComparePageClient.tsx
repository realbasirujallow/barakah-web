'use client';

import Link from 'next/link';
import { useI18n } from '../../lib/i18n';
import { localizeCompetitorFeature } from '../../lib/publicContent';

type AppComparison = {
  name: string;
  emoji: string;
  tagline: string;
  price: string;
  highlight: boolean;
  features: Record<string, string>;
};

type CompareFaq = {
  name: string;
  acceptedAnswer: {
    text: string;
  };
};

type ReviewApp = {
  name: string;
  emoji: string;
  verdict: string;
  pros: string[];
  cons: string[];
  link: string | null;
  cta: string | null;
};

type ComparePageClientProps = {
  apps: AppComparison[];
  faqs: CompareFaq[];
  reviews: ReviewApp[];
  allFeatures: string[];
};

export default function ComparePageClient({
  apps,
  faqs,
  reviews,
  allFeatures,
}: ComparePageClientProps) {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen bg-white">
      {/* 2026-05-01: removed the page-local header (was a custom
          🌙 Barakah wordmark + LanguageSwitcher + signup CTA bar) and
          breadcrumb (Home / Compare Apps). MarketingNav now mounts
          globally from root layout — same chrome as /, /pricing, etc.
          The page <h1> below provides "you are here". */}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-semibold text-[#1B5E20] mb-4">
            {t('compareUpdatedLabel')}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {t('comparePageTitle')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('comparePageSubtitle')}
          </p>
        </div>

        <div className="bg-[#1B5E20] text-white rounded-2xl p-6 mb-10 text-center">
          <p className="text-2xl font-bold mb-1">🌙 {t('compareWinnerTitle')}</p>
          <p className="text-green-200 mb-4">{t('compareWinnerBody')}</p>
          <Link href="/signup" className="inline-block bg-white text-[#1B5E20] font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition">
            {t('homePrimaryCta')}
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 mb-12">
          <table className="w-full text-sm min-w-[750px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-5 py-4 text-gray-500 font-semibold w-44">{t('pricingFeatureLabel')}</th>
                {apps.map((app) => (
                  <th key={app.name} className={`px-4 py-4 text-center ${app.highlight ? 'bg-[#1B5E20] text-white rounded-t-xl' : 'text-gray-700'}`}>
                    <p className="text-xl mb-0.5">{app.emoji}</p>
                    <p className="font-bold">{app.name}</p>
                    <p className={`text-xs mt-0.5 ${app.highlight ? 'text-green-300' : 'text-gray-400'}`}>{app.price}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatures.map((feature, i) => (
                <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-5 py-3 font-medium text-gray-700 border-r border-gray-100">{localizeCompetitorFeature(feature, locale)}</td>
                  {apps.map((app) => (
                    <td key={app.name} className={`px-4 py-3 text-center text-sm ${app.highlight ? 'bg-green-50 font-medium text-[#1B5E20]' : 'text-gray-600'}`}>
                      {app.features[feature] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('compareDetailedTitle')}</h2>
        <div className="space-y-6 mb-12">
          {reviews.map((app) => (
            <div key={app.name} className="border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{app.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-500">{app.verdict}</p>
                  </div>
                </div>
                {app.link && (
                  <Link href={app.link} className="shrink-0 bg-[#1B5E20] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2E7D32] transition">
                    {app.cta}
                  </Link>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('pros')}</p>
                  <ul className="space-y-1.5">
                    {app.pros.map((pro) => (
                      <li key={pro} className="flex gap-2 text-sm text-gray-700"><span className="text-green-500 shrink-0">✓</span>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">{t('cons')}</p>
                  <ul className="space-y-1.5">
                    {app.cons.map((con) => (
                      <li key={con} className="flex gap-2 text-sm text-gray-700"><span className="text-red-400 shrink-0">✗</span>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('compareHeadToHeadTitle')}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/compare/barakah-vs-zoya" className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#1B5E20] hover:shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{t('compareCardInvestingSpecialist')}</p>
              <h3 className="mb-2 text-xl font-bold text-[#1B5E20]">Barakah vs Zoya</h3>
              <p className="text-sm leading-6 text-gray-600">
                {t('compareCardInvestingBody')}
              </p>
            </Link>
            <Link href="/compare/barakah-vs-wahed" className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#1B5E20] hover:shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{t('compareCardRoboAdvisor')}</p>
              <h3 className="mb-2 text-xl font-bold text-[#1B5E20]">Barakah vs Wahed</h3>
              <p className="text-sm leading-6 text-gray-600">
                {t('compareCardRoboAdvisorBody')}
              </p>
            </Link>
            <Link href="/compare/barakah-vs-musaffa" className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-[#1B5E20] hover:shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{t('compareCardScreeningFirst')}</p>
              <h3 className="mb-2 text-xl font-bold text-[#1B5E20]">Barakah vs Musaffa</h3>
              <p className="text-sm leading-6 text-gray-600">
                {t('compareCardScreeningFirstBody')}
              </p>
            </Link>
          </div>
        </section>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('compareFaqTitle')}</h2>
        <div className="space-y-5 mb-12">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF8E1] border-2 border-[#1B5E20] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">{t('compareBottomTitle')}</h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">{t('compareBottomBody')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="bg-[#1B5E20] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#2E7D32] transition">
              {t('compareBottomPrimary')}
            </Link>
            <Link href="/pricing" className="border border-[#1B5E20] text-[#1B5E20] px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition">
              {t('compareBottomSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
