'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../lib/api';
import { getPlaidUiErrorMessage } from '../lib/plaid';
import { hasPaidSyncAccess, type SubscriptionStatusLike } from '../lib/subscription';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../lib/toast';

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
  label = 'Sync banks',
  className = '',
}: SyncBanksButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [accountCount, setAccountCount] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatusLike | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);

  // Fetch Plaid account count + subscription status on mount (and whenever
  // the user changes — login/logout). Both calls already dedupe at the api
  // layer (plaidGetAccounts is per-caller; subscriptionStatus has its own
  // _subStatusInFlight guard) so concurrent mounts across pages stay cheap.
  useEffect(() => {
    if (!user) return;
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
  }, [user]);

  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    try {
      const result = await api.plaidSyncAll();
      const total = (result as { totalAdded?: number } | null)?.totalAdded ?? 0;
      toast(
        total > 0
          ? `Synced ${total} new transaction${total === 1 ? '' : 's'} across your banks`
          : 'All banks synced — no new transactions',
        'success',
      );
      setLastSyncedAt(Date.now());
      onSynced?.();
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
        🔗 Link a bank
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
        🔒 Upgrade to sync
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
          Syncing…
        </>
      ) : (
        <>↻ {label}</>
      )}
    </button>
  );
}
