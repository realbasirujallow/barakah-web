'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, setUnauthorizedHandler } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, state: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// localStorage key for the non-sensitive user profile (name, email, id).
// The JWT itself is stored exclusively in an httpOnly cookie — never in
// localStorage — so JavaScript (including any XSS payload) cannot read it.
const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore user profile from localStorage on mount so the sidebar can show
  // the user's name without a round-trip. The JWT is in the httpOnly cookie
  // and is sent automatically by the browser — we never read it here.
  //
  // If the stored profile exists but the access cookie has expired (e.g. the
  // user left the tab open overnight), we silently attempt a token refresh
  // before deciding whether to keep the session or redirect to login.
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);

    // Register a global 401 handler. When any API call receives 401 AND the
    // silent refresh inside api.ts also fails, clear local state and redirect.
    // (The refresh retry in api.ts runs first — this only fires as a last resort.)
    setUnauthorizedHandler(() => {
      localStorage.removeItem(USER_KEY);
      setUser(null);
      router.push('/login');
    });

    if (!savedUser) {
      // No saved profile → definitely not logged in
      setIsLoading(false);
      return;
    }

    // We have a saved profile. Validate the session by proactively refreshing
    // the access token. This handles the "page reloaded after the 24h JWT
    // expired but the 30-day refresh token is still valid" case.
    let parsed: typeof user | null = null;
    try {
      parsed = JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(USER_KEY);
      setIsLoading(false);
      return;
    }

    // Try a silent refresh. If it succeeds the server has rotated both cookies.
    // If it fails (refresh token also expired) we clear the stale profile.
    api.refresh().then((ok: boolean) => {
      if (ok) {
        setUser(parsed);
      } else {
        // Both tokens expired — clean up and let the guard redirect to /login
        localStorage.removeItem(USER_KEY);
        setUser(null);
      }
      setIsLoading(false);
    }).catch(() => {
      // Network error on mount — keep the stale profile so offline mode still
      // shows the dashboard; the 401 handler will fire on the next real API call.
      setUser(parsed);
      setIsLoading(false);
    });
  }, [router]);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    // The server sets the auth_token httpOnly cookie automatically in the
    // Set-Cookie response header. We only store the non-sensitive profile
    // here for UI display (sidebar name, greeting).
    const profile: User = {
      id: String(data.userId ?? data.id ?? email),
      name: data.fullName ?? data.name ?? email,
      email,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const signup = async (name: string, email: string, password: string, state: string) => {
    // Backend requires email verification before login — no session created here.
    await api.signup(name, email, password, state);
  };

  const logout = () => {
    // Tell the server to clear the httpOnly cookie. Fire-and-forget — we
    // navigate away immediately regardless of the server response.
    api.logout().catch(() => { /* ignore network errors on logout */ });
    localStorage.removeItem(USER_KEY);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
