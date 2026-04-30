'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../../lib/api';
import { isSafeInternalPath } from '../../lib/safePath';
import Link from 'next/link';

interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

const TYPE_ICONS: Record<string, string> = {
  bill_due:           '🔔',
  hawl_complete:      '⏰',
  wasiyyah_reminder:  '📜',
  budget_alert:       '📊',
  savings_milestone:  '🎯',
  zakat_due:          '🕌',
  system:             'ℹ️',
  general:            '🔔',
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnread = useCallback(async () => {
    try {
      const data = await api.getUnreadNotifications();
      setUnreadCount(data?.count || 0);
      if (data?.notifications) setNotifications(data.notifications);
    } catch {
      // Silent error handling — notifications not critical to app functionality
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications(0);
      setNotifications(data?.notifications || []);
      setUnreadCount(data?.unreadCount || 0);
    } catch {
      // Silent error handling — notifications not critical to app functionality
    }
    finally { setLoading(false); }
  }, []);

  // Polling the notifications endpoint is a true "subscribe to an external
  // system" effect (the network). The react-hooks/set-state-in-effect rule
  // is intentionally disabled project-wide under `src/app/**` and
  // `src/components/**` (see eslint.config.mjs) — the rule targets sync
  // state derivations in effects, not async-resolved network fetches.
  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 2 * 60 * 1000); // every 2 min
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    if (open) fetchAll();
  }, [open, fetchAll]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Round 22: Escape key closes the dropdown. Only listen while open so
  // we don't hold a global listener for a component most users never
  // interact with.
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const markRead = async (id: number) => {
    const prevNotifications = notifications;
    const prevUnread = unreadCount;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.markNotificationRead(id);
    } catch {
      setNotifications(prevNotifications);
      setUnreadCount(prevUnread);
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Silent error handling — read status not critical
    }
  };

  const deleteOne = async (id: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const prevNotifications = notifications;
    const prevUnread = unreadCount;
    const removed = notifications.find(n => n.id === id);
    if (removed && !removed.read) setUnreadCount(c => Math.max(0, c - 1));
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNotification(id);
    } catch {
      setNotifications(prevNotifications);
      setUnreadCount(prevUnread);
    }
  };

  // Snapshot "now" once per render so the set of fmtTime() calls within a
  // single paint agree with each other (all notifications compare against the
  // same moment). "5m ago" style relative times are *supposed* to reflect
  // time-of-render; React's concurrent re-renders landing slightly different
  // `now` values is harmless here (they'd be off by ms, not minutes).
  const now = Date.now();
  const fmtTime = (ts: number) => {
    const ms = ts < 1e12 ? ts * 1000 : ts;
    const d = new Date(ms);
    const diff = now - ms;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    // Round 23: undefined locale → browser default. See useCurrency.
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-primary transition"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <title>Notifications</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-gray-800 text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary hover:underline font-medium">
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p className="text-2xl mb-2">🔔</p>
                <p className="text-sm">No notifications yet</p>
              </div>
            )}

            {!loading && notifications.map(n => {
              const icon = TYPE_ICONS[n.type] || '🔔';
              const inner = (
                <>
                  <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'} truncate`}>{n.title}</p>
                    {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-xs text-gray-400 mt-1">{fmtTime(n.createdAt)}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                </>
              );
              // Round 22: same nested-interactive fix as notifications
              // page. Row is a `<div>` container; the activation is a
              // Link or button; the delete button is an absolute-
              // positioned sibling. Prior nesting was invalid HTML
              // (button inside button/a) and non-keyboard-focusable
              // on the no-link fallback.
              const rowClass = `flex gap-3 border-b border-gray-50 hover:bg-gray-50 transition group relative ${!n.read ? 'bg-green-50/40' : ''}`;
              const activationClass = 'flex flex-1 gap-3 px-4 py-3 pr-8 cursor-pointer text-left';

              const activation = isSafeInternalPath(n.link) ? (
                <Link
                  href={n.link}
                  className={activationClass}
                  onClick={() => { markRead(n.id); setOpen(false); }}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  type="button"
                  className={activationClass}
                  onClick={() => { markRead(n.id); setOpen(false); }}
                >
                  {inner}
                </button>
              );

              return (
                <div key={n.id} className={rowClass}>
                  {activation}
                  <button
                    type="button"
                    onClick={(e) => deleteOne(n.id, e)}
                    aria-label="Delete notification"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-300 hover:text-red-400 transition text-xs p-0.5"
                  >✕</button>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboard/notifications"
            className="block text-center py-3 text-xs text-primary font-medium hover:bg-green-50 transition border-t border-gray-100"
            onClick={() => setOpen(false)}
          >
            View all notifications →
          </Link>
        </div>
      )}
    </div>
  );
}
