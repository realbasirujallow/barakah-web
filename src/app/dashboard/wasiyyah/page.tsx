'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';

interface Beneficiary { id: number; beneficiaryName: string; relationship: string; sharePercentage: number; shareType: string; notes: string; }
interface Obligation { id: number; type: string; amount: number; currency: string; description: string; recipient?: string; notes?: string; status: string; }

const OBLIGATION_TYPES = [
  { value: 'ZAKAT',               label: 'Unpaid Zakat',          emoji: '🕌', desc: 'Zakat that is owed but not yet given' },
  { value: 'KAFFARAH',            label: 'Kaffarah',              emoji: '📿', desc: 'Expiation for broken oaths, missed fasts, etc.' },
  { value: 'UNPAID_LOAN',         label: 'Unpaid Loan',           emoji: '💰', desc: 'Money borrowed and not yet repaid' },
  { value: 'PROMISED_SADAQAH',    label: 'Promised Sadaqah',      emoji: '🤲', desc: 'Charity you pledged but have not yet given' },
  { value: 'MISSED_PRAYER_FIDYA', label: 'Fidya (Prayers/Fasts)', emoji: '📖', desc: 'Compensation owed for missed prayers or fasts' },
  { value: 'CUSTOM',              label: 'Other Obligation',      emoji: '📋', desc: 'Any other Islamic or personal obligation' },
];

const fmt = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);

