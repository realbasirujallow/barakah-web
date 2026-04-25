'use client';
import { useAuth, hasAccess, isIntentionalLogout } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, ReactNode, useState } from 'react';
import { ToastProvider } from '../../lib/toast';
import { useDarkMode, toggleDarkMode as toggleDarkModeShared } from '../../lib/useDarkMode';

import { NotificationBell } from './NotificationBell';
import { FeedbackWidget } from './FeedbackWidget';
import { SessionTimeoutModal } from '../../components/SessionTimeoutModal';
// OnboardingTour removed Round 17 — see comment near bottom of file.
import TrialBanner from '../../components/TrialBanner';
import AnnualUpgradeBanner from '../../components/AnnualUpgradeBanner';
import AnnualUpgradeModal from '../../components/AnnualUpgradeModal';
import { isSetupComplete } from '../../lib/setup';

// 'plus' = Plus or Family plan required | 'family' = Family plan only
const navItems: { href: string; icon: string; label: string; gate?: 'plus' | 'family' }[] = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  // ── Free features (alphabetized) ──────────────────────────────────────────
  { href: '/dashboard/assets', icon: '💰', label: 'Assets' },
  { href: '/dashboard/ledger', icon: '📋', label: 'Audit Ledger' },
  { href: '/dashboard/billing', icon: '💳', label: 'Billing & Plans' },
  { href: '/dashboard/bills', icon: '🔔', label: 'Bills' },
  { href: '/dashboard/budget', icon: '📊', label: 'Budget' },
  { href: '/dashboard/debts', icon: '💳', label: 'Debts' },
  { href: '/dashboard/family', icon: '👨‍👩‍👧‍👦', label: 'Family', gate: 'family' },
  { href: '/dashboard/faraid', icon: '⚖️', label: 'Faraid Calculator', gate: 'plus' },
  { href: '/dashboard/fiqh', icon: '📚', label: 'Fiqh Settings' },
  { href: '/dashboard/hawl', icon: '⏰', label: 'Hawl Tracker' },
  { href: '/dashboard/ibadah', icon: '🕋', label: 'Ibadah Finance' },
  { href: '/dashboard/import', icon: '📥', label: 'Import Data' },
  { href: '/dashboard/market-prices', icon: '📈', label: 'Market Prices' },
  { href: '/dashboard/notifications', icon: '🔔', label: 'Notifications' },
  { href: '/dashboard/prayer-times', icon: '🕌', label: 'Prayer Times' },
  { href: '/dashboard/profile', icon: '👤', label: 'Profile & Settings' },
  { href: '/dashboard/ramadan', icon: '🌙', label: 'Ramadan Mode' },
  { href: '/dashboard/recurring', icon: '🔁', label: 'Recurring' },
  { href: '/dashboard/referral', icon: '🎁', label: 'Refer a Friend' },
  { href: '/dashboard/reports', icon: '📊', label: 'Reports' },
  { href: '/dashboard/retirement-zakat', icon: '🏦', label: 'Retirement Zakat' },
  { href: '/dashboard/sadaqah', icon: '🤲', label: 'Sadaqah' },
  { href: '/dashboard/savings', icon: '🎯', label: 'Savings Goals' },
  { href: '/dashboard/transactions', icon: '📝', label: 'Transactions' },
  { href: '/dashboard/zakat', icon: '🕌', label: 'Zakat' },
  // ── Premium features (alphabetized) ───────────────────────────────────────
  { href: '/dashboard/analytics', icon: '📊', label: 'Analytics', gate: 'plus' },
  { href: '/dashboard/categorize', icon: '🔄', label: 'Auto-Categorize', gate: 'plus' },
  { href: '/dashboard/barakah-score', icon: '⭐', label: 'Barakah Score', gate: 'plus' },
  { href: '/dashboard/summary', icon: '📋', label: 'Financial Summary', gate: 'plus' },
  { href: '/dashboard/halal', icon: '✅', label: 'Stock Screener', gate: 'plus' },
  { href: '/dashboard/investments', icon: '📈', label: 'Investments', gate: 'plus' },
  { href: '/dashboard/net-worth', icon: '💎', label: 'Net Worth', gate: 'plus' },
  { href: '/dashboard/riba', icon: '🛡️', label: 'Riba Detector', gate: 'plus' },
  { href: '/dashboard/subscriptions', icon: '🔄', label: 'Subscription Detector', gate: 'plus' },
  { href: '/dashboard/shared', icon: '👥', label: 'Shared Finances', gate: 'family' },
  { href: '/dashboard/waqf', icon: '🏛️', label: 'Waqf', gate: 'plus' },
  { href: '/dashboard/wasiyyah', icon: '📜', label: 'Wasiyyah', gate: 'plus' },
  // Admin page is intentionally NOT listed here — access via direct URL only.
];

