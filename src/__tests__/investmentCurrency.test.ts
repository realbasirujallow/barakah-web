import { describe, expect, it } from 'vitest';
import { convertInvestmentAmount, normalizeInvestmentAmounts } from '../lib/investmentCurrency';

const fx = { base: 'USD', rates: { GBP: 0.8, SAR: 3.75 }, estimated: false, fetchedAt: Date.now() };
describe('investment currency contract', () => {
  it('converts USD summary and native accounts exactly once', () => {
    expect(convertInvestmentAmount(100, 'USD', 'SAR', fx)).toBe(375);
    expect(convertInvestmentAmount(80, 'GBP', 'SAR', fx)).toBe(375);
    const account = normalizeInvestmentAmounts({ totalValue: 80, returnPercent: 12 }, ['totalValue'], 'GBP', 'SAR', fx);
    expect(account).toEqual({ totalValue: 375, returnPercent: 12 });
    expect(convertInvestmentAmount(account.totalValue, 'SAR', 'SAR', null)).toBe(375);
  });
  it('does not fabricate totals when rates are absent, estimated, zero or stale', () => {
    for (const rates of [null, { ...fx, estimated: true }, { ...fx, rates: { GBP: 0, SAR: 3.75 } }, { ...fx, fetchedAt: 1 }]) {
      expect(() => convertInvestmentAmount(80, 'GBP', 'SAR', rates)).toThrow();
    }
    expect(convertInvestmentAmount(10, 'USD', 'USD', null)).toBe(10);
  });
  it('combines summary, holding, and manual asset in the same unit', () => {
    const summary = convertInvestmentAmount(100, 'USD', 'SAR', fx);
    const asset = convertInvestmentAmount(80, 'GBP', 'SAR', fx);
    const holding = convertInvestmentAmount(50, 'USD', 'SAR', fx);
    expect(summary + asset).toBe(750);
    expect(holding / (summary + asset)).toBe(0.25);
  });
});
