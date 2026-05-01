'use client';
import { useAuth, hasAccess, isIntentionalLogout } from '../../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import HeroLink from '../../components/HeroLink';
import { useEffect, ReactNode, useState } from 'react';
import { ToastProvider } from '../../lib/toast';
import { useDarkMode, toggleDarkMode as toggleDarkModeShared } from '../../lib/useDarkMode';
import { recordVisit } from '../../lib/lastVisit';
import {
  LayoutDashboard, Wallet, BookOpen, CreditCard, Receipt, PieChart, Landmark,
  Users, Scale, BookMarked, CalendarClock, Heart, Upload, LineChart, Bell,
  Moon, User, RefreshCw, Gift, FileBarChart, PiggyBank, HandHeart, Target,
  ArrowLeftRight, Coins, BarChart3, Tags, Star, FileText, ShieldCheck,
  TrendingUp, Gem, Shield, ShoppingCart, Building2, ScrollText, Wrench,
  Globe, Eye, Crosshair, Filter, Award,
  type LucideIcon,
} from 'lucide-react';

import { NotificationBell } from './NotificationBell';
import { FeedbackWidget } from './FeedbackWidget';
import { SessionTimeoutModal } from '../../components/SessionTimeoutModal';
// OnboardingTour removed Round 17 — see comment near bottom of file.
import TrialBanner from '../../components/TrialBanner';
import AnnualUpgradeBanner from '../../components/AnnualUpgradeBanner';
import AnnualUpgradeModal from '../../components/AnnualUpgradeModal';
import { isSetupComplete } from '../../lib/setup';

