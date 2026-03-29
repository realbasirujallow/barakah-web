'use client';
import { useAuth, hasAccess, isIntentionalLogout } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, ReactNode, useState, useMemo } from 'react';
import { ToastProvider } from '../../lib/toast';
import { NotificationBell } from './NotificationBell';
import { FeedbackWidget } from './FeedbackWidget';

// 'plus' = Plus or Family plan required | 'family' = Family plan only
const navItems: { href: string; icon: string; label: string; gate?: 'plus' | 'family' }[] = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  // ── Free features (alphabetized) ──────────────────────────────────────────
  { href: '/dashboard/assets', icon: '💰', label: 'Assets' },
  { href: '/dashboard/billing', icon: '💳', label: 'Billing & Plans' },
  { href: '/dashboard/bills', icon: '🔔', label: 'Bills' },
  { href: '/dashboard/budget', icon: '📊', label: 'Budget' },
  { href: '/dashboard/debts', icon: '💳', label: 'Debts' },
  { href: '/dashboard/hawl', icon: '⏰', label: 'Hawl Tracker' },
  { href: '/dashboard/import', icon: '📥', label: 'Import Data' },
  { href: '/dashboard/notifications', icon: '🔔', label: 'Notifications' },
  { href: '/dashboard/prayer-times', icon: '🕌', label: 'Prayer Times' },
  { href: '/dashboard/profile', icon: '👤', label: 'Profile & Settings' },
  { href: '/dashboard/ramadan', icon: '🌙', label: 'Ramadan Mode' },
  { href: '/dashboard/referral', icon: '🎁', label: 'Refer a Friend' },
  { href: '/dashboard/recurring', icon: '🔁', label: 'Recurring' },
  { href: '/dashboard/sadaqah', icon: '🤲', label: 'Sadaqah' },
  { href: '/dashboard/savings', icon: '🎯', label: 'Savings Goals' },
  { href: '/dashboard/transactions', icon: '📝', label: 'Transactions' },
  { href: '/dashboard/zakat', icon: '🕌', label: 'Zakat' },
  // ── Premium features (alphabetized) ───────────────────────────────────────
  { href: '/dashboard/analytics', icon: '📊', label: 'Analytics', gate: 'plus' },
  { href: '/dashboard/categorize', icon: '🔄', label: 'Auto-Categorize', gate: 'plus' },
  { href: '/dashboard/barakah-score', icon: '⭐', label: 'Barakah Score', gate: 'plus' },
  { href: '/dashboard/summary', icon: '📋', label: 'Financial Summary', gate: 'plus' },
  { href: '/dashboard/halal', icon: '✅', label: 'Halal Screener', gate: 'plus' },
  { href: '/dashboard/investments', icon: '📈', label: 'Investments', gate: 'plus' },
  { href: '/dashboard/net-worth', icon: '💎', label: 'Net Worth', gate: 'plus' },
  { href: '/dashboard/riba', icon: '🛡️', label: 'Riba Detector', gate: 'plus' },
  { href: '/dashboard/shared', icon: '👥', label: 'Shared Finances', gate: 'family' },
  { href: '/dashboard/waqf', icon: '🏛️', label: 'Waqf', gate: 'plus' },
  { href: '/dashboard/wasiyyah', icon: '📜', label: 'Wasiyyah', gate: 'plus' },
  // Admin page is intentionally NOT listed here — access via direct URL only.
];

type SidebarSection = 'finance' | 'islamic' | 'premium' | 'account';

const sectionConfig: Record<SidebarSection, { label: string; items: string[] }> = {
  finance: {
    label: 'Finance',
    items: ['Assets', 'Budget', 'Bills', 'Debts', 'Recurring', 'Savings Goals', 'Transactions'],
  },
  islamic: {
    label: 'Islamic',
    items: ['Hawl Tracker', 'Prayer Times', 'Ramadan Mode', 'Sadaqah', 'Zakat'],
  },
  premium: {
    label: 'Premium',
    items: ['Analytics', 'Auto-Categorize', 'Barakah Score', 'Financial Summary', 'Halal Screener', 'Investments', 'Net Worth', 'Riba Detector', 'Shared Finances', 'Waqf', 'Wasiyyah'],
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
  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    finance: true,
    islamic: true,
    premium: true,
    account: true,
  });

  const toggleSection = (section: SidebarSection) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hijriDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
    } catch {
      return '';
    }
  }, []);

  useEffect(() => {
    // Only redirect with ?reason=expired if this wasn't an intentional
    // logout or account deletion — those flows handle their own redirect.
    if (!isLoading && !user && !isIntentionalLogout()) {
      router.push('/login?reason=expired');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF8E1]">Loading...</div>;
  if (!user) return null;

  const renderNavLink = (item: typeof navItems[0], locked: boolean) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setSidebarOpen(false)}
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
    const filteredItems = sectionItems.filter(item => !item.gate || hasAccess(user.plan, item.gate));
    const lockedInSection = sectionItems.filter(item => item.gate && !hasAccess(user.plan, item.gate));

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
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1B5E20] text-white transform transition-transform lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
          <button onClick={() => logout('logout')} className="w-full text-left px-4 py-2 text-green-300 hover:text-white text-sm transition">
            &#x2192; Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
          <button className="lg:hidden text-[#1B5E20]" onClick={() => setSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            {hijriDate && <span className="text-xs text-green-600 hidden md:block">🌙 {hijriDate}</span>}
            <NotificationBell />
            <p className="text-sm text-gray-500">Assalamu Alaikum, <span className="font-semibold text-[#1B5E20]">{user.name}</span></p>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <ToastProvider>
            {children}
          </ToastProvider>
        </main>
        <footer className="px-6 py-3 text-center text-xs text-gray-400 border-t bg-white">
          <Link href="/disclaimer" className="hover:text-[#1B5E20] hover:underline transition">
            ⚠️ Disclaimer &amp; Islamic Guidance Notice
          </Link>
          <span className="mx-2">·</span>
          <span>Not a fatwa — consult a qualified scholar for your specific situation</span>
        </footer>
      </div>

      {/* Floating feedback widget — visible on all dashboard pages */}
      <FeedbackWidget />
    </div>
  );
}
