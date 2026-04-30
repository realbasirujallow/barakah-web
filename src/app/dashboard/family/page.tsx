'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import { PageHeader } from '../../../components/dashboard/PageHeader';

/**
 * Family-plan household management page.
 *
 * Three modes depending on the caller's relationship to a family:
 *   - Owner: invite form, pending invites list, members list, remove buttons.
 *   - Member: read-only view of the household + "Leave family" button.
 *   - Neither: upgrade CTA pointing at /dashboard/billing.
 *
 * Backend contract: see FamilyController.java. Error responses are shaped
 * { error: "Human message", code: "ERROR_CODE" } — we surface the message
 * directly in toast/inline banners.
 */

interface Member {
  userId: number;
  fullName: string | null;
  email: string;
  role: 'owner' | 'member';
}

interface Invite {
  id: number;
  email: string;
  status: 'pending' | 'accepted' | 'canceled' | 'expired';
  createdAt: number;
  expiresAt: number;
  acceptedAt: number | null;
}

interface FamilyResponse {
  family: null;
  // Or the flat shape below when family is present — backend returns one or the other.
  familyId?: number;
  ownerId?: number;
  isOwner?: boolean;
  name?: string | null;
  memberLimit?: number;
  members?: Member[];
  invites?: Invite[];
}

