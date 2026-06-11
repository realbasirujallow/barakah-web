'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { logError } from '../lib/logError';
import { useToast } from '../lib/toast';
import { useI18n } from '../lib/i18n';

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

// 2026-06-11 (i18n bug cluster): labels are dictionary keys, resolved via
// t() at render. The wasRel* keys are reused from the Wasiyyah surface
// (identical wording); only "Other dependent" needed a household-specific key.
const RELATIONSHIPS: { value: string; labelKey: string }[] = [
  { value: 'spouse', labelKey: 'wasRelSpouse' },
  { value: 'son', labelKey: 'wasRelSon' },
  { value: 'daughter', labelKey: 'wasRelDaughter' },
  { value: 'father', labelKey: 'wasRelFather' },
  { value: 'mother', labelKey: 'wasRelMother' },
  { value: 'other', labelKey: 'hhRelOtherDependent' },
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
  const { t, tFmt } = useI18n();
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
      toast(t('hhLoadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [toast, t]);

  useEffect(() => { load(); }, [load]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.updateHouseholdProfile({
        gender: gender || null,
        dateOfBirth: parseDob(dob),
        maritalStatus: marital || null,
      });
      toast(t('hhSaved'), 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('hhSaveError'), 'error');
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
      toast(tFmt('hhMemberAddedFmt', [newName.trim()]), 'success');
      setNewName('');
      setNewDob('');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('hhAddMemberError'), 'error');
    } finally {
      setAddingMember(false);
    }
  };

  const removeMember = async (id: number, name: string) => {
    // Same localized-confirm pattern as /dashboard/family (familyRemoveMemberConfirmFmt).
    if (!confirm(tFmt('hhRemoveConfirmFmt', [name]))) return;
    try {
      await api.deleteHouseholdMember(id);
      toast(tFmt('hhMemberRemovedFmt', [name]), 'success');
      await load();
    } catch (err) {
      toast(err instanceof Error ? err.message : t('hhRemoveError'), 'error');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-500 text-sm">
        {t('hhLoading')}
      </div>
    );
  }

  const members = data?.members ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-[#1B5E20]">{t('hhTitle')}</h2>
        <p className="text-xs text-gray-500 mt-1">
          {t('hhSubtitle')}
        </p>
      </div>

      {/* Scalar profile fields */}
      <div className="p-6 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Round 24: label→input association via htmlFor/id. R19/R20 did
            this sweep across login/signup/forgot/reset/profile; household
            section was missed. Screen readers now announce the label when
            focus lands on the select/input. */}
        <div>
          <label htmlFor="household-gender" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('hhGender')}</label>
          <select
            id="household-gender"
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          >
            <option value="">{t('hhPreferNotToSay')}</option>
            <option value="male">{t('hhMale')}</option>
            <option value="female">{t('hhFemale')}</option>
          </select>
        </div>
        <div>
          <label htmlFor="household-dob" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('hhDob')}</label>
          <input
            id="household-dob"
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
        </div>
        <div>
          <label htmlFor="household-marital" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('hhMarital')}</label>
          <select
            id="household-marital"
            value={marital}
            onChange={e => setMarital(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          >
            <option value="">—</option>
            <option value="single">{t('hhSingle')}</option>
            <option value="married">{t('hhMarried')}</option>
            <option value="divorced">{t('hhDivorced')}</option>
            <option value="widowed">{t('hhWidowed')}</option>
          </select>
        </div>
        <div className="sm:col-span-3 flex justify-end">
          <button
            type="button"
            onClick={saveProfile}
            disabled={savingProfile}
            className="bg-[#1B5E20] text-white py-2 px-5 rounded-lg font-semibold text-sm hover:bg-[#2E7D32] transition disabled:opacity-60"
          >
            {savingProfile ? t('txnSavingEllipsis') : t('save')}
          </button>
        </div>
      </div>

      {/* Members list */}
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-[#1B5E20] mb-3">{t('hhMembersHeading')}</h3>
        {members.length === 0 ? (
          <p className="text-sm text-gray-400 italic">{t('hhNoneYet')}</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {members.map(m => {
              // Localize the backend enum values; fall back to the raw
              // string for any relationship/gender we don't recognize.
              const relKey = RELATIONSHIPS.find(r => r.value === m.relationship)?.labelKey;
              const relLabel = relKey ? t(relKey) : m.relationship;
              const genderLabel = m.gender === 'male' ? t('hhMale')
                : m.gender === 'female' ? t('hhFemale')
                : m.gender;
              return (
                <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{m.fullName}</p>
                    <p className="text-xs text-gray-500">
                      {relLabel}
                      {m.dateOfBirth ? ` · ${tFmt('hhBornFmt', [fmtDob(m.dateOfBirth)])}` : ''}
                      {genderLabel ? ` · ${genderLabel}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(m.id, m.fullName)}
                    className="text-xs text-red-700 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition flex-shrink-0"
                  >
                    {t('familyRemoveBtn')}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Add-member form */}
      {/* Round 26: add htmlFor/id pairs matching the sweep applied to the
          top section in R24. Screen-reader users previously heard "edit, blank"
          on every field in this admin-style form. */}
      <form onSubmit={addMember} className="p-6 grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_1fr_auto] gap-3 items-end">
        <div>
          <label htmlFor="household-new-relationship" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('hhRelationship')}</label>
          <select
            id="household-new-relationship"
            value={newRel}
            onChange={e => setNewRel(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          >
            {RELATIONSHIPS.map(r => (
              <option key={r.value} value={r.value}>{t(r.labelKey)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="household-new-name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('authFullName')}</label>
          <input
            id="household-new-name"
            type="text"
            required
            placeholder={t('hhNamePlaceholder')}
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20] outline-none"
          />
        </div>
        <div>
          <label htmlFor="household-new-dob" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{t('hhDobOptional')}</label>
          <input
            id="household-new-dob"
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
          {addingMember ? t('hhAdding') : t('txnAddBtn')}
        </button>
      </form>
    </div>
  );
}
