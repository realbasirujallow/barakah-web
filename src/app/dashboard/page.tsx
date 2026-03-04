'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { fmt } from '../../lib/format';
import { useToast } from '../../lib/toast';
import Link from 'next/link';

export default function DashboardPage() {
  const [totals, setTotals] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideNetWorth, setHideNetWorth] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHideNetWorth(localStorage.getItem('hideNetWorth') === 'true');
    api.getAssetTotal()
      .then(data => setTotals(data))
      .catch(() => { toast('Failed to load dashboard data. Please refresh.', 'error'); })
      .finally(() => setLoading(false));
  }, []);

  const toggleHideNetWorth = () => {
    const newValue = !hideNetWorth;
    setHideNetWorth(newValue);
    localStorage.setItem('hideNetWorth', newValue ? 'true' : 'false');
  };

  const cards = [
    { href: '/dashboard/assets', icon: '💰', label: 'Assets', desc: 'View & manage wealth' },
    { href: '/dashboard/transactions', icon: '📝', label: 'Transactions', desc: 'Income & expenses' },
    { href: '/dashboard/budget', icon: '📈', label: 'Budget', desc: 'Monthly spending limits' },
    { href: '/dashboard/debts', icon: '💳', label: 'Debts', desc: 'Track halal loans' },
    { href: '/dashboard/bills', icon: '🔔', label: 'Bills', desc: 'Upcoming payments' },
    { href: '/dashboard/zakat', icon: '🕌', label: 'Zakat', desc: 'Calculate zakat due' },
    { href: '/dashboard/hawl', icon: '⏰', label: 'Hawl', desc: 'Lunar year tracker' },
    { href: '/dashboard/sadaqah', icon: '🤲', label: 'Sadaqah', desc: 'Charity tracker' },
    { href: '/dashboard/wasiyyah', icon: '📜', label: 'Wasiyyah', desc: 'Islamic will' },
    { href: '/dashboard/waqf', icon: '🏛️', label: 'Waqf', desc: 'Endowment tracker' },
    { href: '/dashboard/riba', icon: '🛡️', label: 'Riba Detector', desc: 'Scan for interest' },
    { href: '/dashboard/categorize', icon: '🔄', label: 'Auto-Categorize', desc: 'Smart categories' },
  ];

  return (
    <div>
      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-green-600 rounded-2xl p-6 text-white relative">
          <p className="text-green-200 text-sm flex items-center justify-between">
            Net Worth
            <button onClick={toggleHideNetWorth} className="ml-2 text-xs underline text-green-100 hover:text-white">{hideNetWorth ? 'Show' : 'Hide'}</button>
          </p>
          <p className="text-3xl font-bold mt-1">
            {hideNetWorth ? '••••••' : (loading ? '...' : fmt((totals?.netWorth as number) || (totals?.totalWealth as number) || 0))}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${totals?.zakatFullyPaid ? 'from-green-600 to-emerald-500' : 'from-amber-600 to-yellow-500'} rounded-2xl p-6 text-white`}>
          <p className={`${totals?.zakatFullyPaid ? 'text-green-100' : 'text-amber-100'} text-sm flex items-center justify-between`}>
            <span>Zakat Due {totals?.currentLunarYear ? `(${totals.currentLunarYear} AH)` : ''}</span>
            {totals?.zakatFullyPaid && <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">PAID ✓</span>}
          </p>
          <p className="text-3xl font-bold mt-1">
            {loading ? '...' : fmt((totals?.zakatRemaining as number) ?? (totals?.zakatDue as number) ?? 0)}
          </p>
          {!loading && (totals?.zakatPaid as number) > 0 && !totals?.zakatFullyPaid && (
            <p className={`${totals?.zakatFullyPaid ? 'text-green-200' : 'text-amber-200'} text-xs mt-1`}>
              Paid: {fmt((totals?.zakatPaid as number) || 0)} of {fmt((totals?.zakatDue as number) || 0)}
            </p>
          )}
        </div>
        <div className="bg-gradient-to-br from-teal-600 to-cyan-500 rounded-2xl p-6 text-white">
          <p className="text-teal-100 text-sm">Zakat Eligible</p>
          <p className="text-3xl font-bold mt-1">
            {loading ? '...' : (totals?.zakatEligible ? 'Yes' : 'Not Yet')}
          </p>
        </div>
      </div>

      {/* Quick actions grid */}
      <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Link
            key={c.href}
            href={c.href}
            className="bg-white rounded-xl p-5 hover:shadow-md transition group"
          >
            <div className="text-3xl mb-2">{c.icon}</div>
            <h3 className="font-semibold text-[#1B5E20] group-hover:underline">{c.label}</h3>
            <p className="text-gray-500 text-xs mt-1">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
