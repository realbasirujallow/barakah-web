'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { getPlaidUiErrorMessage } from '../lib/plaid';
import { hasPaidSyncAccess, type SubscriptionStatusLike } from '../lib/subscription';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../lib/toast';
import { useI18n } from '../lib/i18n';

/**
 * Shared "Sync Banks" control surfaced on /dashboard/assets and
 * /dashboard/transactions so a user who wants the latest balances or
 * the latest transaction feed doesn't have to navigate to
 * /dashboard/import first.
 *
 * Behaviour by state:
 *
 *   no Plaid accounts linked  → renders "Link a bank" → /dashboard/import
 *   linked but not Plus       → renders "Upgrade to sync" → /dashboard/billing
 *   linked + Plus/Family      → renders "↻ Sync banks"
 *   mid-sync                  → renders spinner + disabled
 *
 * Emits a toast on success/error and invokes `onSynced` so the parent
 * page can reload the data surface the sync just changed (assets list
 * for /assets, transactions list for /transactions).
 *
 * Sync target: /api/plaid/sync-all — the same endpoint the
 * `/dashboard/import` page uses for its "Sync All" button. One POST,
 * one in-flight guard, one success/error path. Keeps the contract
 * identical across every surface that exposes the sync control.
 */
export interface SyncBanksButtonProps {
  /**
   * Called after a successful sync. The parent page should refetch
   * whatever list it shows (assets, transactions, etc.). Errors
   * surface through the toast and do NOT fire this callback.
   */
  onSynced?: () => void;
  /** Optional label override. Defaults to "Sync banks". */
  label?: string;
  /** Optional className to let callers fit the button into their page chrome. */
  className?: string;
}

export function SyncBanksButton({
  onSynced,
  label,
  className = '',
}: SyncBanksButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  // 2026-06-10 (LOC-SYNCBANKS-1): this control was English-only on the
  // assets/transactions pages — ar/ur/fr users saw "Link a bank" / "Sync
  // banks" / "Upgrade to sync" / "Syncing…" in English. Reuse the already-
  // translated dict keys (no new strings needed).
  const { t } = useI18n();
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatusLike | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // Fetch Plaid account count + subscription status on mount (and whenever
  // the user identity changes — login/logout). The api layer's in-flight
  // dedup helps when many components mount at once but does NOT cache
  // across resolved → re-call; for that we depend on `user?.id`, a stable
  // primitive, instead of the `user` OBJECT, so an AuthContext re-render
  // that produces a new reference for the SAME user doesn't refire this
  // effect and the two API calls.
  //
  // 2026-06-08 (founder report: /dashboard/transactions froze 2× while
  // making changes): the previous `[user]` dep caused this effect to
  // re-run on every parent re-render whose AuthContext value object
  // refreshed — typically every filter switch, save, or row toggle on
  // the transactions page. Each re-run fired `plaidGetAccounts` +
  // `subscriptionStatus`, hammering the API connection-pool and
  // contributing to the freeze. `user?.id` is a stable primitive: it
  // only changes when the actual user changes, not on every parent
  // re-render. Same fix shape as the i18n.ts useCallback stabilization
  // from the May-2026 BUG-PROD-AUDIT-LOAD pattern.
  const userId = user?.id ?? null;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      try {
        const [accounts, sub] = await Promise.all([
          api.plaidGetAccounts().catch(() => null),
          api.subscriptionStatus().catch(() => null),
        ]);
        if (cancelled) return;
        if (Array.isArray(accounts)) {
          setAccountCount(accounts.length);
        } else if (accounts && Array.isArray(accounts.accounts)) {
          setAccountCount(accounts.accounts.length);
        } else {
          setAccountCount(0);
        }
        setSubscriptionStatus(sub as SubscriptionStatusLike | null);
      } catch {
        // Swallow — the button simply renders its "nothing linked" branch
        // instead of a broken state. Plaid availability isn't critical
        // to the page the button lives on.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      // SYNC-1: sync-all is async now — POST kicks off a background job
      // (returns 202 immediately) and we poll for the result instead of
      // holding a 30s+ request open (which used to surface a false
      // "Internal Server Error" on timeout for users with many accounts).
      await api.plaidSyncAll();

      // Poll up to ~2 minutes (40 × 3s). Real-time balance/get + holdings
      // re-sync for a multi-account user can take ~60-90s server-side.
      const POLL_INTERVAL_MS = 3000;
      const MAX_POLLS = 40;
      let settled = false;
      for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        let status: { status?: string; totalAdded?: number } | null = null;
        try {
          status = (await api.plaidSyncAllStatus()) as {
            status?: string;
            totalAdded?: number;
          } | null;
        } catch {
          // Transient poll error — keep trying until the budget runs out.
          continue;
        }
        const state = status?.status;
        if (state === 'done' || state === 'idle') {
          // 'idle' = server restarted mid-sync; treat as finished and let
          // the parent refetch surface whatever landed.
          const total = status?.totalAdded ?? 0;
          toast(
            total > 0
              ? `Synced ${total} new transaction${total === 1 ? '' : 's'} across your banks`
              : 'All banks synced — no new transactions',
            'success',
          );
          setLastSyncedAt(Date.now());
          onSynced?.();
          settled = true;
          break;
        }
        if (state === 'failed') {
          toast(getPlaidUiErrorMessage(null, 'sync'), 'error');
          settled = true;
          break;
        }
        // state === 'running' → keep polling.
      }
      if (!settled) {
        // Poll budget exhausted but the job is still running server-side.
        // It will complete in the background; tell the user to refresh.
        toast('Still syncing in the background — refresh in a moment to see updates.', 'success');
        onSynced?.();
      }
    } catch (err) {
      toast(getPlaidUiErrorMessage(err, 'sync'), 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Render gating: resolved-to-zero accounts → "link a bank" CTA.
  // Null = still loading → render a ghost placeholder so the page layout
  // doesn't jump when the count resolves.
  if (accountCount === null) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block h-9 w-32 rounded-lg bg-gray-100 animate-pulse ${className}`}
      />
    );
  }

  if (accountCount === 0) {
    return (
      <Link
        href="/dashboard/import"
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-[#1B5E20] text-[#1B5E20] rounded-lg hover:bg-green-50 transition font-medium ${className}`}
      >
        🔗 {t('dashConnectAccountsDesc')}
      </Link>
    );
  }

  const canSync = hasPaidSyncAccess(subscriptionStatus) || user?.plan === 'plus' || user?.plan === 'family';

  if (!canSync) {
    return (
      <Link
        href="/dashboard/billing"
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm bg-amber-50 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-100 transition font-medium ${className}`}
      >
        🔒 {t('txnUpgradeToSync')}
      </Link>
    );
  }

  const lastLabel = lastSyncedAt
    ? ` · synced ${Math.max(1, Math.round((Date.now() - lastSyncedAt) / 1000))}s ago`
    : '';

  return (
    <button
      type="button"
      onClick={handleSync}
      disabled={syncing}
      title={`Syncs every linked bank${lastLabel}`}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] transition font-medium disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {syncing ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          {t('importSyncing')}
        </>
      ) : (
        <>↻ {label ?? t('txnSyncBanks')}</>
      )}
    </button>
  );
}
