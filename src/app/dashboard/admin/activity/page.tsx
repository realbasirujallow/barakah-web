'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useAuth } from '../../../../context/AuthContext';
import { logError } from '../../../../lib/logError';
import { formatLocation } from '../../../../components/admin/adminFormatting';

/**
 * Admin → Activity: real human activity for founder-led growth.
 *  - Sign-ins: who logged in and when (audit_logs action=LOGIN).
 *  - Referrals: top referrers + who joined under whose code.
 *  - Shares: household invites (who invited whom + status).
 * Read-only. Backed by GET /admin/activity/{sign-ins,referrals,shares}.
 */

interface SignIn {
  user_id: number | null; email: string | null; full_name: string | null;
  plan: string | null; email_verified: boolean | null;
  ip_address: string | null; user_agent: string | null; timestamp: number | null;
  country: string | null; state: string | null;
}
interface TopReferrer {
  referral_code: string | null; email: string | null; full_name: string | null; referral_count: number | null;
}
interface ReferralJoin {
  code: string | null; joiner_email: string | null; joiner_name: string | null;
  joined_at: number | null; email_verified: boolean | null; plan: string | null;
  referrer_email: string | null; referrer_name: string | null;
}
interface Share {
  id: number; inviter_id: number | null; inviter_email: string | null; inviter_name: string | null;
  invitee_email: string | null; status: string | null; created_at: number | null;
}