// Dark-mode external store helpers live in lib/useDarkMode.ts so that both
// the layout and the profile page stay in sync with the same DOM-backed
// state. Reading the `dark` class directly (rather than mirroring it in
// React state) avoids the react-hooks/set-state-in-effect lint warning and
// guarantees we never drift from the authoritative DOM value (which the
// bootstrap script flips before hydration to prevent FOUC).

type SidebarSection = 'finance' | 'islamic' | 'premium' | 'account';

const sectionConfig: Record<SidebarSection, { label: string; items: string[] }> = {
  finance: {
    label: 'Finance',
    items: ['Assets', 'Audit Ledger', 'Bills', 'Budget', 'Debts', 'Recurring', 'Savings Goals', 'Transactions'],
  },
  islamic: {
    label: 'Islamic',
    items: ['Ibadah Finance', 'Fiqh Settings', 'Hawl Tracker', 'Prayer Times', 'Ramadan Mode', 'Retirement Zakat', 'Sadaqah', 'Zakat'],
  },
  premium: {
    label: 'Premium',
    items: ['Analytics', 'Auto-Categorize', 'Barakah Score', 'Family', 'Faraid Calculator', 'Financial Summary', 'Stock Screener', 'Investments', 'Net Worth', 'Riba Detector', 'Shared Finances', 'Subscription Detector', 'Waqf', 'Wasiyyah'],
  },
  account: {
    label: 'Account',
    items: ['Billing & Plans', 'Import Data', 'Notifications', 'Profile & Settings', 'Refer a Friend'],
  },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Dark-mode flag is a view over the `dark` class on <html> — the authoritative
  // source of truth (set before hydration by a bootstrap script to avoid FOUC).
  // useSyncExternalStore subscribes to class-attribute changes so the UI stays
  // in sync regardless of which code path flips the class. Server snapshot is
  // `false` to match the initial server-rendered HTML and avoid hydration mismatch.
  const darkMode = useDarkMode();

  const toggleDarkMode = () => {
    // Mutate the DOM; the MutationObserver in darkModeSubscribe wakes the
    // useSyncExternalStore subscribers so React re-renders with the new value.
    toggleDarkModeShared();
  };
  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    finance: true,
    islamic: true,
    premium: true,
    account: true,
  });

  const toggleSection = (section: SidebarSection) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // HIGH BUG FIX (H-5): Computing new Date().toLocaleDateString() during render
  // (via useMemo with empty deps) executes once on the server and once on the
  // client, which produces different strings near midnight and triggers a
  // hydration mismatch. Move to a client-only effect so SSR renders an empty
  // header and the client fills it in after hydration. We defer the setState
  // with setTimeout(0) to satisfy react-hooks/set-state-in-effect — the codebase
  // uses this same pattern in context/AuthContext.tsx.
  const [headerDate, setHeaderDate] = useState('');
  useEffect(() => {
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      try {
        // Round 24: undefined locale → browser default. Matches R23
        // useCurrency + NotificationBell / notifications date pattern.
        setHeaderDate(new Date().toLocaleDateString(undefined, {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        }));
      } catch { /* Intl unavailable */ }
    }, 0);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, []);

  useEffect(() => {
    // Only redirect with ?reason=expired if this wasn't an intentional
    // logout or account deletion — those flows handle their own redirect.
    if (!isLoading && !user && !isIntentionalLogout()) {
      router.push('/login?reason=expired');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (isLoading || !user) return;
    // Round 23: server-side `setupCompletedAt` is the canonical flag;
    // fall back to localStorage only for pre-migration accounts. This
    // kills the cross-device redirect ping-pong that the old
    // `hasCompletedGuidedSetup(user.id)` check caused on a fresh
    // browser whose localStorage didn't know about the completion.
    if (!isSetupComplete(user.id, user.setupCompletedAt)) {
      router.replace('/setup');
    }
  }, [isLoading, router, user]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Win/Linux) → focus transaction search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('tx-search') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          // Navigate to transactions page if not already there
          router.push('/dashboard/transactions');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  // ── NOTE: Proactive refresh removed from layout ──────────────────────────
  // Previously this layout fired api.refresh() on every pathname change.
  // This caused a "rotation death spiral": the layout and AuthContext both
  // fired concurrent refresh requests with the same token. The first
  // succeeded (rotating the token), but the second used the now-revoked
  // token and returned 'expired', triggering logout.
  //
  // Token freshness is now handled entirely by:
  //   1. AuthContext mount-time refresh (with 30s guard)
  //   2. AuthContext 4-minute background interval
  //   3. api.ts 401-handler (reactive refresh on any failed request)
  // All three go through deduplicatedRefresh() so concurrent calls are safe.

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">Loading...</div>;
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">
      <div className="text-center">
        <p className="text-4xl mb-3">&#127769;</p>
        <p className="text-[#1B5E20] font-medium">Signing out...</p>
      </div>
    </div>
  );

  const renderNavLink = (item: typeof navItems[0], locked: boolean) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setSidebarOpen(false)}
      aria-label={item.label}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
        pathname === item.href
          ? 'bg-green-800 text-white font-semibold'
          : locked
            ? 'text-green-600 hover:bg-green-800/30'
            : 'text-green-200 hover:bg-green-800/50'
      }`}
    >
      <span>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {locked && <span className="text-xs opacity-60">🔒</span>}
    </Link>
  );

  const renderSection = (section: SidebarSection) => {
    const isExpanded = expandedSections[section];
    const config = sectionConfig[section];
    const sectionItems = navItems.filter(item => config.items.includes(item.label));
    const filteredItems = sectionItems.filter(item => !item.gate || hasAccess(user.plan, item.gate, user.planExpiresAt));
    const lockedInSection = sectionItems.filter(item => item.gate && !hasAccess(user.plan, item.gate, user.planExpiresAt));

    if (filteredItems.length === 0 && lockedInSection.length === 0) return null;

    return (
      <div key={section} className="mb-2">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center gap-2 px-4 py-2 text-green-400 hover:text-green-200 text-xs uppercase tracking-wide font-medium transition"
        >
          <span className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          {config.label}
        </button>
        {isExpanded && (
          <div className="space-y-1 pl-2">
            {filteredItems.map(item => renderNavLink(item, false))}
            {lockedInSection.map(item => renderNavLink(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex">
      {/* Sidebar */}
      <aside id="dashboard-sidebar" className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1B5E20] text-white transform transition-transform lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-green-800">
          <h1 className="text-xl font-bold">&#127769; Barakah</h1>
          <p className="text-green-300 text-sm mt-1">{user.name}</p>
        </div>
        <nav className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {/* Dashboard — always at top, ungrouped */}
          {renderNavLink(navItems[0], false)}
          <div className="my-3 border-t border-green-700" />

          {/* Collapsible sections */}
          {renderSection('finance')}
          {renderSection('islamic')}
          {renderSection('premium')}
          {renderSection('account')}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-800">
          <button
            onClick={toggleDarkMode}
            className="w-full text-left px-4 py-2 text-green-300 hover:text-white text-sm transition flex items-center gap-2 mb-1"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'} {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={() => logout('logout')} className="w-full text-left px-4 py-2 text-green-300 hover:text-white text-sm transition">
            &#x2192; Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content — ToastProvider hoisted to wrap the full shell so
          NotificationBell, SessionTimeoutModal, AnnualUpgradeModal,
          FeedbackWidget, and OnboardingWizard can all dispatch toasts. */}
      <ToastProvider>
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
            {/* Round 19: added aria-expanded / aria-controls so screen
                readers and keyboard users can tell whether the sidebar
                is open/closed. The marketing hamburger (/app/page.tsx)
                got the same treatment in Round 18. */}
            <button
              className="lg:hidden text-[#1B5E20]"
              onClick={() => setSidebarOpen(true)}
              aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={sidebarOpen}
              aria-controls="dashboard-sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              {headerDate && <span className="text-xs text-gray-500 hidden md:block">📅 {headerDate}</span>}
              <button
                onClick={toggleDarkMode}
                className="text-gray-500 hover:text-[#1B5E20] text-lg transition"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <NotificationBell />
              <p className="text-sm text-gray-500">Assalamu Alaikum, <span className="font-semibold text-[#1B5E20]">{user.name}</span></p>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <TrialBanner />
            <AnnualUpgradeBanner />
            {children}
          </main>
          <footer className="px-6 py-3 text-center text-xs text-gray-400 border-t bg-white">
            <Link href="/disclaimer" className="hover:text-[#1B5E20] hover:underline transition">
              ⚠️ Disclaimer &amp; Islamic Guidance Notice
            </Link>
            <span className="mx-2">·</span>
            <span>Not a fatwa — consult a qualified scholar for your specific situation</span>
          </footer>
        </div>

        {/* Session timeout warning — remind at 55 min and auto-logout after 60 min of inactivity */}
        <SessionTimeoutModal />

        {/* Annual upgrade modal — shown mid-session to monthly Plus/Family subscribers active 30+ days */}
        <AnnualUpgradeModal />

        {/* Floating feedback widget — visible on all dashboard pages */}
        <FeedbackWidget />

        {/*
          Onboarding tour removed Round 17 — dashboard/page.tsx now renders
          &lt;OnboardingWizard /&gt; which is the newer, data-aware flow. Both
          components shared the `barakah_onboarded` localStorage key, so
          first-run users were seeing two stacked modals and whichever
          completed first dismissed the other. The tour file remains
          unused; consider deleting it once we're sure no beta users are
          mid-tour when they upgrade.
        */}
      </ToastProvider>
    </div>
  );
}
