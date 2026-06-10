import { describe, it, expect } from 'vitest';
import { categoriesForType, txPresentation, TRANSFER_CATEGORIES } from '@/lib/transactionPresentation';

/**
 * Characterization tests for the income-vs-transfer DISPLAY logic
 * (audit recommendation #5 — flow 4, the recurring bug-class the QA
 * ledger keeps catching: a transfer rendered as income/expense, or a
 * directional transfer showing the wrong sign). Asserts the
 * translation-INDEPENDENT bits — sign + color classes — which are
 * exactly where the bug-class lives.
 */

describe('txPresentation — income / expense / transfer rendering', () => {
  it('income is green and signed +', () => {
    const p = txPresentation({ type: 'income' });
    expect(p.sign).toBe('+');
    expect(p.amountClass).toBe('text-green-600');
  });

  it('expense (and any non-income/transfer type) is red and signed −', () => {
    expect(txPresentation({ type: 'expense' }).sign).toBe('−');
    expect(txPresentation({ type: 'expense' }).amountClass).toBe('text-red-600');
    // unknown type falls through to the expense presentation, never income
    expect(txPresentation({ type: 'whatever' }).sign).toBe('−');
  });

  it('a transfer is NEVER rendered with the income/expense sign', () => {
    for (const direction of [undefined, null, 'inflow', 'outflow', 'neutral']) {
      const p = txPresentation({ type: 'transfer', direction });
      expect(p.amountClass).toBe('text-cyan-700');       // distinct cyan, not green/red
      expect(p.sign).not.toBe('+');
      expect(p.sign).not.toBe('−');
      expect(p.sign.startsWith('↔')).toBe(true);
    }
  });

  it('transfer direction drives the sign (inflow +, outflow −, neutral bare)', () => {
    expect(txPresentation({ type: 'transfer', direction: 'inflow' }).sign).toBe('↔ +');
    expect(txPresentation({ type: 'transfer', direction: 'outflow' }).sign).toBe('↔ −');
    expect(txPresentation({ type: 'transfer' }).sign).toBe('↔');
    expect(txPresentation({ type: 'transfer', direction: 'neutral' }).sign).toBe('↔');
  });
});

describe('categoriesForType — the picker list per transaction type', () => {
  it('transfer type offers exactly the transfer categories', () => {
    expect(categoriesForType('transfer')).toEqual(TRANSFER_CATEGORIES);
    expect(categoriesForType('transfer')).toContain('debt_payment');
  });

  it('expense type excludes income/investment/savings (can\'t mis-file an expense as income)', () => {
    const cats = categoriesForType('expense');
    expect(cats).not.toContain('income');
    expect(cats).not.toContain('investment');
    expect(cats).not.toContain('savings');
    expect(cats).toContain('groceries');
  });

  it('income type includes income + transfer/charity but is a curated subset', () => {
    const cats = categoriesForType('income');
    expect(cats).toContain('income');
    expect(cats).toContain('transfer');
    expect(cats).not.toContain('groceries'); // expense-only categories excluded
  });
});
