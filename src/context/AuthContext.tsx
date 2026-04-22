'use client';
import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, setRefreshToken, setUnauthorizedHandler } from '../lib/api';
import { trackLogin, trackSignUp, trackTrialStarted, trackOnce } from '../lib/analytics';
import { DEFAULT_ONBOARDING_TRIAL_DAYS } from '../lib/trial';

// Dev-only trace hook. In production these traces would add noise to
// DevTools and pollute any UI/infra log capture; Sentry already receives
// the exceptional paths via the 401 handler + getSentry() pipeline.
const IS_DEV = process.env.NODE_ENV !== 'production';
function devTrace(...args: unknown[]): void {
  if (IS_DEV) {
     
    console.debug(...args);
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'plus' | 'family';
  planExpiresAt?: number | null;
  referralCode?: string;
  /**
   * Server-supplied flag: this user's ID is in the backend's ADMIN_USER_IDS.
   * UI-hint only — every /admin/** endpoint independently re-checks admin
   * status. Absent for legacy cached profiles that predate the flag; treated
   * as false in that case.
   */
  isAdmin?: boolean;
  /**
   * Round 23: server-side guided-setup completion timestamp (epoch ms).
   * Replaces the per-device `barakah_guided_setup_completed_<userId>`
   * localStorage flag as source of truth. Null means either the user
   * hasn't finished setup or their account predates this field (in
   * which case callers fall back to the legacy local flag).
   */
  setupCompletedAt?: number | null;
  /**
   * Round 23: user's country (ISO country code from signup). Drives
   * locale-aware number / currency / date formatting in `useCurrency`
   * and related hooks. Not shown in UI directly.
   */
  country?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string, state: string, country: string, referralCode?: string, phoneNumber?: string) => Promise<void>;
  logout: (reason?: 'logout' | 'deleted') => Promise<void>;
  isLoading: boolean;
  /** Call after a plan change to refresh plan from /auth/profile */
  refreshPlan: () => Promise<void>;
}

// Module-level flag: when true the dashboard layout should NOT override
// the redirect with its own /login?expired=true push.
let _intentionalLogout = false;
export function isIntentionalLogout() { return _intentionalLogout; }

const AuthContext = createContext<AuthContextType | null>(null);

// localStorage key for the non-sensitive user profile (name, email, id).
// The JWT itself is stored exclusively in an httpOnly cookie — never in
// localStorage — so JavaScript (including any XSS payload) cannot read it.
const USER_KEY = 'user';
const LAST_ACTIVITY_KEY = 'last_activity_ts';

// How long after a successful refresh before we allow another proactive refresh.
// Reduced to 30 seconds so the auth_token cookie stays fresh even during
// frequent navigation (direct URL entry causes a full-page load where the
// Next.js middleware checks the cookie *before* client JS runs — if the
// cookie has expired the user gets bounced to /login before React can refresh).
// Previously 90s which was too long — users got session-expired on page transitions.
export const REFRESH_TS_KEY = 'last_refresh_ts';
const REFRESH_GUARD_SECONDS = 30; // 30 seconds

