'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * SUB-002 (2026-05-13) — interstitial for third-party subscription cancel links.
 *
 * Before: /dashboard/subscriptions opened the curated merchant cancel URL
 * directly in a new tab (target="_blank"). When a curated URL was stale
 * (HBO "Detail/000001719" pages, ChatGPT fragment-anchored deep links,
 * merchants that A/B their support routes) the user landed on a 404 or
 * cold support hub with no clear way back to Barakah.
 *
 * Now: the cancel link points here, this page validates the destination
 * (must be https), kicks off the redirect after a brief delay, and shows
 * a permanent "Back to Barakah" fallback so a bad merchant page is a
 * one-click recovery instead of a dead end.
 *
 * The URL whitelist is intentionally permissive (any https origin) because
 * the curated CANCEL_LINKS list in SubscriptionDetectionService is the
 * actual trust boundary — this page only refuses non-https targets and
 * obviously-bogus ones to prevent open-redirect abuse.
 */
function CancelRedirectInner() {
  const params = useSearchParams();
  const rawTo = params.get('to') ?? '';
  const name = params.get('name') ?? 'this subscription';
  const [redirected, setRedirected] = useState(false);

  const safeTo = useMemo(() => {
    try {
      const u = new URL(rawTo);
      // Only https — blocks javascript:, data:, http: and other foot-guns.
      if (u.protocol !== 'https:') return null;
      return u.toString();
    } catch {
      return null;
    }
  }, [rawTo]);

  useEffect(() => {
    if (!safeTo) return;
    const t = window.setTimeout(() => {
      setRedirected(true);
      window.location.href = safeTo;
    }, 800);
    return () => window.clearTimeout(t);
  }, [safeTo]);

  return (
    <div className="min-h-screen bg-[#FFF8E1] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md w-full p-8 text-center">
        <p className="text-4xl mb-4">↗</p>
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">
          {safeTo ? `Opening ${name}'s cancel page…` : 'That cancel link looks broken'}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {safeTo
            ? redirected
              ? 'If the page didn’t load, the merchant may have moved their cancellation flow.'
              : 'You’re being redirected.'
            : 'We couldn’t safely open that link. You can search for the cancellation page on Google or return to Barakah.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {safeTo && (
            <a
              href={safeTo}
              className="inline-block bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
            >
              Go to {name} now
            </a>
          )}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`how to cancel ${name}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#1B5E20] border border-[#1B5E20] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#FFF8E1] transition"
          >
            Search Google
          </a>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Back to Barakah
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CancelRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFF8E1]" />}>
      <CancelRedirectInner />
    </Suspense>
  );
}
