'use client';

/**
 * Admin Users tab — Last Joiners cards + searchable/filterable/paginated
 * user table with CSV export. The row click opens the parent's user
 * detail modal; all mutations (delete, plan change, trial grant, etc.)
 * remain on the parent so modal handlers keep working.
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split
 * refactor.
 */

import { useState, useEffect } from 'react';
import type { AdminUser, UsersResponse, UserFilter } from './adminTypes';
import { PLAN_LABELS, SUB_STATUS_LABELS, cadenceLabel, fmtDateMs, fmtFullTs, formatLocation } from './adminFormatting';

export interface AdminUsersTabProps {
  usersData: UsersResponse | null;
  recentSignups?: AdminUser[];
  filteredUsers: AdminUser[];
  search: string;
  setSearch: (s: string) => void;
  searchLoading?: boolean;
  userFilter: UserFilter;
  setUserFilter: (f: UserFilter) => void;
  page: number;
  setPage: (p: number) => void;
  loadData: (p: number) => void | Promise<void>;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  countryFilter: string;
  onQueryChange: (q: { sort?: string; dir?: 'asc' | 'desc'; country?: string }) => void;
  openUser: (u: AdminUser, listContext?: AdminUser[]) => void;
  onBulkDelete?: (ids: number[]) => Promise<void>;
}

