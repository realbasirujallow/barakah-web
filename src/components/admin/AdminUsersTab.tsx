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

import type { AdminUser, UsersResponse, UserFilter } from './adminTypes';
import { PLAN_LABELS, SUB_STATUS_LABELS, fmtDateMs, fmtFullTs } from './adminFormatting';

export interface AdminUsersTabProps {
  usersData: UsersResponse | null;
  recentSignups?: AdminUser[];
  filteredUsers: AdminUser[];
  search: string;
  setSearch: (s: string) => void;
  userFilter: UserFilter;
  setUserFilter: (f: UserFilter) => void;
  page: number;
  setPage: (p: number) => void;
  loadData: (p: number) => void | Promise<void>;
  openUser: (u: AdminUser) => void;
}

export function AdminUsersTab({
  usersData,
  recentSignups,
  filteredUsers,
  search,
  setSearch,
  userFilter,
  setUserFilter,
  page,
  setPage,
  loadData,
  openUser,
}: AdminUsersTabProps) {
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
                  onClick={() => openUser(u)}
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
              <input
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {[
                  ['all', 'All Users'],
                  ['unverified', 'Unverified'],
                  ['past_due', 'Past Due'],
                  ['trialing', 'Trials'],
                  ['missing_phone', 'Missing Phone'],
                  ['missing_location', 'Missing Location'],
                  ['paying', 'Paying'],
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
              <span className="text-xs text-gray-400">{usersData?.totalElements ?? 0} total</span>
              {(usersData?.totalPages ?? 1) > 1 && !search && (
                <>
                  <button
                    onClick={() => { const p = page - 1; setPage(p); loadData(p); }}
                    disabled={page === 0}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    ← Prev
                  </button>
                  <span className="text-xs text-gray-500 px-2">Page {page + 1} of {usersData!.totalPages}</span>
                  <button
                    onClick={() => { const p = page + 1; setPage(p); loadData(p); }}
                    disabled={page + 1 >= usersData!.totalPages}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition"
                  >
                    Next →
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  const users = usersData?.users ?? [];
                  const csv = ['ID,Name,Email,Phone,Plan,Status,Verified,Location,Joined']
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
                className="px-3 py-1.5 text-xs font-medium text-[#1B5E20] border border-[#1B5E20] rounded-lg hover:bg-green-50 transition"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
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
                  <td colSpan={10} className="text-center py-10 text-gray-400">
                    {search ? 'No users match your search.' : userFilter !== 'all' ? 'No users match this filter on the current page.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const planInfo = PLAN_LABELS[u.plan] ?? PLAN_LABELS.free;
                  const subInfo = SUB_STATUS_LABELS[u.subscriptionStatus ?? 'inactive'] ?? SUB_STATUS_LABELS.inactive;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => openUser(u)}>
                      <td className="px-3 py-3 text-gray-400 font-mono text-xs">{u.id}</td>
                      <td className="px-3 py-3">
                        <p className="font-medium text-gray-900 text-sm">{u.name || '—'}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${planInfo.color}`}>{planInfo.label}</span>
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
                        {u.state && u.country ? `${u.state}, ${u.country}` : u.country || u.state || '—'}
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
      </div>
    </div>
  );
}
