// AUTO-GENERATED from DomainConstants.java — DO NOT EDIT MANUALLY
// Regenerate: cd barakah-backend && ./scripts/generate-constants.sh

export const TRANSACTION_TYPES = ['income', 'expense', 'transfer'] as const;
export const TRANSACTION_DIRECTIONS = ['inflow', 'outflow', 'neutral'] as const;
export const TRANSACTION_CATEGORIES = ['food', 'dining', 'groceries', 'coffee', 'transportation', 'fuel', 'parking', 'public_transit', 'housing', 'rent', 'utilities', 'home_maintenance', 'insurance', 'shopping', 'clothing', 'electronics', 'healthcare', 'fitness', 'pharmacy', 'education', 'kids', 'childcare', 'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets', 'debt_payment', 'savings', 'investment', 'taxes', 'interest', 'income', 'salary', 'business', 'charity', 'zakat', 'sadaqah', 'transfer', 'refund', 'uncategorized', 'other'] as const;
export const ASSET_TYPES = ['cash', 'savings_account', 'checking_account', 'primary_home', 'investment_property', 'investment_property_resale', 'rental_property', 'stock', 'crypto', 'business', 'individual_brokerage', 'etf', '401k', 'retirement_401k', 'roth_ira', 'ira', 'hsa', '403b', 'pension', 'retirement', 'tsp', 'sep_ira', '529', '529_plan', 'education_savings', 'gold', 'silver', 'vehicle', 'other'] as const;
export const ASSET_ADDRESS_TYPES = ['primary_home', 'investment_property', 'investment_property_resale', 'rental_property', 'business'] as const;
export const ASSET_RETIREMENT_TYPES = ['401k', 'retirement_401k', 'ira', 'roth_ira', 'pension', 'retirement', '403b', 'tsp', 'sep_ira', 'hsa'] as const;
export const ASSET_EDUCATION_TYPES = ['529', '529_plan', 'education_savings'] as const;
export const ASSET_INVESTMENT_TYPES = ['stock', 'individual_brokerage', 'crypto', 'etf'] as const;
export const DEBT_TYPES = ['islamic_mortgage', 'conventional_mortgage', 'personal_loan', 'car_loan', 'student_loan', 'qard_hasan', 'credit_card', 'business_loan', 'other'] as const;
export const DEBT_ISLAMIC_TYPES = ['islamic_mortgage', 'qard_hasan'] as const;
export const DEBT_STATUSES = ['active', 'paid_off', 'defaulted'] as const;
export const BILL_CATEGORIES = ['utilities', 'housing', 'internet', 'insurance', 'subscriptions', 'healthcare', 'education', 'transport', 'debt', 'charity', 'phone', 'other'] as const;
export const BILL_FREQUENCIES = ['weekly', 'monthly', 'quarterly', 'yearly', 'one_time'] as const;
export const SADAQAH_CATEGORIES = ['food', 'clothing', 'education', 'medical', 'shelter', 'water', 'general', 'orphan', 'mosque', 'disaster_relief', 'dawah', 'other'] as const;
export const WAQF_TYPES = ['cash', 'property', 'equipment', 'books', 'land', 'other'] as const;
export const WAQF_PURPOSES = ['education', 'healthcare', 'mosque', 'water', 'orphanage', 'general', 'other'] as const;
export const WAQF_STATUSES = ['active', 'completed', 'cancelled'] as const;
export const INVESTMENT_ACCOUNT_TYPES = ['brokerage', 'retirement_401k', 'ira', 'roth_ira', 'hsa', 'education_529', 'crypto', 'mutual_fund', 'other'] as const;
export const INVESTMENT_HOLDING_TYPES = ['stock', 'etf', 'mutual_fund', 'bond', 'crypto', 'reit', 'sukuk', 'other'] as const;
export const WASIYYAH_RELATIONSHIPS = ['spouse', 'son', 'daughter', 'father', 'mother', 'brother', 'sister', 'grandchild', 'uncle', 'aunt', 'other'] as const;
export const WASIYYAH_OBLIGATION_TYPES = ['ZAKAT', 'KAFFARAH', 'UNPAID_LOAN', 'PROMISED_SADAQAH', 'MISSED_PRAYER_FIDYA', 'CUSTOM'] as const;
export const NOTIFICATION_TYPES = ['bill_due', 'hawl_complete', 'wasiyyah_reminder', 'budget_alert', 'savings_milestone', 'zakat_due', 'system', 'general'] as const;
export const SUBSCRIPTION_PLANS = ['free', 'plus', 'family'] as const;
export const SUBSCRIPTION_ACTIVE_STATUSES = ['active', 'trial', 'trialing', 'past_due'] as const;
export const FIQH_SCHOOLS = ['HANAFI', 'SHAFII', 'MALIKI', 'HANBALI', 'GENERAL'] as const;
export const RIBA_SOURCE_TYPES = ['MORTGAGE', 'CREDIT_CARD', 'PERSONAL_LOAN', 'CAR_LOAN', 'STUDENT_LOAN', 'SAVINGS_INTEREST', 'INVESTMENT_INTEREST', 'OTHER'] as const;

export function formatLabel(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
