import { describe, it, expect, vi, beforeEach } from 'vitest';

// safeParse routes failures through logError (Sentry in prod). Mock it so the
// test doesn't emit and so we can assert the failure path was taken.
vi.mock('../lib/logError', () => ({ logError: vi.fn() }));

import { safeParse, safeParseWithFallback, formatTimeAgo } from '../lib/schemas';
import { logError } from '../lib/logError';

// Mirrors the (non-exported) ValidationResult<T> shape in schemas.ts.
type VR<T> = { success: boolean; data?: T; issues?: Array<{ path: string; message: string }> };
const ok = <T,>(data: T) => (): VR<T> => ({ success: true, data });
const fail = () => (): VR<never> => ({ success: false, issues: [{ path: 'x', message: 'bad' }] });

describe('safeParse (defensive API-response boundary)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns validated data on success', () => {
    expect(safeParse(ok({ a: 1 }), { raw: true }, 'ctx')).toEqual({ a: 1 });
  });

  it('returns null (and logs) on validation failure', () => {
    expect(safeParse(fail(), { garbage: true }, 'AssetList')).toBeNull();
    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('coerces a successful-but-empty payload to null', () => {
    expect(safeParse(ok(null as unknown as object), {}, 'ctx')).toBeNull();
  });
});

describe('safeParseWithFallback', () => {
  it('returns validated data on success', () => {
    expect(safeParseWithFallback(ok({ a: 2 }), { raw: 1 }, 'ctx')).toEqual({ a: 2 });
  });

  it('falls back to the raw data on failure (never throws)', () => {
    const raw = { keepThis: true };
    expect(safeParseWithFallback(fail(), raw, 'ctx')).toBe(raw);
  });
});

describe('formatTimeAgo (price-freshness label)', () => {
  it('handles the sentinel/edge inputs', () => {
    expect(formatTimeAgo(undefined)).toBe('unknown');
    expect(formatTimeAgo(null as unknown as number)).toBe('unknown');
    expect(formatTimeAgo(-1)).toBe('never — prices failed to load');
    expect(formatTimeAgo(366 * 24 * 3600 * 1000)).toBe('a long time ago — prices may not have loaded');
  });

  it('formats seconds / minutes / hours / days with correct boundaries', () => {
    expect(formatTimeAgo(0)).toBe('0s ago');
    expect(formatTimeAgo(59_000)).toBe('59s ago');
    expect(formatTimeAgo(60_000)).toBe('1m ago');
    expect(formatTimeAgo(59 * 60_000)).toBe('59m ago');
    expect(formatTimeAgo(60 * 60_000)).toBe('1h ago');
    expect(formatTimeAgo(23 * 3600_000)).toBe('23h ago');
    expect(formatTimeAgo(24 * 3600_000)).toBe('1d ago');
    expect(formatTimeAgo(300 * 24 * 3600_000)).toBe('300d ago');
  });
});
