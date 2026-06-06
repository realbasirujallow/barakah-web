'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../lib/toast';

const LOCALE_LABELS: Record<string, string> = {
  en: '🇬🇧 English',
  ar: '🇸🇦 Arabic (العربية)',
  ur: '🇵🇰 Urdu (اردو)',
  fr: '🇫🇷 French (Français)',
};

interface LocaleUser {
  id: number;
  plan: string;
  createdAt: string;
}

interface LocaleGroupSummary {
  locale: string;
  count: number;
}

interface AuditResult {
  total: number;
  nonEnglish: number;
  byLocale: LocaleGroupSummary[];
}

interface LocaleUsersPage {
  locale: string;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  users: LocaleUser[];
}

export function AdminLocaleAuditTab() {
  const [data, setData] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [fixing, setFixing] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [usersByLocale, setUsersByLocale] = useState<Record<string, LocaleUsersPage | 'loading' | 'error'>>({});
  const { toast } = useToast();

  useEffect(() => {
    api.adminLocaleAudit()
      .then((r: unknown) => setData(r as AuditResult))
      .catch(() => toast('Failed to load locale audit', 'error'))
      .finally(() => setLoading(false));
  }, [toast]);

  async function expandLocale(locale: string) {
    if (expanded === locale) { setExpanded(null); return; }
    setExpanded(locale);
    if (usersByLocale[locale] && usersByLocale[locale] !== 'error') return;
    setUsersByLocale(prev => ({ ...prev, [locale]: 'loading' }));
    try {
      const r = await api.adminLocaleAuditUsers(locale, 0, 100) as LocaleUsersPage;
      setUsersByLocale(prev => ({ ...prev, [locale]: r }));
    } catch {
      setUsersByLocale(prev => ({ ...prev, [locale]: 'error' }));
      toast(`Failed to load users for ${locale}`, 'error');
    }
  }

  async function refreshLocale(locale: string) {
    try {
      const r = await api.adminLocaleAuditUsers(locale, 0, 100) as LocaleUsersPage;
      setUsersByLocale(prev => ({ ...prev, [locale]: r }));
    } catch {
      /* swallow */
    }
  }

  async function fixLocale(userId: number, fromLocale: string) {
    setFixing(userId);
    try {
      await api.adminUpdateUserLocale(userId, 'en');
      toast(`Locale reset to EN for user #${userId}`, 'success');
      const fresh = await api.adminLocaleAudit() as AuditResult;
      setData(fresh);
      await refreshLocale(fromLocale);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to update locale', 'error');
    } finally {
      setFixing(null);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!data) return null;

  const nonEnglishGroups = data.byLocale.filter(g => g.locale !== 'en');

  function renderTable(group: LocaleGroupSummary, showAction: boolean) {
    const entry = usersByLocale[group.locale];
    if (entry === 'loading' || entry === undefined) {
      return <div className="border-t px-4 py-6 text-center text-sm text-gray-500">Loading…</div>;
    }
    if (entry === 'error') {
      return <div className="border-t px-4 py-6 text-center text-sm text-red-600">Failed to load — try again.</div>;
    }
    return (
      <div className="border-t">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Joined</th>
              {showAction && <th className="px-4 py-2 text-left">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entry.users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">#{u.id}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.plan === 'family' ? 'bg-purple-100 text-purple-700' : u.plan === 'plus' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                {showAction && (
                  <td className="px-4 py-3">
                    <button
                      disabled={fixing === u.id}
                      onClick={() => fixLocale(u.id, group.locale)}
                      className="px-3 py-1 text-xs rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {fixing === u.id ? '…' : 'Reset to EN'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {entry.totalElements > entry.users.length && (
          <div className="px-4 py-3 text-xs text-gray-500 border-t bg-gray-50">
            Showing {entry.users.length} of {entry.totalElements}. Open a user&apos;s record from the Users tab for full detail.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{data.total}</p>
          <p className="text-sm text-gray-500 mt-1">Total users</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{data.total - data.nonEnglish}</p>
          <p className="text-sm text-green-600 mt-1">English (en)</p>
        </div>
        <div className={`rounded-xl p-4 text-center border ${data.nonEnglish > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
          <p className={`text-2xl font-bold ${data.nonEnglish > 0 ? 'text-amber-700' : 'text-green-700'}`}>{data.nonEnglish}</p>
          <p className={`text-sm mt-1 ${data.nonEnglish > 0 ? 'text-amber-600' : 'text-green-600'}`}>Non-English locale</p>
        </div>
      </div>

      {data.nonEnglish === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center text-green-700">
          ✅ All users have an English server locale — no mismatches detected.
        </div>
      )}

      {nonEnglishGroups.length > 0 && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-medium text-amber-800">⚠️ These users have a non-English <code>user.locale</code>. Their weekly recap insights and system emails (trial reminders, zakat notifications, etc.) arrive in the locale shown below — even if their UI appears in English. Use <strong>Reset to EN</strong> if they&apos;ve indicated they prefer English.</p>
          </div>

          {nonEnglishGroups.map(group => (
            <div key={group.locale} className="bg-white border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                onClick={() => expandLocale(group.locale)}
              >
                <span className="font-semibold text-gray-800">
                  {LOCALE_LABELS[group.locale] ?? group.locale} — {group.count} user{group.count !== 1 ? 's' : ''}
                </span>
                <span className="text-gray-400 text-sm">{expanded === group.locale ? '▲' : '▼'}</span>
              </button>

              {expanded === group.locale && renderTable(group, true)}
            </div>
          ))}
        </div>
      )}

      {/* English group — collapsed by default */}
      {data.byLocale.filter(g => g.locale === 'en').map(group => (
        <div key="en" className="bg-white border rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
            onClick={() => expandLocale('en')}
          >
            <span className="font-semibold text-gray-800">
              🇬🇧 English — {group.count} user{group.count !== 1 ? 's' : ''} ✅
            </span>
            <span className="text-gray-400 text-sm">{expanded === 'en' ? '▲' : '▼'}</span>
          </button>
          {expanded === 'en' && renderTable(group, false)}
        </div>
      ))}
    </div>
  );
}
