import { describe, it, expect } from 'vitest';
import { parseDate, inferDateOrder, parseAmount } from '../app/dashboard/import/GenericCsvImport';

// 2026-06-12 — pins the two date-parsing bugs the web bug-hunt found live in
// the generic CSV importer. Both corrupt which month an imported row counts
// toward, for the importer's core international / non-US-timezone audience.

// Helper: the local calendar day a parsed timestamp lands on.
const dayOf = (ts: number | null) => {
  expect(ts).not.toBeNull();
  const d = new Date(ts as number);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

describe('parseDate — ISO no timezone shift', () => {
  it('keeps YYYY-MM-DD on the same local calendar day (no UTC-midnight back-shift)', () => {
    // The bug: new Date('2026-06-12') is UTC midnight; local getters in any
    // negative-UTC zone returned Jun 11. Must stay Jun 12 regardless of TZ.
    expect(dayOf(parseDate('2026-06-12', 'mdy'))).toBe('2026-06-12');
    expect(dayOf(parseDate('2026-01-01', 'mdy'))).toBe('2026-01-01');
  });
});

describe('parseDate — ambiguous numeric order is honored', () => {
  it('reads 03/04/2026 as 4 March under mdy, 3 April under dmy', () => {
    expect(dayOf(parseDate('03/04/2026', 'mdy'))).toBe('2026-03-04');
    expect(dayOf(parseDate('03/04/2026', 'dmy'))).toBe('2026-04-03');
  });

  it('first-part>12 is always a day (dd/mm) regardless of order', () => {
    expect(dayOf(parseDate('25/12/2026', 'mdy'))).toBe('2026-12-25');
    expect(dayOf(parseDate('25/12/2026', 'dmy'))).toBe('2026-12-25');
  });

  it('two-digit years normalize to 2000s', () => {
    expect(dayOf(parseDate('06/12/26', 'mdy'))).toBe('2026-06-12');
  });
});

describe('inferDateOrder — column-level resolution', () => {
  it('detects dd/mm when any cell has first part > 12', () => {
    expect(inferDateOrder(['03/04/2026', '25/04/2026'], 'mdy')).toBe('dmy');
  });
  it('detects mm/dd when any cell has second part > 12', () => {
    expect(inferDateOrder(['03/04/2026', '03/25/2026'], 'dmy')).toBe('mdy');
  });
  it('falls back when the whole column is ambiguous', () => {
    expect(inferDateOrder(['03/04/2026', '05/06/2026'], 'mdy')).toBe('mdy');
    expect(inferDateOrder(['03/04/2026', '05/06/2026'], 'dmy')).toBe('dmy');
  });
});

describe('parseAmount — common bank formats', () => {
  it('handles parentheses negatives, currency symbols, and EU separators', () => {
    expect(parseAmount('$1,234.56')).toBe(1234.56);
    expect(parseAmount('(50.00)')).toBe(-50);
    expect(parseAmount('1.234,56')).toBe(1234.56); // EU: dot=thousands, comma=decimal
    expect(parseAmount('')).toBeNull();
    expect(parseAmount('abc')).toBeNull();
  });
});
