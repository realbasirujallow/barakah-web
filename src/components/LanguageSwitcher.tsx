'use client';

import { useId } from 'react';
import { useI18n } from '../lib/i18n';

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export default function LanguageSwitcher({
  className = '',
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, locales, setLocale, t } = useI18n();
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={`flex items-center gap-2 text-sm text-gray-600 ${className}`.trim()}
    >
      {!compact && <span className="font-medium text-gray-700">{t('language')}</span>}
      <select
        id={inputId}
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        aria-label={t('language')}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
      >
        {locales.map((supportedLocale) => (
          <option key={supportedLocale.code} value={supportedLocale.code}>
            {supportedLocale.label}
          </option>
        ))}
      </select>
    </label>
  );
}
