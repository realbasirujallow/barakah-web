'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { fmt } from '../../lib/format';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import OnboardingWizard from '../../components/OnboardingWizard';
import { TransactionUsageMeter } from '../../components/TransactionUsageMeter';
import { PRICING } from '../../lib/pricing';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface IslamicEvent { name: string; daysAway: number; hijriDate: string; approximateGregorianDate: string; }
interface HijriData { hijriDate: string; hijriMonthName: string; isRamadan: boolean; upcomingEvents: IslamicEvent[]; }
interface HawlDue { dueCount: number; upcomingCount: number; due: Array<{ assetName: string; zakatAmount: number }>; }
interface AssetTotal { netWorth?: number; totalWealth?: number; zakatDue?: number; zakatRemaining?: number; zakatPaid?: number; zakatFullyPaid?: boolean; zakatEligible?: boolean; currentLunarYear?: number; }
interface PortfolioSummary { totalValue: number; totalGainLoss: number; totalGainLossPct: number; }
interface PortfolioHistorySnapshot { date: string; dayGainLoss: number; dayGainLossPercent: number; }

// Dashboard widget types
interface SpendingWidget { thisMonth: number; lastMonth: number; income: number; changePercent: number; topCategories: Array<{ category: string; amount: number }>; }
interface BudgetCategory { id: number; category: string; monthlyLimit: number; spent: number; remaining: number; percentage: number; overBudget: boolean; color?: string; }
interface BudgetWidget { month: number; year: number; totalBudgeted: number; totalSpent: number; totalRemaining: number; categories: BudgetCategory[]; }
interface MiniTransaction { id: number; description: string; merchantName: string | null; category: string; type: string; amount: number; timestamp: number; importSource: string | null; }
interface RecentTransactionsWidget { transactions: MiniTransaction[]; totalCount: number; }
interface BillItem { id: number; name: string; amount: number; category: string; dueDay: number; frequency: string; paid: boolean; nextDueDate: number; overdue: boolean; dueInDays: number; }
interface UpcomingBillsWidget { bills: BillItem[]; upcomingItems: Array<Record<string, unknown>>; totalMonthlyBills: number; upcomingCount: number; overdueCount: number; }
interface NetWorthHistoryPoint { date: number; netWorth: number; }
interface NetWorthMiniWidget { currentNetWorth: number; totalAssets: number; totalDebts: number; changeAmount: number; changePercent: number; history: NetWorthHistoryPoint[]; }
interface DashboardWidgets { spending: SpendingWidget | null; budgetOverview: BudgetWidget | null; recentTransactions: RecentTransactionsWidget | null; upcomingBills: UpcomingBillsWidget | null; netWorthMini: NetWorthMiniWidget | null; }

