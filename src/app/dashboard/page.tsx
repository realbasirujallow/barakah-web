'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { fmt } from '../../lib/format';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import OnboardingWizard from '../../components/OnboardingWizard';

interface IslamicEvent { name: string; daysAway: number; hijriDate: string; approximateGregorianDate: string; }
interface HijriData { hijriDate: string; hijriMonthName: string; isRamadan: boolean; upcomingEvents: IslamicEvent[]; }

export default function DashboardPage() {
  const [totals, setTotals] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideNetWorth, setHideNetWorth] = useState(false);
  const [hideZakat, setHideZakat] = useState(false);
  const [hijri, setHijri] = useState<HijriData | null>(null);
  const [hawlDue, setHawlDue] = useState<{ dueCount: number; upcomingCount: number; due: Record<string, unknown>[] } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Show onboarding for first-time users
    try {
      if (!localStorage.getItem('barakah_onboarded')) setShowOnboarding(true);
    } catch {}
    setHideNetWorth(localStorage.getItem('hideNetWorth') === 'true');
    setHideZakat(localStorage.getItem('hideZakatDashboard') === 'true');
    Promise.allSettled([
      api.getAssetTotal(),
      api.getIslamicCalendarToday(),
      api.getHawlDue(30),
    ]).then(([assetResult, hijriResult, hawlResult]) => {
      if (assetResult.status === 'fulfilled') setTotals(assetResult.value);
      else toast('Failed to load dashboard data. Please refresh.', 'error');
      if (hijriResult.status === 'fulfilled') setHijri(hijriResult.value as HijriData);
      if (hawlResult.status === 'fulfilled') setHawlDue(hawlResult.value as typeof hawlDue);
    }).finally(() => setLoading(false));
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
      {/* Onboarding Wizard for first-time users */}
      {showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}

      {/* Ramadan Banner */}
      {hijri?.isRamadan && (
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

      {/* ── Islamic Calendar + Zakat Reminders Row ─────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Hijri Date + Upcoming Events */}
        {hijri && (
          <div className="bg-white rounded-2xl p-5 border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Islamic Date</p>
                <p className="text-lg font-bold text-[#1B5E20]">{hijri.hijriDate}</p>
              </div>
              <span className="text-3xl">🕌</span>
            </div>
            {hijri.upcomingEvents.length > 0 && (
              <div className="border-t border-green-50 pt-3 mt-2 space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Upcoming</p>
                {hijri.upcomingEvents.slice(0, 3).map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-medium">{e.name}</span>
                    <span className="text-gray-500 text-xs">
                      {e.daysAway === 0 ? 'Today!' : e.daysAway === 1 ? 'Tomorrow' : `${e.daysAway} days`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Hawl/Zakat Reminders */}
        {hawlDue && (hawlDue.dueCount > 0 || hawlDue.upcomingCount > 0) && (
          <div className={`rounded-2xl p-5 border ${hawlDue.dueCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Zakat Reminders</p>
                {hawlDue.dueCount > 0 ? (
                  <p className="text-lg font-bold text-amber-700">{hawlDue.dueCount} asset{hawlDue.dueCount !== 1 ? 's' : ''} — Zakat due now!</p>
                ) : (
                  <p className="text-lg font-bold text-[#1B5E20]">{hawlDue.upcomingCount} coming up</p>
                )}
              </div>
              <span className="text-3xl">⏰</span>
            </div>
            {hawlDue.due?.slice(0, 2).map((h: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center justify-between text-sm mt-1 bg-white/60 rounded-lg px-3 py-2">
                <span className="font-medium text-gray-800">{h.assetName as string}</span>
                <span className="text-amber-700 font-bold">{fmt((h.zakatAmount as number) || 0)} due</span>
              </div>
            ))}
            <Link href="/dashboard/hawl" className="inline-block mt-3 text-sm font-medium text-[#1B5E20] hover:underline">
              View Hawl Tracker →
            </Link>
          </div>
        )}
      </div>

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

      {/* ── Free plan upgrade teaser ─────────────────────────────────────────── */}
      {user?.plan === 'free' && (
        <div className="mt-10 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <span className="text-4xl">✨</span>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#1B5E20] mb-1">Unlock Barakah Plus</h3>
              <p className="text-sm text-gray-700 mb-3">
                Get access to Halal Stock Screener, Riba Detector, unlimited transactions, and more premium features.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-white text-xs font-medium text-gray-700 px-3 py-1 rounded-full border border-green-100">🔍 Halal Stock Screener</span>
                <span className="bg-white text-xs font-medium text-gray-700 px-3 py-1 rounded-full border border-green-100">🛡️ Riba Detector</span>
                <span className="bg-white text-xs font-medium text-gray-700 px-3 py-1 rounded-full border border-green-100">♾️ Unlimited Transactions</span>
              </div>
              <Link
                href="/dashboard/billing"
                className="inline-block bg-[#1B5E20] text-white px-6 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm transition"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
