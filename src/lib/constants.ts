/**
 * Canonical domain constants for Barakah.
 *
 * MIRROR OF: barakah-backend/src/main/java/com/barakah/config/DomainConstants.java
 * ALSO MIRRORED IN: barakah_app/lib/constants/domain_constants.dart
 *
 * When adding a new category/type:
 *   1. Add it to DomainConstants.java first (source of truth)
 *   2. Update this file
 *   3. Update domain_constants.dart
 *   4. Never define domain values inline in page files
 */

// ── Transaction ──────────────────────────────────────────────────────────────

export const TRANSACTION_TYPES = ['income', 'expense', 'transfer'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_DIRECTIONS = ['inflow', 'outflow', 'neutral'] as const;

export const TRANSACTION_CATEGORIES = [
  // Food & Drink
  'food', 'dining', 'groceries', 'coffee',
  // Transportation
  'transportation', 'fuel', 'parking', 'public_transit',
  // Housing
  'housing', 'rent', 'utilities', 'home_maintenance',
  // Insurance
  'insurance',
  // Shopping
  'shopping', 'clothing', 'electronics',
  // Health
  'healthcare', 'fitness', 'pharmacy',
  // Education
  'education', 'kids', 'childcare',
  // Entertainment & Lifestyle
  'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets',
  // Financial
  'debt_payment', 'savings', 'investment', 'taxes', 'interest',
  // Income-specific
  'income', 'salary', 'business',
  // Islamic
  'charity', 'zakat', 'sadaqah',
  // Transfers
  'transfer',
  // Catch-all
  'uncategorized', 'other',
] as const;

/** Expense-only categories (for budget and spending views). */
export const EXPENSE_CATEGORIES = TRANSACTION_CATEGORIES.filter(
  c => !['income', 'salary', 'transfer', 'uncategorized'].includes(c),
);

/** Income-only categories. */
export const INCOME_CATEGORIES = ['income', 'salary', 'business', 'investment', 'gift', 'other'] as const;

/** Transfer-only categories. */
export const TRANSFER_CATEGORIES = ['transfer', 'savings', 'investment', 'debt_payment', 'other'] as const;

// ── Asset Types ──────────────────────────────────────────────────────────────

export const ASSET_TYPE_GROUPS = {
  'Cash & Savings': ['cash', 'savings_account', 'checking_account'],
  'Real Estate': ['primary_home', 'investment_property', 'investment_property_resale', 'rental_property'],
  'Investments': ['stock', 'crypto', 'business', 'individual_brokerage', 'etf'],
  'Retirement': ['401k', 'retirement_401k', 'roth_ira', 'ira', 'hsa', '403b', 'pension'],
  'Education': ['529', '529_plan', 'education_savings'],
  'Precious Metals': ['gold', 'silver'],
  'Other': ['vehicle', 'other'],
} as const;

export const ASSET_ADDRESS_TYPES = ['primary_home', 'investment_property', 'investment_property_resale', 'rental_property', 'business'] as const;
export const ASSET_RETIREMENT_TYPES = ['401k', 'retirement_401k', 'ira', 'roth_ira', 'pension', 'retirement', '403b', 'tsp', 'sep_ira', 'hsa'] as const;
export const ASSET_EDUCATION_TYPES = ['529', '529_plan', 'education_savings'] as const;
export const ASSET_INVESTMENT_TYPES = ['stock', 'individual_brokerage', 'crypto', 'etf'] as const;

// ── Debt Types ───────────────────────────────────────────────────────────────

export const DEBT_TYPES = [
  'islamic_mortgage', 'conventional_mortgage', 'personal_loan', 'car_loan',
  'student_loan', 'qard_hasan', 'credit_card', 'business_loan', 'other',
] as const;

export const DEBT_ISLAMIC_TYPES = ['islamic_mortgage', 'qard_hasan'] as const;
export const DEBT_STATUSES = ['active', 'paid_off', 'defaulted'] as const;

// ── Bill ─────────────────────────────────────────────────────────────────────

export const BILL_CATEGORIES = [
  'utilities', 'housing', 'internet', 'insurance', 'subscriptions',
  'healthcare', 'education', 'transport', 'debt', 'charity', 'phone', 'other',
] as const;

export const BILL_FREQUENCIES = ['weekly', 'monthly', 'quarterly', 'yearly', 'one_time'] as const;

// ── Sadaqah ──────────────────────────────────────────────────────────────────

export const SADAQAH_CATEGORIES = [
  'food', 'clothing', 'education', 'medical', 'shelter', 'water',
  'general', 'orphan', 'mosque', 'disaster_relief', 'dawah', 'other',
] as const;

// ── Waqf ─────────────────────────────────────────────────────────────────────

export const WAQF_TYPES = ['cash', 'property', 'equipment', 'books', 'land', 'other'] as const;
export const WAQF_PURPOSES = ['education', 'healthcare', 'mosque', 'water', 'orphanage', 'general', 'other'] as const;

// ── Investment ───────────────────────────────────────────────────────────────

export const INVESTMENT_ACCOUNT_TYPES = [
  'brokerage', 'retirement_401k', 'ira', 'roth_ira', 'hsa',
  'education_529', 'crypto', 'mutual_fund', 'other',
] as const;

export const INVESTMENT_HOLDING_TYPES = [
  'stock', 'etf', 'mutual_fund', 'bond', 'crypto', 'reit', 'sukuk', 'other',
] as const;

// ── Wasiyyah ─────────────────────────────────────────────────────────────────

export const WASIYYAH_RELATIONSHIPS = [
  'spouse', 'son', 'daughter', 'father', 'mother', 'brother', 'sister',
  'grandchild', 'uncle', 'aunt', 'other',
] as const;

export const WASIYYAH_OBLIGATION_TYPES = [
  'ZAKAT', 'KAFFARAH', 'UNPAID_LOAN', 'PROMISED_SADAQAH', 'MISSED_PRAYER_FIDYA', 'CUSTOM',
] as const;

// ── Currencies ───────────────────────────────────────────────────────────────

export const CURRENCIES = [
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'SGD', 'MYR', 'AED', 'SAR',
  'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'EGP', 'TRY', 'IDR', 'PKR',
  'BDT', 'INR', 'NGN', 'KES', 'ZAR', 'MAD', 'TND', 'IQD', 'LBP',
  'CHF', 'SEK', 'NOK', 'DKK', 'JPY', 'CNY', 'KRW', 'THB', 'PHP',
  'VND', 'BRL', 'MXN', 'COP',
] as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Pretty-print a category/type slug: "debt_payment" → "Debt Payment" */
export function formatLabel(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
