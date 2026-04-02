'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

// ── Configuration ──────────────────────────────────────────────────────────
const SESSION_TIMEOUT_MS  = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS   =  5 * 60 * 1000; // Show warning 5 minutes before timeout
const WARNING_AT_MS       = SESSION_TIMEOUT_MS - WARNING_BEFORE_MS; // 25 minutes
const ACTIVITY_EVENTS     = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'] as const;
const THROTTLE_MS         = 60_000; // Only update activity timestamp once per minute

const LAST_ACTIVITY_KEY = 'last_activity_ts';

/**
 * SessionTimeoutModal — tracks user inactivity and shows a countdown modal
 * at 25 minutes. If the user doesn't extend, they're logged out at 30 minutes.
 * Extending the session calls api.refresh() to keep the server-side cookies alive.
 */
export function SessionTimeoutModal() {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_BEFORE_MS / 1000); // seconds remaining
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef(Date.now());
  const throttleRef     = useRef(0);

  // ── Reset all timers ───────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current)  clearTimeout(logoutTimerRef.current);
    if (countdownRef.current)    clearInterval(countdownRef.current);
    warningTimerRef.current = null;
    logoutTimerRef.current  = null;
    countdownRef.current    = null;
  }, []);

  // ── Start the idle timers from now ─────────────────────────────────────
  const startTimers = useCallback(() => {
    clearAllTimers();
    const now = Date.now();
    lastActivityRef.current = now;
    try { localStorage.setItem(LAST_ACTIVITY_KEY, String(now)); } catch { /* SSR safety */ }

    // Timer 1: show warning at 25 minutes
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(WARNING_BEFORE_MS / 1000);

      // Start the 1-second countdown display
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);

      // Timer 2: auto-logout at 30 minutes (5 min after warning)
      logoutTimerRef.current = setTimeout(() => {
        setShowWarning(false);
        logout('logout');
      }, WARNING_BEFORE_MS);
    }, WARNING_AT_MS);
  }, [clearAllTimers, logout]);

  // ── Handle user activity ───────────────────────────────────────────────
  const handleActivity = useCallback(() => {
    // Don't reset if warning is already visible (user must click the button)
    if (showWarning) return;

    // Throttle: only reset timers once per minute to avoid performance impact
    const now = Date.now();
    if (now - throttleRef.current < THROTTLE_MS) return;
    throttleRef.current = now;

    startTimers();
  }, [showWarning, startTimers]);

  // ── Extend session (user clicked "Stay Logged In") ────────────────────
  const extendSession = useCallback(async () => {
    setShowWarning(false);
    clearAllTimers();

    try {
      // Refresh the server-side session cookies
      await api.refresh();
      try {
        localStorage.setItem('last_refresh_ts', String(Date.now()));
      } catch { /* SSR safety */ }
    } catch {
      // Refresh failed — session may already be expired
    }

    startTimers();
  }, [clearAllTimers, startTimers]);

  // ── Set up activity listeners ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    // Check if there's a recent activity timestamp (e.g. from another tab)
    try {
      const stored = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
      if (stored > 0) {
        const elapsed = Date.now() - stored;
        if (elapsed >= SESSION_TIMEOUT_MS) {
          // Already timed out while away
          logout('logout');
          return;
        }
      }
    } catch { /* SSR safety */ }

    startTimers();

    // Attach activity listeners
    const handler = () => handleActivity();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, handler, { passive: true });
    }

    return () => {
      clearAllTimers();
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, handler);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Re-run when user changes (login/logout)

  // Sync across tabs: if activity happens in another tab, pick it up
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LAST_ACTIVITY_KEY && e.newValue && !showWarning) {
        startTimers();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [showWarning, startTimers]);

  // Don't render anything if user isn't logged in or warning isn't showing
  if (!user || !showWarning) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">⏰</div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Session Expiring Soon
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-4">
          Your session will expire due to inactivity. You&apos;ll be signed out in:
        </p>

        {/* Countdown */}
        <div className="text-3xl font-bold text-[#1B5E20] mb-6 font-mono">
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={extendSession}
            className="px-6 py-3 bg-[#1B5E20] text-white rounded-xl font-semibold hover:bg-[#155016] transition-colors"
          >
            Stay Logged In
          </button>
          <button
            onClick={() => { setShowWarning(false); logout('logout'); }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          For your security, inactive sessions are automatically ended after 30 minutes.
        </p>
      </div>
    </div>
  );
}
