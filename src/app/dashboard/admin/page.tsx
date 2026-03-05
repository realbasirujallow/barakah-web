'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';

interface AdminUser {
  id: number;
  email: string;
  name: string;
}

interface UsersResponse {
  users: AdminUser[];
  count: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export default function AdminPage() {
  const [userCount, setUserCount] = useState<number | null>(null);
  const [usersData, setUsersData] = useState<UsersResponse | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const loadData = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const [countRes, usersRes] = await Promise.all([
        api.getAdminUserCount(),
        api.getAdminUsers(p, 50),
      ]);
      setUserCount(countRes?.count ?? null);
      setUsersData(usersRes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load admin data';
      if (msg.toLowerCase().includes('admin access') || msg.includes('403')) {
        setForbidden(true);
      } else {
        toast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(0); }, [loadData]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadData(newPage);
  };

  const filteredUsers = (usersData?.users ?? []).filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access Required</h1>
        <p className="text-gray-500 max-w-sm">
          Your account is not in the <code className="bg-gray-100 px-1 rounded text-sm">ADMIN_USER_IDS</code> environment variable.
          Ask the server owner to add your user ID.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white">
          <p className="text-green-200 text-sm mb-1">Total Users</p>
          <p className="text-4xl font-bold">{userCount ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">On This Page</p>
          <p className="text-4xl font-bold text-gray-800">{usersData?.count ?? 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Pages</p>
          <p className="text-4xl font-bold text-gray-800">{usersData?.totalPages ?? 1}</p>
        </div>
      </div>

      {/* Search + table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600 text-sm">
              Clear
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-10 text-gray-400">
                    {search ? 'No users match your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 text-gray-400 font-mono">{u.id}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{u.name || '—'}</td>
                    <td className="px-5 py-3 text-gray-600">{u.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(usersData?.totalPages ?? 1) > 1 && !search && (
          <div className="px-5 py-4 border-t flex items-center justify-between text-sm text-gray-500">
            <span>
              Page {page + 1} of {usersData!.totalPages} &mdash; {usersData!.totalElements} total users
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"
              >
                ← Prev
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page + 1 >= usersData!.totalPages}
                className="px-3 py-1 rounded-lg border hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