// Safe localStorage helpers
const safeGetItem = (key: string): string | null => {
  try { return localStorage.getItem(key); } catch { return null; }
};
const safeSetItem = (key: string, value: string): void => {
  try { localStorage.setItem(key, value); } catch { /* private browsing or quota exceeded */ }
};

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍕', dining: '🍽️', groceries: '🛒', transportation: '🚗', housing: '🏠',
  utilities: '💡', shopping: '🛍️', entertainment: '🎬', subscriptions: '📱',
  healthcare: '🏥', education: '📚', zakat: '🕌', sadaqah: '🤲', income: '💰',
  transfer: '🔄', debt_payment: '💳', personal: '👤', uncategorized: '📋',
};

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const [totals, setTotals] = useState<AssetTotal | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideNetWorth, setHideNetWorth] = useState(() => safeGetItem('hideNetWorth') === 'true');
  const [hideZakat, setHideZakat] = useState(() => safeGetItem('hideZakatDashboard') === 'true');
  const [hijri, setHijri] = useState<HijriData | null>(null);
  const [hawlDue, setHawlDue] = useState<HawlDue | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => !safeGetItem('barakah_onboarded'));
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [latestPortfolioSnapshot, setLatestPortfolioSnapshot] = useState<PortfolioHistorySnapshot | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidgets | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const getGreeting = (): { text: string; emoji: string } => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good morning', emoji: '🌅' };
    if (hour < 18) return { text: 'Good afternoon', emoji: '☀️' };
    return { text: 'Good evening', emoji: '🌙' };
  };

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const [assetResult, hijriResult, hawlResult, portfolioResult, portfolioHistoryResult, widgetResult] = await Promise.allSettled([
        api.getAssetTotal(),
        api.getIslamicCalendarToday(),
        api.getHawlDue(30),
        api.getPortfolioSummary(),
        api.getPortfolioHistory(2),
        api.getDashboardWidgets(),
      ]);

      if (cancelled) return;

      if (assetResult.status === 'fulfilled') setTotals(assetResult.value);
      else toast('Failed to load dashboard data. Please refresh.', 'error');
      if (hijriResult.status === 'fulfilled') setHijri(hijriResult.value as HijriData);
      if (hawlResult.status === 'fulfilled') setHawlDue(hawlResult.value as typeof hawlDue);
      if (portfolioResult.status === 'fulfilled') {
        const data = portfolioResult.value as PortfolioSummary;
        if ((data?.totalValue || 0) > 0) {
          setPortfolioSummary(data);
        }
      }
      if (portfolioHistoryResult.status === 'fulfilled') {
        const historyPayload = portfolioHistoryResult.value as { history?: PortfolioHistorySnapshot[] };
        const history = Array.isArray(historyPayload?.history) ? historyPayload.history : [];
        setLatestPortfolioSnapshot(history.length > 0 ? history[history.length - 1] : null);
      }
      if (widgetResult.status === 'fulfilled') {
        setWidgets(widgetResult.value as DashboardWidgets);
      }
      setLoading(false);
    };

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  const toggleHideNetWorth = () => {
    const newValue = !hideNetWorth;
    setHideNetWorth(newValue);
    safeSetItem('hideNetWorth', newValue ? 'true' : 'false');
  };

  const toggleHideZakat = () => {
    const newValue = !hideZakat;
    setHideZakat(newValue);
    safeSetItem('hideZakatDashboard', newValue ? 'true' : 'false');
  };

  const quickActions = [
    { href: '/dashboard/zakat', icon: '🕌', label: 'Calculate Zakat', desc: 'Calculate zakat due' },
    { href: '/dashboard/transactions', icon: '📝', label: 'Add Transaction', desc: 'Income & expenses' },
    { href: '/dashboard/import', icon: '🏦', label: 'Connect Accounts', desc: 'Link your bank' },
    { href: '/dashboard/budget', icon: '📈', label: 'View Budget', desc: 'Monthly spending limits' },
  ];

  const cards = [
    { href: '/dashboard/assets', icon: '💰', label: 'Assets', desc: 'View & manage wealth' },
    { href: '/dashboard/categorize', icon: '🔄', label: 'Auto-Categorize', desc: 'Smart categories' },
    { href: '/dashboard/barakah-score', icon: '⭐', label: 'Barakah Score', desc: 'Islamic finance health' },
    { href: '/dashboard/bills', icon: '🔔', label: 'Bills', desc: 'Upcoming payments' },
    { href: '/dashboard/budget', icon: '📈', label: 'Budget', desc: 'Monthly spending limits' },
    { href: '/dashboard/debts', icon: '💳', label: 'Debts', desc: 'Track halal loans' },
    { href: '/dashboard/hawl', icon: '⏰', label: 'Hawl', desc: 'Lunar year tracker' },
    { href: '/dashboard/prayer-times', icon: '🕌', label: 'Prayer Times', desc: 'Daily salah schedule' },
    { href: '/dashboard/notifications', icon: '🔔', label: 'Notifications', desc: 'Bills, Zakat & Hawl alerts' },
    { href: '/dashboard/referral', icon: '🎁', label: 'Refer a Friend', desc: 'Share & earn rewards' },
    { href: '/dashboard/riba', icon: '🛡️', label: 'Riba Detector', desc: 'Scan for interest' },
    { href: '/dashboard/sadaqah', icon: '🤲', label: 'Sadaqah', desc: 'Charity tracker' },
    { href: '/dashboard/transactions', icon: '📝', label: 'Transactions', desc: 'Income & expenses' },
    { href: '/dashboard/waqf', icon: '🏛️', label: 'Waqf', desc: 'Endowment tracker' },
    { href: '/dashboard/wasiyyah', icon: '📜', label: 'Wasiyyah', desc: 'Islamic will' },
    { href: '/dashboard/zakat', icon: '🕌', label: 'Zakat', desc: 'Calculate zakat due' },
  ];

  const hasInvestmentPulse = (portfolioSummary?.totalValue || 0) > 0;
  const dayMove = latestPortfolioSnapshot?.dayGainLoss ?? 0;
  const dayMovePct = latestPortfolioSnapshot?.dayGainLossPercent ?? 0;
  const netWorthValue = (totals?.netWorth as number) || (totals?.totalWealth as number) || 0;
  const isTrialExpired = user?.plan === 'free' && user?.planExpiresAt && user.planExpiresAt < Date.now() / 1000;
  const hasNoData = !loading && netWorthValue === 0 && !widgets?.recentTransactions?.transactions?.length;

  return (
    <div>
      {/* Onboarding Wizard for first-time users */}
      {showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}

      {/* Trial Expired Banner */}
      {isTrialExpired && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-semibold text-amber-900">Your trial has ended</p>
              <p className="text-sm text-amber-700">Upgrade to keep syncing your accounts and accessing premium features.</p>
            </div>
          </div>
          <Link href="/dashboard/billing" className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#2E7D32] transition flex-shrink-0">
            Upgrade Now
          </Link>
        </div>
      )}

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

      {/* Greeting section */}
      <div className="mb-6 p-6 bg-gradient-to-r from-[#1B5E20] to-green-600 rounded-2xl text-white">
        <p className="text-lg font-semibold flex items-center gap-2">
          <span className="text-2xl">{getGreeting().emoji}</span>
          {getGreeting().text}{user?.name ? `, ${user.name}` : ''}
        </p>
        <p className="text-green-100 text-sm mt-1">Welcome back to Barakah. May your finances be blessed with barakah.</p>
      </div>

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

      {/* Empty-state CTA for new users */}
      {hasNoData && (
        <div className="bg-white border-2 border-dashed border-green-200 rounded-2xl p-8 mb-6 text-center">
          <span className="text-5xl block mb-3">🏦</span>
          <h3 className="text-xl font-bold text-[#1B5E20] mb-2">Connect your bank accounts to get started</h3>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            Link your accounts to automatically track spending, monitor your net worth, and calculate zakat with precision.
          </p>
          <Link href="/dashboard/import" className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
            Connect Accounts
          </Link>
        </div>
      )}

      {/* ── Summary Cards Row ─────────────────────────────────────────────── */}
      <div className={`grid gap-4 mb-6 ${hasInvestmentPulse ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        <div className="bg-gradient-to-br from-[#1B5E20] to-green-600 rounded-2xl p-5 text-white relative">
          <p className="text-green-200 text-sm flex items-center justify-between">
            Net Worth
            <button onClick={toggleHideNetWorth} className="ml-2 text-xs underline text-green-100 hover:text-white">{hideNetWorth ? 'Show' : 'Hide'}</button>
          </p>
          <p className="text-2xl font-bold mt-1">
            {hideNetWorth ? '••••••' : (loading ? '...' : fmt(netWorthValue))}
          </p>
          {!hideNetWorth && widgets?.netWorthMini?.changeAmount != null && (
            <p className={`text-xs mt-1 ${(widgets.netWorthMini.changeAmount || 0) >= 0 ? 'text-emerald-200' : 'text-rose-200'}`}>
              {(widgets.netWorthMini.changeAmount || 0) >= 0 ? '▲' : '▼'} {fmt(Math.abs(widgets.netWorthMini.changeAmount || 0))} ({(widgets.netWorthMini.changePercent || 0).toFixed(1)}%) 90d
            </p>
          )}
        </div>
        <div className={`bg-gradient-to-br ${totals?.zakatFullyPaid ? 'from-green-600 to-emerald-500' : 'from-amber-600 to-yellow-500'} rounded-2xl p-5 text-white`}>
          <p className={`${totals?.zakatFullyPaid ? 'text-green-100' : 'text-amber-100'} text-sm flex items-center justify-between`}>
            <span>Zakat Due {totals?.currentLunarYear ? `(${totals.currentLunarYear} AH)` : ''}</span>
            <span className="flex items-center gap-2">
              {Boolean(totals?.zakatFullyPaid) && <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">PAID</span>}
              <button onClick={toggleHideZakat} className="text-xs underline opacity-70 hover:opacity-100">{hideZakat ? 'Show' : 'Hide'}</button>
            </span>
          </p>
          <p className="text-2xl font-bold mt-1">
            {hideZakat ? '••••••' : (loading ? '...' : fmt((totals?.zakatRemaining as number) ?? (totals?.zakatDue as number) ?? 0))}
          </p>
          {!hideZakat && !loading && ((totals?.zakatPaid as number) || 0) > 0 && !Boolean(totals?.zakatFullyPaid) && (
            <p className={`${totals?.zakatFullyPaid ? 'text-green-200' : 'text-amber-200'} text-xs mt-1`}>
              Paid: {fmt((totals?.zakatPaid as number) || 0)} of {fmt((totals?.zakatDue as number) || 0)}
            </p>
          )}
        </div>
        <div className="bg-gradient-to-br from-teal-600 to-cyan-500 rounded-2xl p-5 text-white">
          <p className="text-teal-100 text-sm">Zakat Eligible</p>
          <p className="text-2xl font-bold mt-1">
            {loading ? '...' : (totals?.zakatEligible ? 'Yes' : 'Not Yet')}
          </p>
        </div>
        {hasInvestmentPulse && (
          <Link
            href="/dashboard/investments"
            className="block bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-5 text-white hover:shadow-lg transition"
          >
            <p className="text-slate-300 text-sm">Today&apos;s Market Move</p>
            <p className={`text-2xl font-bold mt-1 ${dayMove >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
              {dayMove >= 0 ? '+' : ''}{fmt(dayMove)}
            </p>
            <p className="text-slate-300 text-xs mt-1">
              {dayMovePct >= 0 ? '+' : ''}{dayMovePct.toFixed(2)}% &middot; {fmt(portfolioSummary?.totalValue || 0)}
            </p>
          </Link>
        )}
      </div>

      {/* ── Spending + Budget Row ─────────────────────────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Spending Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Spending This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {widgets?.spending ? fmt(widgets.spending.thisMonth) : loading ? '...' : fmt(0)}
              </p>
            </div>
            {widgets?.spending && widgets.spending.lastMonth > 0 && (
              <div className={`text-sm font-semibold px-2.5 py-1 rounded-full ${widgets.spending.changePercent <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {widgets.spending.changePercent <= 0 ? '▼' : '▲'} {Math.abs(widgets.spending.changePercent)}% vs last month
              </div>
            )}
          </div>
          {widgets?.spending?.topCategories && widgets.spending.topCategories.length > 0 && (
            <div className="space-y-2 mt-3">
              {widgets.spending.topCategories.slice(0, 4).map((cat, i) => {
                const max = widgets.spending!.topCategories[0]?.amount || 1;
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm w-5">{CATEGORY_ICONS[cat.category] || '📋'}</span>
                    <span className="text-sm text-gray-700 w-24 truncate capitalize">{cat.category.replace(/_/g, ' ')}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-[#1B5E20] rounded-full h-2 transition-all" style={{ width: `${Math.min((cat.amount / max) * 100, 100)}%` }} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-20 text-right">{fmt(cat.amount)}</span>
                  </div>
                );
              })}
            </div>
          )}
          {(!widgets?.spending || widgets.spending.thisMonth === 0) && !loading && (
            <p className="text-gray-400 text-sm mt-2">No spending recorded yet this month.</p>
          )}
          <Link href="/dashboard/summary" className="inline-block mt-3 text-sm font-medium text-[#1B5E20] hover:underline">
            View full breakdown →
          </Link>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Budget — {new Date().toLocaleString(undefined, { month: 'long', year: 'numeric' })}</p>
              {widgets?.budgetOverview && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {fmt(widgets.budgetOverview.totalSpent)} of {fmt(widgets.budgetOverview.totalBudgeted)} spent
                </p>
              )}
            </div>
            {widgets?.budgetOverview && widgets.budgetOverview.totalBudgeted > 0 && (
              <span className="text-sm font-semibold text-gray-500">
                {fmt(widgets.budgetOverview.totalRemaining)} left
              </span>
            )}
          </div>
          {widgets?.budgetOverview?.categories && widgets.budgetOverview.categories.length > 0 ? (
            <div className="space-y-3">
              {widgets.budgetOverview.categories.slice(0, 4).map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 capitalize">{cat.category.replace(/_/g, ' ')}</span>
                    <span className="text-gray-500">{fmt(cat.spent)} / {fmt(cat.monthlyLimit)}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`rounded-full h-2.5 transition-all ${cat.percentage > 100 ? 'bg-red-500' : cat.percentage > 80 ? 'bg-amber-500' : 'bg-[#1B5E20]'}`}
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">No budgets set up yet.</p>
              <Link href="/dashboard/budget" className="text-sm text-[#1B5E20] font-medium hover:underline mt-1 inline-block">
                Create your first budget →
              </Link>
            </div>
          )}
          {widgets?.budgetOverview?.categories && widgets.budgetOverview.categories.length > 0 && (
            <Link href="/dashboard/budget" className="inline-block mt-3 text-sm font-medium text-[#1B5E20] hover:underline">
              Manage budgets →
            </Link>
          )}
        </div>
      </div>

      {/* ── Recent Transactions + Upcoming Bills Row ──────────────────────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Recent Transactions</p>
            <Link href="/dashboard/transactions" className="text-sm text-[#1B5E20] font-medium hover:underline">View all</Link>
          </div>
          {widgets?.recentTransactions?.transactions && widgets.recentTransactions.transactions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {widgets.recentTransactions.transactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[txn.category] || '📋'}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{txn.merchantName || txn.description}</p>
                      <p className="text-xs text-gray-400 capitalize">{txn.category?.replace(/_/g, ' ')} &middot; {timeAgo(txn.timestamp)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold flex-shrink-0 ml-2 ${txn.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                    {txn.type === 'income' ? '+' : ''}{fmt(txn.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">No transactions yet.</p>
              <Link href="/dashboard/transactions" className="text-sm text-[#1B5E20] font-medium hover:underline mt-1 inline-block">
                Add your first transaction →
              </Link>
            </div>
          )}
        </div>

        {/* Upcoming Bills / Recurring */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Upcoming Bills</p>
              {widgets?.upcomingBills && (widgets.upcomingBills.totalMonthlyBills || 0) > 0 && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {fmt(widgets.upcomingBills.totalMonthlyBills)} /month
                </p>
              )}
            </div>
            <Link href="/dashboard/bills" className="text-sm text-[#1B5E20] font-medium hover:underline">View all</Link>
          </div>
          {widgets?.upcomingBills?.bills && widgets.upcomingBills.bills.length > 0 ? (
            <div className="space-y-2">
              {widgets.upcomingBills.bills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{bill.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{bill.category?.replace(/_/g, ' ')} &middot; {bill.frequency}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{fmt(bill.amount)}</p>
                    <p className={`text-xs font-medium ${bill.overdue ? 'text-red-600' : bill.dueInDays <= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {bill.overdue ? 'Overdue' : bill.dueInDays === 0 ? 'Due today' : bill.dueInDays === 1 ? 'Tomorrow' : `in ${bill.dueInDays}d`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">No upcoming bills.</p>
              <Link href="/dashboard/bills" className="text-sm text-[#1B5E20] font-medium hover:underline mt-1 inline-block">
                Add your first bill →
              </Link>
            </div>
          )}
          {widgets?.upcomingBills && (widgets.upcomingBills.overdueCount || 0) > 0 && (
            <div className="mt-2 bg-red-50 text-red-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              {widgets.upcomingBills.overdueCount} bill{widgets.upcomingBills.overdueCount !== 1 ? 's' : ''} overdue
            </div>
          )}
        </div>
      </div>

      {/* ── Net Worth Mini-Chart ──────────────────────────────────────────── */}
      {widgets?.netWorthMini && widgets.netWorthMini.history && widgets.netWorthMini.history.length > 1 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Net Worth Trend — 90 Days</p>
              <div className="flex items-baseline gap-3 mt-1">
                <p className="text-2xl font-bold text-gray-900">
                  {hideNetWorth ? '••••••' : fmt(widgets.netWorthMini.currentNetWorth)}
                </p>
                {!hideNetWorth && (
                  <span className={`text-sm font-semibold ${(widgets.netWorthMini.changeAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(widgets.netWorthMini.changeAmount || 0) >= 0 ? '▲' : '▼'} {fmt(Math.abs(widgets.netWorthMini.changeAmount || 0))} ({(widgets.netWorthMini.changePercent || 0).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
            <Link href="/dashboard/net-worth" className="text-sm text-[#1B5E20] font-medium hover:underline">Details →</Link>
          </div>
          {!hideNetWorth && (
            <div className="h-40 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={widgets.netWorthMini.history.map((p) => ({
                  date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                  netWorth: p.netWorth,
                }))}>
                  <defs>
                    <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1B5E20" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip formatter={(value) => [fmt(Number(value)), 'Net Worth']} labelStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="netWorth" stroke="#1B5E20" strokeWidth={2} fill="url(#nwGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(c => (
            <Link
              key={c.href + c.label}
              href={c.href}
              className="bg-white rounded-xl p-4 hover:shadow-md transition group border border-gray-100"
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <h3 className="font-semibold text-[#1B5E20] group-hover:underline text-sm">{c.label}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature cards grid */}
      <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Explore Features</h2>
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

      {/* ── Free plan: Transaction usage + Plus feature teasers ──────────── */}
      {user?.plan === 'free' && (
        <div className="mt-8 space-y-4">
          {/* Transaction usage meter */}
          <TransactionUsageMeter />

          {/* Feature teaser cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/dashboard/barakah-score" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition group relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-green-100 text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-full">Plus</div>
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-semibold text-gray-900 group-hover:text-[#1B5E20]">Financial Insights</h4>
              <p className="text-xs text-gray-500 mt-1">Barakah Score, spending trends, and halal ratio — see your full picture.</p>
            </Link>

            <Link href="/dashboard/halal" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition group relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-green-100 text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-full">Plus</div>
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-semibold text-gray-900 group-hover:text-[#1B5E20]">Halal Finance Check</h4>
              <p className="text-xs text-gray-500 mt-1">Screen 30,000+ stocks and detect interest in your accounts.</p>
            </Link>

            <Link href="/dashboard/net-worth" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition group relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-green-100 text-[#1B5E20] text-xs font-bold px-2 py-0.5 rounded-full">Plus</div>
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-semibold text-gray-900 group-hover:text-[#1B5E20]">Net Worth Tracking</h4>
              <p className="text-xs text-gray-500 mt-1">Assets minus debts, tracked over time with trend analysis.</p>
            </Link>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-[#1B5E20] to-green-600 rounded-xl p-5 flex items-center justify-between">
            <div className="text-white">
              <p className="font-bold text-lg">Barakah Plus — from {PRICING.plus.monthly}/mo</p>
              <p className="text-green-200 text-sm">Unlimited transactions + 11 premium features</p>
            </div>
            <Link
              href="/dashboard/billing"
              className="bg-white text-[#1B5E20] px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-50 transition flex-shrink-0"
            >
              View Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
