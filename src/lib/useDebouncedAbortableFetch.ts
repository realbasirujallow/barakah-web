import { useEffect, useRef, useState } from 'react';

/**
 * Debounced fetch that cancels the in-flight request when deps change.
 *
 * The Round 28 Nominatim-autocomplete fix in prayer-times/page.tsx is
 * the reference pattern: debounce on keystrokes, wrap the fetch in an
 * AbortController, abort on cleanup. That pattern was duplicated in a
 * couple of other places and will be duplicated more as we add
 * autocomplete surfaces. Extract it once so future sites get the
 * correct handling for free.
 *
 * Behavior:
 *   • `delayMs` after deps settle, `fetcher(signal)` runs.
 *   • If deps change again before `delayMs` elapses, the pending
 *     setTimeout is cleared AND the previous AbortController is aborted.
 *   • If the component unmounts, both the timeout and the controller are
 *     torn down so no `setState` fires on an unmounted component.
 *   • `AbortError` is swallowed — callers shouldn't see it as a user
 *     error. Non-abort errors are surfaced in the returned `error` state.
 *
 * Typical usage:
 *
 *   const { data, loading, error } = useDebouncedAbortableFetch<Suggestion[]>(
 *     [query],                                  // deps
 *     async (signal) => {                       // fetcher
 *       if (query.length < 2) return [];
 *       const res = await fetch(`/api/suggest?q=${encodeURIComponent(query)}`, { signal });
 *       if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *       return res.json();
 *     },
 *     350,                                      // delay
 *     []                                        // initial value
 *   );
 *
 * The deps array is the "trigger" — whenever it changes, the fetcher re-runs
 * after `delayMs`. Keep deps primitive (string, number) to avoid surprise
 * triggers from object identity changes.
 */
export function useDebouncedAbortableFetch<T>(
  deps: readonly unknown[],
  fetcher: (signal: AbortSignal) => Promise<T>,
  delayMs: number = 300,
  initial: T,
): { data: T; loading: boolean; error: Error | null } {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // Keep a fresh reference to the fetcher without re-triggering the
  // effect when its identity changes (parent re-renders). Ref write
  // lives in useEffect so we don't mutate during render (which newer
  // eslint-plugin-react-hooks flags as react-hooks/refs).
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const value = await fetcherRef.current(controller.signal);
        if (!controller.signal.aborted) {
          setData(value);
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delayMs);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
    // Intentionally use `deps` directly — exhaustive-deps can't see
    // through the spread, and the caller controls what triggers re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
