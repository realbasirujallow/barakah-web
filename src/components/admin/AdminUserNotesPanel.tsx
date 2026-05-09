'use client';

/**
 * Founder-CRM admin notes panel — embedded inside AdminUserDetailModal.
 *
 * Built 2026-05-06 in response to the founder's question: "Track every
 * conversation. For each person: ... what made them hesitate?"
 *
 * Lifecycle events answer signup / first-action / paid / what-feature-made-
 * them-care. This panel covers what-made-them-hesitate — the colour from
 * demo calls / mosque conversations / support emails that no event stream
 * captures.
 *
 * UI: textarea + curated tag chips ("scholar", "pricing", "family-feature",
 * "trust", "competitor", "billing-confused", "wants-feature", "objection")
 * plus a free-text custom-tag input. Below the form, a list of existing
 * notes for this user, newest first, each with a delete button (only the
 * note's author can delete; backend enforces).
 */

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

const SUGGESTED_TAGS: readonly string[] = [
  'scholar',
  'pricing',
  'family-feature',
  'trust',
  'competitor',
  'billing-confused',
  'wants-feature',
  'objection',
  'demo-positive',
  'demo-negative',
  'mosque',
];

interface AdminNote {
  id: number;
  userId: number;
  authorAdminId: number;
  text: string;
  tags: string[];
  createdAt: number;
}

interface AdminUserNotesPanelProps {
  userId: number;
  toast: (msg: string, kind?: 'success' | 'error' | 'info') => void;
}

export default function AdminUserNotesPanel({ userId, toast }: AdminUserNotesPanelProps) {
  const [notes, setNotes] = useState<AdminNote[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [draftTags, setDraftTags] = useState<Set<string>>(new Set());
  const [customTag, setCustomTag] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetUserNotes(userId);
      if (res?.error) {
        toast(res.error, 'error');
        setNotes([]);
      } else {
        setNotes((res?.notes ?? []) as AdminNote[]);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load notes', 'error');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleTag = (tag: string) => {
    setDraftTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const addCustomTag = () => {
    const t = customTag.trim().toLowerCase();
    if (!t) return;
    if (!/^[a-z0-9_:\-]+$/.test(t)) {
      toast('Tags can only contain a-z, 0-9, _, :, -', 'error');
      return;
    }
    if (t.length > 40) {
      toast('Tags must be 40 characters or less', 'error');
      return;
    }
    setDraftTags(prev => new Set([...prev, t]));
    setCustomTag('');
  };

  const submit = async () => {
    const text = draft.trim();
    if (!text) {
      toast('Please write something before saving the note', 'error');
      return;
    }
    if (text.length > 4096) {
      toast('Note exceeds 4096 characters', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const tags = Array.from(draftTags);
      const res = await api.adminCreateUserNote(userId, text, tags);
      if (res?.error) {
        toast(res.error, 'error');
        return;
      }
      setDraft('');
      setDraftTags(new Set());
      toast('Note saved', 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save note', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteNote = async (noteId: number) => {
    if (!confirm('Delete this note? This cannot be undone.')) return;
    try {
      const res = await api.adminDeleteNote(noteId);
      if (res?.error) {
        toast(res.error, 'error');
        return;
      }
      toast('Note deleted', 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to delete note', 'error');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Founder notes</h3>
        <span className="text-xs text-gray-500">
          {notes === null ? '' : `${notes.length} note${notes.length === 1 ? '' : 's'}`}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Capture what they said on a demo, in support email, or after a mosque event.
        Tag for the cross-user view at <code className="bg-gray-100 px-1">/dashboard/admin/notes</code>.
      </p>

      {/* Compose */}
      <div className="mb-4">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={3}
          maxLength={4096}
          placeholder="e.g. On 2026-05-06 demo, said he&apos;d wait until first scholar is signed before paying. Asked about Hanafi-silver methodology specifically."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/30"
        />
        <div className="text-xs text-gray-400 text-right mt-1">{draft.length} / 4096</div>

        <div className="mt-2">
          <div className="text-xs font-medium text-gray-700 mb-1">Tags</div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_TAGS.map(tag => {
              const on = draftTags.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition ${
                    on
                      ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {on ? '✓ ' : ''}{tag}
                </button>
              );
            })}
            {Array.from(draftTags).filter(t => !SUGGESTED_TAGS.includes(t)).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className="text-xs px-2 py-0.5 rounded-full border bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 transition"
              >
                ✓ {tag} ✕
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 mt-2">
            <input
              type="text"
              value={customTag}
              onChange={e => setCustomTag(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag(); } }}
              placeholder="Custom tag (a-z 0-9 _ : -)"
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#1B5E20]/30"
            />
            <button
              type="button"
              onClick={addCustomTag}
              className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            >
              Add tag
            </button>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={submitting || !draft.trim()}
            className="px-4 py-1.5 bg-[#1B5E20] text-white text-sm rounded font-semibold hover:bg-[#1B5E20]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving…' : 'Save note'}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="border-t border-gray-100 pt-3">
        {loading && <p className="text-sm text-gray-400 py-3 text-center">Loading…</p>}
        {!loading && notes && notes.length === 0 && (
          <p className="text-sm text-gray-400 py-3 text-center">
            No notes yet. The first one breaks the seal.
          </p>
        )}
        {notes && notes.length > 0 && (
          <ul className="space-y-3">
            {notes.map(n => (
              <li key={n.id} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap flex-1">{n.text}</p>
                  <button
                    type="button"
                    onClick={() => deleteNote(n.id)}
                    className="text-xs text-gray-400 hover:text-red-600 transition"
                    title="Delete note"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-1 mt-1.5">
                  {n.tags.map(t => (
                    <span key={t} className="text-[10px] bg-[#1B5E20]/10 text-[#1B5E20] px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
