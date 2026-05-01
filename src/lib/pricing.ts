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

/**
 * Competitor comparison data for the /pricing page.
 *
 * ⚠️ Trust-drift hazard: competitor prices change without warning. Re-verify
 * every quarter from the sources below. Update
 * {@link COMPETITOR_PRICING_LAST_VERIFIED} on every sweep.
 *
 * ── 2026-04-22 sweep log ──────────────────────────────────────────────
 *
 *   • YNAB (ynab.com/pricing)
 *     Monthly $14.99 · Annual $109 · 34-day trial, no card.
 *     Matches prior table — no change.
 *
 *   • Monarch (monarch.com/pricing — monarchmoney.com now 301→monarch.com)
 *     Two tiers:
 *       – Core:  $14.99/mo monthly-billed · $99.99/yr annual-billed
 *                ($8.33/mo effective when paid annually)
 *       – Plus:  $25.00/mo monthly-billed · $299.99/yr annual-billed
 *     7-day trial, payment method required up-front.
 *     Intro offer: code WELCOME for 30% off first year (new users only).
 *     We compare against Core below — it's the head-to-head
 *     feature-parity tier with Barakah Plus. If Monarch renames/removes
 *     Core, revisit.
 *
 *   • Zoya Pro (help.zoya.finance/en/articles/8307704)
 *     US: $14.99/mo · $119.99/yr. Non-US pricing varies by store.
 *     No trial length disclosed on the help article.
 *     Matches prior table — no change.
 *
 *   • Copilot (copilot.money, copilot.money/pricing)
 *     Single plan: $95/yr annual-billed ($7.92/mo effective). Monthly-
 *     only billing is no longer surfaced on their pricing page in the
 *     2026-04-22 fetch; the $13/mo number that was in this table looks
 *     like it was either a legacy tier or a stale copy — corrected to
 *     $95/yr below. If you need the monthly-only rate, confirm with a
 *     fresh check before citing it.
 *
 * If a number here is stale, fix it in the same PR as the SEO / referral
 * copy sweep — every public-facing pricing number has to agree, or user
 * trust erodes silently.
 */
export const COMPETITOR_PRICING_LAST_VERIFIED = '2026-04-22';

export const COMPETITOR_COMPARISON = [
  // Monthly: monthly-billed rate where the competitor exposes one. Copilot
  // no longer surfaces a monthly-only option — the "$95/yr" entry is the
  // effective monthly equivalent ($7.92), which we annotate instead of
  // inventing a fake monthly-billed SKU.
  { feature: 'Monthly price',          barakah: '$9.99',   monarch: '$14.99',    ynab: '$14.99',  zoya: '$14.99', copilot: 'annual only' },
  { feature: 'Annual price',           barakah: '$99/yr',  monarch: '$99.99/yr', ynab: '$109/yr', zoya: '$119.99/yr', copilot: '$95/yr' },
  // Free-trial row added 2026-04-22 sweep. Barakah's 30-day no-card is
  // the most generous of the set and should carry weight on the pricing
  // page — don't forget to surface it in the table UI.
  { feature: 'Free trial',             barakah: '30 days (no card)', monarch: '7 days (card)', ynab: '34 days (no card)', zoya: '—',       copilot: 'free trial*' },
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
  { feature: 'Arabic, Urdu & French support', barakah: true, monarch: false, ynab: false, zoya: false, copilot: false },
] as const;