function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Keep a ref to router so the unauthorized handler always has the latest
  // reference without needing to be in the effect's dependency array.
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    // HIGH BUG FIX: cancellation flag so rapid unmount (e.g. fast-navigation) does
    // not call setUser/setIsLoading on an already-unmounted context provider.
    let cancelled = false;
    const finishLoading = () => {
      window.setTimeout(() => { if (!cancelled) setIsLoading(false); }, 0);
    };
    let savedUser: string | null = null;
    try {
      savedUser = localStorage.getItem(USER_KEY);
    } catch {
      // localStorage is disabled (SSR context, private browsing, etc.)
      finishLoading();
      return;
    }

    // Register a global 401 handler.
    setUnauthorizedHandler(() => {
      try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REFRESH_TS_KEY);
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      } catch {
        // localStorage access failed, continue with cleanup
      }
      setRefreshToken(null);
      setUser(null);
      if (typeof window !== 'undefined' && isProtectedPath(window.location.pathname)) {
        routerRef.current.push('/login?reason=expired');
      }
    });

    if (!savedUser) {
      finishLoading();
      return;
    }

    let parsed: User | null = null;
    try {
      parsed = JSON.parse(savedUser);
    } catch {
      try {
        localStorage.removeItem(USER_KEY);
      } catch {
        // localStorage access failed
      }
      finishLoading();
      return;
    }

    // Detect stale cached profiles that are missing fields added after the
    // user last logged in. Two known cases:
    //   - plan missing: user predates the login-plan-in-response change.
    //     Defaulting to 'free' without a server round-trip would block
    //     paid users from their features, so we force a profile refresh.
    //   - isAdmin missing: user predates the admin-flag change. Defaulting
    //     to not-admin would silently lock real admins out of /admin/**
    //     (same "click Funnel, bounce to dashboard" bug). Force a refresh.
    // Either signal triggers the same reconciliation path.
    const planMissing = parsed != null && !parsed.plan;
    const isAdminMissing = parsed != null && typeof parsed.isAdmin === 'undefined';
    const needsSync = planMissing || isAdminMissing;
    if (planMissing) {
      // Temporary safe placeholder (type-safe) — overwritten below immediately.
      parsed!.plan = 'free';
    }

    /**
     * Fetch the authoritative plan from the server and persist it to
     * localStorage so future mounts don't need to re-fetch.
     */
    const syncPlan = async (u: User): Promise<User> => {
      try {
        const data = await api.getProfile(true);
        if (data?.plan) {
          const updated: User = {
            ...u,
            plan: data.plan as User['plan'],
            planExpiresAt: data.planExpiresAt ?? null,
            // Pick up admin flag on every server-reconciliation so newly-granted
            // admin access takes effect on the next tab visibility / page load
            // instead of requiring a full logout.
            isAdmin: data.isAdmin === true,
            // Round 23: fetch server-side setup completion + country so
            // dashboard/setup redirect logic and currency formatting
            // always have the latest truth across devices.
            setupCompletedAt: (data.setupCompletedAt as number | null | undefined) ?? null,
            country: (data.country as string | undefined) ?? u.country,
          };
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
          return updated;
        }
      } catch { /* silent — if offline keep whatever we have */ }
      return u;
    };

    let lastRefreshTs = 0;
    try {
      lastRefreshTs = parseInt(localStorage.getItem(REFRESH_TS_KEY) || '0', 10) || 0;
    } catch {
      // localStorage access failed
    }
    const secondsSinceRefresh = (Date.now() - lastRefreshTs) / 1000;

    if (secondsSinceRefresh < REFRESH_GUARD_SECONDS) {
      // Session cookies are fresh. If any legacy field is missing from the
      // cached profile (plan, isAdmin), reconcile with the server so we
      // don't lock the user out of features they actually have access to.
      if (needsSync) {
        syncPlan(parsed!).then(u => {
          if (cancelled) return;
          setUser(u);
          setIsLoading(false);
        });
      } else {
        window.setTimeout(() => {
          if (cancelled) return;
          setUser(parsed);
          setIsLoading(false);
        }, 0);
      }
      return;
    }

    // Try a silent refresh. If it succeeds the server has rotated both cookies.
    //
    // IMPORTANT: This is a PROACTIVE refresh — the auth_token cookie may still
    // be perfectly valid (24h / 7d with Remember Me). If the refresh fails for
    // any reason (proxy cookie corruption, transient backend error, etc.) we
    // MUST NOT logout. The auth_token cookie is the authoritative session —
    // it will continue working for all API calls. Only the 401 handler in
    // apiFetch should trigger a logout (when the auth_token truly expires and
    // the refresh also fails).
    api.refresh().then(async (result: 'ok' | 'expired' | 'rate_limited' | 'network_error') => {
      if (cancelled) return;
      if (result === 'ok') {
        try {
          localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
        } catch {
          // localStorage access failed
        }
        // If plan was missing, fetch the real one now that the session is fresh.
        const finalUser = needsSync ? await syncPlan(parsed!) : parsed!;
        setUser(finalUser);
      } else if (result === 'expired') {
        // Proactive refresh returned 'expired'. This does NOT necessarily mean
        // the session is dead — the auth_token cookie may still be valid. Don't
        // logout here; instead, verify with a lightweight server call (getProfile).
        // If getProfile succeeds → auth_token is valid, keep user logged in.
        // If getProfile fails with 401 → the 401 handler in apiFetch will trigger
        // the real logout flow.
        devTrace('Proactive refresh returned expired — verifying auth_token with profile check');
        try {
          const data = await api.getProfile(true);
          if (data?.plan && parsed) {
            const updated: User = {
              ...parsed,
              plan: data.plan as User['plan'],
              planExpiresAt: data.planExpiresAt ?? null,
              isAdmin: data.isAdmin === true,
            };
            try { localStorage.setItem(USER_KEY, JSON.stringify(updated)); } catch { /* SSR */ }
            setUser(updated);
          } else {
            setUser(parsed);
          }
        } catch {
          // getProfile failed — the 401 handler will have already triggered
          // logout if auth_token is truly expired. If it was a network error,
          // keep the cached user for offline mode.
          setUser(parsed);
        }
      } else {
        // Network error — keep stale profile for offline mode
        setUser(parsed);
      }
      setIsLoading(false);
    }).catch((err: unknown) => {
      if (cancelled) return;
      // Network error on mount (offline) — keep stale profile for offline mode.
      // Log error for debugging: distinguish network errors from auth errors.
      if (err instanceof Error) {
        devTrace('Silent refresh error on mount:', {
          message: err.message,
          isNetworkError: err.message.includes('No connection') || err.message.includes('fetch'),
        });
      }
      setUser(parsed);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []); // Run ONCE on mount only.

  // Sync logout across browser tabs via storage events.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY && e.newValue === null) {
        setUser(null);
        if (typeof window !== 'undefined' && isProtectedPath(window.location.pathname)) {
          routerRef.current.push('/login?reason=expired');
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // ── Proactive background token refresh ───────────────────────────────
  // Refreshes the access token every 15 minutes while the user is active.
  // This prevents the JWT from silently expiring during long sessions where
  // the user is navigating but never triggers a 401 (e.g., reading pages
  // without making API calls). Without this, the auth_token cookie can
  // expire and the Next.js middleware redirects to /login?reason=expired
  // before the silent-refresh-on-401 mechanism has a chance to kick in.
  useEffect(() => {
    if (!user) return;

    const BACKGROUND_REFRESH_MS = 4 * 60 * 1000; // 4 minutes — keeps auth_token cookie fresh so Next.js middleware never sees an expired cookie during full-page navigations

    const interval = setInterval(async () => {
      // Skip if a refresh happened recently (e.g., from a 401 retry)
      let lastTs = 0;
      try { lastTs = parseInt(localStorage.getItem(REFRESH_TS_KEY) || '0', 10) || 0; } catch { /* SSR */ }
      if (Date.now() - lastTs < BACKGROUND_REFRESH_MS * 0.8) return;

      try {
        const result = await api.refresh();
        if (result === 'ok') {
          try { localStorage.setItem(REFRESH_TS_KEY, String(Date.now())); } catch { /* SSR */ }
        }
        // If refresh returns 'expired' or 'network_error', don't force logout —
        // the 401 handler will catch it on the next API call. This avoids
        // unnecessary logouts for transient network issues.
      } catch {
        // Network error — ignore; next API call will trigger refresh if needed.
      }
    }, BACKGROUND_REFRESH_MS);

    return () => clearInterval(interval);
  }, [user]);

  // Detect stale auth when a tab regains focus. Another tab may have logged
  // out (clearing the cookie) while this tab was backgrounded — the storage
  // event catches localStorage changes, but this handler also re-checks the
  // server session so we catch cookie-only expirations.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (!user) return;
      api.lifecycleHeartbeat({
        platform: 'web',
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'web',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        route: window.location.pathname,
      }).catch(() => {});
      // If localStorage was already cleared by another tab, fast-path out.
      try {
        if (!localStorage.getItem(USER_KEY)) {
          setUser(null);
          if (isProtectedPath(window.location.pathname)) {
            routerRef.current.push('/login?reason=expired');
          }
          return;
        }
      } catch { /* SSR safety */ }
      if (!isProtectedPath(window.location.pathname)) return;
      // Otherwise do a lightweight server check.
      api.getProfile(true).catch((err: unknown) => {
        // Profile fetch failed (likely 401) — the global unauthorized
        // handler will clean up and redirect. Log for debugging.
        if (err instanceof Error) {
          devTrace('Profile check failed on visibility change:', { message: err.message });
        }
      });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [user]);

  useEffect(() => {
    if (!user || !pathname) return;
    const sendHeartbeat = () => api.lifecycleHeartbeat({
      platform: 'web',
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || 'web',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      route: pathname,
    }).catch(() => {});

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 5 * 60 * 1000);
    return () => window.clearInterval(interval);
  }, [pathname, user]);

  // HIGH BUG FIX (H-9): wrap the four exposed functions in useCallback so
  // downstream consumers that depend on their identity (useEffect deps,
  // React.memo children) don't re-run on every AuthProvider re-render. These
  // are the stable surface of the context; we memoize them individually, then
  // wrap the provider value in useMemo below so the full object reference is
  // only recreated when something genuinely changed.
  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    const data = await api.login(email, password, rememberMe);
    const profile: User = {
      id: String(data.userId ?? data.id ?? email),
      name: data.fullName ?? data.name ?? email,
      email,
      plan: (data.plan as User['plan']) ?? 'free',
      planExpiresAt: data.planExpiresAt ?? null,
      referralCode: data.referralCode,
      isAdmin: data.isAdmin === true,
      // Round 23: server-side guided-setup completion + country locale
      // source. Login-response fields may be undefined for legacy
      // backends; null-coalesce to avoid writing `undefined` into
      // the cached profile JSON.
      setupCompletedAt: (data.setupCompletedAt as number | null | undefined) ?? null,
      country: (data.country as string | undefined) ?? undefined,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
    setRefreshToken(typeof data.refreshToken === 'string'
      ? data.refreshToken
      : (typeof data.refresh_token === 'string' ? data.refresh_token : null));
    _intentionalLogout = false; // BUG FIX: reset so expired-session redirect works after re-login
    setUser(profile);
    // Fire GA4 login event — analytics must never break auth.
    try { trackLogin('email'); } catch { /* GA4 may be blocked or unavailable */ }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, state: string, country: string, referralCode?: string, phoneNumber?: string) => {
    await api.signup(name, email, password, state, country, referralCode, phoneNumber);
    // Fire GA4 sign_up event. Backend also fires USER_SIGNED_UP; this covers
    // the client-side side of the funnel (e.g., for ads/attribution).
    try { trackSignUp('email'); } catch { /* GA4 may be blocked or unavailable */ }
    // Every Barakah signup auto-grants a 30-day Plus trial (see
    // AppSettingsService.getOnboardingTrialDefault). Fire the GA4
    // trial_started event here so paid-acquisition channels can report on
    // trial-start rates, not just sign-up rates — the gap between those
    // two numbers becomes the "email verification bounce" we track in the
    // admin funnel. Scoped via trackOnce so a signup → log-out → sign-up-
    // again flow doesn't double-count.
    try {
      trackOnce('trial_started', () =>
        trackTrialStarted('plus', DEFAULT_ONBOARDING_TRIAL_DAYS));
    } catch { /* GA4 may be blocked or unavailable */ }
  }, []);

  const logout = useCallback(async (reason?: 'logout' | 'deleted') => {
    _intentionalLogout = true;
    try {
      await api.logout();
    } catch (err: unknown) {
      // Ignore network errors on logout; log for debugging
      if (err instanceof Error) {
        devTrace('Logout API call failed (network error):', { message: err.message });
      }
    }
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TS_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    } catch {
      // localStorage access failed
    }
    setRefreshToken(null);
    setUser(null);
    const query = reason ? `?reason=${reason}` : '';
    routerRef.current.push(`/login${query}`);
  }, []);

  /** Refresh plan info from the server (call after a Stripe payment or upgrade). */
  const refreshPlan = useCallback(async () => {
    try {
      const data = await api.getProfile();
      if (data?.plan && user) {
        const updated: User = {
          ...user,
          plan: data.plan as User['plan'],
          planExpiresAt: data.planExpiresAt ?? null,
          isAdmin: data.isAdmin === true,
          setupCompletedAt: (data.setupCompletedAt as number | null | undefined) ?? user.setupCompletedAt ?? null,
          country: (data.country as string | undefined) ?? user.country,
        };
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(updated));
        } catch {
          // localStorage access failed, but continue with state update
        }
        setUser(updated);
      }
    } catch (err: unknown) {
      // Silent failure — could be offline or auth error
      if (err instanceof Error) {
        devTrace('Plan refresh failed:', { message: err.message });
      }
    }
  }, [user]);

  // HIGH BUG FIX (H-9): memoize the context value so it only changes when one
  // of its parts does. Previously we passed an inline object literal to
  // AuthContext.Provider, which re-instantiated the identity on every render
  // and forced every consumer to rerender even when user/isLoading hadn't
  // changed.
  const value = useMemo(
    () => ({ user, login, signup, logout, isLoading, refreshPlan }),
    [user, isLoading, login, signup, logout, refreshPlan],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

/** Returns true if the user's plan meets the minimum required plan.
 *  Also checks planExpiresAt — if the subscription has expired, treat as free.
 *  NOTE: The backend stores planExpiresAt as epoch SECONDS (from Stripe). */
export function hasAccess(
  userPlan: string | undefined,
  required: 'plus' | 'family',
  planExpiresAt?: string | number | null
): boolean {
  if (!userPlan || userPlan === 'free') return false;
  // If planExpiresAt is set and in the past, subscription has lapsed
  if (planExpiresAt) {
    let expiryMs: number;
    if (typeof planExpiresAt === 'number') {
      // Backend returns epoch seconds (from Stripe) — convert to milliseconds.
      // Epoch seconds for years 2001–2286 stay under 10 billion; millis are always above.
      const EPOCH_SECONDS_MAX = 10_000_000_000;
      expiryMs = planExpiresAt < EPOCH_SECONDS_MAX ? planExpiresAt * 1000 : planExpiresAt;
    } else {
      expiryMs = new Date(planExpiresAt).getTime();
    }
    if (expiryMs > 0 && expiryMs < Date.now()) return false;
  }
  if (required === 'plus') return userPlan === 'plus' || userPlan === 'family';
  if (required === 'family') return userPlan === 'family';
  return false;
}
