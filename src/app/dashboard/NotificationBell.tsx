'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../../lib/api';

interface Notification {
  id: string;
  icon: string;
  title: string;
  body: string;
  type: 'zakat' | 'bill' | 'hawl' | 'budget' | 'general';
  href?: string;
  read: boolean;
}

const STORAGE_KEY = 'barakah_web_notifications';
const LAST_FETCH_KEY = 'barakah_notif_last_fetch';

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadStored(): Notification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveStored(items: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 30)));
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = useCallback(async () => {
    // Only fetch once per day to avoid annoying the user
    const today = getTodayKey();
    const lastFetch = localStorage.getItem(LAST_FETCH_KEY);
    if (lastFetch === today) {
      setNotifications(loadStored());
      return;
    }

    const items: Notification[] = [];

    try {
      // Check zakat status
      const totals = await api.getAssetTotal();
      if (totals?.zakatEligible && (totals?.zakatDue as number) > 0) {
        const amt = (totals.zakatDue as number).toFixed(2);
        items.push({
          id: `zakat_${today}`,
          icon: '🕌',
          title: 'Zakat Reminder',
          body: `Your estimated zakat due is $${amt}. Purify your wealth.`,
          type: 'zakat',
          href: '/dashboard/zakat',
          read: false,
        });
      }
    } catch { /* ignore */ }

    try {
      // Check bills
      const billData = await api.getBills();
      const bills = billData?.bills || billData || [];
      const unpaid = bills.filter((b: Record<string, unknown>) => !b.paid);
      const now = Date.now();
      for (const b of unpaid) {
        const due = b.nextDueDate as number;
        const daysLeft = due ? Math.ceil((due - now) / 86400000) : 999;
        if (daysLeft <= 3) {
          items.push({
            id: `bill_${b.id}_${today}`,
            icon: daysLeft <= 0 ? '🚨' : '🔔',
            title: daysLeft <= 0 ? 'Bill Overdue!' : 'Bill Due Soon',
            body: `${b.name} ($${(b.amount as number).toFixed(2)}) ${daysLeft <= 0 ? 'is overdue' : `due in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}.`,
            type: 'bill',
            href: '/dashboard/bills',
            read: false,
          });
        }
      }
    } catch { /* ignore */ }

    try {
      // Check hawl trackers
      const hawlData = await api.getHawl();
      const trackers = hawlData?.trackers || [];
      for (const t of trackers) {
        const days = (t.daysRemaining as number) ?? 999;
        if (days <= 30) {
          items.push({
            id: `hawl_${t.id}_${today}`,
            icon: days <= 0 ? '🕌' : '⏰',
            title: days <= 0 ? 'Hawl Complete!' : 'Hawl Approaching',
            body: days <= 0
              ? `Hawl for "${t.assetName}" is complete. Zakat may be due.`
              : `${days} days remaining for "${t.assetName}" hawl.`,
            type: 'hawl',
            href: '/dashboard/hawl',
            read: false,
          });
        }
      }
    } catch { /* ignore */ }

    try {
      // Check budgets
      const budgetData = await api.getBudgets();
      const budgets = budgetData?.budgets || [];
      for (const b of budgets) {
        const spent = (b.spent as number) || 0;
        const limit = (b.budgetLimit as number) || 0;
        if (limit > 0 && spent >= limit * 0.8) {
          const pct = Math.round(spent / limit * 100);
          items.push({
            id: `budget_${b.id}_${today}`,
            icon: spent >= limit ? '🚨' : '⚠️',
            title: spent >= limit ? 'Budget Exceeded!' : 'Budget Warning',
            body: `${b.category}: ${pct}% used ($${spent.toFixed(2)} of $${limit.toFixed(2)}).`,
            type: 'budget',
            href: '/dashboard/budget',
            read: false,
          });
        }
      }
    } catch { /* ignore */ }

    // Merge with existing read state
    const existing = loadStored();
    const readIds = new Set(existing.filter(n => n.read).map(n => n.id));
    for (const item of items) {
      if (readIds.has(item.id)) item.read = true;
    }

    saveStored(items);
    setNotifications(items);
    localStorage.setItem(LAST_FETCH_KEY, today);
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveStored(updated);
  };

  const clearAll = () => {
    setNotifications([]);
    saveStored([]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-[#1B5E20] transition rounded-lg hover:bg-gray-100"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-[#1B5E20] hover:underline">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500">
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                <p className="text-2xl mb-2">🔔</p>
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <a
                  key={n.id}
                  href={n.href || '#'}
                  onClick={() => {
                    const updated = notifications.map(x => x.id === n.id ? { ...x, read: true } : x);
                    setNotifications(updated);
                    saveStored(updated);
                    setOpen(false);
                  }}
                  className={`block px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition ${!n.read ? 'bg-green-50/50' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{n.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${!n.read ? 'text-[#1B5E20]' : 'text-gray-700'}`}>{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 bg-[#1B5E20] rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