export function AdminUsersTab({
  usersData,
  recentSignups,
  filteredUsers,
  search,
  setSearch,
  searchLoading,
  userFilter,
  setUserFilter,
  page,
  setPage,
  loadData,
  sortBy,
  sortDir,
  countryFilter,
  onQueryChange,
  openUser,
  onBulkDelete,
}: AdminUsersTabProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);

  // Clear selection when the user list changes (page turn, search, filter)
  useEffect(() => { setSelected(new Set()); setBulkConfirm(false); }, [filteredUsers]);

  const toggleOne = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredUsers.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selected.size === 0) return;
    setBulkDeleting(true);
    try {
      await onBulkDelete(Array.from(selected));
      setSelected(new Set());
      setBulkConfirm(false);
    } finally {
      setBulkDeleting(false);
    }
  };

  const allSelected = filteredUsers.length > 0 && selected.size === filteredUsers.length;
  const someSelected = selected.size > 0 && !allSelected;

  // Server-side sort presets (value encodes "field|dir"). Applied via
  // onQueryChange, which resets to page 0 and refetches.
  const SORT_OPTIONS: { value: string; label: string }[] = [
    { value: 'id|asc', label: 'Joined (oldest first)' },
    { value: 'createdAt|desc', label: 'Joined (newest first)' },
    { value: 'loginCount|desc', label: 'Most logins' },
    { value: 'loginCount|asc', label: 'Fewest logins' },
    { value: 'lastLoginAt|desc', label: 'Recently active' },
    { value: 'plan|asc', label: 'Plan (A–Z)' },
    { value: 'billingInterval|desc', label: 'Cadence (annual first)' },
    { value: 'country|asc', label: 'Country (A–Z)' },
    { value: 'email|asc', label: 'Email (A–Z)' },
  ];
  const currentSortValue = `${sortBy}|${sortDir}`;

  // Country options: codes present on the current page, plus the active filter
  // (so it stays selected even if this page has no rows for it), sorted.
  const countryOptions = Array.from(
    new Set(
      [
        ...(usersData?.users ?? []).map(u => u.country).filter((c): c is string => !!c && c.trim() !== ''),
        countryFilter,
      ].filter(c => !!c && c.trim() !== ''),
    ),
  ).sort();

  // Shared pager (top + bottom). Server-side paging, so hidden during a
  // full-database search (search results aren't paged through here).
  const totalPages = usersData?.totalPages ?? 1;
  const pager = totalPages > 1 && !search ? (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => { const p = page - 1; setPage(p); loadData(p); }}
        disabled={page === 0}
        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
      >
        ← Prev
      </button>
      <span className="text-xs text-gray-500 px-2">Page {page + 1} of {totalPages}</span>
      <button
        onClick={() => { const p = page + 1; setPage(p); loadData(p); }}
        disabled={page + 1 >= totalPages}
        className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
      >
        Next →
      </button>
    </div>
  ) : null;

  return (
    <div className="space-y-4">
      {recentSignups && recentSignups.length > 0 && (
        <div className="bg-white rounded-2xl border p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-semibold text-gray-800 text-sm">Last Joiners</h2>
              <p className="text-xs text-gray-400 mt-1">Recent signups kept above the user table for quicker troubleshooting.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setUserFilter('all');
              }}
              className="text-xs text-[#1B5E20] font-medium hover:underline"
            >
              Reset user view
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recentSignups.map(u => {
              const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => openUser(u, recentSignups)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left hover:border-[#1B5E20]/30 hover:bg-white transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.name || 'Unnamed user'}</p>
                      <p className="text-xs text-gray-500 mt-1 break-all">{u.email}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>{fmtDateMs(u.createdAt)}</span>
                    <span>{u.emailVerified === false ? 'Unverified' : 'Verified'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden border">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex-1 flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, country, plan… (searches all users)"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none pr-8"
                />
                {searchLoading && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs animate-pulse">
                    …
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['all', 'All Users'],
                  ['plus', 'Plus'],
                  ['family', 'Family'],
                  ['free', 'Free'],
                  ['monthly', 'Monthly'],
                  ['annual', 'Annual'],
                  ['trialing', 'Trials'],
                  ['paying', 'Paying'],
                  ['past_due', 'Past Due'],
                  ['unverified', 'Unverified'],
                  ['missing_phone', 'Missing Phone'],
                  ['missing_location', 'Missing Location'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setUserFilter(value as UserFilter)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      userFilter === value
                        ? 'bg-[#1B5E20] text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B5E20] hover:text-[#1B5E20]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {userFilter !== 'all' && (
                  <button type="button" onClick={() => setUserFilter('all')} className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600">
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-sm px-2 py-1">
                  Clear Search
                </button>
              )}
              <span className="text-xs text-gray-400">
                {search.trim().length >= 2
                  ? `${filteredUsers.length} result${filteredUsers.length !== 1 ? 's' : ''} for "${search.trim()}"`
                  : `${usersData?.totalElements ?? 0} total`}
              </span>
              {!search && (
                <>
                  <label className="text-xs text-gray-500" htmlFor="admin-users-sort">Sort:</label>
                  <select
                    id="admin-users-sort"
                    value={currentSortValue}
                    onChange={(e) => {
                      const [field, dir] = e.target.value.split('|');
                      onQueryChange({ sort: field, dir: dir as 'asc' | 'desc' });
                    }}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <label className="text-xs text-gray-500" htmlFor="admin-users-country">Country:</label>
                  <select
                    id="admin-users-country"
                    value={countryFilter}
                    onChange={(e) => onQueryChange({ country: e.target.value })}
                    className="px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50 transition"
                  >
                    <option value="">All countries</option>
                    {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </>
              )}
              {pager}
              <button
                onClick={() => {
                  const users = filteredUsers;
                  const csv = ['ID,Name,Email,Phone,Plan,Status,Verified,VerifiedAt,Location,Joined,SignupSource,SignupIp,LastLogin,LastLoginIp,LoginCount']
                    .concat(users.map(u => [
                      u.id,
                      `"${(u.name || '').replace(/"/g, '""')}"`,
                      u.email,
                      u.phoneNumber || '',
                      u.plan,
                      u.subscriptionStatus || 'inactive',
                      u.emailVerified === false ? 'No' : 'Yes',
                      fmtFullTs(u.emailVerifiedAt),
                      [u.state, u.country].filter(Boolean).join(', '),
                      fmtFullTs(u.createdAt),
                      u.signupSource || '',
                      u.signupIp || '',
                      fmtFullTs(u.lastLoginAt),
                      u.lastLoginIp || '',
                      String(u.loginCount ?? 0),
                    ].join(','))).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `barakah-users-${new Date().toISOString().slice(0, 10)}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                title="Exports visible rows (use search to filter before exporting)"
                className="px-3 py-1.5 text-xs font-medium text-[#1B5E20] border border-[#1B5E20] rounded-lg hover:bg-green-50 transition"
              >
                Export CSV ({search.trim().length >= 2 ? `${filteredUsers.length} results` : `page ${page + 1}`})
              </button>
            </div>
          </div>
        </div>

        {/* Bulk delete action bar — appears when ≥1 row is selected */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-red-50 border-b border-red-100">
            <span className="text-sm font-medium text-red-700">
              {selected.size} user{selected.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
            >
              Clear
            </button>
            {!bulkConfirm ? (
              <button
                type="button"
                onClick={() => setBulkConfirm(true)}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete {selected.size} account{selected.size !== 1 ? 's' : ''}…
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-700 font-medium">Permanently delete? This cannot be undone.</span>
                <button
                  type="button"
                  onClick={() => setBulkConfirm(false)}
                  className="px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={bulkDeleting}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg transition disabled:opacity-50"
                >
                  {bulkDeleting ? `Deleting…` : `Yes, delete ${selected.size}`}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-3 py-3 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    title="Select all"
                  />
                </th>
                <th className="px-3 py-3">ID</th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Plan</th>
                <th className="px-3 py-3">Verified</th>
                <th className="px-3 py-3">Location</th>
                <th className="px-3 py-3">Signed Up</th>
                <th className="px-3 py-3">Last Login</th>
                <th className="px-3 py-3">Login IP</th>
                <th className="px-3 py-3">Logins</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-gray-400">
                    {search ? 'No users match your search.' : userFilter !== 'all' ? 'No users match this filter on the current page.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                  const subInfo = SUB_STATUS_LABELS[u.subscriptionStatus ?? 'inactive'] ?? SUB_STATUS_LABELS.inactive;
                  const cadence = cadenceLabel(u.billingInterval, u.plan);
                  const isSelected = selected.has(u.id);
                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-gray-50 transition cursor-pointer ${isSelected ? 'bg-red-50' : ''}`}
                      onClick={() => openUser(u, filteredUsers)}
                    >
                      <td className="px-3 py-3 w-8" onClick={e => toggleOne(u.id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-3 text-gray-400 font-mono text-xs">{u.id}</td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-gray-900 text-sm">{u.name || '—'}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
                          {cadence && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${cadence.color}`}>{cadence.label}</span>}
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${subInfo.color}`}>{subInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        {u.emailVerified === false
                          ? <span className="text-red-500 text-xs font-medium">✗ No</span>
                          : <div>
                              <span className="text-green-500 text-xs font-medium">✓ Yes</span>
                              {u.emailVerifiedAt && <p className="text-[10px] text-gray-400">{fmtFullTs(u.emailVerifiedAt)}</p>}
                            </div>
                        }
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500">
                        {formatLocation(u.state, u.country)}
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-xs">
                        <p>{fmtFullTs(u.createdAt)}</p>
                        {u.signupSource && <p className="text-[10px] text-gray-400">{u.signupSource}</p>}
                      </td>
                      <td className="px-3 py-3 text-gray-500 text-xs">
                        {u.lastLoginAt ? fmtFullTs(u.lastLoginAt) : '—'}
                      </td>
                      <td className="px-3 py-3 text-gray-400 font-mono text-[10px]">
                        {u.lastLoginIp || '—'}
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-gray-500">
                        {u.loginCount ?? 0}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[#1B5E20] text-xs font-medium">View →</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Bottom pagination — mirrors the top pager so admins don't have to
            scroll back up after reading a long page of users. */}
        {pager && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/60">
            <span className="text-xs text-gray-400">{usersData?.totalElements ?? 0} total</span>
            {pager}
            <span className="w-16" />
          </div>
        )}
      </div>
    </div>
  );
}
