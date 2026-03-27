'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { fmt } from '../../lib/format';
import { useToast } from '../../lib/toast';
import Link from 'next/link';

/** Returns true if today is in Ramadan (Hijri month 9). Approximate — within ~1 day. */
function isRamadan(): boolean {
  const jd = Math.floor(Date.now() / 86400000) + 2440587;
  const z = jd - 1948439;
  const hijriMonth = Math.floor(((z % 10631) % 354.367) / 29.5) + 1;
  return hijriMonth === 9;
}

export default function DashboardPage() {
  const [totals, setTotals] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideNetWorth, setHideNetWorth] = useState(false);
  const [hideZakat, setHideZakat] = useState(false);
  const { toast } = useToast();
  const ramadan = isRamadan();

  useEffect(() => {
    setHideNetWorth(localStorage.getItem('hideNetWorth') === 'true');
    setHideZakat(localStorage.getItem('hideZakatDashboard') === 'true');
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

  const toggleHideZakat = () => {
    const newValue = !hideZakat;
    setHideZakat(newValue);
    localStorage.setItem('hideZakatDashboard', newValue ? 'true' : 'false');
  };

  const cards = [
    { href: '/dashboard/assets', icon: '💰', label: 'Assets', desc: 'View & manage wealth' },
    { href: '/dashboard/categorize', icon: '🔄', label: 'Auto-Categorize', desc: 'Smart categories' },
    { href: '/dashboard/barakah-score', icon: '⭐', label: 'Barakah Score', desc: 'Islamic finance health' },
    { href: '/dashboard/bills', icon: '🔔', label: 'Bills', desc: 'Upcoming payments' },
    { href: '/dashboard/budget', icon: '📈', label: 'Budget', desc: 'Monthly spending limits' },
    { href: '/dashboard/debts', icon: '💳', label: 'Debts', desc: 'Track halal loans' },
    { href: '/dashboard/hawl', icon: '⏰', label: 'Hawl', desc: 'Lunar year tracker' },
    { href: '/dashboard/prayer-times', icon: '🕌', label: 'Prayer Times', desc: 'Daily salah schedule' },
    { href: '/dashboard/notifications', icon: '🔔', label: 'Reminders', desc: 'Bills, Zakat & Hawl alerts' },
    { href: '/dashboard/referral', icon: '🎁', label: 'Refer a Friend', desc: 'Share & earn rewards' },
    { href: '/dashboard/riba', icon: '🛡️', label: 'Riba Detector', desc: 'Scan for interest' },
    { href: '/dashboard/sadaqah', icon: '🤲', label: 'Sadaqah', desc: 'Charity tracker' },
    { href: '/dashboard/transactions', icon: '📝', label: 'Transactions', desc: 'Income & expenses' },
    { href: '/dashboard/waqf', icon: '🏛️', label: 'Waqf', desc: 'Endowment tracker' },
    { href: '/dashboard/wasiyyah', icon: '📜', label: 'Wasiyyah', desc: 'Islamic will' },
    { href: '/dashboard/zakat', icon: '🕌', label: 'Zakat', desc: 'Calculate zakat due' },
  ];

  return (
    <div>
      {/* Ramadan Banner */}
      {ramadan && (
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-2xl p-5 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌙</span>
            <div>
              <p className="font-bold text-lg">Ramadan Mubarak!</p>
              <p className="text-purple-200 text-sm">May this blessed month bring you barakah and acceptance.</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap mt-3">
            <Link href="/dashboard/sadaqah" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition">🤲 Track Sadaqah</Link>
            <Link href="/dashboard/zakat" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition">🕌 Pay Zakat</Link>
            <Link href="/dashboard/prayer-times" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition">🕌 Prayer Times</Link>
          </div>
        </div>
      )}

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
            <span className="flex items-center gap-2">
              {Boolean(totals?.zakatFullyPaid) && <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">PAID ✓</span>}
              <button onClick={toggleHideZakat} className="text-xs underline opacity-70 hover:opacity-100">{hideZakat ? 'Show' : 'Hide'}</button>
            </span>
          </p>
          <p className="text-3xl font-bold mt-1">
            {hideZakat ? '••••••' : (loading ? '...' : fmt((totals?.zakatRemaining as number) ?? (totals?.zakatDue as number) ?? 0))}
          </p>
          {!hideZakat && !loading && ((totals?.zakatPaid as number) || 0) > 0 && !Boolean(totals?.zakatFullyPaid) && (
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
