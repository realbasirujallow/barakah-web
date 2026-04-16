/**
 * Centralized pricing configuration.
 * Update prices here — all components import from this single source of truth.
 *
 * Feature lists are used in: homepage pricing section, profile/billing page,
 * setup flow, PlanGate component, and Flutter billing_screen.dart.
 * Keep ALL of these in sync when adding features.
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

/** Free plan features. */
export const FREE_FEATURES = [
  'Up to 10 transactions/month',
  'Basic zakat calculator (live nisab)',
  'Hawl tracker',
  'Prayer times (any city)',
  'Budgets & bills tracking',
  'Sadaqah tracking',
  'Ramadan Mode',
  'Islamic calendar & events',
] as const;

/** Plus plan features — the "synced personal finance + Islamic intelligence" plan. */
export const PLUS_FEATURES = [
  'Unlimited transactions',
  'Bank account sync (Plaid)',
  'Live balances & net worth',
  'Safe-to-spend & cash-flow forecast',
  'Zakat calculator with receipts',
  'Faraid (inheritance) calculator',
  'Ibadah Finance dashboard',
  'Riba Elimination Journey',
  'Halal stock screener (30,000+)',
  'Barakah Score (5 pillars)',
  'Transaction review queue & tags',
  'Merchant normalization',
  'Wasiyyah & Waqf planning',
  'Debt Payoff Projector',
  'Analytics & Year-over-Year',
  'CSV & PDF export',
  'Auto-categorization rules',
] as const;

/** Family plan features — the "household continuity" plan. */
export const FAMILY_FEATURES = [
  'Everything in Plus',
  'Up to 6 family members',
  'Shared budgets & goals',
  'Household zakat visibility',
  'Family estate continuity',
  'Family financial summary',
  'Shared expense splitting',
] as const;

/** Competitor comparison data for the /pricing page. */
export const COMPETITOR_COMPARISON = [
  { feature: 'Monthly price',          barakah: '$9.99',   monarch: '$14.99',    ynab: '$14.99',  zoya: '$14.99', copilot: '$13/mo'   },
  { feature: 'Annual price',           barakah: '$99/yr',  monarch: '$99.99/yr', ynab: '$109/yr', zoya: '$119.99/yr', copilot: '$95.99/yr' },
  { feature: 'Bank account sync',      barakah: true,  monarch: true,  ynab: true,  zoya: false, copilot: true  },
  { feature: 'Budgeting & bills',      barakah: true,  monarch: true,  ynab: true,  zoya: false, copilot: true  },
  { feature: 'Safe-to-spend',          barakah: true,  monarch: true,  ynab: true,  zoya: false, copilot: true  },
  { feature: 'Cash-flow forecast',     barakah: true,  monarch: true,  ynab: false, zoya: false, copilot: true  },
  { feature: 'Net worth tracking',     barakah: true,  monarch: true,  ynab: true,  zoya: false, copilot: true  },
  { feature: 'Investment tracking',    barakah: true,  monarch: true,  ynab: false, zoya: true,  copilot: true  },
  { feature: 'Zakat calculator',       barakah: true,  monarch: false, ynab: false, zoya: true,  copilot: false },
  { feature: 'Multi-madhab support',   barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Hawl tracking',          barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Faraid (inheritance)',   barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Riba detection',         barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Halal stock screening',  barakah: true,  monarch: false, ynab: false, zoya: true,  copilot: false },
  { feature: 'Islamic will (Wasiyyah)',barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Sadaqah & Waqf tracking',barakah: true, monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Household/family plan',  barakah: true,  monarch: true,  ynab: false, zoya: false, copilot: false },
  { feature: 'Prayer times',           barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Ramadan Mode',           barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
  { feature: 'Urdu & Arabic support',  barakah: true,  monarch: false, ynab: false, zoya: false, copilot: false },
] as const;
