'use client';

/**
 * Founder-CRM cross-user notes view — pulls every admin note matching a
 * tag (or no filter) so the founder can scan "every user who mentioned
 * scholar review" or "every user who said they wanted feature X" in one
 * place.
 *
 * Built 2026-05-06 in response to the founder's question: "Track every
 * conversation. For each person: ... what made them hesitate?"
 *
 * Per-user notes are written from AdminUserDetailModal → AdminUserNotesPanel.
 * This page is the cross-user read view: tag filter + day window + a list.
 *
 * Backend: GET /admin/notes?tag=<X>&days=<N>&limit=<M>   (admin-only).
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { useToast } from '../../../../lib/toast';
import { logError } from '../../../../lib/logError';
import { useAuth } from '../../../../context/AuthContext';
import { getLocale } from '../../../../lib/i18n';

interface AdminNoteWithUser {
  id: number;
  userId: number;
  authorAdminId: number;
  text: string;
  tags: string[];
  createdAt: number;
  user: {
    id: number;
    email: string;
    name?: string;
    plan?: string;
  };
}

interface NotesResponse {
  notes: AdminNoteWithUser[];
  tag: string;
  days: number;
}

interface TagFreqResponse {
  days: number;
  tags: { tag: string; count: number }[];
}

const DAY_OPTIONS = [7, 30, 90, 365] as const;

export default function AdminNotesPage() {
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<AdminNoteWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState('');
  const [days, setDays] = useState<number>(30);
  const [tagFreq, setTagFreq] = useState<TagFreqResponse | null>(null);

  const isAdmin = user?.isAdmin === true;
  const isAdminKnown = typeof user?.isAdmin === 'boolean';

  useEffect(() => {
    if (!isAuthLoading && user && isAdminKnown && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, isAdminKnown, isAuthLoading, router, user]);

  useEffect(() => {
    if (isAuthLoading || !user || !isAdmin) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.adminListNotesByTag(tag || undefined, days, 200) as NotesResponse;
        if (!cancelled) setNotes(res?.notes ?? []);
      } catch (err) {
        logError(err, { context: 'Failed to load admin notes' });
        if (!cancelled) toast('Failed to load notes. Admin access required?', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [tag, days, isAdmin, isAuthLoading, toast, user]);

  // Tag frequency for the sidebar — gives the founder a top-N shortcut to
  // the most-mentioned objections / feature wants in the chosen window.
  useEffect(() => {
    if (isAuthLoading || !user || !isAdmin) return;
    let cancelled = false;
    api.adminGetNoteTagFrequency(days)
      .then(res => { if (!cancelled) setTagFreq(res as TagFreqResponse); })
      .catch(err => logError(err, { context: 'Failed to load tag frequency' }));
    return () => { cancelled = true; };
  }, [days, isAdmin, isAuthLoading, user]);

  if (isAuthLoading || !isAdminKnown) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (user && !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard/admin"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-4"
        >
          <span aria-hidden="true">←</span>
          Back to Admin Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Founder notes</h1>
          <p className="text-sm text-gray-600 mb-4">
            Cross-user view of conversation notes. Pulls every note matching a tag so
            you can see &ldquo;everyone who mentioned scholar review&rdquo; in one read.
          </p>

          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="filter-tag">
                Filter by tag
              </label>
              <input
                id="filter-tag"
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value.trim().toLowerCase())}
                placeholder="e.g. scholar"
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="filter-days">
                Window
              </label>
              <select
                id="filter-days"
                value={days}
                onChange={e => setDays(parseInt(e.target.value, 10))}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
              >
                {DAY_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}d</option>
                ))}
              </select>
            </div>
            {tag && (
              <button
                type="button"
                onClick={() => setTag('')}
                className="text-xs px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50"
              >
                Clear filter
              </button>
            )}
            {/* 2026-05-18 release-polish (admin gap #3): CSV export of the
                currently-filtered notes set so the founder can run ad-hoc
                analysis in a spreadsheet without re-querying. */}
            <button
              type="button"
              disabled={notes.length === 0 || loading}
              onClick={() => {
                const escape = (s: string) =>
                  `"${(s ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' ')}"`;
                const header = 'id,createdAtIso,userId,userEmail,userName,plan,tags,text';
                const lines = notes.map(n =>
                  [
                    n.id,
                    new Date(n.createdAt).toISOString(),
                    n.userId,
                    escape(n.user?.email ?? ''),
                    escape(n.user?.name ?? ''),
                    escape(n.user?.plan ?? ''),
                    escape((n.tags ?? []).join('|')),
                    escape(n.text ?? ''),
                  ].join(','),
                );
                const csv = [header, ...lines].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const tagSlug = tag ? `-tag-${tag}` : '';
                a.download = `barakah-admin-notes${tagSlug}-${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="text-xs px-3 py-1.5 border border-[#1B5E20] text-[#1B5E20] rounded hover:bg-[#1B5E20]/5 disabled:opacity-40"
              title="Download the currently-filtered notes as CSV (one row per note)"
            >
              ⬇ Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tag frequency sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-2">Top tags ({days}d)</h2>
              {!tagFreq && <p className="text-sm text-gray-400">Loading…</p>}
              {tagFreq && tagFreq.tags.length === 0 && (
                <p className="text-sm text-gray-400">No tagged notes in window.</p>
              )}
              {tagFreq && tagFreq.tags.length > 0 && (
                <ul className="space-y-1">
                  {tagFreq.tags.map(t => {
                    const isActive = t.tag === tag;
                    return (
                      <li key={t.tag}>
                        <button
                          type="button"
                          onClick={() => setTag(t.tag)}
                          className={`w-full text-left px-2 py-1 rounded text-sm flex items-center justify-between transition ${
                            isActive ? 'bg-[#1B5E20]/10 text-[#1B5E20] font-semibold' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span>{t.tag}</span>
                          <span className="text-xs text-gray-500">{t.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          {/* Notes list */}
          <main className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900">
                  {tag ? <>Notes tagged &ldquo;{tag}&rdquo;</> : 'All notes'}
                </h2>
                <span className="text-xs text-gray-500">
                  {loading ? '…' : `${notes.length} note${notes.length === 1 ? '' : 's'}`}
                </span>
              </div>

              {loading && (
                <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
              )}
              {!loading && notes.length === 0 && (
                <p className="text-sm text-gray-400 py-6 text-center">
                  No notes match this filter. Open a user&rsquo;s detail and write the first one.
                </p>
              )}
              {!loading && notes.length > 0 && (
                <ul className="space-y-3">
                  {notes.map(n => (
                    <li key={n.id} className="border border-gray-200 rounded-lg px-3 py-2">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <div className="text-sm">
                          {/* 2026-05-10: deep-link to admin user-detail modal.
                              The parent admin page reads ?focusUser=ID on
                              mount and auto-opens the modal, so the founder
                              can jump straight into "view → fix email →
                              log call" instead of scrolling the user table. */}
                          <Link
                            href={`/dashboard/admin?focusUser=${n.user.id}`}
                            className="font-semibold text-gray-900 hover:text-[#1B5E20] hover:underline"
                          >
                            {n.user.name || n.user.email}
                          </Link>
                          {n.user.name && (
                            <span className="text-xs text-gray-500 ml-1">{n.user.email}</span>
                          )}
                          {n.user.plan && (
                            <span className="text-xs text-gray-400 ml-2">[{n.user.plan}]</span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(n.createdAt).toLocaleString(getLocale())}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{n.text}</p>
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        {n.tags.map(t => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTag(t)}
                            className={`text-[10px] px-1.5 py-0.5 rounded transition ${
                              t === tag ? 'bg-[#1B5E20] text-white' : 'bg-[#1B5E20]/10 text-[#1B5E20] hover:bg-[#1B5E20]/20'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