function fmtTime(ms: number | null): string {
  if (!ms) return '—';
  const d = new Date(Number(ms));
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
function relTime(ms: number | null): string {
  if (!ms) return '';
  const diff = Date.now() - Number(ms);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
function device(ua: string | null): string {
  if (!ua) return '—';
  if (/Barakah|Dart|okhttp|CFNetwork/i.test(ua)) return /iPhone|iOS|CFNetwork|Darwin/i.test(ua) ? 'iOS app' : 'Android app';
  if (/iPhone|iPad/i.test(ua)) return 'iOS web';
  if (/Android/i.test(ua)) return 'Android web';
  if (/Mac/i.test(ua)) return 'Mac web';
  if (/Windows/i.test(ua)) return 'Windows web';
  return 'Web';
}
function name(n: string | null, e: string | null): string {
  return (n && n.trim()) || (e && e.trim()) || 'Unknown';
}

type Tab = 'signins' | 'referrals' | 'shares';

export default function AdminActivityPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  const [tab, setTab] = useState<Tab>('signins');
  const [includeTest, setIncludeTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signIns, setSignIns] = useState<SignIn[]>([]);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [joins, setJoins] = useState<ReferralJoin[]>([]);
  const [shares, setShares] = useState<Share[]>([]);

  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) router.push('/dashboard');
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  const reload = useCallback(async () => {
    if (isAuthLoading || !user || !isAdmin) return;
    setLoading(true);
    try {
      const [si, ref, sh] = await Promise.all([
        api.getAdminSignIns(150, includeTest) as Promise<{ signIns: SignIn[] }>,
        api.getAdminReferralActivity(includeTest) as Promise<{ topReferrers: TopReferrer[]; joins: ReferralJoin[] }>,
        api.getAdminShares(200) as Promise<{ shares: Share[] }>,
      ]);
      setSignIns(si?.signIns ?? []);
      setTopReferrers(ref?.topReferrers ?? []);
      setJoins(ref?.joins ?? []);
      setShares(sh?.shares ?? []);
    } catch (e) {
      logError(e, { context: 'Failed to load admin activity' });
    } finally {
      setLoading(false);
    }
  }, [includeTest, isAdmin, isAuthLoading, user]);

  useEffect(() => { void reload(); }, [reload]);

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  const badge = (text: string, tone: 'green' | 'gray' | 'amber' | 'red') => {
    const tones = {
      green: 'bg-emerald-50 text-emerald-700', gray: 'bg-gray-100 text-gray-600',
      amber: 'bg-amber-50 text-amber-700', red: 'bg-rose-50 text-rose-700',
    };
    return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tones[tone]}`}>{text}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-4">
          <span aria-hidden="true">←</span> Back to Admin Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Activity</h1>
          <p className="text-sm text-gray-600 mt-1">
            Who&apos;s signing in, who&apos;s sharing, and who joined under each referral code — for founder-led outreach.
          </p>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
            {([['signins', `Sign-ins (${signIns.length})`], ['referrals', `Referrals (${joins.length})`], ['shares', `Shares (${shares.length})`]] as [Tab, string][]).map(([t, label]) => (
              <button key={t} type="button" onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-green-50'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-sm text-gray-600">
              <input type="checkbox" checked={includeTest} onChange={e => setIncludeTest(e.target.checked)} />
              Include test accounts
            </label>
            <button type="button" onClick={() => void reload()} disabled={loading}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-primary text-primary hover:bg-green-50 disabled:opacity-50">
              {loading ? 'Refreshing…' : '↻ Refresh'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading && <div className="p-8 text-center text-gray-400">Loading…</div>}

          {!loading && tab === 'signins' && (
            signIns.length === 0 ? <div className="p-8 text-center text-gray-400">No sign-ins yet.</div> :
            <ul className="divide-y divide-gray-100">
              {signIns.map((s, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{name(s.full_name, s.email)}</p>
                    <p className="text-xs text-gray-500 truncate">{s.email} · {device(s.user_agent)}{(s.country || s.state) ? ` · ${formatLocation(s.state, s.country)}` : ''}{s.ip_address ? ` · ${s.ip_address}` : ''}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-gray-900">{fmtTime(s.timestamp)}</p>
                    <p className="text-xs text-gray-400">{relTime(s.timestamp)}{s.plan && s.plan !== 'free' ? ' · ' : ''}{s.plan && s.plan !== 'free' ? badge(s.plan, 'green') : null}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && tab === 'referrals' && (
            <div>
              <div className="px-5 pt-4 pb-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">Top referrers</div>
              {topReferrers.length === 0 ? <div className="px-5 py-4 text-gray-400 text-sm">No referrers yet.</div> :
                <ul className="divide-y divide-gray-100">
                  {topReferrers.map((r, i) => (
                    <li key={i} className="flex items-center justify-between px-5 py-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{name(r.full_name, r.email)}</p>
                        <p className="text-xs text-gray-500 truncate">{r.email} · code <span className="font-mono">{r.referral_code}</span></p>
                      </div>
                      {badge(`${r.referral_count} joined`, 'green')}
                    </li>
                  ))}
                </ul>}
              <div className="px-5 pt-4 pb-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">Who joined under a code</div>
              {joins.length === 0 ? <div className="px-5 py-4 text-gray-400 text-sm">No referred sign-ups yet.</div> :
                <ul className="divide-y divide-gray-100">
                  {joins.map((j, i) => (
                    <li key={i} className="flex items-center justify-between px-5 py-3 gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{name(j.joiner_name, j.joiner_email)}</p>
                        <p className="text-xs text-gray-500 truncate">
                          via <span className="font-mono">{j.code}</span>
                          {j.referrer_email ? ` → ${name(j.referrer_name, j.referrer_email)}` : ' (unknown referrer)'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-gray-900">{fmtTime(j.joined_at)}</p>
                        <p className="text-xs">{j.email_verified ? badge('verified', 'green') : badge('unverified', 'amber')}</p>
                      </div>
                    </li>
                  ))}
                </ul>}
            </div>
          )}

          {!loading && tab === 'shares' && (
            shares.length === 0 ? <div className="p-8 text-center text-gray-400">No household invites yet.</div> :
            <ul className="divide-y divide-gray-100">
              {shares.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-5 py-3 gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{name(s.inviter_name, s.inviter_email)} <span className="text-gray-400 font-normal">invited</span> {s.invitee_email}</p>
                    <p className="text-xs text-gray-500">{fmtTime(s.created_at)} · {relTime(s.created_at)}</p>
                  </div>
                  {badge(s.status ?? '—',
                    s.status === 'accepted' ? 'green' : s.status === 'pending' ? 'amber' : 'gray')}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
