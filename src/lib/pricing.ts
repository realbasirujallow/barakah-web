/**
 * Centralized pricing configuration.
 * Update prices here — all components import from this single source of truth.
 */
export const PRICING = {
  plus: {
    monthly: '$9.99',
    yearly: '$99',
    monthlyPeriod: '/mo',
    yearlyPeriod: '/year',
    yearlySaving: 'Save 17%',
  },
  family: {
    monthly: '$14.99',
    yearly: '$119',
    monthlyPeriod: '/mo',
    yearlyPeriod: '/year',
    yearlySaving: 'Save 34%',
  },
} as const;

/** Helper: get display price for a plan and billing period */
export function displayPrice(
  plan: 'plus' | 'family',
  billing: 'monthly' | 'yearly' = 'monthly',
) {
  const p = PRICING[plan];
  return billing === 'yearly'
    ? `${p.yearly}${p.yearlyPeriod}`
    : `${p.monthly}${p.monthlyPeriod}`;
}
