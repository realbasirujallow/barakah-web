'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { isSafeInternalPath } from '../../../lib/safePath';

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.getNotifications(p);
      if (data?.error) {
        // BUG FIX: surface API-level errors instead of silently returning.
        // Round 18: also clear the notification list so users don't see a
        // stale page-2 list under a "Failed to load page 3" error.
        setLoadError(String(data.error));
        setNotifications([]);
        return;
      }
      setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
      setUnreadCount(data?.unreadCount || 0);
      setTotalPages(data?.totalPages || 1);
      setPage(p);
    } catch {
      // BUG FIX: show error UI instead of silently swallowing — the user is
      // on the notifications page specifically to read these.
      setLoadError('Failed to load notifications. Please try again.');
      setNotifications([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(0); }, [load]);

  const markRead = async (id: number) => {
    // Snapshot state for rollback
    const prevNotifications = notifications;
    const prevUnread = unreadCount;
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    try {
      await api.markNotificationRead(id);
    } catch {
      // Roll back on failure
      setNotifications(prevNotifications);
      setUnreadCount(prevUnread);
      toast('Failed to mark notification as read', 'error');
    }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // BUG FIX: show toast instead of silent console.warn
      toast('Failed to mark all as read', 'error');
    }
  };

  const deleteOne = async (id: number) => {
    // Snapshot state for rollback
    const prevNotifications = notifications;
    const prevUnread = unreadCount;
    // Optimistic update
    const removed = notifications.find(n => n.id === id);
    if (removed && !removed.read) setUnreadCount(c => Math.max(0, c - 1));
    setNotifications(prev => prev.filter(n => n.id !== id));
    try {
      await api.deleteNotification(id);
    } catch {
      // Roll back on failure
      setNotifications(prevNotifications);
      setUnreadCount(prevUnread);
      toast('Failed to delete notification', 'error');
    }
  };

  const fmtTime = (ts: number) => {
    const ms = ts < 1e12 ? ts * 1000 : ts;
    const d = new Date(ms);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B5E20]">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500 mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} className="text-sm text-[#1B5E20] border border-[#1B5E20] px-3 py-1.5 rounded-lg hover:bg-green-50 transition">
            Mark all read
          </button>
        )}
      </div>

      {loadError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={() => load(page)}
            className="text-sm font-semibold text-red-700 underline hover:no-underline flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
        </div>
      ) : !loadError && notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔔</p>
          <p>No notifications yet. We&apos;ll let you know when something needs your attention.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const icon = TYPE_ICONS[n.type] || '🔔';
            const rowClass = `bg-white rounded-xl p-4 flex gap-4 cursor-pointer hover:shadow-md transition group ${!n.read ? 'border-l-4 border-[#1B5E20]' : ''}`;
            const inner = (
              <>
                <span className="text-2xl flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                  {n.body && <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>}
                  <p className="text-xs text-gray-400 mt-1">{fmtTime(n.createdAt)}</p>
                </div>
                <div className="flex items-start gap-2">
                  {!n.read && <div className="w-2.5 h-2.5 bg-[#1B5E20] rounded-full mt-1.5 flex-shrink-0" />}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteOne(n.id); }}
                    className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-sm"
                  >✕</button>
                </div>
              </>
            );
            return isSafeInternalPath(n.link) ? (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => { if (!n.read) markRead(n.id); }}
                className={rowClass}
              >
                {inner}
              </Link>
            ) : (
              // Round 19: changed from <div onClick> to <button> so
              // keyboard users can focus and activate notifications
              // without a link. Styling with text-align:left keeps the
              // existing row layout.
              <button
                type="button"
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`${rowClass} w-full text-left`}
              >
                {inner}
              </button>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button type="button" onClick={() => load(page - 1)} disabled={page === 0}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">← Prev</button>
          <span className="px-4 py-2 text-sm text-gray-600">{page + 1} / {totalPages}</span>
          <button type="button" onClick={() => load(page + 1)} disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">Next →</button>
        </div>
      )}
    </div>
  );
}
