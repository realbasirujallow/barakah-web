'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

// ── Configuration ──────────────────────────────────────────────────────────
const SESSION_TIMEOUT_MS  = 60 * 60 * 1000; // 60 minutes (1 hour idle timeout)
const WARNING_BEFORE_MS   =  5 * 60 * 1000; // Show warning 5 minutes before timeout
const WARNING_AT_MS       = SESSION_TIMEOUT_MS - WARNING_BEFORE_MS; // 55 minutes
const ACTIVITY_EVENTS     = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'] as const;
const THROTTLE_MS         = 60_000; // Only update activity timestamp once per minute

const LAST_ACTIVITY_KEY = 'last_activity_ts';

/**
 * SessionTimeoutModal — tracks user inactivity and shows a countdown modal
 * at 55 minutes. If the user doesn't extend, they're logged out at 60 minutes.
 * Extending the session calls api.refresh() to keep the server-side cookies alive.
 */
export function SessionTimeoutModal() {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_BEFORE_MS / 1000); // seconds remaining
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const logoutDeadlineRef = useRef<number | null>(null);
  const throttleRef     = useRef(0);

  const readLastActivity = useCallback(() => {
    try {
      const stored = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
      return stored > 0 ? stored : Date.now();
    } catch {
      return Date.now();
    }
  }, []);

  // ── Reset all timers ───────────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current)  clearTimeout(logoutTimerRef.current);
    if (countdownRef.current)    clearInterval(countdownRef.current);
    warningTimerRef.current = null;
    logoutTimerRef.current  = null;
    countdownRef.current    = null;
    logoutDeadlineRef.current = null;
  }, []);

  const scheduleFromActivity = useCallback((lastActivityTs: number) => {
    clearAllTimers();
    const now = Date.now();
    const elapsed = now - lastActivityTs;
    const remainingUntilWarning = WARNING_AT_MS - elapsed;
    const remainingUntilLogout = SESSION_TIMEOUT_MS - elapsed;

    if (remainingUntilLogout <= 0) {
      setShowWarning(false);
      logout('logout');
      return;
    }

    if (remainingUntilWarning <= 0) {
      setShowWarning(true);
      logoutDeadlineRef.current = now + remainingUntilLogout;
      setCountdown(Math.max(0, Math.ceil(remainingUntilLogout / 1000)));

      countdownRef.current = setInterval(() => {
        const deadline = logoutDeadlineRef.current;
        if (!deadline) return;
        const nextSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        setCountdown(nextSeconds);
      }, 1000);

      logoutTimerRef.current = setTimeout(() => {
        const latestActivity = readLastActivity();
        if (Date.now() - latestActivity < SESSION_TIMEOUT_MS) {
          setShowWarning(false);
          scheduleFromActivity(latestActivity);
          return;
        }
        setShowWarning(false);
        logout('logout');
      }, remainingUntilLogout);
      return;
    }

    setShowWarning(false);
    warningTimerRef.current = setTimeout(() => {
      const latestActivity = readLastActivity();
      scheduleFromActivity(latestActivity);
    }, remainingUntilWarning);
  }, [clearAllTimers, logout, readLastActivity]);

  const persistActivity = useCallback((ts: number) => {
    try {
      localStorage.setItem(LAST_ACTIVITY_KEY, String(ts));
    } catch {
      // localStorage unavailable
    }
  }, []);

  // ── Handle user activity ───────────────────────────────────────────────
  const handleActivity = useCallback(() => {
    // Don't reset if warning is already visible (user must click the button)
    if (showWarning) return;

    // Throttle: only reset timers once per minute to avoid performance impact
    const now = Date.now();
    if (now - throttleRef.current < THROTTLE_MS) return;
    throttleRef.current = now;

    persistActivity(now);
    scheduleFromActivity(now);
  }, [persistActivity, scheduleFromActivity, showWarning]);

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

    const now = Date.now();
    persistActivity(now);
    scheduleFromActivity(now);
  }, [clearAllTimers, persistActivity, scheduleFromActivity]);

  // ── Set up activity listeners ──────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    // Force-reset activity timestamp on login to prevent stale-timestamp logout loop.
    // The login function sets this too, but React batching can cause the effect to
    // read a stale value. Writing it here guarantees freshness.
    const now = Date.now();
    persistActivity(now);
    scheduleFromActivity(now);

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
      if (e.key === LAST_ACTIVITY_KEY && e.newValue) {
        const syncedTs = parseInt(e.newValue, 10);
        if (syncedTs > 0) {
          setShowWarning(false);
          scheduleFromActivity(syncedTs);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [scheduleFromActivity]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !user) return;
      scheduleFromActivity(readLastActivity());
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [readLastActivity, scheduleFromActivity, user]);

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
          For your security, inactive sessions are automatically ended after 45 minutes.
        </p>
      </div>
    </div>
  );
}
