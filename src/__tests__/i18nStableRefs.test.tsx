/**
 * Regression test for BUG-PROD-AUDIT-LOAD (2026-06-06):
 *
 * /dashboard/admin/audit-log was stuck on "Loading…" forever on prod
 * even though the backend returned 200 in <500ms. Root cause: the
 * audit-log page lists `t` in its useEffect dependency array, and
 * useI18n() was returning a FRESH arrow function on every render —
 * each render → effect re-fired → setLoading(true) before the prior
 * fetch resolved → "Loading…" never cleared.
 *
 * Fix: memoize `t`, `tFmt`, and the returned object inside useI18n
 * with useCallback / useMemo, so their references stay stable as
 * long as `locale` doesn't change.
 *
 * This test pins that contract so the bug can't regress silently.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useI18n } from '../lib/i18n';

describe('useI18n — stable references across renders', () => {
  it('returns the SAME `t` function across renders when locale is unchanged', () => {
    const { result, rerender } = renderHook(() => useI18n());
    const t1 = result.current.t;
    rerender();
    const t2 = result.current.t;
    rerender();
    const t3 = result.current.t;
    expect(t2).toBe(t1);
    expect(t3).toBe(t1);
  });

  it('returns the SAME `tFmt` function across renders when locale is unchanged', () => {
    const { result, rerender } = renderHook(() => useI18n());
    const f1 = result.current.tFmt;
    rerender();
    const f2 = result.current.tFmt;
    expect(f2).toBe(f1);
  });

  it('returns the SAME hook value object across renders when locale is unchanged', () => {
    const { result, rerender } = renderHook(() => useI18n());
    const v1 = result.current;
    rerender();
    const v2 = result.current;
    // Reference equality — the whole object should be memoized so
    // components destructuring `const { t } = useI18n()` and listing
    // the destructured value in deps don't re-run effects.
    expect(v2).toBe(v1);
  });

  it('still translates correctly (smoke check that the memoization did not break t)', () => {
    const { result } = renderHook(() => useI18n());
    // Pass a missing key — implementation falls back to the key itself.
    expect(result.current.t('definitely_missing_test_key_xyz')).toBe(
      'definitely_missing_test_key_xyz',
    );
  });
});
