'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { trackDemoDataLoaded } from '../../lib/analytics';
import { useCurrency } from '../../lib/useCurrency';
import { useToast } from '../../lib/toast';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import OnboardingWizard from '../../components/OnboardingWizard';
import ReferralPromptModal, { useReferralPrompt } from '../../components/ReferralPromptModal';
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
  const { fmt } = useCurrency();
  const [totals, setTotals] = useState<AssetTotal | null>(null);
  const [loading, setLoading] = useState(true);
  // Round 18: these four flags used to read localStorage inside the
  // useState initializer, which runs on both SSR (where safeGetItem
  // returns null by design) and CSR (where it returns the real value).
  // For returning users the two values differed and React threw a
  // hydration mismatch — plus there was a 1-frame flash of "show
  // onboarding" before the correct value was hydrated. Pattern: start
  // false (SSR-safe), hydrate in a useEffect.
  const [hideNetWorth, setHideNetWorth] = useState(false);
  const [hideZakat, setHideZakat] = useState(false);
  const [hijri, setHijri] = useState<HijriData | null>(null);
  const [hawlDue, setHawlDue] = useState<HawlDue | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [latestPortfolioSnapshot, setLatestPortfolioSnapshot] = useState<PortfolioHistorySnapshot | null>(null);
  const [widgets, setWidgets] = useState<DashboardWidgets | null>(null);
  const [safeToSpend, setSafeToSpend] = useState<{safeToSpend: number; dailySafeToSpend?: number; totalIncome: number; totalSpent: number; totalBillsDue: number; totalBudgeted: number; daysRemainingInMonth: number} | null>(null);
  const [insights, setInsights] = useState<{type: string; severity: string; title: string; body: string}[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { show: showReferralPrompt, dismiss: dismissReferralPrompt } = useReferralPrompt();
  const [referralBannerDismissed, setReferralBannerDismissed] = useState(false);

  // Round 18: single post-mount hydration for all localStorage-backed
  // UI state. Running on the client only, so SSR → CSR markup stays
  // stable. Wrapped in setTimeout(0) to satisfy the
  // react-hooks/set-state-in-effect rule (same pattern as the
  // greeting hydration above) — cascading-render concerns are
  // non-issues here since these setters only flip UI chrome.
  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setHideNetWorth(safeGetItem('hideNetWorth') === 'true');
      setHideZakat(safeGetItem('hideZakatDashboard') === 'true');
      setShowOnboarding(!safeGetItem('barakah_onboarded'));
      setReferralBannerDismissed(safeGetItem('barakah_referral_banner_dismissed') === 'true');
    }, 0);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, []);

  // HIGH BUG FIX (H-6): Reading new Date().getHours() during render causes
  // SSR (where the server's clock picks one bucket) and CSR (where the
  // user's clock may be in a different bucket) to produce different greeting
  // strings, which triggers a hydration mismatch. Start with a neutral
  // greeting and replace it after mount, deferred via setTimeout(0) to keep
  // react-hooks/set-state-in-effect happy (same pattern as layout headerDate).
  const [greeting, setGreeting] = useState<{ text: string; emoji: string }>({ text: 'Welcome back', emoji: '🌙' });
  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      const h = new Date().getHours();
      if (h < 12) setGreeting({ text: 'Good morning', emoji: '🌅' });
      else if (h < 18) setGreeting({ text: 'Good afternoon', emoji: '☀️' });
      else setGreeting({ text: 'Good evening', emoji: '🌙' });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      const [assetResult, hijriResult, hawlResult, portfolioResult, portfolioHistoryResult, widgetResult, safeToSpendResult, insightsResult] = await Promise.allSettled([
        api.getAssetTotal(),
        api.getIslamicCalendarToday(),
        api.getHawlDue(30),
        api.getPortfolioSummary(),
        api.getPortfolioHistory(2),
        api.getDashboardWidgets(),
        api.getSafeToSpend(),
        api.getDashboardInsights(),
      ]);

      if (cancelled) return;

      if (assetResult.status === 'fulfilled') setTotals(assetResult.value);
      else {
        // Round 17: suppress the red toast when the failure is a 403 /
        // "Plus required" message — that's the expected state for new
        // free-tier users who don't have asset totals in their plan.
        // Previously every fresh free signup saw a jarring "Failed to
        // load dashboard data" banner on their very first dashboard
        // render. The PlanGate component already renders a proper
        // upsell card in-place, so no toast is needed for that case.
        const errMsg = assetResult.reason instanceof Error
          ? assetResult.reason.message : String(assetResult.reason ?? '');
        const isPlanGate = /plus required|403|forbidden|upgrade/i.test(errMsg);
        if (!isPlanGate) {
          toast('Failed to load dashboard data. Please refresh.', 'error');
        }
      }
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
      if (safeToSpendResult.status === 'fulfilled') {
        setSafeToSpend(safeToSpendResult.value as typeof safeToSpend);
      }
      if (insightsResult.status === 'fulfilled' && Array.isArray(insightsResult.value?.insights)) {
        setInsights(insightsResult.value.insights);
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
  // Tick every minute so the trial banner flips on even if the user keeps
  // the dashboard open past their plan's expiration time.
  const [currentTimestamp, setCurrentTimestamp] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const id = setInterval(() => setCurrentTimestamp(Math.floor(Date.now() / 1000)), 60_000);
    return () => clearInterval(id);
  }, []);
  const isTrialExpired = user?.plan === 'free' && user?.planExpiresAt && user.planExpiresAt < currentTimestamp;
  const hasNoData = !loading && netWorthValue === 0 && !widgets?.recentTransactions?.transactions?.length;

  return (
    <div>
      {/* Onboarding Wizard for first-time users */}
      {showOnboarding && <OnboardingWizard onComplete={() => setShowOnboarding(false)} />}
      {!showOnboarding && showReferralPrompt && <ReferralPromptModal onDismiss={dismissReferralPrompt} />}

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

      {/* ── Compact Greeting (single line, Monarch-style) ─────────────────── */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span>{greeting.emoji}</span>
          {greeting.text}{user?.name ? `, ${user.name}` : ''}
          {hijri?.hijriDate && (
            <span className="text-gray-400 font-normal text-sm ml-2">· {hijri.hijriDate}</span>
          )}
        </p>
      </div>

      {/* ── Weekly Insight Banner (like Monarch's Weekly Recap) ────────────── */}
      {insights.length > 0 && (
        <div className="mb-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-lg">{insights[0].severity === 'good' ? '📈' : insights[0].severity === 'warning' ? '⚠️' : '💡'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-green-900 font-medium truncate">{insights[0].body}</p>
            {insights.length > 1 && (
              <p className="text-xs text-green-600 mt-0.5">{insights.length - 1} more insight{insights.length > 2 ? 's' : ''}</p>
            )}
          </div>
          <Link href="/dashboard/analytics" className="text-xs text-[#1B5E20] font-semibold hover:underline flex-shrink-0">View all →</Link>
        </div>
      )}

      {/* ── Referral Banner (dismissible, shows until first successful referral) ── */}
      {!referralBannerDismissed && !showReferralPrompt && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤝</span>
            <p className="text-sm text-green-800 font-medium">
              Invite family to Barakah — they get <strong>first month for $4.99</strong>, you get a free month
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/dashboard/referral" className="bg-[#1B5E20] text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#2E7D32] transition">
              Share
            </Link>
            <button
              onClick={() => { safeSetItem('barakah_referral_banner_dismissed', 'true'); setReferralBannerDismissed(true); }}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              aria-label="Dismiss referral banner"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* ── Islamic Calendar + Zakat Reminders (compact row above grid) ────── */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {hijri && (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Islamic Date</p>
                <p className="text-base font-bold text-[#1B5E20]">{hijri.hijriDate}</p>
              </div>
              {hijri.upcomingEvents.length > 0 && (
                <div className="text-right">
                  {hijri.upcomingEvents.slice(0, 2).map((e, i) => (
                    <p key={i} className="text-xs text-gray-500">
                      <span className="font-medium text-gray-700">{e.name}</span> · {e.daysAway}d
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {hawlDue && (hawlDue.dueCount > 0 || hawlDue.upcomingCount > 0) && (
          <div className={`rounded-xl p-4 border ${hawlDue.dueCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Hawl / Zakat</p>
                {hawlDue.dueCount > 0 ? (
                  <p className="text-base font-bold text-amber-700">{hawlDue.dueCount} due now</p>
                ) : (
                  <p className="text-base font-bold text-[#1B5E20]">{hawlDue.upcomingCount} upcoming</p>
                )}
              </div>
              <Link href="/dashboard/hawl" className="text-xs text-[#1B5E20] font-medium hover:underline">View →</Link>
            </div>
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
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard/import" className="inline-block bg-[#1B5E20] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2E7D32] transition">
              Connect Accounts
            </Link>
            <button
              onClick={async () => {
                try {
                  await api.seedDemoData();
                  trackDemoDataLoaded();
                  window.location.reload();
                } catch { toast('Could not load sample data.', 'error'); }
              }}
              className="inline-block border border-[#1B5E20] text-[#1B5E20] px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Load Sample Data to Explore
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-3">Sample data lets you explore every feature. Replace with real data anytime.</p>
        </div>
      )}

      {/* ── Summary Cards (full width, above grid) ──────────────────────── */}
      <div role="region" aria-label="Financial summary" className={`grid gap-4 mb-5 ${hasInvestmentPulse ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Net Worth</p>
            <button onClick={toggleHideNetWorth} className="text-[10px] text-gray-400 hover:text-gray-600">{hideNetWorth ? 'Show' : 'Hide'}</button>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {hideNetWorth ? '••••••' : (loading ? '...' : fmt(netWorthValue))}
          </p>
          {!hideNetWorth && widgets?.netWorthMini?.changeAmount != null && (
            <p className={`text-xs mt-1 font-medium ${(widgets.netWorthMini.changeAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(widgets.netWorthMini.changeAmount || 0) >= 0 ? '▲' : '▼'} {fmt(Math.abs(widgets.netWorthMini.changeAmount || 0))} ({(widgets.netWorthMini.changePercent || 0).toFixed(1)}%)
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Zakat Due</p>
            <div className="flex items-center gap-1">
              {Boolean(totals?.zakatFullyPaid) && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">PAID</span>}
              <button onClick={toggleHideZakat} className="text-[10px] text-gray-400 hover:text-gray-600">{hideZakat ? 'Show' : 'Hide'}</button>
            </div>
          </div>
          <p className={`text-xl font-bold ${totals?.zakatFullyPaid ? 'text-green-600' : 'text-amber-600'}`}>
            {hideZakat ? '••••••' : (loading ? '...' : fmt((totals?.zakatRemaining as number) ?? (totals?.zakatDue as number) ?? 0))}
          </p>
          {!hideZakat && !loading && ((totals?.zakatPaid as number) || 0) > 0 && !Boolean(totals?.zakatFullyPaid) && (
            <p className="text-xs text-gray-500 mt-1">
              Paid: {fmt((totals?.zakatPaid as number) || 0)} of {fmt((totals?.zakatDue as number) || 0)}
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Zakat Eligible</p>
          <p className={`text-xl font-bold ${totals?.zakatEligible ? 'text-green-600' : 'text-gray-400'}`}>
            {loading ? '...' : (totals?.zakatEligible ? 'Yes' : 'Not Yet')}
          </p>
        </div>
        {hasInvestmentPulse && (
          <Link href="/dashboard/investments" className="block bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Market Today</p>
            <p className={`text-xl font-bold ${dayMove >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dayMove >= 0 ? '+' : ''}{fmt(dayMove)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {dayMovePct >= 0 ? '+' : ''}{dayMovePct.toFixed(2)}% · {fmt(portfolioSummary?.totalValue || 0)}
            </p>
          </Link>
        )}
      </div>

      {/* ══════════════ TWO-COLUMN LAYOUT ══════════════ */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-6 mb-6">

      {/* ── LEFT COLUMN ─────────────────────────────────────────────────────── */}
      <div className="space-y-5">

      {/* ── Spending + Budget ──────────────────────────────────────────────── */}
      <div role="region" aria-label="Spending and budget overview" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spending Summary */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Spending This Month</p>
              <p className="text-2xl font-bold text-gray-900 truncate">
                {widgets?.spending ? fmt(widgets.spending.thisMonth) : loading ? '...' : fmt(0)}
              </p>
            </div>
            {widgets?.spending && widgets.spending.lastMonth >= 50 && (
              // Only surface the MoM comparison once last month had meaningful
              // spending ($50+). Under that, the % comparison is misleading
              // (used to render "▲ 999+%" every time a new account started).
              // Above the threshold we still cap at 500% so a genuine spike
              // doesn't explode the pill.
              <div className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${widgets.spending.changePercent <= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {widgets.spending.changePercent <= 0 ? '▼' : '▲'} {Math.abs(widgets.spending.changePercent) > 500 ? '500+' : Math.abs(widgets.spending.changePercent).toFixed(1)}%
              </div>
            )}
          </div>
          {widgets?.spending?.topCategories && widgets.spending.topCategories.length > 0 && (
            <div className="space-y-2 mt-3">
              {widgets.spending.topCategories.slice(0, 4).map((cat) => {
                const max = widgets.spending!.topCategories[0]?.amount || 1;
                return (
                  <div key={cat.category} className="flex items-center gap-2 min-w-0">
                    <span className="text-sm flex-shrink-0">{CATEGORY_ICONS[cat.category] || '📋'}</span>
                    <span className="text-xs text-gray-700 w-16 md:w-24 truncate capitalize flex-shrink-0">{cat.category.replace(/_/g, ' ')}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
                      <div className="bg-[#1B5E20] rounded-full h-2 transition-all" style={{ width: `${Math.min((cat.amount / max) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-900 flex-shrink-0 text-right">{fmt(cat.amount)}</span>
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
              <span className={`text-sm font-semibold ${widgets.budgetOverview.totalRemaining < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {widgets.budgetOverview.totalRemaining < 0
                  ? `${fmt(Math.abs(widgets.budgetOverview.totalRemaining))} over budget`
                  : `${fmt(widgets.budgetOverview.totalRemaining)} left`}
              </span>
            )}
          </div>
          {widgets?.budgetOverview?.categories && widgets.budgetOverview.categories.length > 0 ? (
            <div className="space-y-3">
              {widgets.budgetOverview.categories.slice(0, 4).map((cat) => (
                <div key={cat.category}>
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

      {/* ── Safe to Spend ──────────────────────────────────────────────── */}
      {safeToSpend && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Safe to Spend</p>
          <p className={`text-3xl font-bold ${safeToSpend.safeToSpend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {fmt(safeToSpend.safeToSpend)}
          </p>
          {safeToSpend.safeToSpend > 0 ? (
            <p className="text-sm text-gray-500 mt-1">
              {fmt(safeToSpend.dailySafeToSpend ?? (safeToSpend.daysRemainingInMonth > 0 ? safeToSpend.safeToSpend / safeToSpend.daysRemainingInMonth : 0))} per day for {safeToSpend.daysRemainingInMonth} days remaining
            </p>
          ) : (
            <p className="text-sm text-red-500 mt-1 font-medium">You&apos;ve exceeded your budget this month</p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 flex-wrap">
            <span>{fmt(safeToSpend.totalIncome)} income</span>
            <span>-</span>
            <span>{fmt(safeToSpend.totalBillsDue)} bills</span>
            <span>-</span>
            <span>{fmt(safeToSpend.totalSpent)} spent</span>
            <span>=</span>
            <span className={`font-semibold ${safeToSpend.safeToSpend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {fmt(safeToSpend.safeToSpend)}
            </span>
          </div>
        </div>
      )}

      {/* ── Net Worth Trend (in left column) ───────────────────────────────── */}
      {widgets?.netWorthMini && widgets.netWorthMini.history && widgets.netWorthMini.history.length > 1 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Net Worth — 90 Days</p>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-xl font-bold text-gray-900">
                  {hideNetWorth ? '••••••' : fmt(widgets.netWorthMini.currentNetWorth)}
                </p>
                {!hideNetWorth && (
                  <span className={`text-xs font-semibold ${(widgets.netWorthMini.changeAmount || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(widgets.netWorthMini.changeAmount || 0) >= 0 ? '▲' : '▼'} {fmt(Math.abs(widgets.netWorthMini.changeAmount || 0))} ({(widgets.netWorthMini.changePercent || 0).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
            <Link href="/dashboard/net-worth" className="text-xs text-[#1B5E20] font-medium hover:underline">Details →</Link>
          </div>
          {!hideNetWorth && (
            <div className="h-32 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={widgets.netWorthMini.history.map((p) => ({
                  date: new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                  netWorth: p.netWorth,
                }))}>
                  <defs>
                    <linearGradient id="nwGradientLeft" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B5E20" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1B5E20" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Tooltip formatter={(value) => [fmt(Number(value)), 'Net Worth']} labelStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="netWorth" stroke="#1B5E20" strokeWidth={2} fill="url(#nwGradientLeft)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      </div>{/* END LEFT COLUMN */}

      {/* ── RIGHT COLUMN ────────────────────────────────────────────────────── */}
      <div className="space-y-4 min-w-0">
        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 overflow-hidden">
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

      </div>{/* END RIGHT COLUMN */}
      </div>{/* END TWO-COLUMN GRID */}

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

      {/* Upgrade nudge for free plan — above the feature grid so it can't be missed */}
      {user?.plan === 'free' && (
        <div className="bg-gradient-to-r from-[#1B5E20] to-green-600 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-white min-w-0">
            <p className="font-bold text-sm sm:text-base">🌙 Unlock Barakah Plus — from {PRICING.plus.monthly}/mo</p>
            <p className="text-green-200 text-xs mt-0.5">Unlimited transactions · Bank sync · Halal screener · Zakat autopilot</p>
          </div>
          <Link
            href="/dashboard/billing"
            className="bg-white text-[#1B5E20] px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-50 transition flex-shrink-0"
          >
            Upgrade
          </Link>
        </div>
      )}

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
