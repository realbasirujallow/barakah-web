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
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, state: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount, and register a global 401
  // handler so any expired-JWT response automatically clears the session and
  // redirects to the login page.
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);

    // Register 401 handler — fires whenever apiFetch / apiDownload gets a 401
    setUnauthorizedHandler(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      router.push('/login');
    });
  }, [router]);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId || data.id || email);
    localStorage.setItem('user', JSON.stringify({ id: data.userId || data.id, name: data.name || email, email }));
    setToken(data.token);
    setUser({ id: data.userId || data.id, name: data.name || email, email });
  };

  const signup = async (name: string, email: string, password: string, state: string) => {
    const data = await api.signup(name, email, password, state);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId || data.id || email);
    localStorage.setItem('user', JSON.stringify({ id: data.userId || data.id, name, email, state }));
    setToken(data.token);
    setUser({ id: data.userId || data.id, name, email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