export default function WasiyyahPage() {
  const [items, setItems]           = useState<Beneficiary[]>([]);
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<'beneficiaries' | 'obligations'>('beneficiaries');
  const [showForm, setShowForm]     = useState(false);
  const [showObForm, setShowObForm] = useState(false);
  const [form, setForm]             = useState({ beneficiaryName: '', relationship: '', sharePercentage: '', shareType: 'percentage', notes: '' });
  const [obForm, setObForm]         = useState({ type: 'ZAKAT', amount: '', currency: 'USD', description: '', recipient: '', notes: '' });
  const [saving, setSaving]         = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    Promise.all([
      api.getWasiyyah(),
      api.getWasiyyahObligations(),
    ]).then(([bData, oData]) => {
      setItems(bData?.beneficiaries || bData || []);
      setObligations(oData?.obligations || []);
    }).catch(() => toast('Failed to load wasiyyah data', 'error'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addWasiyyah({ ...form, sharePercentage: parseFloat(form.sharePercentage) });
      setShowForm(false);
      setForm({ beneficiaryName: '', relationship: '', sharePercentage: '', shareType: 'percentage', notes: '' });
      load(); toast('Beneficiary added', 'success');
    } catch { toast('Failed to add beneficiary', 'error'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this beneficiary?')) return;
    await api.deleteWasiyyah(id).catch(() => toast('Failed to remove', 'error'));
    load();
  };

  const handleObSave = async () => {
    setSaving(true);
    try {
      await api.addWasiyyahObligation({
        ...obForm,
        amount: parseFloat(obForm.amount),
      });
      setShowObForm(false);
      setObForm({ type: 'ZAKAT', amount: '', currency: 'USD', description: '', recipient: '', notes: '' });
      load(); toast('Obligation recorded', 'success');
    } catch { toast('Failed to record obligation', 'error'); }
    setSaving(false);
  };

  const handleObDelete = async (id: number) => {
    if (!confirm('Remove this obligation?')) return;
    await api.deleteWasiyyahObligation(id).catch(() => toast('Failed to remove', 'error'));
    load();
  };

  const markFulfilled = async (ob: Obligation) => {
    await api.updateWasiyyahObligation(ob.id, { status: ob.status === 'pending' ? 'fulfilled' : 'pending' })
      .catch(() => toast('Failed to update status', 'error'));
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const totalShare   = items.reduce((s, b) => s + (b.sharePercentage || 0), 0);
  const totalPending = obligations.filter(o => o.status === 'pending').reduce((s, o) => s + o.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Wasiyyah (Islamic Will)</h1>
        <button
          onClick={() => tab === 'beneficiaries' ? setShowForm(true) : setShowObForm(true)}
          className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
        >
          {tab === 'beneficiaries' ? '+ Add Beneficiary' : '+ Record Obligation'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['beneficiaries', 'obligations'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${tab === t ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
            {t === 'beneficiaries' ? '📜 Beneficiaries' : `⚖️ Obligations${obligations.filter(o=>o.status==='pending').length > 0 ? ` (${obligations.filter(o=>o.status==='pending').length})` : ''}`}
          </button>
        ))}
      </div>

      {/* ── Beneficiaries Tab ── */}
      {tab === 'beneficiaries' && (
        <>
          <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-2xl p-6 text-white mb-6">
            <p className="text-purple-200 text-sm">Total Share Allocated</p>
            <p className="text-4xl font-bold">{totalShare.toFixed(1)}%</p>
            <p className="text-purple-200 text-sm mt-1">{totalShare <= 33.3 ? '✅ Within the 1/3 Sunnah limit' : '⚠️ Exceeds the 1/3 Sunnah limit'}</p>
            <div className="w-full bg-purple-900/40 rounded-full h-3 mt-3">
              <div className={`h-3 rounded-full ${totalShare <= 33.3 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${Math.min(totalShare, 100)}%` }} />
            </div>
            <div className="flex justify-between text-xs text-purple-300 mt-1"><span>0%</span><span>33.3%</span><span>100%</span></div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-6">
            <strong>Islamic Guidance:</strong> Wasiyyah for non-heirs should not exceed one-third (Bukhari &amp; Muslim). Fixed-share heirs receive their Quranic portions automatically.
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map(b => (
                <div key={b.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#1B5E20]">{b.beneficiaryName}</p>
                    <p className="text-sm text-gray-500">{b.relationship}{b.notes ? ` • ${b.notes}` : ''}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-purple-600">{b.sharePercentage}%</p>
                    <button onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600 text-sm">Del</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📜</p><p>No beneficiaries yet. Planning your estate is a Sunnah.</p></div>
          )}
        </>
      )}

      {/* ── Obligations Tab ── */}
      {tab === 'obligations' && (
        <>
          {/* Summary card */}
          <div className="bg-gradient-to-r from-amber-700 to-orange-600 rounded-2xl p-6 text-white mb-6">
            <p className="text-amber-200 text-sm">Total Pending Obligations</p>
            <p className="text-4xl font-bold">{fmt(totalPending)}</p>
            <p className="text-amber-200 text-sm mt-1">
              {obligations.filter(o => o.status === 'pending').length} obligation(s) to be settled from estate
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 mb-6">
            <strong>What are Obligations?</strong> These are Islamic duties (Wajibat) — such as unpaid Zakat, Kaffarah, or loans — that must be settled in full from your estate <em>before</em> any inheritance is distributed. Unlike Wasiyyah, they are not subject to the 1/3 limit.
          </div>

          {obligations.length > 0 ? (
            <div className="space-y-3">
              {obligations.map(ob => {
                const typeInfo = OBLIGATION_TYPES.find(t => t.value === ob.type) ?? OBLIGATION_TYPES[OBLIGATION_TYPES.length - 1];
                return (
                  <div key={ob.id} className={`bg-white rounded-xl p-4 border-l-4 ${ob.status === 'fulfilled' ? 'border-green-400 opacity-60' : 'border-amber-400'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{typeInfo.emoji}</span>
                          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">{typeInfo.label}</span>
                          {ob.status === 'fulfilled' && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Fulfilled</span>}
                        </div>
                        <p className="font-semibold text-gray-800 truncate">{ob.description}</p>
                        {ob.recipient && <p className="text-sm text-gray-500">→ {ob.recipient}</p>}
                        {ob.notes && <p className="text-xs text-gray-400 mt-1 italic">{ob.notes}</p>}
                      </div>
                      <div className="ml-4 text-right flex-shrink-0">
                        <p className="text-xl font-bold text-amber-700">{fmt(ob.amount, ob.currency)}</p>
                        <div className="flex gap-2 mt-2 justify-end">
                          <button onClick={() => markFulfilled(ob)} className="text-xs text-[#1B5E20] hover:underline font-medium">
                            {ob.status === 'pending' ? 'Mark fulfilled' : 'Mark pending'}
                          </button>
                          <button onClick={() => handleObDelete(ob.id)} className="text-xs text-gray-400 hover:text-red-600">Del</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">⚖️</p>
              <p className="font-medium text-gray-600">No obligations recorded.</p>
              <p className="text-sm mt-1">If you have unpaid Zakat, loans, or other Islamic duties, record them here so your family can fulfil them on your behalf.</p>
            </div>
          )}
        </>
      )}

      {/* Add Beneficiary Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Beneficiary</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input value={form.beneficiaryName} onChange={e => setForm({ ...form, beneficiaryName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="Full name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input value={form.relationship} onChange={e => setForm({ ...form, relationship: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Nephew, Charity" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Share Percentage</label>
                <input type="number" step="0.1" min="0" max="100" value={form.sharePercentage} onChange={e => setForm({ ...form, sharePercentage: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="10" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.beneficiaryName || !form.sharePercentage} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Obligation Modal */}
      {showObForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-1">Record an Obligation</h2>
            <p className="text-sm text-gray-500 mb-4">An Islamic duty to be settled from your estate</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of Obligation</label>
                <div className="grid grid-cols-2 gap-2">
                  {OBLIGATION_TYPES.map(t => (
                    <button key={t.value} onClick={() => setObForm({ ...obForm, type: t.value })}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left transition ${obForm.type === t.value ? 'border-[#1B5E20] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <span className="text-lg">{t.emoji}</span>
                      <span className="text-xs font-medium text-gray-700 leading-tight">{t.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">{OBLIGATION_TYPES.find(t => t.value === obForm.type)?.desc}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input value={obForm.description} onChange={e => setObForm({ ...obForm, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder={obForm.type === 'ZAKAT' ? 'e.g. Zakat for 2024 — held back due to illness' : obForm.type === 'UNPAID_LOAN' ? 'e.g. £500 borrowed from Ahmed in 2022' : 'Brief description'} />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input type="number" step="0.01" min="0" value={obForm.amount} onChange={e => setObForm({ ...obForm, amount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" />
                </div>
                <div className="w-28">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select value={obForm.currency} onChange={e => setObForm({ ...obForm, currency: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm">
                    {['USD','GBP','EUR','SAR','AED','CAD','AUD','PKR','MYR','BDT','NGN','EGP'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Who should receive this?</label>
                <input value={obForm.recipient} onChange={e => setObForm({ ...obForm, recipient: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Local mosque, Ahmed ibn Ibrahim" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (for family)</label>
                <textarea value={obForm.notes} onChange={e => setObForm({ ...obForm, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900 resize-none" rows={3}
                  placeholder="Any context your family needs to know to fulfil this obligation..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowObForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleObSave} disabled={saving || !obForm.description || !obForm.amount}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Record Obligation'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
