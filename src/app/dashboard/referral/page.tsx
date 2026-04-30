'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { logError } from '../../../lib/logError';
import { trackReferralShare } from '../../../lib/analytics';
import { REFEREE_FIRST_MONTH_PRICE, REFEREE_REGULAR_PRICE } from '../../../lib/referralCopy';
import { PageHeader } from '../../../components/dashboard/PageHeader';

// Fire both the GA4 share event and the backend REFERRAL_SHARED lifecycle
// event so the admin viral-loop funnel reflects this surface.
function fireShare(method: string, source: string) {
  try { trackReferralShare(method); } catch { /* GA4 unavailable */ }
  api.lifecycleTrackEvent?.('referral_shared', { method, source }, 'web')
    .catch(() => { /* analytics must never break the share UI */ });
}

interface ReferralData {
  referralCode: string;
  shareUrl: string;
  referralClicks: number;
  referralCount: number;
  plan: string;
}

export default function ReferralPage() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Round 28: Web Share API capability detection. Move to client-only state
  // so we never evaluate `typeof navigator` during render — Next 16 partial
  // prerendering could stream through the dashboard layout's loading-guard
  // and turn the render-time check into a hydration mismatch (server sees
  // `false`, client sees `true`). The layout currently shields this, but
  // the useState+useEffect pattern is the defensive answer.
  const [canShare, setCanShare] = useState(false);
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  const load = () => {
    setLoading(true);
    setError(null);
    api.getReferralCode()
      .then((d: ReferralData) => setData(d))
      .catch((err: Error) => {
        logError(err, { context: 'Failed to load referral code' });
        setError(err?.message || 'Failed to load referral data.');
      })
      .finally(() => setLoading(false));
  };
  // Wrapped via setTimeout(0) so the synchronous setLoading/setError
  // calls inside load() don't trip the
  // react-hooks/set-state-in-effect lint rule (same pattern used
  // throughout the dashboard).
  useEffect(() => {
    const id = window.setTimeout(() => { load(); }, 0);
    return () => window.clearTimeout(id);
     
  }, []);

  const copyLink = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      fireShare('copy', 'referral_page');
    }).catch(() => {});
  };

  const shareNative = () => {
    if (!data || !navigator.share) return;
    navigator.share({
      title: 'Join Barakah — Islamic Finance Tracker',
      text: 'Build a more thoughtful Muslim household finance system with Barakah. Sign up with my referral link!',
      url: data.shareUrl,
    }).then(() => fireShare('native', 'referral_page')).catch(() => {});
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-6xl mb-4">😔</p>
      <p className="text-red-600 mb-4">{error}</p>
      {/* Round 18: retry button so users aren't stranded on a transient error. */}
      <button
        onClick={load}
        className="bg-[#1B5E20] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[#2E7D32] transition"
      >
        Try again
      </button>
    </div>
  );

  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Refer a Friend"
        subtitle="Share Barakah with friends and family."
        className="mb-4"
      />

      {/* Reward summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-teal-700 text-white rounded-2xl p-5">
          <p className="text-3xl mb-2">🎁</p>
          <p className="font-bold text-lg">You earn</p>
          <p className="text-green-200 text-sm mt-1">A free extra month of Barakah access — automatically applied once your friend verifies their email.</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-5">
          <p className="text-3xl mb-2">💰</p>
          {/* Round 32: use constants from lib/referralCopy.ts so modal and
              this page stay in sync with the backend reward contract. */}
          <p className="font-bold text-lg">They get first month for {REFEREE_FIRST_MONTH_PRICE}</p>
          <p className="text-amber-100 text-sm mt-1">Your friend gets Barakah Plus for just {REFEREE_FIRST_MONTH_PRICE} instead of {REFEREE_REGULAR_PRICE} — 50% off their first month, automatically applied at checkout.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold">{data.referralClicks}</p>
          <p className="text-sky-100 text-sm mt-1">Referral Link Clicks</p>
        </div>
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold">{data.referralCount}</p>
          <p className="text-green-200 text-sm mt-1">Rewards Triggered</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 text-center">
          <p className="text-4xl font-bold">{data.referralCode}</p>
          <p className="text-amber-100 text-sm mt-1">Your Referral Code</p>
        </div>
      </div>

      {/* Share Link */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-primary mb-3">Your Referral Link</h2>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={data.shareUrl}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 select-all"
            onClick={e => (e.target as HTMLInputElement).select()}
          />
          <button
            onClick={copyLink}
            className={`px-5 py-3 rounded-xl font-medium text-sm transition ${
              copied
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-[#1B5E20] text-white hover:bg-[#2E7D32]'
            }`}
          >
            {copied ? '✅ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {canShare && (
          <button
            onClick={shareNative}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-3 px-4 hover:bg-blue-700 transition text-sm font-medium"
          >
            📤 Share
          </button>
        )}
        <a
          href={`https://wa.me/?text=${encodeURIComponent('Build a more thoughtful Muslim household finance system with Barakah! ' + data.shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => fireShare('whatsapp', 'referral_page')}
          className="flex items-center justify-center gap-2 bg-green-500 text-white rounded-xl py-3 px-4 hover:bg-green-600 transition text-sm font-medium"
        >
          💬 WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Build a more thoughtful Muslim household finance system with Barakah! 🌙 ' + data.shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => fireShare('twitter', 'referral_page')}
          className="flex items-center justify-center gap-2 bg-sky-500 text-white rounded-xl py-3 px-4 hover:bg-sky-600 transition text-sm font-medium"
        >
          🐦 Twitter
        </a>
        <a
          href={`mailto:?subject=${encodeURIComponent('Check out Barakah — Islamic Household Finance')}&body=${encodeURIComponent('Assalamu Alaikum!\n\nI\'ve been using Barakah to organize daily money, zakat, and family financial responsibilities in one place, and thought you might like it too.\n\nSign up here: ' + data.shareUrl)}`}
          onClick={() => fireShare('email', 'referral_page')}
          className="flex items-center justify-center gap-2 bg-gray-600 text-white rounded-xl py-3 px-4 hover:bg-gray-700 transition text-sm font-medium"
        >
          ✉️ Email
        </a>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-semibold text-primary mb-4">How it works</h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <span className="bg-green-100 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
            <div>
              <p className="font-medium">Share your link</p>
              <p className="text-gray-500 text-sm">Send your unique referral link to friends and family.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-green-100 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
            <div>
              <p className="font-medium">They sign up</p>
              <p className="text-gray-500 text-sm">When someone signs up using your link, they&apos;re linked to your account.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <span className="bg-green-100 text-primary rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
            <div>
              <p className="font-medium">Earn rewards</p>
              <p className="text-gray-500 text-sm">Once they verify their email, <strong>you earn a free extra month</strong> and <strong>they get their first paid month for {REFEREE_FIRST_MONTH_PRICE}</strong> — automatically applied at checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
