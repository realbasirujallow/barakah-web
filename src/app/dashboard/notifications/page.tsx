'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';

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
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await api.getNotifications(p);
      setNotifications(data?.notifications || []);
      setUnreadCount(data?.unreadCount || 0);
      setTotalPages(data?.totalPages || 1);
      setPage(p);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(0); }, [load]);

  const markRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  };

  const deleteOne = async (id: number) => {
    try {
      await api.deleteNotification(id);
      const removed = notifications.find(n => n.id === id);
      if (removed && !removed.read) setUnreadCount(c => Math.max(0, c - 1));
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch { /* silent */ }
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
          <h1 className="text-2xl font-bold text-[#1B5E20]">🔔 Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500 mt-1">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} className="text-sm text-[#1B5E20] border border-[#1B5E20] px-3 py-1.5 rounded-lg hover:bg-green-50 transition">
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🔔</p>
          <p>No notifications yet. We&apos;ll let you know when something needs your attention.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const icon = TYPE_ICONS[n.type] || '🔔';
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`bg-white rounded-xl p-4 flex gap-4 cursor-pointer hover:shadow-md transition group ${!n.read ? 'border-l-4 border-[#1B5E20]' : ''}`}
              >
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
                    onClick={(e) => { e.stopPropagation(); deleteOne(n.id); }}
                    className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-sm"
                  >✕</button>
                </div>
              </div>
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
