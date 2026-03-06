'use client';
import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setUnauthorizedHandler } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'plus' | 'family';
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, state: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  /** Call after a plan change to refresh plan from /auth/profile */
  refreshPlan: () => Promise<void>;
}

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
  // This is important: the effect must only run ONCE on mount to avoid
  // triggering redundant refresh calls on every in-app navigation.
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    // Register a global 401 handler. When any API call receives 401 AND the
    // silent refresh inside api.ts also fails, clear local state and redirect.
    // Uses routerRef so we always have the latest router without re-running
    // this effect on every navigation.
    setUnauthorizedHandler(() => {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REFRESH_TS_KEY);
      setUser(null);
      routerRef.current.push('/login');
    });

    if (!savedUser) {
      // No saved profile → definitely not logged in
      setIsLoading(false);
      return;
    }

    // We have a saved profile. Validate the session by proactively refreshing
    // the access token. This handles the "page reloaded after the 24h JWT
    // expired but the 30-day refresh token is still valid" case.
    let parsed: User | null = null;
    try {
      parsed = JSON.parse(savedUser);
      // Ensure plan has a default for profiles saved before plan was added
      if (parsed && !parsed.plan) parsed.plan = 'free';
    } catch {
      localStorage.removeItem(USER_KEY);
      setIsLoading(false);
      return;
    }

    // Guard against duplicate refresh calls.
    //
    // Two scenarios this protects against:
    //  1. Duplicate tabs: two tabs opening simultaneously both call /auth/refresh.
    //     If the server uses single-use rotation the second call fails → sign-out.
    //  2. In-app navigation: navigating between dashboard pages should NOT
    //     trigger repeated proactive refreshes. apiFetch handles 401s itself
    //     (silent refresh + retry), and it updates last_refresh_ts when it
    //     does so. This guard prevents AuthContext from racing with apiFetch.
    //
    // Window is 5 minutes — long enough to cover normal browsing sessions
    // and short enough that a real re-mount (new tab, F5) still validates.
    const lastRefreshTs = parseInt(localStorage.getItem(REFRESH_TS_KEY) || '0', 10);
    const secondsSinceRefresh = (Date.now() - lastRefreshTs) / 1000;

    if (secondsSinceRefresh < REFRESH_GUARD_SECONDS) {
      // A refresh happened recently (either on mount or via apiFetch silent
      // refresh). Trust the existing httpOnly cookie and skip the round-trip.
      setUser(parsed);
      setIsLoading(false);
      return;
    }

    // Try a silent refresh. If it succeeds the server has rotated both cookies.
    // If it fails (refresh token also expired) we clear the stale profile.
    api.refresh().then((ok: boolean) => {
      if (ok) {
        // Stamp the refresh time so other tabs / apiFetch skip redundant
        // refreshes within the guard window.
        localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
        setUser(parsed);
      } else {
        // Both tokens expired — clean up and let the guard redirect to /login
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REFRESH_TS_KEY);
        setUser(null);
      }
      setIsLoading(false);
    }).catch(() => {
      // Network error on mount — keep the stale profile so offline mode still
      // shows the dashboard; the 401 handler will fire on the next real API call.
      setUser(parsed);
      setIsLoading(false);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount only. routerRef keeps the redirect callback fresh.
          // Adding router here would re-run auth checks on every navigation,
          // causing refresh token rotation races and spurious sign-outs.

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    // The server sets the auth_token httpOnly cookie automatically in the
    // Set-Cookie response header. We only store the non-sensitive profile
    // here for UI display (sidebar name, greeting).
    const profile: User = {
      id: String(data.userId ?? data.id ?? email),
      name: data.fullName ?? data.name ?? email,
      email,
      plan: (data.plan as User['plan']) ?? 'free',
      referralCode: data.referralCode,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    // Stamp the refresh time on login so the mount guard is satisfied
    // for any tabs opened shortly after.
    localStorage.setItem(REFRESH_TS_KEY, String(Date.now()));
    setUser(profile);
  };

  const signup = async (name: string, email: string, password: string, state: string, referralCode?: string) => {
    // Backend requires email verification before login — no session created here.
    await api.signup(name, email, password, state, referralCode);
  };

  const logout = () => {
    // Tell the server to clear the httpOnly cookie. Fire-and-forget — we
    // navigate away immediately regardless of the server response.
    api.logout().catch(() => { /* ignore network errors on logout */ });
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REFRESH_TS_KEY);
    setUser(null);
    routerRef.current.push('/login');
  };

  /** Refresh plan info from the server (call after a Stripe payment or upgrade). */
  const refreshPlan = async () => {
    try {
      const data = await api.getProfile();
      if (data?.plan && user) {
        const updated: User = { ...user, plan: data.plan as User['plan'] };
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

/** Returns true if the user's plan meets the minimum required plan. */
export function hasAccess(userPlan: string | undefined, required: 'plus' | 'family'): boolean {
  if (!userPlan || userPlan === 'free') return false;
  if (required === 'plus') return userPlan === 'plus' || userPlan === 'family';
  if (required === 'family') return userPlan === 'family';
  return false;
}
