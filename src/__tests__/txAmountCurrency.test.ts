import { describe, it, expect } from 'vitest';
import { txAmount } from '../app/dashboard/transactions/page';

// 2026-06-13 (TXN-ROW-CURRENCY-IGNORED): each transaction row must render in
// its OWN currency, not the user's preferred-currency formatter — a GBP £50
// row was showing "$50.00" for a USD-preferred user.
const prefFmt = (n: number) => `PREF${n}`; // stand-in preferred-currency formatter

describe('txAmount — per-row currency', () => {
  it('formats a foreign-currency row in its own currency, not the preferred one', () => {
    const out = txAmount({ amount: 50, currency: 'GBP' } as never, prefFmt, 'en-US', 'USD');
    expect(out).toContain('£');
    expect(out).not.toContain('$');
    expect(out).not.toBe('PREF50');
  });

  it('uses the preferred formatter (fast path) when the row matches the preferred currency', () => {
    expect(txAmount({ amount: 50, currency: 'USD' } as never, prefFmt, 'en-US', 'USD')).toBe('PREF50');
  });

  it('treats a missing row currency as the preferred currency', () => {
    expect(txAmount({ amount: 50 } as never, prefFmt, 'en-US', 'USD')).toBe('PREF50');
  });

  it('renders an unknown but well-formed 3-letter code as-is (no crash)', () => {
    // Intl accepts any well-formed ISO-ish code and uses it as the symbol.
    expect(txAmount({ amount: 50, currency: 'ZZZ' } as never, prefFmt, 'en-US', 'USD')).toContain('ZZZ');
  });

  it('falls back to the preferred formatter for a malformed currency code', () => {
    // 2-letter / non-conforming codes make Intl throw → graceful fallback.
    expect(txAmount({ amount: 50, currency: 'US' } as never, prefFmt, 'en-US', 'USD')).toBe('PREF50');
  });

  it('renders EUR in its own symbol for a USD-preferred user', () => {
    const out = txAmount({ amount: 99.5, currency: 'EUR' } as never, prefFmt, 'en-US', 'USD');
    expect(out).toContain('€');
  });
});
