'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import {
  clearPendingPlaidLinkToken,
  getPlaidUiErrorMessage,
  readPendingPlaidLinkToken,
} from '../../../lib/plaid';

export default function PlaidOauthPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [token] = useState<string | null>(() => readPendingPlaidLinkToken());

  // Redirect unauthenticated visitors to login before doing anything with Plaid.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [authLoading, user, router]);

  const receivedRedirectUri = useMemo(() => {
    if (typeof window === 'undefined') return undefined;
    return window.location.href;
  }, []);

  const finishWithRedirect = useCallback((status: 'linked' | 'error', message: string) => {
    const params = new URLSearchParams({ plaid: status, message });
    router.replace(`/dashboard/import?${params.toString()}`);
  }, [router]);

  const onSuccess = useCallback(async (publicToken: string, metadata: { institution: { name: string } | null }) => {
    try {
      await api.plaidExchangeToken(publicToken, metadata?.institution?.name);
      clearPendingPlaidLinkToken();
      finishWithRedirect('linked', 'Bank linked successfully! Click "Sync" to import transactions.');
    } catch (err) {
      clearPendingPlaidLinkToken();
      finishWithRedirect(
        'error',
        getPlaidUiErrorMessage(err, 'exchange'),
      );
    }
  }, [finishWithRedirect]);

  const onExit = useCallback((error: { display_message?: string | null } | null) => {
    clearPendingPlaidLinkToken();
    finishWithRedirect(
      'error',
      error?.display_message || (error
        ? getPlaidUiErrorMessage(error, 'start')
        : 'Plaid authentication was canceled before completion.'),
    );
  }, [finishWithRedirect]);

  const { open, ready } = usePlaidLink({
    token: token ?? '',
    onSuccess,
    onExit,
    receivedRedirectUri,
  });

  const error = token
    ? ''
    : 'No pending Plaid session was found. Start again from the import page.';
  const processing = Boolean(token) && !ready;

  useEffect(() => {
    if (!token || !ready) return;
    open();
  }, [open, ready, token]);

  // Show nothing while auth is resolving or user is being redirected to login.
  if (authLoading || !user) return null;

  return (
    <main className="min-h-screen bg-[#F7FAF7] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-green-200 rounded-2xl shadow-sm p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center text-2xl">
          {error ? '!' : 'B'}
        </div>
        <h1 className="mt-5 text-2xl font-bold text-[#1B5E20]">
          {error ? 'Plaid Setup Interrupted' : 'Finishing Bank Login'}
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {error
            ? error
            : processing
              ? 'We are resuming your bank connection securely. Plaid should reopen automatically in a moment.'
              : 'Plaid is ready. If nothing opened, use the button below to continue.'}
        </p>
        {!error && token && (
          <button
            onClick={() => open()}
            disabled={!ready}
            className="mt-6 w-full bg-[#1B5E20] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#2E7D32] transition disabled:opacity-50"
          >
            {ready ? 'Continue with Plaid' : 'Loading Plaid...'}
          </button>
        )}
        <Link
          href="/dashboard/import"
          className="mt-4 inline-flex text-sm font-medium text-[#1B5E20] hover:underline"
        >
          Return to import page
        </Link>
      </div>
    </main>
  );
}
