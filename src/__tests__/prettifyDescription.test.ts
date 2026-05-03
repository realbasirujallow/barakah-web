import { describe, it, expect } from 'vitest';
import { prettifyDescription } from '../lib/prettifyDescription';

/**
 * 2026-05-03 — sibling of barakah_app/test/prettify_description_test.dart.
 *
 * The web prettifier and the Dart port share the exact same intent and
 * pattern set; whenever you change one, change the other and re-run
 * BOTH test suites. The cases below are the same we sanity-checked in
 * a node REPL during the overnight build pass; locking them down here
 * prevents a future regex tweak from silently breaking the demo.
 */
describe('prettifyDescription', () => {
  it('compresses ORIG CO NAME ACH blob', () => {
    expect(
      prettifyDescription(
        'ORIG CO NAME:IN 529 Dir ACH CO ENTRY DESCR:CONTRIB SEC:WEB IND ID:000029897953049 ORIG ID:1356651600',
      ),
    ).toBe('IN 529');
  });

  it('extracts merchant from EXTERNAL TRANSFER FROM', () => {
    expect(prettifyDescription('EXTERNAL TRANSFER FROM CHASE COLLEGE *5335 ON 05/01')).toBe(
      'CHASE COLLEGE',
    );
  });

  it('compresses POS DEBIT with Square prefix', () => {
    expect(prettifyDescription('POS DEBIT - VISA - SQ *AVON FOUNDATION CTR 4/30')).toBe(
      'AVON FOUNDATION CTR',
    );
  });

  it('compresses card-statement location-trail format', () => {
    expect(prettifyDescription('AVON RURAL KING FREMONT IN 5042 04/30')).toBe(
      'AVON RURAL KING FREMONT',
    );
  });

  it('Zelle FROM with title-case counterparty', () => {
    expect(
      prettifyDescription('RECEIVED ZELLE PMT ID:JPM99C7PXV2J FROM BASIRU JALLOW ON 04/30'),
    ).toBe('Zelle — Basiru Jallow');
  });

  it('passes through clean merchant strings', () => {
    expect(prettifyDescription('Spotify Premium')).toBe('Spotify Premium');
    expect(prettifyDescription('Aldi')).toBe('Aldi');
  });

  it('handles empty/null/undefined safely', () => {
    expect(prettifyDescription('')).toBe('');
    expect(prettifyDescription(null)).toBe('');
    expect(prettifyDescription(undefined)).toBe('');
  });

  it('strips trailing IDs from non-pattern blobs', () => {
    const out = prettifyDescription('SOMERANDOMTRANS ID:123456 REF:7890');
    expect(out).not.toContain('ID:');
    expect(out).not.toContain('REF:');
    expect(out.startsWith('SOMERANDOMTRANS')).toBe(true);
  });

  it('clips overly long merchant names to 60 chars with ellipsis', () => {
    const long = 'A'.repeat(80);
    const out = prettifyDescription(long);
    expect(out.length).toBeLessThanOrEqual(60);
    expect(out.endsWith('…')).toBe(true);
  });

  it('PURCHASE AUTHORIZED form', () => {
    expect(
      prettifyDescription('PURCHASE AUTHORIZED ON 05/01 SPOTIFY USA NEW YORK NY S301234567890'),
    ).toBe('SPOTIFY USA NEW YORK NY');
  });
});
