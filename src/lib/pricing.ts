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
