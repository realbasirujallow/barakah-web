'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setUnauthorizedHandler } from '../lib/api';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, state: string, referralCode?: string) => Promise<void>;
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
// Extended to 5 minutes to prevent multiple navigations from triggering
// redundant refresh calls that race with each other.
export const REFRESH_TS_KEY = 'last_refresh_ts';
const REFRESH_GUARD_SECONDS = 300; // 5 minutes

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Keep a ref to router so the unauthorized handler always has the latest
  // reference without needing to be in the effect's dependency array.
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    let savedUser: string | null = null;
    try {
      savedUser = localStorage.getItem(USER_KEY);
    } catch {
      // localStorage is disabled (SSR context, private browsing, etc.)
      setIsLoading(false);
      return;
    }

    // Register a global 401 handler.
    setUnauthorizedHandler(() => {
      try {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REFRESH_TS_KEY);
      } catch {
        // localStorage access failed, continue with cleanup
      }
      setUser(null);
      routerRef.current.push('/login?reason=expired');
    });

    if (!savedUser) {
      setIsLoading(false);
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
      setIsLoading(false);
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
        setUser(parsed);
        setIsLoading(false);
      }
      return;
    }

    // Try a silent refresh. If it succeeds the server has rotated both cookies.
    api.refresh().then(async (ok: boolean) => {
      if (ok) {
        try {
          localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
        } catch {
          // localStorage access failed
        }
        // If plan was missing, fetch the real one now that the session is fresh.
        const finalUser = planMissing ? await syncPlan(parsed!) : parsed!;
        setUser(finalUser);
      } else {
        try {
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(REFRESH_TS_KEY);
        } catch {
          // localStorage access failed
        }
        setUser(null);
      }
      setIsLoading(false);
    }).catch(() => {
      // Network error on mount — keep stale profile for offline mode.
      setUser(parsed);
      setIsLoading(false);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount only.

  // Sync logout across browser tabs via storage events.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY && e.newValue === null) {
        setUser(null);
        routerRef.current.push('/login?reason=expired');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Detect stale auth when a tab regains focus. Another tab may have logged
  // out (clearing the cookie) while this tab was backgrounded — the storage
  // event catches localStorage changes, but this handler also re-checks the
  // server session so we catch cookie-only expirations.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      // If localStorage was already cleared by another tab, fast-path out.
      try {
        if (!localStorage.getItem(USER_KEY)) {
          setUser(null);
          routerRef.current.push('/login?reason=expired');
          return;
        }
      } catch { /* SSR safety */ }
      // Otherwise do a lightweight server check.
      api.getProfile().catch(() => {
        // Profile fetch failed (likely 401) — the global unauthorized
        // handler will clean up and redirect.
      });
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
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
    setUser(profile);
  };

  const signup = async (name: string, email: string, password: string, state: string, referralCode?: string) => {
    await api.signup(name, email, password, state, referralCode);
  };

  const logout = async (reason?: 'logout' | 'deleted') => {
    _intentionalLogout = true;
    try { await api.logout(); } catch { /* ignore network errors on logout */ }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REFRESH_TS_KEY);
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
        localStorage.setItem(USER_KEY, JSON.stringify(updated));
        setUser(updated);
      }
    } catch { /* silent */ }
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
