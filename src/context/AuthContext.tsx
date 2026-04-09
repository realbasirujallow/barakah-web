'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api, setUnauthorizedHandler, setRefreshToken, setAccessToken } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'plus' | 'family';
  planExpiresAt?: number | null;
  referralCode?: string;
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
    const finishLoading = () => {
      window.setTimeout(() => setIsLoading(false), 0);
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
      // Clear in-memory + persisted tokens
      setRefreshToken(null);
      setAccessToken(null);
      try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REFRESH_TS_KEY);
        localStorage.removeItem('last_activity_ts');
      } catch {
        // localStorage access failed, continue with cleanup
      }
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

    // Detect stale cached profiles that are missing the plan field.
    // This happens when a user logged in before `plan` was added to the
    // login response. We MUST NOT default to 'free' here — doing so would
    // block plus/family users from accessing their paid features. Instead,
    // we fetch the real plan from /auth/profile after session validation.
    const planMissing = parsed != null && !parsed.plan;
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
        const data = await api.getProfile();
        if (data?.plan) {
          const updated: User = { ...u, plan: data.plan as User['plan'], planExpiresAt: data.planExpiresAt ?? null };
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
      // Session cookies are fresh. If the plan was missing, fetch it now so
      // plus/family users aren't incorrectly locked out.
      if (planMissing) {
        syncPlan(parsed!).then(u => {
          setUser(u);
          setIsLoading(false);
        });
      } else {
        window.setTimeout(() => {
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
    api.refresh().then(async (result: 'ok' | 'expired' | 'network_error') => {
      if (result === 'ok') {
        try {
          localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
        } catch {
          // localStorage access failed
        }
        // If plan was missing, fetch the real one now that the session is fresh.
        const finalUser = planMissing ? await syncPlan(parsed!) : parsed!;
        setUser(finalUser);
      } else if (result === 'expired') {
        // Proactive refresh returned 'expired'. This does NOT necessarily mean
        // the session is dead — the auth_token cookie may still be valid. Don't
        // logout here; instead, verify with a lightweight server call (getProfile).
        // If getProfile succeeds → auth_token is valid, keep user logged in.
        // If getProfile fails with 401 → the 401 handler in apiFetch will trigger
        // the real logout flow.
        console.debug('Proactive refresh returned expired — verifying auth_token with profile check');
        try {
          const data = await api.getProfile();
          if (data?.plan && parsed) {
            const updated: User = { ...parsed, plan: data.plan as User['plan'], planExpiresAt: data.planExpiresAt ?? null };
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
      // Network error on mount (offline) — keep stale profile for offline mode.
      // Log error for debugging: distinguish network errors from auth errors.
      if (err instanceof Error) {
        console.debug('Silent refresh error on mount:', {
          message: err.message,
          isNetworkError: err.message.includes('No connection') || err.message.includes('fetch'),
        });
      }
      setUser(parsed);
      setIsLoading(false);
    });
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
      api.getProfile().catch((err: unknown) => {
        // Profile fetch failed (likely 401) — the global unauthorized
        // handler will clean up and redirect. Log for debugging.
        if (err instanceof Error) {
          console.debug('Profile check failed on visibility change:', { message: err.message });
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

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    const data = await api.login(email, password, rememberMe);
    const profile: User = {
      id: String(data.userId ?? data.id ?? email),
      name: data.fullName ?? data.name ?? email,
      email,
      plan: (data.plan as User['plan']) ?? 'free',
      planExpiresAt: data.planExpiresAt ?? null,
      referralCode: data.referralCode,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
    // Store tokens in localStorage — CDN strips Set-Cookie headers so httpOnly
    // cookies never reach the browser. Both tokens are persisted client-side.
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    if (data.token) {
      setAccessToken(data.token);
    }
    setUser(profile);
  };

  const signup = async (name: string, email: string, password: string, state: string, country: string, referralCode?: string, phoneNumber?: string) => {
    await api.signup(name, email, password, state, country, referralCode, phoneNumber);
  };

  const logout = async (reason?: 'logout' | 'deleted') => {
    _intentionalLogout = true;
    // Clear in-memory tokens
    setRefreshToken(null);
    setAccessToken(null);
    try {
      await api.logout();
    } catch (err: unknown) {
      // Ignore network errors on logout; log for debugging
      if (err instanceof Error) {
        console.debug('Logout API call failed (network error):', { message: err.message });
      }
    }
    try {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TS_KEY);
      localStorage.removeItem('last_activity_ts');
    } catch {
      // localStorage access failed
    }
    setUser(null);
    const query = reason ? `?reason=${reason}` : '';
    routerRef.current.push(`/login${query}`);
  };

  /** Refresh plan info from the server (call after a Stripe payment or upgrade). */
  const refreshPlan = async () => {
    try {
      const data = await api.getProfile();
      if (data?.plan && user) {
        const updated: User = { ...user, plan: data.plan as User['plan'], planExpiresAt: data.planExpiresAt ?? null };
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
        console.debug('Plan refresh failed:', { message: err.message });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, refreshPlan }}>
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
