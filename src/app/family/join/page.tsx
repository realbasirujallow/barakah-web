'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { logError } from '../../../lib/logError';

/**
 * Public Family-plan invite landing page.
 *
 * Entry point: /family/join?token=<rawToken> (the URL sent in the invite email).
 * Works for both logged-out and logged-in visitors:
 *
 *   - Calls GET /api/family/invite/preview (no auth) to show the inviter
 *     name and household name BEFORE the visitor commits.
 *   - If logged in and the preview is valid → "Accept invitation" button
 *     calls POST /api/family/accept and redirects to /dashboard/family.
 *   - If logged out → "Sign in to accept" and "Create account to accept"
 *     buttons, with the token stashed in sessionStorage so the signup /
 *     verify-email flows can pick it back up after the user is authed.
 *
 * The preview endpoint returns structured { valid:false, reason:... } for
 * bad/expired/canceled/already-accepted tokens so we can render friendly
 * branch-specific messages instead of a generic 404.
 */

interface PreviewResponse {
  valid: boolean;
  reason?: string;
  email?: string;
  expiresAt?: number;
  inviterFullName?: string;
  inviterEmail?: string | null;
  familyName?: string | null;
}

const PENDING_INVITE_KEY = 'barakah_pending_family_invite_token';

function safeSet(key: string, value: string) {
  try { sessionStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

function formatDate(ms: number | undefined): string {
  if (!ms) return '';
  try {
    return new Date(ms).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

function JoinFamilyContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, isLoading } = useAuth();
  const token = params.get('token');

  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  // Initialize loading from whether we have a token to fetch — avoids having
  // to call setLoading(false) inside the effect body (which React warns about).
  const [loading, setLoading] = useState<boolean>(token !== null);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    api.previewFamilyInvite(token)
      .then((res) => {
        if (!cancelled) {
          const preview = res as PreviewResponse;
          // Only persist the token once the API confirms it is valid.
          // Storing it before validation would let expired/canceled tokens
          // pollute sessionStorage and confuse the post-signup flow.
          if (preview.valid) safeSet(PENDING_INVITE_KEY, token);
          setPreview(preview);
        }
      })
      .catch((err) => {
        logError(err, { context: 'family invite preview failed' });
        if (!cancelled) setPreview({ valid: false, reason: 'LOAD_ERROR' });
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const handleAccept = async () => {
    if (!token || accepting) return;
    setAccepting(true);
    setError(null);
    try {
      await api.acceptFamilyInvite(token);
      try { sessionStorage.removeItem(PENDING_INVITE_KEY); } catch { /* ignore */ }
      router.push('/dashboard/family?joined=1');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept invitation');
      setAccepting(false);
    }
  };

  if (!token) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-4">Missing invite token</h1>
        <p className="text-gray-600">The link you followed doesn&apos;t have a token. Ask whoever sent the invite to re-share the link.</p>
      </Card>
    );
  }

  if (loading || isLoading) {
    return <Card><p className="text-gray-500 text-center">Loading invitation…</p></Card>;
  }

  if (!preview?.valid) {
    const message = invalidReasonMessage(preview?.reason);
    return (
      <Card>
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-3">{message.title}</h1>
        <p className="text-gray-600 mb-6">{message.body}</p>
        <Link href="/" className="inline-block text-[#1B5E20] font-semibold underline">
          Go to barakah homepage
        </Link>
      </Card>
    );
  }

  const inviter = preview.inviterFullName || 'Someone';
  const redirectUrl = `/family/join?token=${encodeURIComponent(token)}`;
  const signupUrl = `/signup?redirect=${encodeURIComponent(redirectUrl)}${preview.email ? `&invited_email=${encodeURIComponent(preview.email)}` : ''}`;
  const loginUrl  = `/login?redirect=${encodeURIComponent(redirectUrl)}`;

  return (
    <Card>
      <div className="text-center mb-6">
        <p className="text-5xl mb-3">👨‍👩‍👧‍👦</p>
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">{inviter} invited you to Barakah Family</h1>
        <p className="text-gray-600">
          Join their Barakah household and get full access to every Plus feature — zakat calculator, bank sync, halal screener, riba detector, and shared estate planning. One subscription covers everyone.
        </p>
      </div>

      {preview.email && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 text-center">
          Invitation sent to <strong className="text-gray-900">{preview.email}</strong>
          {preview.expiresAt && <> · Expires {formatDate(preview.expiresAt)}</>}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">
          {error}
        </div>
      )}

      {user ? (
        <>
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full bg-[#1B5E20] text-white py-3 rounded-xl font-semibold hover:bg-[#2E7D32] transition disabled:opacity-60"
          >
            {accepting ? 'Joining…' : `Accept invitation as ${user.email}`}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Not you? <Link href="/login" className="underline">Sign in as someone else</Link>
          </p>
        </>
      ) : (
        <div className="space-y-3">
          <Link
            href={signupUrl}
            className="block w-full bg-[#1B5E20] text-white py-3 rounded-xl font-semibold text-center hover:bg-[#2E7D32] transition"
          >
            Create a Barakah account
          </Link>
          <Link
            href={loginUrl}
            className="block w-full border border-[#1B5E20] text-[#1B5E20] py-3 rounded-xl font-semibold text-center hover:bg-green-50 transition"
          >
            Sign in to an existing account
          </Link>
          <p className="text-xs text-gray-500 text-center">
            After verifying your email, you&apos;ll be redirected back here to accept the invitation.
          </p>
        </div>
      )}
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {children}
      </div>
    </div>
  );
}

function invalidReasonMessage(reason?: string): { title: string; body: string } {
  switch (reason) {
    case 'EXPIRED':
      return { title: 'This invitation expired', body: 'Invitations are valid for 7 days. Ask whoever invited you to send a new one.' };
    case 'ACCEPTED':
      return { title: 'This invitation was already used', body: 'It looks like this invitation has already been accepted. Sign in to see your family plan, or ask for a fresh invite.' };
    case 'CANCELED':
      return { title: 'This invitation was canceled', body: 'The family owner canceled this invitation before it was accepted. Get in touch with them to receive a new one.' };
    case 'INVALID_TOKEN':
    case 'LOAD_ERROR':
    default:
      return { title: 'We couldn\u2019t verify this invitation', body: 'The link may be wrong or damaged. Ask whoever invited you to re-send it.' };
  }
}

export default function JoinFamilyPage() {
  return (
    <Suspense fallback={<Card><p className="text-gray-500 text-center">Loading…</p></Card>}>
      <JoinFamilyContent />
    </Suspense>
  );
}
