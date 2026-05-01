'use client';

import Link from 'next/link';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useI18n } from '../../lib/i18n';
import { PUBLIC_FEATURE_CARDS, localizeText } from '../../lib/publicContent';

export default function FeaturesPageClient() {
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen px-4 py-20 max-w-5xl mx-auto">
      <div className="mb-8 flex justify-end">
        <LanguageSwitcher compact />
      </div>
      <h1 className="text-4xl font-bold text-center mb-4">
        {t('featuresPageTitle')}
      </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
        {t('featuresPageSubtitle')}
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {PUBLIC_FEATURE_CARDS.map((feature) => (
          <li
            key={feature.title.en}
            className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
          >
            <span className="text-3xl mb-3 block">{feature.icon}</span>
            <h2 className="font-semibold text-lg mb-2">{localizeText(feature.title, locale)}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{localizeText(feature.desc, locale)}</p>
          </li>
        ))}
      </ul>
      <div className="text-center">
        <Link
          href="/signup"
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {t('homePrimaryCta')}
        </Link>
      </div>
    </div>
  );
}
