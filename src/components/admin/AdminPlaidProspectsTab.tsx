'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast';
import type { AdminUser, PlaidOutreachStatus, PlaidProspect, PlaidProspectsResponse } from './adminTypes';
import { fmtFullTs, formatLocation } from './adminFormatting';

const FILTERS = [
  ['all', 'All linked'], ['free', 'Free'], ['expired', 'Expired'], ['active', 'Active connection'],
  ['needs_reconnect', 'Needs reconnect'], ['recent_sync', 'Recent sync'], ['never_paid', 'Never paid'],
] as const;
const OUTREACH: { value: PlaidOutreachStatus; label: string }[] = [
  { value: 'not_contacted', label: 'Not contacted' }, { value: 'sent', label: 'Sent' },
  { value: 'replied', label: 'Replied' }, { value: 'interested', label: 'Interested' },
  { value: 'converted', label: 'Converted' }, { value: 'do_not_contact', label: 'Do not contact' },
];

export function AdminPlaidProspectsTab({ openUser }: { openUser: (u: AdminUser, list?: AdminUser[]) => void }) {
  const { toast } = useToast();
  const [data, setData] = useState<PlaidProspectsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('all');
  const [outreach, setOutreach] = useState('all');
  const [q, setQ] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.getAdminPlaidProspects({ page, filter, outreach, q }) as PlaidProspectsResponse);
    } catch {
      toast('Could not load Plaid prospects.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, outreach, page, q, toast]);

  useEffect(() => { const id = setTimeout(load, q ? 300 : 0); return () => clearTimeout(id); }, [load, q]);
  const prospects = useMemo(() => data?.prospects ?? [], [data?.prospects]);
  const users = useMemo(() => prospects.map(toAdminUser), [prospects]);

  const updateStatus = async (p: PlaidProspect, status: PlaidOutreachStatus) => {
    setSavingId(p.userId);
    try {
      await api.updateAdminPlaidOutreach(p.userId, status);
      setData(current => current ? {
        ...current,
        prospects: current.prospects.map(row => row.userId === p.userId
          ? { ...row, outreachStatus: status, outreachUpdatedAt: Date.now() } : row),
      } : current);
      toast('Outreach status updated.', 'success');
    } catch {
      toast('Could not update outreach status.', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const exportCsv = () => {
    const header = ['Name','Email','Phone','Country','Plan','Status','Connection','First connected','Last sync','Imported transactions','Last imported transaction','Last login','Last seen','Trial expiration','Last paywall','Last checkout','Outreach'];
    const quote = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = prospects.map(p => [p.fullName,p.email,p.phoneNumber,formatLocation(p.state,p.country),p.plan,p.subscriptionStatus,connectionLabel(p),fmtFullTs(p.firstConnectedAt),fmtFullTs(p.lastSyncedAt),p.importedTransactionCount,fmtFullTs(p.lastImportedTransactionAt),fmtFullTs(p.lastLoginAt),fmtFullTs(p.lastSeenAt),fmtFullTs(p.planExpiresAt),fmtFullTs(p.lastPaywallAt),fmtFullTs(p.lastCheckoutAt),p.outreachStatus].map(quote).join(','));
    const url = URL.createObjectURL(new Blob([[header.map(quote).join(','), ...rows].join('\n')], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = `plaid-prospects-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return <div className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 className="text-xl font-semibold text-gray-900">Plaid Prospects</h2><p className="text-sm text-gray-500">People who connected a financial account, ordered by their latest sync.</p></div>
      <div className="flex gap-2"><button onClick={load} className="admin-action"><RefreshCw size={15}/> Refresh</button><button onClick={exportCsv} disabled={!prospects.length} className="admin-action"><Download size={15}/> Export page</button></div>
    </div>
    <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
      <div className="relative max-w-md"><Search className="absolute left-3 top-2.5 text-gray-400" size={17}/><input value={q} onChange={e => { setQ(e.target.value); setPage(0); }} placeholder="Search name, email, or phone" className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 bg-white" /></div>
      <div className="flex flex-wrap gap-2">{FILTERS.map(([value,label]) => <button key={value} onClick={() => { setFilter(value); setPage(0); }} className={`px-3 py-1.5 rounded-md text-xs font-medium border ${filter === value ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}`}>{label}</button>)}</div>
      <label className="flex items-center gap-2 text-sm text-gray-600">Outreach <select value={outreach} onChange={e => { setOutreach(e.target.value); setPage(0); }} className="border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-900"><option value="all">All statuses</option>{OUTREACH.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}</select></label>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><Metric label="Matching prospects" value={data?.totalElements ?? 0}/><Metric label="Visible active" value={prospects.filter(p => p.connectionHealthy).length}/><Metric label="Needs reconnect" value={prospects.filter(p => p.needsReconnect).length}/><Metric label="Never paid" value={prospects.filter(p => !['stripe','revenuecat'].includes(p.subscriptionSource ?? '')).length}/></div>
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      {loading ? <p className="p-8 text-center text-sm text-gray-500">Loading prospects…</p> : !prospects.length ? <p className="p-8 text-center text-sm text-gray-500">No prospects match these filters.</p> : <table className="min-w-[1400px] w-full text-sm"><thead className="bg-gray-50 text-left text-xs uppercase text-gray-500"><tr>{['User','Plan','Connection','Bank activity','App activity','Conversion intent','Outreach',''].map(x => <th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">{prospects.map((p,index) => <tr key={p.userId} className="align-top hover:bg-gray-50">
        <td className="px-3 py-3"><p className="font-medium text-gray-900">{p.fullName || 'Unnamed user'}</p><p className="text-gray-600">{p.email}</p><p className="text-xs text-gray-400">{p.phoneNumber || 'No phone'} · {formatLocation(p.state,p.country) || 'Unknown location'}</p></td>
        <td className="px-3 py-3"><p className="font-medium capitalize">{p.plan}</p><p className="text-xs text-gray-500 capitalize">{p.subscriptionStatus.replace('_',' ')}</p><p className="text-xs text-gray-400">Expires {fmtFullTs(p.planExpiresAt)}</p></td>
        <td className="px-3 py-3"><span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${p.needsReconnect ? 'bg-red-50 text-red-700' : p.connectionHealthy ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{connectionLabel(p)}</span><p className="text-xs text-gray-500 mt-1">{p.activeAccountCount}/{p.accountCount} active</p>{p.lastSyncError && <p className="text-xs text-red-600 max-w-xs mt-1" title={p.lastSyncError}>{p.lastSyncError.slice(0,100)}</p>}</td>
        <td className="px-3 py-3"><p>{p.importedTransactionCount} imported</p><p className="text-xs text-gray-500">Connected {fmtFullTs(p.firstConnectedAt)}</p><p className="text-xs text-gray-500">Synced {fmtFullTs(p.lastSyncedAt)}</p><p className="text-xs text-gray-500">Latest data {fmtFullTs(p.lastImportedTransactionAt)}</p></td>
        <td className="px-3 py-3"><p className="text-xs text-gray-500">Login {fmtFullTs(p.lastLoginAt)}</p><p className="text-xs text-gray-500">Seen {fmtFullTs(p.lastSeenAt)}</p></td>
        <td className="px-3 py-3"><p className="text-xs text-gray-500">Paywall {fmtFullTs(p.lastPaywallAt)}</p><p className="text-xs text-gray-500">Checkout {fmtFullTs(p.lastCheckoutAt)}</p></td>
        <td className="px-3 py-3"><select aria-label={`Outreach status for ${p.email}`} value={p.outreachStatus} disabled={savingId === p.userId} onChange={e => updateStatus(p,e.target.value as PlaidOutreachStatus)} className="border border-gray-300 rounded-md px-2 py-1.5 bg-white text-gray-900">{OUTREACH.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}</select><p className="text-xs text-gray-400 mt-1">{p.outreachUpdatedAt ? fmtFullTs(p.outreachUpdatedAt) : 'No outreach yet'}</p></td>
        <td className="px-3 py-3"><button onClick={() => openUser(users[index], users)} className="text-primary font-medium hover:underline">View user</button></td>
      </tr>)}</tbody></table>}
    </div>
    {(data?.totalPages ?? 0) > 1 && <div className="flex justify-center items-center gap-3 text-sm"><button disabled={page === 0} onClick={() => setPage(v => v-1)} className="admin-action">Previous</button><span>Page {page+1} of {data?.totalPages}</span><button disabled={page+1 >= (data?.totalPages ?? 1)} onClick={() => setPage(v => v+1)} className="admin-action">Next</button></div>}
    <style jsx>{`.admin-action{display:inline-flex;align-items:center;gap:.4rem;padding:.5rem .75rem;border:1px solid #d1d5db;border-radius:.375rem;background:white;color:#374151;font-size:.8rem;font-weight:500}.admin-action:disabled{opacity:.45}`}</style>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) { return <div className="bg-white border border-gray-200 rounded-lg p-3"><p className="text-2xl font-semibold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>; }
function connectionLabel(p: PlaidProspect) { return p.needsReconnect ? 'Needs reconnect' : p.connectionHealthy ? 'Active' : 'Inactive'; }
function toAdminUser(p: PlaidProspect): AdminUser { return { id:p.userId,email:p.email,name:p.fullName || p.email,phoneNumber:p.phoneNumber,country:p.country,state:p.state,plan:p.plan,subscriptionStatus:p.subscriptionStatus,subscriptionSource:p.subscriptionSource,planExpiresAt:p.planExpiresAt,lastLoginAt:p.lastLoginAt,lastSeenAt:p.lastSeenAt,createdAt:p.firstConnectedAt ?? 0 }; }