// 'plus' = Plus or Family plan required | 'family' = Family plan only
// `adminOnly` items render in a separate Admin section that's hidden from
// non-admin users entirely. Lets the founder reach admin surfaces in one
// click instead of typing each /dashboard/admin/X URL by hand.
// Phase 10 (Apr 30 2026) — Lucide icons replace emoji nav glyphs and
// plain-language labels lead for Islamic modules. The competitive UX
// audit (third-party agent, Apr 30) flagged emoji nav as "utility-heavy"
// and Hawl/Faraid/Wasiyyah/Waqf as "cognitive load for new users."
//
// Plain-language strategy: lead with the English meaning; users who
// recognise the Arabic term still see it on the destination page header.
// Words kept in Arabic where they are well-known to the audience and
// where the English translation loses precision (Sadaqah, Fiqh, Ibadah,
// Ramadan, Zakat).
const navItems: { href: string; icon: LucideIcon; label: string; gate?: 'plus' | 'family'; adminOnly?: boolean }[] = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  // ── Free features (alphabetized) ──────────────────────────────────────────
  { href: '/dashboard/assets', icon: Wallet, label: 'Assets' },
  { href: '/dashboard/ledger', icon: BookOpen, label: 'Audit Ledger' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing & Plans' },
  { href: '/dashboard/bills', icon: Receipt, label: 'Bills' },
  { href: '/dashboard/budget', icon: PieChart, label: 'Budget' },
  { href: '/dashboard/debts', icon: Landmark, label: 'Debts' },
  { href: '/dashboard/family', icon: Users, label: 'Family', gate: 'family' },
  { href: '/dashboard/faraid', icon: Scale, label: 'Inheritance Calculator', gate: 'plus' },
  { href: '/dashboard/fiqh', icon: BookMarked, label: 'Fiqh Settings' },
  { href: '/dashboard/hawl', icon: CalendarClock, label: 'Zakat Anniversary' },
  { href: '/dashboard/ibadah', icon: Heart, label: 'Ibadah Finance' },
  { href: '/dashboard/import', icon: Upload, label: 'Import Data' },
  { href: '/dashboard/market-prices', icon: LineChart, label: 'Market Prices' },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
  { href: '/dashboard/prayer-times', icon: Moon, label: 'Prayer Times' },
  { href: '/dashboard/profile', icon: User, label: 'Profile & Settings' },
  { href: '/dashboard/ramadan', icon: Moon, label: 'Ramadan Mode' },
  { href: '/dashboard/recurring', icon: RefreshCw, label: 'Recurring' },
  { href: '/dashboard/referral', icon: Gift, label: 'Refer a Friend' },
  { href: '/dashboard/reports', icon: FileBarChart, label: 'Reports' },
  { href: '/dashboard/retirement-zakat', icon: PiggyBank, label: 'Retirement Zakat' },
  { href: '/dashboard/sadaqah', icon: HandHeart, label: 'Sadaqah' },
  { href: '/dashboard/savings', icon: Target, label: 'Savings Goals' },
  { href: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/dashboard/zakat', icon: Coins, label: 'Zakat' },
  // ── Premium features (alphabetized) ───────────────────────────────────────
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics', gate: 'plus' },
  { href: '/dashboard/categorize', icon: Tags, label: 'Auto-Categorize', gate: 'plus' },
  { href: '/dashboard/barakah-score', icon: Star, label: 'Barakah Score', gate: 'plus' },
  { href: '/dashboard/summary', icon: FileText, label: 'Financial Summary', gate: 'plus' },
  { href: '/dashboard/halal', icon: ShieldCheck, label: 'Stock Screener', gate: 'plus' },
  { href: '/dashboard/investments', icon: TrendingUp, label: 'Investments', gate: 'plus' },
  { href: '/dashboard/net-worth', icon: Gem, label: 'Net Worth', gate: 'plus' },
  { href: '/dashboard/riba', icon: Shield, label: 'Riba Detector', gate: 'plus' },
  { href: '/dashboard/subscriptions', icon: ShoppingCart, label: 'Subscription Detector', gate: 'plus' },
  { href: '/dashboard/shared', icon: Users, label: 'Shared Finances', gate: 'family' },
  { href: '/dashboard/waqf', icon: Building2, label: 'Endowment', gate: 'plus' },
  { href: '/dashboard/wasiyyah', icon: ScrollText, label: 'Islamic Will', gate: 'plus' },
  // ── Admin (founder/staff only — gated by user.isAdmin) ───────────────────
  { href: '/dashboard/admin', icon: Wrench, label: 'Admin Home', adminOnly: true },
  { href: '/dashboard/admin/halal-screening', icon: ShieldCheck, label: 'Halal Screening', adminOnly: true },
  { href: '/dashboard/admin/email-locales', icon: Globe, label: 'Email Locales', adminOnly: true },
  { href: '/dashboard/admin/email-preview', icon: Eye, label: 'Email Preview', adminOnly: true },
  { href: '/dashboard/admin/acquisition', icon: Crosshair, label: 'Acquisition', adminOnly: true },
  { href: '/dashboard/admin/growth', icon: TrendingUp, label: 'Growth', adminOnly: true },
  { href: '/dashboard/admin/funnel', icon: Filter, label: 'Funnel', adminOnly: true },
  { href: '/dashboard/admin/scorecard', icon: Award, label: 'Scorecard', adminOnly: true },
];

// Dark-mode external store helpers live in lib/useDarkMode.ts so that both
// the layout and the profile page stay in sync with the same DOM-backed
// state. Reading the `dark` class directly (rather than mirroring it in
// React state) avoids the react-hooks/set-state-in-effect lint warning and
// guarantees we never drift from the authoritative DOM value (which the
// bootstrap script flips before hydration to prevent FOUC).

// Phase 12.2 (Apr 30 2026) — IA rebuild per the third-party UX audit.
//
// Old sections: Finance / Islamic / Premium / Account / Admin
// (Premium grouped by *plan tier* instead of by *use case*, which forced
// users to mentally cross-reference "what category does this fall under"
// against "do I have access to this." Audit called this out specifically.)
//
// New sections, by USE not by PLAN — premium-gated items live in their
// natural bucket with the "Plus" pill indicating gating:
//   • Spending  — daily money flow (transactions, budget, recurring,
//                 subscription detector, riba detector, auto-categorize,
//                 analytics, audit ledger)
//   • Plan      — multi-month / yearly horizon (savings goals, debts,
//                 bills, retirement zakat, net worth, investments,
//                 stock screener, assets, barakah score, financial
//                 summary, reports, market prices, import data)
//   • Islamic   — fiqh-bound tools (zakat, zakat anniversary, sadaqah,
//                 prayer times, ramadan mode, fiqh settings, ibadah
//                 finance, inheritance calculator, islamic will,
//                 endowment)
//   • Family    — household scope (family, shared finances)
//   • Profile   — personal account chrome (billing & plans, profile &
//                 settings, notifications, refer a friend)
//   • Admin     — founder/staff (kept as-is, hidden for non-admins)
//
// Premium items keep their `gate: 'plus' | 'family'` flag in navItems —
// the pill renders next to them regardless of which section they live
// in now. Free-tier users still see locked entries so they understand
// what's available with an upgrade.
type SidebarSection = 'spending' | 'plan' | 'islamic' | 'family' | 'profile' | 'admin';

const sectionConfig: Record<SidebarSection, { label: string; items: string[] }> = {
  spending: {
    label: 'Spending',
    items: ['Transactions', 'Budget', 'Recurring', 'Audit Ledger', 'Auto-Categorize', 'Analytics', 'Riba Detector', 'Subscription Detector'],
  },
  plan: {
    label: 'Plan',
    items: ['Savings Goals', 'Debts', 'Bills', 'Retirement Zakat', 'Assets', 'Net Worth', 'Investments', 'Stock Screener', 'Market Prices', 'Barakah Score', 'Financial Summary', 'Reports', 'Import Data'],
  },
  islamic: {
    label: 'Islamic',
    items: ['Zakat', 'Zakat Anniversary', 'Sadaqah', 'Prayer Times', 'Ramadan Mode', 'Fiqh Settings', 'Ibadah Finance', 'Inheritance Calculator', 'Islamic Will', 'Endowment'],
  },
  family: {
    label: 'Family',
    items: ['Family', 'Shared Finances'],
  },
  profile: {
    label: 'Profile',
    items: ['Profile & Settings', 'Billing & Plans', 'Notifications', 'Refer a Friend'],
  },
  admin: {
    label: 'Admin',
    items: ['Admin Home', 'Halal Screening', 'Email Locales', 'Email Preview', 'Acquisition', 'Growth', 'Funnel', 'Scorecard'],
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
  // Sidebar density: only the section CONTAINING the current route opens
  // by default; the others collapse so the nav doesn't bury the user in
  // 30+ links on first load. Finance opens too because it's the most-
  // used section on a typical session. Once the user toggles a section
  // they keep that state for the rest of their session (in-memory, not
  // persisted — keeps the no-storage promise).
  const sectionForPath = (p: string): SidebarSection | null => {
    for (const [section, config] of Object.entries(sectionConfig) as [SidebarSection, { items: string[] }][]) {
      const items = navItems.filter(item => config.items.includes(item.label));
      if (items.some(item => item.href === p)) return section;
    }
    return null;
  };
  const initialActiveSection = sectionForPath(pathname);
  // Phase 12.2: Spending is the universal "open by default" — every user
  // looks at transactions/budget regularly. The currently-active section
  // also opens (so the user sees the link they're on highlighted).
  // Everything else collapses to keep the sidebar calm on first paint.
  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    spending: true,
    plan: initialActiveSection === 'plan',
    islamic: initialActiveSection === 'islamic',
    family: initialActiveSection === 'family',
    profile: initialActiveSection === 'profile',
    admin: initialActiveSection === 'admin',
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

  // Phase 14 (2026-04-30): record the user's last meaningful dashboard
  // visit so the home page can show "Continue where you left off". The
  // recorder skips /dashboard root + admin/billing/import (per the
  // SKIP_PREFIXES list in lastVisit.ts) so the home page never points
  // back at itself.
  useEffect(() => {
    if (pathname) recordVisit(pathname);
  }, [pathname]);

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
        <p className="text-primary font-medium">Signing out...</p>
      </div>
    </div>
  );

  // ── Phase 4.3 (2026-04-27) — Monarch-style sidebar tokens ─────────────
  // Light surface (bg-sidebar = oklch 0.99 0.005 165, subtle teal-tinted
  // off-white) with dark foreground (text-sidebar-foreground). Active
  // route gets bg-primary text-primary-foreground (the new softer teal
  // pill). Section header buttons use text-muted-foreground; hover
  // surfaces use bg-sidebar-accent. Every colour now respects light/
  // dark mode via the OKLCH variables in globals.css.
  const renderNavLink = (item: typeof navItems[0], locked: boolean) => {
    const Icon = item.icon;
    // R43 (2026-05-01): HeroLink (no heroName) wraps router.push in
    // document.startViewTransition so cross-fading between any two
    // dashboard subpages feels smooth instead of snapping. We pass
    // the existing setSidebarOpen(false) side-effect through
    // onBeforeNavigate so mobile drawer-close still happens. Browsers
    // without View Transitions API support fall through to plain
    // navigation, so this is purely additive.
    return (
      <HeroLink
        key={item.href}
        href={item.href}
        onBeforeNavigate={() => setSidebarOpen(false)}
        aria-label={item.label}
        aria-current={pathname === item.href ? 'page' : undefined}
        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
          pathname === item.href
            ? 'bg-primary text-primary-foreground font-semibold'
            : locked
              ? 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{item.label}</span>
        {locked && (
          <span className="text-[10px] uppercase tracking-wider opacity-60 font-semibold" aria-label="Premium only">
            Plus
          </span>
        )}
      </HeroLink>
    );
  };

  const renderSection = (section: SidebarSection) => {
    if (section === 'admin' && !user.isAdmin) return null;

    const isExpanded = expandedSections[section];
    const config = sectionConfig[section];
    const sectionItems = navItems
        .filter(item => config.items.includes(item.label))
        .filter(item => !item.adminOnly || user.isAdmin);
    const filteredItems = sectionItems.filter(item => !item.gate || hasAccess(user.plan, item.gate, user.planExpiresAt));
    const lockedInSection = sectionItems.filter(item => item.gate && !hasAccess(user.plan, item.gate, user.planExpiresAt));

    if (filteredItems.length === 0 && lockedInSection.length === 0) return null;

    return (
      <div key={section} className="mb-1">
        <button
          onClick={() => toggleSection(section)}
          aria-expanded={isExpanded}
          className="w-full flex items-center gap-2 px-3 py-1.5 text-muted-foreground hover:text-foreground text-[11px] uppercase tracking-wider font-semibold transition-colors"
        >
          <span className={`transition-transform text-[8px] ${isExpanded ? 'rotate-90' : ''}`} aria-hidden="true">
            ▶
          </span>
          {config.label}
        </button>
        {isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {filteredItems.map(item => renderNavLink(item, false))}
            {lockedInSection.map(item => renderNavLink(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex">
      {/*
        Phase 4.3 sidebar — Monarch-style light surface with semantic
        shadcn tokens. The sidebar is now a 3-row flex column (header /
        scrollable nav / footer); the visible chrome reads as
        bg-sidebar / text-sidebar-foreground / border-sidebar-border so
        light & dark modes auto-derive from globals.css. The active
        nav item is a brand-teal pill (bg-primary text-primary-foreground)
        — much closer to Monarch's clean active state than the old
        saturated dark-green block.
      */}
      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transform transition-transform lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-5 py-5 border-b border-sidebar-border flex-shrink-0">
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <span aria-hidden="true">🌙</span>
            <span>Barakah</span>
          </h1>
          <p className="text-muted-foreground text-xs mt-0.5 truncate">{user.name}</p>
        </div>
        <nav className="px-3 py-3 overflow-y-auto flex-1 min-h-0">
          {/* Dashboard — always at top, ungrouped */}
          {renderNavLink(navItems[0], false)}
          <div className="my-2 h-px bg-sidebar-border" />

          {/* Collapsible sections */}
          {renderSection('spending')}
          {renderSection('plan')}
          {renderSection('islamic')}
          {renderSection('family')}
          {renderSection('profile')}
          {renderSection('admin')}
        </nav>
        <div className="px-3 py-3 border-t border-sidebar-border flex-shrink-0 space-y-0.5">
          <button
            onClick={toggleDarkMode}
            className="w-full text-left px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-sm transition-colors flex items-center gap-2"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => logout('logout')}
            className="w-full text-left px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md text-sm transition-colors flex items-center gap-2"
          >
            <span aria-hidden="true">→</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content — ToastProvider hoisted to wrap the full shell so
          NotificationBell, SessionTimeoutModal, AnnualUpgradeModal,
          FeedbackWidget, and OnboardingWizard can all dispatch toasts.

          Phase 7.5: skip-to-content link is the first focusable element
          when sighted/keyboard users tab onto the dashboard. Hidden by
          default, becomes visible on focus. WCAG 2.4.1 (Bypass Blocks). */}
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <ToastProvider>
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between lg:justify-end">
            {/* Round 19: added aria-expanded / aria-controls so screen
                readers and keyboard users can tell whether the sidebar
                is open/closed. The marketing hamburger (/app/page.tsx)
                got the same treatment in Round 18. */}
            <button
              className="lg:hidden text-primary"
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
              {user.isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition"
                  title="Admin home"
                >
                  🛠️ Admin
                </Link>
              )}
              <button
                onClick={toggleDarkMode}
                className="text-gray-500 hover:text-primary text-lg transition"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <NotificationBell />
              <p className="text-sm text-gray-500">Assalamu Alaikum, <span className="font-semibold text-primary">{user.name}</span></p>
            </div>
          </header>
          <main id="dashboard-main" tabIndex={-1} className="flex-1 p-6 overflow-auto">
            <TrialBanner />
            <AnnualUpgradeBanner />
            {children}
          </main>
          <footer className="px-6 py-3 text-center text-xs text-gray-400 border-t bg-white">
            <Link href="/disclaimer" className="hover:text-primary hover:underline transition">
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
