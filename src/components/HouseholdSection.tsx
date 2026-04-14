'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { logError } from '../lib/logError';
import { useToast } from '../lib/toast';

/**
 * Household profile section — lives on /dashboard/profile.
 *
 * Two blocks in one component:
 *   1. Scalar fields on the user row: gender, date of birth, marital status.
 *   2. Household members table: spouses, children, parents (dependents used
 *      by Faraid prefill, Wasiyyah beneficiary suggestions, and the zakat
 *      classifier that exempts women's personal jewelry under Shafi'i/Maliki).
 *
 * This is the single source of truth for household info across the app.
 * Previously users re-entered family structure on every Faraid run.
 */

interface Member {
  id: number;
  relationship: string;
  fullName: string;
  dateOfBirth: number | null;
  gender: string | null;
  notes: string | null;
}

interface HouseholdResponse {
  gender: string | null;
  dateOfBirth: number | null;
  maritalStatus: string | null;
  members: Member[];
}

const RELATIONSHIPS: { value: string; label: string }[] = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' },
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'other', label: 'Other dependent' },
];

function fmtDob(ms: number | null): string {
  if (!ms) return '';
  try { return new Date(ms).toISOString().slice(0, 10); } catch { return ''; }
}

function parseDob(iso: string): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

export default function HouseholdSection() {
  const { toast } = useToast();
  const [data, setData] = useState<HouseholdResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Profile form state
  const [gender, setGender] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [marital, setMarital] = useState<string>('');

  // New-member form state
  const [newRel, setNewRel] = useState('son');
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getHousehold() as HouseholdResponse;
      setData(res);
      setGender(res.gender ?? '');
      setDob(fmtDob(res.dateOfBirth));
      setMarital(res.maritalStatus ?? '');
    } catch (err) {
      logError(err, { context: 'Failed to load household' });
      toast('Could not load your household info.', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.updateHouseholdProfile({
        gender: gender || null,
        dateOfBirth: parseDob(dob),
        maritalStatus: marital || null,
      });
      toast('Household info saved', 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setAddingMember(true);
    try {
      await api.createHouseholdMember({
        relationship: newRel,
        fullName: newName.trim(),
        dateOfBirth: parseDob(newDob),
      });
      toast(`${newName.trim()} added`, 'success');
      setNewName('');
      setNewDob('');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not add member', 'error');
    } finally {
      setAddingMember(false);
    }
  };

  const removeMember = async (id: number, name: string) => {
    if (!confirm(`Remove ${name} from your household? You can always re-add them.`)) return;
    try {
      await api.deleteHouseholdMember(id);
      toast(`${name} removed`, 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not remove', 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-500 text-sm">
        Loading household…
      </div>
    );
  }

  const members = data?.members ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1B5E20]">Household</h2>
        <p className="text-xs text-gray-500 mt-1">
          Used to auto-fill the Faraid inheritance calculator, suggest Wasiyyah
          beneficiaries, and apply your madhab&apos;s jewelry zakat rules.
        </p>
      </div>

      {/* Scalar profile fields */}
      <div className="p-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Gender</label>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Date of birth</label>
          <input
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Marital status</label>
          <select
            value={marital}
            onChange={e => setMarital(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          >
            <option value="">—</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div className="sm:col-span-3 flex justify-end">
          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile}
            className="bg-[#1B5E20] text-white py-2 px-5 rounded-lg font-semibold text-sm hover:bg-[#2E7D32] transition disabled:opacity-60"
          >
            {savingProfile ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Members list */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-[#1B5E20] mb-3">Spouse &amp; dependents</h3>
        {members.length === 0 ? (
          <p className="text-sm text-gray-400 italic">None added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map(m => (
              <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{m.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {m.relationship}
                    {m.dateOfBirth ? ` · born ${fmtDob(m.dateOfBirth)}` : ''}
                    {m.gender ? ` · ${m.gender}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMember(m.id, m.fullName)}
                  className="text-xs text-red-700 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition flex-shrink-0"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add-member form */}
      <form onSubmit={addMember} className="p-6 grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_1fr_auto] gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Relationship</label>
          <select
            value={newRel}
            onChange={e => setNewRel(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          >
            {RELATIONSHIPS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Full name</label>
          <input
            type="text"
            required
            placeholder="e.g. Fatima"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Date of birth (optional)</label>
          <input
            type="date"
            value={newDob}
            onChange={e => setNewDob(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={addingMember || !newName.trim()}
          className="bg-[#1B5E20] text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-[#2E7D32] transition disabled:opacity-60 whitespace-nowrap"
        >
          {addingMember ? 'Adding…' : 'Add'}
        </button>
      </form>
    </div>
  );
}
