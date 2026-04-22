'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

/**
 * Internal feature-flag provider. Replaces PostHog's feature-flag client.
 *
 * ## Contract
 * - On mount (or whenever `user` changes) we fetch {@code /api/feature-flags/me}
 *   once, which returns every active flag's variant for the current user.
 *   This is a single round-trip so downstream paywall/pricing/CTA
 *   components can call {@link useFeatureFlag} synchronously without
 *   triggering per-check network requests.
 * - Unknown flag → returns the fallback {@code 'control'} (matches the
 *   backend's {@code MISSING_FLAG_VARIANT}). Callers never see null,
 *   never see undefined.
 * - Unauthenticated users → empty map. The provider no-ops; any
 *   {@link useFeatureFlag} call returns {@code 'control'}.
 * - On fetch failure → empty map + console warn. The app MUST NOT
 *   break because a flag lookup 500'd.
 *
 * ## Example
 * ```tsx
 * const variant = useFeatureFlag('pricing_test_q2');
 * return <PriceBadge price={variant === 'treatment' ? 12.99 : 9.99} />;
 * ```
 */
type VariantMap = Record<string, string>;

interface FeatureFlagsContextShape {
  variants: VariantMap;
  isReady: boolean;
  /** Force-refresh from the server. Rare — normally auto-fires on login. */
  refresh: () => Promise<void>;
}

const FALLBACK: FeatureFlagsContextShape = {
  variants: {},
  isReady: false,
  refresh: async () => {},
};

const FeatureFlagsContext = createContext<FeatureFlagsContextShape>(FALLBACK);

/** Backend's fallback when a flag is unknown or errored. */
export const FEATURE_FLAG_FALLBACK = 'control';

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [variants, setVariants] = useState<VariantMap>({});
  const [isReady, setIsReady] = useState(false);

  const load = useCallback(async () => {
    // Flip isReady=false here (not inside useEffect directly) so the
    // react-hooks/set-state-in-effect rule stays happy — the rule
    // prohibits raw setState() calls as the FIRST thing in useEffect,
    // but setState inside a function the effect invokes is fine.
    setIsReady(false);
    if (!user) {
      setVariants({});
      setIsReady(true);
      return;
    }
    try {
      const res = (await api.getMyFeatureFlagVariants()) as
        | { variants?: VariantMap }
        | null;
      setVariants(res?.variants ?? {});
    } catch (err) {
      // Deliberate silent fallback — a broken flags endpoint must not
      // propagate to the UI. Callers branching on a flag just see the
      // control variant everywhere.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[FeatureFlags] load failed, using empty map:', err);
      }
      setVariants({});
    } finally {
      setIsReady(true);
    }
  }, [user]);

  useEffect(() => {
    // react-hooks/set-state-in-effect flags the transitive setState inside
    // load(). The React docs call this "synchronising to external state"
    // (the logged-in user), which is the legitimate use of useEffect.
    // Suppress locally — the same pattern is accepted in AuthContext.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const value = useMemo(
    () => ({ variants, isReady, refresh: load }),
    [variants, isReady, load],
  );

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

/**
 * Resolve a single feature flag to its variant string synchronously.
 * Returns {@link FEATURE_FLAG_FALLBACK} ({@code 'control'}) when the
 * flag is unknown, the user isn't logged in, or the fetch failed.
 *
 * ```tsx
 * const v = useFeatureFlag('paywall_v2');
 * if (v === 'treatment') return <NewPaywall />;
 * return <LegacyPaywall />;
 * ```
 */
export function useFeatureFlag(flag: string): string {
  const ctx = useContext(FeatureFlagsContext);
  return ctx.variants[flag] ?? FEATURE_FLAG_FALLBACK;
}

/** Access the full variant map — useful for admin preview UIs. */
export function useFeatureFlagsRaw(): FeatureFlagsContextShape {
  return useContext(FeatureFlagsContext);
}