function formatDate(ms: number | null | undefined): string {
  if (!ms) return '—';
  try {
    return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function FamilyPage() {
  const { user, refreshPlan } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FamilyResponse | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getFamily() as FamilyResponse;
      setData(res);
    } catch (err) {
      logError(err, { context: 'Failed to load family' });
      toast('Could not load your family plan. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  // Round 18: celebrate a fresh invite accept. `/family/join` routes the
  // user here with `?joined=1` after a successful accept — show a toast
  // once, then strip the param so a refresh doesn't re-fire it.
  const searchParams = useSearchParams();
  const router = useRouter();
  const joinedToastShown = useRef(false);
  useEffect(() => {
    if (joinedToastShown.current) return;
    if (searchParams.get('joined') === '1') {
      joinedToastShown.current = true;
      toast('Welcome to the household! You\u2019re all set.', 'success');
      router.replace('/dashboard/family');
    }
  }, [searchParams, router, toast]);

  const isOwner = Boolean(data?.isOwner);
  const hasFamily = Boolean(data && data.familyId);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed || sending) return;
    // Round 21: client-side email format check before wasting a
    // round-trip + rate-limit token on a typo like "ahmad@" or
    // "ahmad@gmail". Mirrors the regex used in forgot-password.
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)) {
      toast('Please enter a valid email address', 'error');
      return;
    }
    setSending(true);
    try {
      await api.createFamilyInvite(trimmed);
      toast(`Invite sent to ${trimmed}`, 'success');
      setInviteEmail('');
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not send invite';
      toast(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  const handleCancelInvite = async (inviteId: number, email: string) => {
    if (!confirm(`Cancel the pending invite to ${email}?`)) return;
    try {
      await api.cancelFamilyInvite(inviteId);
      toast('Invite canceled', 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not cancel invite', 'error');
    }
  };

  const handleRemoveMember = async (userId: number, name: string) => {
    if (!confirm(`Remove ${name} from your family plan? They'll drop back to the Free plan.`)) return;
    try {
      await api.removeFamilyMember(userId);
      toast(`${name} removed`, 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not remove member', 'error');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Leave this family plan? You will drop back to the Free plan.')) return;
    try {
      await api.leaveFamily();
      toast('You have left the family plan', 'success');
      await refreshPlan();
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not leave family', 'error');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-gray-500">Loading your family…</div>;
  }

  // ── No family: prompt to upgrade ────────────────────────────────────────
  if (!hasFamily) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">Family plan</h1>
        <p className="text-gray-600 mb-8">
          Family gives up to 6 household members shared access to all Plus features — one subscription, one household, shared budgets, estate visibility, and zakat tracking.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-6xl mb-4">👨‍👩‍👧‍👦</p>
          {user?.plan === 'family' ? (
            <>
              <p className="text-gray-700 mb-6">
                Your Family plan is active — setting up your household now. Refresh this page in a moment to invite members.
              </p>
              <button
                type="button"
                onClick={() => load()}
                className="inline-block bg-[#1B5E20] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2E7D32] transition"
              >
                Refresh household
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-6">
                {user?.plan === 'free'
                  ? 'You\u2019re on the Free plan today.'
                  : 'You\u2019re on Barakah Plus today.'}
                {' '}Upgrade to Family to invite up to 5 household members.
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-block bg-[#1B5E20] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#2E7D32] transition"
              >
                Upgrade to Family — $14.99/mo
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const members = data?.members ?? [];
  const pendingInvites = (data?.invites ?? []).filter(i => i.status === 'pending');
  const pastInvites = (data?.invites ?? []).filter(i => i.status !== 'pending');
  const seatsUsed = members.length + pendingInvites.length;
  const seatsTotal = data?.memberLimit ?? 6;

  // ── Member (not owner) view ─────────────────────────────────────────────
  if (!isOwner) {
    const ownerMember = members.find(m => m.role === 'owner');
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1B5E20] mb-2">Your family plan</h1>
        <p className="text-gray-600 mb-8">
          You&rsquo;re a member of {ownerMember?.fullName ?? 'this'}&apos;s Barakah Family household.
          All Plus features are covered by their subscription.
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-[#1B5E20] mb-4">Household members ({members.length})</h2>
          <ul className="divide-y divide-gray-100">
            {members.map(m => (
              <li key={m.userId} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{m.fullName ?? m.email}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                <span className={`text-xs uppercase font-semibold px-2 py-1 rounded ${m.role === 'owner' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLeave}
          className="w-full text-red-700 border border-red-200 rounded-xl py-3 font-medium hover:bg-red-50 transition"
        >
          Leave family plan
        </button>
      </div>
    );
  }

  // ── Owner view ──────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto">
      {/* Phrasing matches the seat counter below: owner + N invitees = total
          seats. Earlier copy said "Invite up to 5" while the counter showed
          "Total seats: 6" — same number, two different ways of saying it,
          easy for users to second-guess. We compute the inviteable count
          from the actual seatsTotal so the marketing copy can never drift
          from what the seat math reports. (QA flagged 2026-04-25.) */}
      <PageHeader
        title="Your family plan"
        subtitle={`Up to ${seatsTotal} household members on one plan, including you. One subscription covers everyone — members get full Plus access at no extra cost.`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold">{seatsUsed}</p>
          <p className="text-green-100 text-sm mt-1">Seats used</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-[#1B5E20]">{seatsTotal - seatsUsed}</p>
          <p className="text-gray-500 text-sm mt-1">Seats left</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-[#1B5E20]">{seatsTotal}</p>
          <p className="text-gray-500 text-sm mt-1">Total seats</p>
        </div>
      </div>

      {/* Invite form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-[#1B5E20] mb-2">Invite a household member</h2>
        <p className="text-sm text-gray-500 mb-4">They&apos;ll receive a link that expires in 7 days.</p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="spouse@example.com"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            disabled={seatsUsed >= seatsTotal || sending}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={seatsUsed >= seatsTotal || sending || !inviteEmail.trim()}
            className="bg-[#1B5E20] text-white rounded-xl px-6 py-3 text-sm font-semibold hover:bg-[#2E7D32] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending…' : 'Send invite'}
          </button>
        </form>
        {seatsUsed >= seatsTotal && (
          <p className="text-xs text-amber-700 mt-3">All seats filled — cancel a pending invite or remove a member to invite someone new.</p>
        )}
      </div>

      {/* Members list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-[#1B5E20] mb-4">Members ({members.length})</h2>
        <ul className="divide-y divide-gray-100">
          {members.map(m => (
            <li key={m.userId} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{m.fullName ?? m.email}</p>
                <p className="text-sm text-gray-500 truncate">{m.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {m.role === 'owner' && (
                  <span className="text-xs uppercase font-semibold bg-[#1B5E20] text-white px-2 py-1 rounded">Owner</span>
                )}
                {m.role === 'member' && (
                  <button
                    onClick={() => handleRemoveMember(m.userId, m.fullName ?? m.email)}
                    className="text-xs text-red-700 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-[#1B5E20] mb-4">Pending invites ({pendingInvites.length})</h2>
          <ul className="divide-y divide-gray-100">
            {pendingInvites.map(inv => (
              <li key={inv.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{inv.email}</p>
                  <p className="text-xs text-gray-500">Expires {formatDate(inv.expiresAt)}</p>
                </div>
                <button
                  onClick={() => handleCancelInvite(inv.id, inv.email)}
                  className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition flex-shrink-0"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Past invites */}
      {pastInvites.length > 0 && (
        <details className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <summary className="cursor-pointer font-semibold text-[#1B5E20]">Previous invites ({pastInvites.length})</summary>
          <ul className="divide-y divide-gray-100 mt-3">
            {pastInvites.map(inv => (
              <li key={inv.id} className="py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-gray-700 truncate">{inv.email}</p>
                  <p className="text-xs text-gray-400">{formatDate(inv.createdAt)}</p>
                </div>
                <span className={`text-xs uppercase font-medium ${
                  inv.status === 'accepted' ? 'text-green-700'
                  : inv.status === 'canceled' ? 'text-gray-500'
                  : 'text-amber-700'
                }`}>{inv.status}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        To cancel the Family plan itself, head to <Link href="/dashboard/billing" className="underline">Billing</Link>.
      </p>
    </div>
  );
}
