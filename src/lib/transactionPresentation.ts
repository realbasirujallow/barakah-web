import { t as tStandalone } from './i18n';

/**
 * Transaction category lists + display presentation.
 *
 * 2026-06-10 (audit rec #5): extracted verbatim from
 * dashboard/transactions/page.tsx so the income-vs-transfer DISPLAY
 * logic — the recurring bug-class where a transfer is mis-rendered as
 * income/expense, or a directional transfer shows the wrong sign — is
 * unit-testable (see transactionPresentation.test.ts). Behavior is
 * unchanged; the page imports these instead of defining them inline.
 */

export const CATEGORIES = [
  'food', 'dining', 'groceries', 'coffee',
  'transportation', 'fuel', 'parking', 'public_transit',
  'housing', 'utilities', 'rent', 'home_maintenance', 'insurance',
  'shopping', 'clothing', 'electronics',
  'healthcare', 'fitness', 'pharmacy',
  'education', 'kids', 'childcare',
  'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets',
  'income', 'investment', 'savings', 'debt_payment', 'taxes', 'transfer',
  'charity', 'zakat', 'sadaqah',
  'business', 'other',
];

export const TRANSFER_CATEGORIES = ['transfer', 'savings', 'investment', 'debt_payment', 'other'];

export function categoriesForType(type: string) {
  if (type === 'income') return CATEGORIES.filter(c => ['income', 'investment', 'savings', 'transfer', 'business', 'other', 'charity', 'gift', 'gifts', 'taxes'].includes(c) || ['salary'].includes(c));
  if (type === 'transfer') return TRANSFER_CATEGORIES;
  return CATEGORIES.filter(c => !['income', 'investment', 'savings'].includes(c));
}

/** Minimal structural input — a full Tx is assignable. */
export interface TxPresentationInput {
  type: string;
  direction?: string | null;
}

export interface TxPresentation {
  amountClass: string;
  badgeClass: string;
  badge: string;
  sign: string;
}

export function txPresentation(tx: TxPresentationInput): TxPresentation {
  if (tx.type === 'income') {
    return { amountClass: 'text-green-600', badgeClass: 'bg-green-100 text-green-700', badge: tStandalone('txnBadgeIncome'), sign: '+' };
  }
  if (tx.type === 'transfer') {
    const inflow = tx.direction === 'inflow';
    const outflow = tx.direction === 'outflow';
    return {
      amountClass: 'text-cyan-700',
      badgeClass: 'bg-cyan-100 text-cyan-700',
      badge: inflow ? tStandalone('txnBadgeTransferIn') : outflow ? tStandalone('txnBadgeTransferOut') : tStandalone('txnBadgeTransfer'),
      sign: inflow ? '↔ +' : outflow ? '↔ −' : '↔',
    };
  }
  return { amountClass: 'text-red-600', badgeClass: 'bg-red-100 text-red-700', badge: tStandalone('txnBadgeExpense'), sign: '−' };
}
