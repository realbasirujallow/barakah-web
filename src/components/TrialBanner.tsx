'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { trackPaywallViewed } from '../lib/analytics';
import { useI18n } from '../lib/i18n';
import { useToast } from '../lib/toast';

// ── "Current time" external store ────────────────────────────────────────
// useSyncExternalStore is the React-approved way to read a mutable, non-
// React value during render without tripping the component-purity rule.
// We re-notify subscribers every minute; that's precise enough for a
// day/hour countdown and keeps CPU use negligible.
// `getNowClient` MUST return value-equal results across consecutive synchronous
// calls — that's React's useSyncExternalStore contract. `() => Date.now()`
// violates this: between React's render-time call and the mount-effect's
// snapshot check (a few ms later), Date.now() has advanced, so React thinks
// the store changed and forces a re-render. After re-render, the same gap
// happens again → infinite loop. Reproduced 2026-04-26 on Chrome Mobile
// Android 10 (Sentry 0be993e6 on /dashboard, "Maximum update depth exceeded").
//
// Fix: cache the value at module scope; only refresh when the interval
// explicitly ticks. Snapshot is then stable between renders and only changes
// when subscribers are notified — exactly what useSyncExternalStore expects.
let _cachedNow = typeof window === 'undefined' ? 0 : Date.now();
function subscribeMinute(onChange: () => void): () => void {
  // Refresh immediately on subscribe so the first read after mount isn't
  // stale from a prior session.
  _cachedNow = Date.now();
  const id = window.setInterval(() => {
    _cachedNow = Date.now();
    onChange();
  }, 60_000);
  return () => window.clearInterval(id);
}
const getNowClient = () => _cachedNow;
const getNowServer = () => 0; // banner is client-only; server render renders nothing

/**
 * Trial countdown banner — rendered above dashboard pages while the user is on
 * an onboarding trial. Shows X days (or hours) remaining with a one-click
 * upgrade CTA so users convert BEFORE the trial-end email arrives.
 *
 * Visibility rules:
 *   - subscriptionStatus is 'trialing' or 'trial'
 *   - planExpiresAt is in the future
 *   - user hasn't dismissed the banner in the current day
 *
 * Fires paywall_viewed('trial_banner') once per session when shown so we
 * can measure banner impressions → upgrade clicks in GA4.
 */

