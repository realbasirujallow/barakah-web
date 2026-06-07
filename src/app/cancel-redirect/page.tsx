'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * SUB-002 (2026-05-13) — interstitial for third-party subscription cancel links.
 *
 * SEC-OPENREDIRECT-1 (2026-06-07): hardened. The page used to:
 *   (a) accept ANY https URL via ?to=...
 *   (b) auto-redirect 800ms later via window.location.href
 *   (c) display attacker-controlled `name` query param in the title
 *
 * Combination was a usable phishing primitive — attacker sends
 *   https://trybarakah.com/cancel-redirect?to=https://phish-paypal.example.com&name=PayPal
 * victim sees the trusted Barakah origin + a green "Go to PayPal now"
 * button + auto-redirect after 800ms. Reputation-laundering goldmine.
 *
 * Now:
 *   1. Host allowlist — only suffixes from the curated CANCEL_LINKS map
 *      in SubscriptionDetectionService are accepted as redirect targets.
 *      Unknown hosts render the "broken link" branch.
 *   2. NO auto-redirect. The user must click the button. Removes the
 *      "victim opens an email link, gets bounced to phish before they
 *      can react" timing.
 *   3. `name` is the merchant key matched against the allowlist (not
 *      attacker-controlled text). Falls back to a generic label.
 */
const ALLOWED_HOST_SUFFIXES: ReadonlyArray<string> = [
  // Mirrors the values in SubscriptionDetectionService.java CANCEL_LINKS.
  'netflix.com', 'hulu.com', 'disneyplus.com', 'help.max.com',
  'paramountplus.com', 'peacocktv.com', 'apple.com', 'spotify.com',
  'youtube.com', 'amazon.com', 'audible.com', 'nytimes.com', 'wsj.com',
  'washingtonpost.com', 'medium.com', 'substack.com', 'patreon.com',
  'chess.com', 'duolingo.com', 'headspace.com', 'calm.com', 'noom.com',
  'myfitnesspal.com', 'strava.com', 'dropbox.com', 'icloud.com',
  'google.com', 'microsoft.com', 'office.com', 'adobe.com', 'figma.com',
  'github.com', 'gitlab.com', 'jetbrains.com', 'openai.com', 'chatgpt.com',
  'claude.ai', 'anthropic.com', 'notion.so', 'evernote.com', 'todoist.com',
  'asana.com', 'monday.com', 'slack.com', 'zoom.us', 'webex.com',
];

function CancelRedirectInner() {
  const params = useSearchParams();
  const rawTo = params.get('to') ?? '';
  const rawName = params.get('name') ?? '';

  const safeTo = useMemo(() => {
    try {
      const u = new URL(rawTo);
      if (u.protocol !== 'https:') return null;
      // SEC-OPENREDIRECT-1: enforce the curated allowlist. Host must
      // match exactly OR be a subdomain of an allowed suffix.
      const host = u.hostname.toLowerCase();
      const allowed = ALLOWED_HOST_SUFFIXES.some(
        (s) => host === s || host.endsWith('.' + s),
      );
      if (!allowed) return null;
      return u.toString();
    } catch {
      return null;
    }
  }, [rawTo]);

  // Sanitize `name` to alphanumerics + spaces so an attacker can't
  // inject UI text like "PayPal — click below" via the query param.
  const name = useMemo(() => {
    const cleaned = rawName.replace(/[^A-Za-z0-9 +\-.]/g, '').trim();
    return cleaned.length > 0 && cleaned.length < 40 ? cleaned : 'this subscription';
  }, [rawName]);

  // SEC-OPENREDIRECT-1: NO auto-redirect. Removed the setTimeout +
  // window.location.href assignment. User must click the button below.
  const [redirected] = useState(false);

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
