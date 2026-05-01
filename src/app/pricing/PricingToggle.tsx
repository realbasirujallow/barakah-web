'use client';
import { useState } from 'react';
import Link from 'next/link';
import { PRICING, FREE_FEATURES, PLUS_FEATURES, FAMILY_FEATURES } from '../../lib/pricing';
import { useI18n } from '../../lib/i18n';

// Strip currency symbol / commas so we can do arithmetic on the numeric value.
// Keeps the single source of truth in lib/pricing.ts rather than duplicating
// derived price figures as hardcoded strings in the JSX.
function parsePrice(formatted: string): number {
  const n = Number(formatted.replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function fmtUSD(value: number): string {
  return `$${value.toFixed(2).replace(/\.00$/, '')}`;
}

export default function PricingToggle() {
  const { t } = useI18n();
  // Default to annual billing — the 17% (Plus) / 34% (Family) savings are
  // the frame every visitor should see first. Monthly is still one tap away
  // for users who prefer not to commit annually up front. This also
  // improves LTV: annual plans churn dramatically less than monthly.
  const [isAnnual, setIsAnnual] = useState(true);

  // Derived yearly-monthly equivalents and "vs monthly" savings
  const plusMonthly = parsePrice(PRICING.plus.monthly);
  const plusYearly = parsePrice(PRICING.plus.yearly);
  const familyMonthly = parsePrice(PRICING.family.monthly);
  const familyYearly = parsePrice(PRICING.family.yearly);

  const plusYearlyPerMonth = fmtUSD(plusYearly / 12);
  const familyYearlyPerMonth = fmtUSD(familyYearly / 12);
  const plusYearlySavings = fmtUSD(plusMonthly * 12 - plusYearly);
  const familyYearlySavings = fmtUSD(familyMonthly * 12 - familyYearly);

  return (
    <>
      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-3 mb-12">
        <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
          {t('monthly')}
        </span>
        <button
          onClick={() => setIsAnnual(prev => !prev)}
          aria-label="Toggle billing period"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 ${
            isAnnual ? 'bg-green-700' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              isAnnual ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>
          {t('annual')}
        </span>
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
          isAnnual ? 'bg-green-700 text-white scale-105' : 'bg-green-100 text-green-800'
        }`}>
          {t('saveRange')}
        </span>
      </div>

      {/* Plan Cards */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Free</h2>
            <p className="text-sm text-gray-500">{t('pricingPlanFreeSubtitle')}</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">$0</span>
            <span className="text-gray-500 ml-1">/forever</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {FREE_FEATURES.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block w-full text-center bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {t('pricingGetStartedFree')}
          </Link>
        </div>

        {/* Plus Plan */}
        <div className="bg-white rounded-2xl border-2 border-green-700 shadow-lg p-8 flex flex-col relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-green-700 text-white text-sm font-semibold px-4 py-1 rounded-full">
              {t('pricingMostPopular')}
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Plus</h2>
            <p className="text-sm text-gray-500">{t('pricingPlanPlusSubtitle')}</p>
          </div>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900 transition-all">
              {isAnnual ? plusYearlyPerMonth : PRICING.plus.monthly}
            </span>
            <span className="text-gray-500 mb-1">/mo</span>
            {isAnnual && (
              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-1">
                billed {PRICING.plus.yearly}/yr
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {isAnnual ? (
              <span className="text-green-700 font-medium">You save {plusYearlySavings}/year vs monthly</span>
            ) : (
              <>
                or {PRICING.plus.yearly}{PRICING.plus.yearlyPeriod}{' '}
                <span className="text-green-700 font-medium">({PRICING.plus.yearlySaving})</span>
              </>
            )}
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {PLUS_FEATURES.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block w-full text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {t('homePrimaryCta')}
          </Link>
        </div>

        {/* Family Plan */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-amber-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
              {t('pricingForHouseholds')}
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Family</h2>
            <p className="text-sm text-gray-500">{t('pricingPlanFamilySubtitle')}</p>
          </div>
          <div className="mb-2 flex items-end gap-2">
            <span className="text-4xl font-bold text-gray-900 transition-all">
              {isAnnual ? familyYearlyPerMonth : PRICING.family.monthly}
            </span>
            <span className="text-gray-500 mb-1">/mo</span>
            {isAnnual && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mb-1">
                billed {PRICING.family.yearly}/yr
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {isAnnual ? (
              <span className="text-green-700 font-medium">You save {familyYearlySavings}/year vs monthly</span>
            ) : (
              <>
                or {PRICING.family.yearly}{PRICING.family.yearlyPeriod}{' '}
                <span className="text-green-700 font-medium">({PRICING.family.yearlySaving})</span>
              </>
            )}
          </p>
          <ul className="space-y-3 mb-8 flex-1">
            {FAMILY_FEATURES.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/signup"
            className="block w-full text-center bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {t('pricingStartFamily')}
          </Link>
        </div>
      </section>
    </>
  );
}
