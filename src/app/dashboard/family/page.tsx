'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';
import { SkeletonPage } from '../SkeletonCard';

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
  const { t, tFmt } = useI18n();
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
      toast(t('familyLoadError'), 'error');
    } finally {
      setLoading(false);
    }
    // `t` is a fresh identity each render; including it would make `load` a new
    // function every render and the `[load]` effect refire forever. Keep `toast`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast(t('familyJoinedToast'), 'success');
      router.replace('/dashboard/family');
    }
    // `t` is a fresh identity each render; the `joinedToastShown` ref already
    // guards against re-firing, but excluding `t` avoids per-render churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router, toast]);

  const isOwner = Boolean(data?.isOwner);
  const hasFamily = Boolean(data && data.familyId);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inviteEmail.trim();
    if (!trimmed || sending) return;
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmed)) {
      toast(t('familyInvalidEmail'), 'error');
      return;
    }
    setSending(true);
    try {
      await api.createFamilyInvite(trimmed);
      toast(tFmt('familyInviteSentFmt', [trimmed]), 'success');
      setInviteEmail('');
      await load();
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('familyInviteError');
      toast(msg, 'error');
    } finally {
      setSending(false);
    }
  };

  const handleCancelInvite = async (inviteId: number, email: string) => {
    if (!confirm(tFmt('familyCancelInviteConfirmFmt', [email]))) return;
    try {
      await api.cancelFamilyInvite(inviteId);
      toast(t('familyInviteCanceled'), 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('familyCancelInviteError'), 'error');
    }
  };

  const handleRemoveMember = async (userId: number, name: string) => {
    if (!confirm(tFmt('familyRemoveMemberConfirmFmt', [name]))) return;
    try {
      await api.removeFamilyMember(userId);
      toast(tFmt('familyMemberRemovedFmt', [name]), 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('familyRemoveMemberError'), 'error');
    }
  };

  const handleLeave = async () => {
    if (!confirm(t('familyLeaveConfirm'))) return;
    try {
      await api.leaveFamily();
      toast(t('familyLeftToast'), 'success');
      await refreshPlan();
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('familyLeaveError'), 'error');
    }
  };

  if (loading) return <SkeletonPage />;

  if (!hasFamily) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">{t('familyPlanHeading')}</h1>
        <p className="text-gray-600 mb-8">{t('familyUpgradeIntro')}</p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-6xl mb-4">👨‍👩‍👧‍👦</p>
          {user?.plan === 'family' ? (
            <>
              <p className="text-gray-700 mb-6">{t('familyProvisioning')}</p>
              <button
                type="button"
                onClick={() => load()}
                className="inline-block bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                {t('familyRefreshHousehold')}
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-700 mb-6">
                {user?.plan === 'free' ? t('familyOnFreeToday') : t('familyOnPlusToday')}
                {' '}{t('familyUpgradeNudge')}
              </p>
              <Link
                href="/dashboard/billing"
                className="inline-block bg-primary text-primary-foreground py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition"
              >
                {t('familyUpgradeCta')}
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  const members = data?.members ?? [];
  const nowMs = Date.now();
  const pendingInvitesRaw = (data?.invites ?? []).filter(i => i.status === 'pending');
  const pendingInvites = pendingInvitesRaw.filter(i => (i.expiresAt ?? 0) > nowMs);
  const expiredInvites = pendingInvitesRaw.filter(i => (i.expiresAt ?? 0) <= nowMs)
                                          .map(i => ({ ...i, status: 'expired' as const }));
  const pastInvites = [
    ...expiredInvites,
    ...(data?.invites ?? []).filter(i => i.status !== 'pending'),
  ];
  const seatsUsed = members.length + pendingInvites.length;
  const seatsTotal = data?.memberLimit ?? 6;

  const statusLabel = (s: Invite['status']) => {
    switch (s) {
      case 'accepted': return t('familyStatusAccepted');
      case 'canceled': return t('familyStatusCanceled');
      case 'expired': return t('familyStatusExpired');
      default: return t('familyStatusPending');
    }
  };

  if (!isOwner) {
    const ownerMember = members.find(m => m.role === 'owner');
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary mb-2">{t('familyYourPlanHeading')}</h1>
        <p className="text-gray-600 mb-8">
          {tFmt('familyMemberIntroFmt', [ownerMember?.fullName ?? t('familyThis')])}
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-primary mb-4">{tFmt('familyHouseholdMembersFmt', [members.length])}</h2>
          <ul className="divide-y divide-gray-100">
            {members.map(m => (
              <li key={m.userId} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{m.fullName ?? m.email}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                </div>
                <span className={`text-xs uppercase font-semibold px-2 py-1 rounded ${m.role === 'owner' ? 'bg-primary text-primary-foreground' : 'bg-gray-100 text-gray-700'}`}>
                  {m.role === 'owner' ? t('familyRoleOwner') : t('familyRoleMember')}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLeave}
          className="w-full text-red-700 border border-red-200 rounded-xl py-3 font-medium hover:bg-red-50 transition"
        >
          {t('familyLeaveBtn')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t('familyPageTitle')}
        subtitle={tFmt('familyPageSubtitleFmt', [seatsTotal])}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] text-white rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold">{seatsUsed}</p>
          <p className="text-green-100 text-sm mt-1">{t('familySeatsUsed')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-primary">{seatsTotal - seatsUsed}</p>
          <p className="text-gray-500 text-sm mt-1">{t('familySeatsLeft')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
          <p className="text-3xl font-bold text-primary">{seatsTotal}</p>
          <p className="text-gray-500 text-sm mt-1">{t('familyTotalSeats')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-primary mb-2">{t('familyInviteHeading')}</h2>
        <p className="text-sm text-gray-500 mb-4">{t('familyInviteHelper')}</p>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder={t('familyInvitePlaceholder')}
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            disabled={seatsUsed >= seatsTotal || sending}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={seatsUsed >= seatsTotal || sending || !inviteEmail.trim()}
            className="bg-primary text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending ? t('familySending') : t('familySendInvite')}
          </button>
        </form>
        {seatsUsed >= seatsTotal && (
          <p className="text-xs text-amber-700 mt-3">{t('familySeatsFull')}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-primary mb-4">{tFmt('familyMembersHeadingFmt', [members.length])}</h2>
        <ul className="divide-y divide-gray-100">
          {members.map(m => (
            <li key={m.userId} className="py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{m.fullName ?? m.email}</p>
                <p className="text-sm text-gray-500 truncate">{m.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {m.role === 'owner' && (
                  <span className="text-xs uppercase font-semibold bg-primary text-primary-foreground px-2 py-1 rounded">{t('familyRoleOwner')}</span>
                )}
                {m.role === 'member' && (
                  <button
                    onClick={() => handleRemoveMember(m.userId, m.fullName ?? m.email)}
                    className="text-xs text-red-700 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition"
                  >
                    {t('familyRemoveBtn')}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {pendingInvites.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-primary mb-4">{tFmt('familyPendingHeadingFmt', [pendingInvites.length])}</h2>
          <ul className="divide-y divide-gray-100">
            {pendingInvites.map(inv => (
              <li key={inv.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{inv.email}</p>
                  <p className="text-xs text-gray-500">{tFmt('familyExpiresFmt', [formatDate(inv.expiresAt)])}</p>
                </div>
                <button
                  onClick={() => handleCancelInvite(inv.id, inv.email)}
                  className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 transition flex-shrink-0"
                >
                  {t('familyCancelBtn')}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pastInvites.length > 0 && (
        <details className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <summary className="cursor-pointer font-semibold text-primary">{tFmt('familyPreviousHeadingFmt', [pastInvites.length])}</summary>
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
                  : inv.status === 'expired' ? 'text-gray-500'
                  : 'text-amber-700'
                }`}>{statusLabel(inv.status)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        {t('familyCancelPlanPrefix')} <Link href="/dashboard/billing" className="underline">{t('familyCancelPlanLink')}</Link>.
      </p>
    </div>
  );
}