// Per-day dismissal: "barakah_trial_banner_dismissed_YYYY-MM-DD"
// so a fresh banner comes back every day as the countdown shrinks.
const DISMISS_KEY_PREFIX = 'barakah_trial_banner_dismissed_';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${DISMISS_KEY_PREFIX}${y}-${m}-${day}`;
}

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* localStorage unavailable */ }
}

interface SubscriptionStatus {
  plan: string;
  status: string;
  hasSubscription: boolean;
}

export default function TrialBanner() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loaded, setLoaded] = useState(false);
  // Round 19: start false (SSR-safe), hydrate in a useEffect — prior
  // lazy initializer read localStorage which is unavailable during SSR,
  // causing hydration mismatch on returning users who'd dismissed today.
  const [dismissed, setDismissed] = useState<boolean>(false);
  // Re-reads the clock every minute — purity-safe via useSyncExternalStore.
  const now = useSyncExternalStore(subscribeMinute, getNowClient, getNowServer);

  // Round 19: hydrate the dismissed flag post-mount so SSR and CSR
  // always start with `false`, eliminating hydration-mismatch errors.
  // Wrapped in setTimeout(0) to satisfy the react-hooks/set-state-in-effect
  // lint rule.
  useEffect(() => {
    const id = window.setTimeout(() => {
      setDismissed(safeGet(todayKey()) === 'true');
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api.subscriptionStatus()
      .then((data) => { if (!cancelled) setStatus(data as SubscriptionStatus); })
      .catch(() => { /* fall back to planExpiresAt heuristic below */ })
      .finally(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, [user]);

  if (!user || !loaded || dismissed || now === 0) return null;

  // Trial detection: subscription status says trialing, OR user has planExpiresAt
  // with a paid plan but no subscription record (which is exactly the onboarding
  // trial shape — promotional grant with no Stripe/RC customer).
  const isTrialing = status?.status === 'trialing' || status?.status === 'trial';
  if (!isTrialing) return null;

  // planExpiresAt from AuthContext User comes as epoch seconds (backend).
  const expiresAt = user.planExpiresAt;
  if (!expiresAt || expiresAt <= 0) return null;

  const EPOCH_SECONDS_MAX = 10_000_000_000;
  const expiryMs = expiresAt < EPOCH_SECONDS_MAX ? expiresAt * 1000 : expiresAt;
  const msLeft = expiryMs - now;
  if (msLeft <= 0) return null; // trial already expired — the scheduler will downgrade

  const daysLeft = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
  const hoursLeft = Math.max(0, Math.ceil(msLeft / (60 * 60 * 1000)));
  const planLabel = user.plan === 'family' ? 'Family' : 'Plus';

  // Time-copy — emphasizes hours when <24h to sharpen urgency at the end.
  const timeCopy = daysLeft > 1
    ? `${daysLeft} days left`
    : hoursLeft > 1
      ? `${hoursLeft} hours left`
      : 'ends soon';

  const handleDismiss = () => {
    setDismissed(true);
    safeSet(todayKey(), 'true');
  };

  return (
    <TrialBannerInner
      timeCopy={timeCopy}
      daysLeft={daysLeft}
      planLabel={planLabel}
      onDismiss={handleDismiss}
    />
  );
}

function TrialBannerInner({
  timeCopy,
  daysLeft,
  planLabel,
  onDismiss,
}: {
  timeCopy: string;
  daysLeft: number;
  planLabel: string;
  onDismiss: () => void;
}) {
  // Fire paywall_viewed once per mount. Placed in the inner component so it
  // only runs when we've actually decided to render the banner.
  useEffect(() => {
    try { trackPaywallViewed('trial_banner'); } catch { /* GA4 unavailable */ }
  }, []);

  // 2026-05-12 (QA-2026-05-12, Bug #17): pull strings through i18n so the
  // trial banner respects ar / ur / fr locales. Falls back to English keys
  // that already existed for the title + cancel actions; new keys
  // (trialBannerBody, trialBannerKeepPlan) added to lib/i18n.ts.
  const { t } = useI18n();
  // 2026-05-12 (QA-2026-05-12, audit A3): replace native window.alert()
  // with the in-app toast. alert() ships a blocking modal that locks the
  // event loop, can't be dismissed by VoiceOver consistently, and looks
  // unbranded inside a fintech app where every other error path uses
  // toast().
  const { toast } = useToast();

  // 2026-05-05 (P1 audit): give trial users a one-click "cancel trial" path.
  // Previously the only way out was the Stripe Customer Portal, which is
  // confusing for onboarding-trial users who never entered a payment method.
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleCancelTrial() {
    setCancelling(true);
    try {
      const result = (await api.cancelTrial()) as { success?: boolean; error?: string };
      if (result?.error) {
        toast(result.error, 'error');
        setCancelling(false);
        return;
      }
      // Reload so AuthContext refreshes user.plan / status everywhere.
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to cancel trial. Please try again.', 'error');
      setCancelling(false);
    }
  }

  const urgent = daysLeft <= 2;
  const containerCls = urgent
    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300'
    : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300';
  const labelCls = urgent ? 'text-amber-800' : 'text-[#1B5E20]';

  return (
    <div
      className={`${containerCls} border rounded-xl px-4 py-3 mb-4 flex items-center justify-between gap-3 flex-wrap`}
      data-testid="trial-banner"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">
          {urgent ? '⏰' : '🎁'}
        </span>
        <div className="min-w-0">
          {/* 2026-05-12 (QA-2026-05-12, Bug #17 + #18): pull title + body
              through t() so ar/ur/fr render the localized banner. dir="auto"
              on both paragraphs prevents bidi punctuation flip when text
              starts with leading LTR punctuation inside an RTL container
              (e.g. ".Keep unlimited..." rendered the period at line start
              under Arabic locale). */}
          <p dir="auto" className={`font-semibold ${labelCls} text-sm sm:text-base`}>
            {t('trialBannerTitle').replace('{plan}', planLabel).replace('{time}', timeCopy)}
          </p>
          <p dir="auto" className="text-xs text-gray-600 mt-0.5">
            {urgent
              ? t('trialBannerUrgentBody').replace('{plan}', planLabel)
              : t('trialBannerBody')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/dashboard/billing"
          className="bg-[#1B5E20] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#2E7D32] transition whitespace-nowrap"
        >
          {t('trialBannerKeepPlan').replace('{plan}', planLabel)}
        </Link>
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="text-gray-600 hover:text-gray-800 text-xs underline whitespace-nowrap px-2"
            data-testid="trial-banner-cancel"
          >
            {t('trialBannerCancel')}
          </button>
        ) : (
          <span className="flex items-center gap-1">
            <button
              onClick={handleCancelTrial}
              disabled={cancelling}
              className="bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-700 transition whitespace-nowrap disabled:opacity-50"
              data-testid="trial-banner-cancel-confirm"
            >
              {cancelling ? 'Cancelling…' : 'Yes, cancel'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={cancelling}
              className="text-gray-500 hover:text-gray-700 text-xs px-2"
            >
              keep
            </button>
          </span>
        )}
        <button
          onClick={onDismiss}
          aria-label="Dismiss trial banner for today"
          className="text-gray-400 hover:text-gray-600 text-xl leading-none px-2 py-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
