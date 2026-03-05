'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  type: 'urgent' | 'info' | 'success' | 'warning';
  href?: string;
  timestamp?: number;
}

function daysUntil(ts: number): number {
  return Math.round((ts * 1000 - Date.now()) / 86400000);
}

export default function NotificationsPage() {
  const [items, setItems]   = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const build = async () => {
      const activities: ActivityItem[] = [];
      try {
        // Bills due soon
        const bills = await api.getBills();
        const billList: any[] = bills?.bills || bills || [];
        billList.filter(b => !b.isPaid).forEach(b => {
          const d = daysUntil(b.dueDate);
          if (d <= 7 && d >= 0) activities.push({ id: `bill-${b.id}`, icon: '🔔', title: `Bill Due: ${b.name}`, subtitle: `${fmt(b.amount)} due in ${d === 0 ? 'today' : `${d} day${d > 1 ? 's' : ''}`}`, type: d <= 1 ? 'urgent' : 'warning', href: '/dashboard/bills', timestamp: b.dueDate });
        });

        // Zakat status
        const zakat = await api.getZakat();
        if (zakat?.zakatEligible && !zakat?.zakatFullyPaid) {
          activities.push({ id: 'zakat-due', icon: '🕌', title: 'Zakat Due', subtitle: `${fmt(zakat.zakatDue || 0)} in Zakat has not been fully paid for this lunar year`, type: 'warning', href: '/dashboard/zakat' });
        } else if (zakat?.zakatFullyPaid) {
          activities.push({ id: 'zakat-paid', icon: '✅', title: 'Zakat Fulfilled', subtitle: 'Your Zakat obligation for this lunar year is complete. JazakAllahu Khayran!', type: 'success', href: '/dashboard/zakat' });
        }

        // Hawl tracker
        const hawl = await api.getHawl();
        const hawlList: any[] = hawl?.hawlTrackers || hawl || [];
        hawlList.filter((h: any) => h.isActive && !h.zakatPaid).forEach((h: any) => {
          if (h.endDate) {
            const d = daysUntil(h.endDate);
            if (d <= 30 && d >= 0) activities.push({ id: `hawl-${h.id}`, icon: '⏰', title: `Hawl Ending: ${h.name}`, subtitle: `Your hawl cycle for "${h.name}" ends in ${d} day${d !== 1 ? 's' : ''}`, type: d <= 7 ? 'urgent' : 'warning', href: '/dashboard/hawl', timestamp: h.endDate });
          }
        });

        // Debts
        const debts = await api.getDebts();
        const debtList: any[] = debts?.debts || debts || [];
        debtList.filter((d: any) => d.dueDate).forEach((d: any) => {
          const days = daysUntil(d.dueDate);
          if (days <= 14 && days >= 0) activities.push({ id: `debt-${d.id}`, icon: '💳', title: `Debt Payment Due: ${d.debtorName || d.lenderName}`, subtitle: `${fmt(d.remainingAmount || d.amount)} due in ${days} day${days !== 1 ? 's' : ''}`, type: days <= 3 ? 'urgent' : 'info', href: '/dashboard/debts', timestamp: d.dueDate });
        });

        // Savings goals progress
        const savings = await api.getSavingsGoals();
        const savList: any[] = savings?.goals || savings || [];
        savList.filter((g: any) => g.currentAmount >= g.targetAmount).forEach((g: any) => {
          activities.push({ id: `goal-${g.id}`, icon: '🎯', title: `Goal Reached: ${g.name}!`, subtitle: `You have reached your savings goal of ${fmt(g.targetAmount)}. Alhamdulillah!`, type: 'success', href: '/dashboard/savings' });
        });

      } catch (e) {
        console.error('Notifications fetch error', e);
      }

      // Sort by urgency then timestamp
      activities.sort((a, b) => {
        const p = { urgent: 0, warning: 1, info: 2, success: 3 };
        return (p[a.type] - p[b.type]) || ((a.timestamp || 0) - (b.timestamp || 0));
      });

      setItems(activities);
      setLoading(false);
    };
    build();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const colors = {
    urgent:  'border-red-400 bg-red-50',
    warning: 'border-amber-400 bg-amber-50',
    info:    'border-blue-400 bg-blue-50',
    success: 'border-green-400 bg-green-50',
  };
  const icons = { urgent: '🚨', warning: '⚠️', info: 'ℹ️', success: '✅' };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Notifications & Reminders</h1>
        <p className="text-sm text-gray-500 mt-1">Bills, Zakat, Hawl cycles and goal alerts — all in one place</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">✨</p>
          <p className="text-lg font-medium text-gray-600">You're all caught up!</p>
          <p className="text-sm mt-2">No urgent reminders right now. Alhamdulillah!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className={`rounded-xl p-4 border-l-4 ${colors[item.type]}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{item.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{item.subtitle}</p>
                </div>
                {item.href && (
                  <Link href={item.href} className="text-sm text-[#1B5E20] font-medium hover:underline flex-shrink-0">View →</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
