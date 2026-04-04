'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';
import { toHijri } from '../../../lib/format';

interface HawlItem { id: number; assetName: string; assetType: string; amount: number; nisabThreshold: number; zakatAmount: number; hawlStartDate: number; hawlEndDate: number; zakatPaid: boolean; active: boolean; zakatLocked: boolean; zakatLockedDate: number; lockedNisabValue: number; lockedGoldPrice: number; lockedZakatAmount: number; effectiveZakatAmount: number; }
const TYPES = ['cash', 'gold', 'silver', 'crypto', 'stocks', 'business', 'other'];

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
};

export default function HawlPage() {
  const [items, setItems] = useState<HawlItem[]>([]);
  const [nextDueDate, setNextDueDate] = useState<number | null>(null);
  const [nextDueAsset, setNextDueAsset] = useState<string>('');
  const [nextDueDays, setNextDueDays] = useState<number>(0);
  const [nextDueAmount, setNextDueAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ assetName: '', assetType: 'cash', amount: '', nisabThreshold: '5000', startDate: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [importing, setImporting] = useState(false);
  const [allPaidMessage, setAllPaidMessage] = useState<string | null>(null);
  const [editingDateId, setEditingDateId] = useState<number | null>(null);
  const [newStartDate, setNewStartDate] = useState('');
  const [dateInputMode, setDateInputMode] = useState<'gregorian' | 'hijri'>('gregorian');
  const [hijriInput, setHijriInput] = useState({ year: '', month: '', day: '' });
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    api.getHawl().then(d => {
      if (d?.error) { toast(d.error, 'error'); return; }
      setItems(Array.isArray(d?.trackers) ? d.trackers : Array.isArray(d) ? d : []);
      setNextDueDate(d?.nextZakatDueDate || null);
      setNextDueAsset(d?.nextZakatDueAsset || '');
      setNextDueDays(d?.nextZakatDueDays || 0);
      setNextDueAmount(d?.nextZakatDueAmount || 0);
    }).catch(() => { toast('Failed to load hawl trackers', 'error'); }).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    const amt = parseFloat(form.amount);
    const nisab = parseFloat(form.nisabThreshold);
    if (!form.assetName.trim()) { setSaveError('Asset name is required'); setSaving(false); return; }
    if (isNaN(amt) || amt <= 0) { setSaveError('Amount must be a positive number'); setSaving(false); return; }
    if (isNaN(nisab) || nisab <= 0) { setSaveError('Nisab threshold must be a positive number'); setSaving(false); return; }

    const data: Record<string, unknown> = { assetName: form.assetName, assetType: form.assetType, amount: amt, nisabThreshold: nisab };
    // Custom start date (noon UTC to avoid timezone edge cases)
    if (form.startDate) {
      data.hawlStartDate = new Date(form.startDate + 'T12:00:00Z').getTime();
    }
    try {
      await api.addHawl(data);
      setShowForm(false); setForm({ assetName: '', assetType: 'cash', amount: '', nisabThreshold: '5000', startDate: '' }); load();
      toast('Asset tracker added', 'success');
    } catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Failed to save tracker'; setSaveError(msg); toast(msg, 'error'); }
    setSaving(false);
  };

  const handleMarkPaid = async (id: number) => {
    try {
      const result = await api.markHawlPaid(id);
      if (result?.allZakatPaid) {
        setAllPaidMessage(result.allPaidMessage || 'MashaAllah! All zakat obligations fulfilled!');
      }
      load();
    } catch {
      toast('Failed to mark as paid', 'error');
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (allPaidMessage) {
      timer = setTimeout(() => setAllPaidMessage(null), 8000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [allPaidMessage]);

  const handleReset = (id: number) => {
    setConfirmAction({
      message: 'Reset this Hawl? This will start a new 354-day cycle from today and mark zakat as unpaid for this asset.',
      action: async () => {
        try {
          await api.resetHawl(id);
          toast('Hawl reset — new cycle started', 'success');
          load();
        } catch {
          toast('Failed to reset hawl', 'error');
        }
      }
    });
  };

  const handleDelete = (id: number) => {
    setConfirmAction({
      message: 'Delete this tracker?',
      action: async () => {
        setDeletingId(id);
        try {
          await api.deleteHawl(id);
          toast('Tracker deleted', 'success');
        } catch {
          toast('Failed to delete tracker', 'error');
        } finally {
          setDeletingId(null);
          load();
        }
      }
    });
  };

  const handleLockZakat = async (id: number) => {
    try {
      const result = await api.lockHawlZakat(id);
      toast(result?.message || 'Zakat amount locked at current prices', 'success');
      load();
    } catch {
      toast('Failed to lock zakat', 'error');
    }
  };

  const handleUnlockZakat = (id: number) => {
    setConfirmAction({
      message: 'Unlock zakat? Your obligation will revert to live gold/silver prices.',
      action: async () => {
        try {
          const result = await api.unlockHawlZakat(id);
          toast(result?.message || 'Zakat lock removed', 'success');
          load();
        } catch {
          toast('Failed to unlock zakat', 'error');
        }
      }
    });
  };

  const handleImportAssets = async () => {
    setImporting(true);
    try {
      const result = await api.importAssetsToHawl();
      if (result?.error) { toast(result.error, 'error'); return; }
      toast(result?.message || `Imported ${result?.importedCount || 0} assets`, 'success');
      load();
    } catch {
      toast('Failed to import assets', 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleUpdateStartDate = async (id: number) => {
    try {
      let data: Record<string, unknown>;
      if (dateInputMode === 'gregorian') {
        if (!newStartDate) { toast('Please select a date', 'error'); return; }
        data = { hawlStartDate: new Date(newStartDate + 'T12:00:00Z').getTime() };
      } else {
        const y = parseInt(hijriInput.year), m = parseInt(hijriInput.month), d = parseInt(hijriInput.day);
        if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 30) { toast('Invalid Hijri date', 'error'); return; }
        data = { hijriYear: y, hijriMonth: m, hijriDay: d };
      }
      const result = await api.updateHawlStartDate(id, data);
      toast(result?.message || 'Start date updated', 'success');
      setEditingDateId(null);
      setNewStartDate('');
      setHijriInput({ year: '', month: '', day: '' });
      load();
    } catch {
      toast('Failed to update start date', 'error');
    }
  };

  const formatHijriDate = (epochMs: number) => {
    const h = toHijri(new Date(epochMs));
    return `${h.day} ${h.monthName} ${h.year} AH`;
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const zakatDue = items.filter(i => !i.zakatPaid && i.hawlEndDate && i.hawlEndDate < Date.now());
  const pending = items.filter(i => !i.zakatPaid && (!i.hawlEndDate || i.hawlEndDate >= Date.now()));

  return (
    <div>
      {/* All Paid Celebration Banner */}
      {allPaidMessage && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white mb-6 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-bold text-lg">{allPaidMessage}</p>
              <p className="text-white/80 text-sm mt-1">May Allah accept your zakat and increase your barakah.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Hawl Tracker</h1>
        <div className="flex gap-2">
          <button type="button" onClick={handleImportAssets} disabled={importing} className="border border-[#1B5E20] text-[#1B5E20] px-4 py-2 rounded-lg hover:bg-green-50 font-medium disabled:opacity-50 text-sm">
            {importing ? 'Importing...' : 'Import Assets'}
          </button>
          <button type="button" onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Track Asset</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Tracking</p><p className="text-2xl font-bold text-[#1B5E20]">{items.length}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Zakat Due</p><p className="text-2xl font-bold text-amber-600">{zakatDue.length}</p></div>
        <div className="bg-white rounded-xl p-5"><p className="text-gray-500 text-sm">Total Zakat</p><p className="text-2xl font-bold text-red-600">{fmt(zakatDue.reduce((s, i) => s + (i.effectiveZakatAmount || i.zakatAmount), 0))}</p></div>
      </div>

      {nextDueDate && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-5 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">&#8987;</span>
            <p className="font-bold text-lg">Next Zakat Due</p>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/90 font-semibold">{nextDueAsset}</p>
              <p className="text-white/70 text-sm">{new Date(nextDueDate).toLocaleDateString('en-US', DATE_FORMAT)}</p>
              <p className="text-white/50 text-xs">{formatHijriDate(nextDueDate)}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{nextDueDays}<span className="text-lg ml-1">days</span></p>
              <p className="text-white/60 text-sm">Zakat: {fmt(nextDueAmount)}</p>
            </div>
          </div>
        </div>
      )}

      {zakatDue.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-amber-700 mb-3">Zakat Due — Hawl Complete</h2>
          <div className="space-y-2">
            {zakatDue.map(item => (
              <div key={item.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-[#1B5E20]">{item.assetName}</p>
                    <p className="text-sm text-gray-500">{item.assetType} &bull; {fmt(item.amount)}</p>
                    <p className="text-xs text-gray-400 mt-1">Hawl: {formatHijriDate(item.hawlStartDate)} &rarr; {formatHijriDate(item.hawlEndDate)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-bold text-amber-600">{fmt(item.effectiveZakatAmount || item.zakatAmount)}</p>
                    <button type="button" onClick={() => handleMarkPaid(item.id)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">Paid</button>
                    <button type="button" onClick={() => setEditingDateId(editingDateId === item.id ? null : item.id)} className="text-purple-600 hover:text-purple-800 text-sm" title="Change Hawl date">&#128197;</button>
                    <button type="button" onClick={() => handleReset(item.id)} className="text-blue-600 hover:text-blue-800 text-sm" title="Reset Hawl cycle">&#8635;</button>
                    <button type="button" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === item.id ? '...' : 'Del'}</button>
                  </div>
                </div>
                {/* Date Editor */}
                {editingDateId === item.id && (
                  <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Change Hawl Start Date</p>
                    <div className="flex gap-2 mb-2">
                      <button type="button" onClick={() => setDateInputMode('gregorian')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'gregorian' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-600'}`}>Gregorian</button>
                      <button type="button" onClick={() => setDateInputMode('hijri')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'hijri' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-600'}`}>Hijri</button>
                    </div>
                    {dateInputMode === 'gregorian' ? (
                      <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm text-gray-900 w-full" />
                    ) : (
                      <div className="flex gap-2">
                        <input type="number" placeholder="Year (e.g. 1447)" value={hijriInput.year} onChange={e => setHijriInput({ ...hijriInput, year: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                        <input type="number" placeholder="Month (1-12)" min="1" max="12" value={hijriInput.month} onChange={e => setHijriInput({ ...hijriInput, month: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                        <input type="number" placeholder="Day (1-30)" min="1" max="30" value={hijriInput.day} onChange={e => setHijriInput({ ...hijriInput, day: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button type="button" onClick={() => handleUpdateStartDate(item.id)} className="bg-[#1B5E20] text-white px-3 py-1 rounded text-sm">Update</button>
                      <button type="button" onClick={() => { setEditingDateId(null); setNewStartDate(''); setHijriInput({ year: '', month: '', day: '' }); }} className="text-gray-500 text-sm">Cancel</button>
                    </div>
                  </div>
                )}
                {item.zakatLocked ? (
                  <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <span>&#128274;</span>
                      <span>Zakat locked: {fmt(item.lockedZakatAmount || item.zakatAmount)} ({item.assetType === 'silver' ? 'Silver' : 'Gold'}: ${(item.lockedGoldPrice ?? 0).toFixed(2)}/g on {new Date(item.zakatLockedDate).toLocaleDateString('en-US', DATE_FORMAT)})</span>
                    </div>
                    <button type="button" onClick={() => handleUnlockZakat(item.id)} className="text-xs text-gray-500 hover:text-red-600 underline">Unlock</button>
                  </div>
                ) : (
                  <div className="mt-2">
                    <button type="button" onClick={() => handleLockZakat(item.id)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <span>&#128275;</span> Lock zakat amount at today&apos;s {item.assetType === 'silver' ? 'silver' : item.assetType === 'gold' ? 'gold' : 'metal'} price
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Pending</h2>
          <div className="space-y-2">
            {pending.map(item => {
              const start = item.hawlStartDate || Date.now();
              const end = item.hawlEndDate || start + 354.37 * 86400000;
              const total = end - start;
              const elapsed = Date.now() - start;
              // Guard against invalid date ranges
              let pct = 0;
              if (total <= 0) {
                pct = end < Date.now() ? 100 : 0;
              } else {
                pct = Math.min(Math.max((elapsed / total) * 100, 0), 100);
              }
              const daysLeft = Math.max(0, Math.ceil((end - Date.now()) / 86400000));
              return (
                <div key={item.id} className="bg-white rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-semibold text-[#1B5E20]">{item.assetName}</p>
                      <p className="text-sm text-gray-500">{item.assetType} &bull; {fmt(item.amount)}</p>
                      <p className="text-xs text-gray-400">Hawl: {formatHijriDate(start)} &rarr; {formatHijriDate(end)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{daysLeft}d left</span>
                      <button type="button" onClick={() => setEditingDateId(editingDateId === item.id ? null : item.id)} className="text-purple-600 hover:text-purple-800 text-sm" title="Change Hawl date">&#128197;</button>
                      <button type="button" onClick={() => handleReset(item.id)} className="text-blue-600 hover:text-blue-800 text-sm" title="Reset Hawl cycle">&#8635;</button>
                      <button type="button" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="text-gray-400 hover:text-red-600 text-sm disabled:opacity-50">{deletingId === item.id ? '...' : 'Del'}</button>
                    </div>
                  </div>
                  {/* Date Editor */}
                  {editingDateId === item.id && (
                    <div className="mb-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">Change Hawl Start Date</p>
                      <div className="flex gap-2 mb-2">
                        <button type="button" onClick={() => setDateInputMode('gregorian')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'gregorian' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-600'}`}>Gregorian</button>
                        <button type="button" onClick={() => setDateInputMode('hijri')} className={`text-xs px-2 py-1 rounded ${dateInputMode === 'hijri' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100 text-gray-600'}`}>Hijri</button>
                      </div>
                      {dateInputMode === 'gregorian' ? (
                        <input type="date" value={newStartDate} onChange={e => setNewStartDate(e.target.value)} className="border rounded px-2 py-1 text-sm text-gray-900 w-full" />
                      ) : (
                        <div className="flex gap-2">
                          <input type="number" placeholder="Year (e.g. 1447)" value={hijriInput.year} onChange={e => setHijriInput({ ...hijriInput, year: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                          <input type="number" placeholder="Month (1-12)" min="1" max="12" value={hijriInput.month} onChange={e => setHijriInput({ ...hijriInput, month: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                          <input type="number" placeholder="Day (1-30)" min="1" max="30" value={hijriInput.day} onChange={e => setHijriInput({ ...hijriInput, day: e.target.value })} className="border rounded px-2 py-1 text-sm text-gray-900 w-1/3" />
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => handleUpdateStartDate(item.id)} className="bg-[#1B5E20] text-white px-3 py-1 rounded text-sm">Update</button>
                        <button type="button" onClick={() => { setEditingDateId(null); setNewStartDate(''); setHijriInput({ year: '', month: '', day: '' }); }} className="text-gray-500 text-sm">Cancel</button>
                      </div>
                    </div>
                  )}
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-[#1B5E20] h-2 rounded-full" style={{ width: `${pct}%` }} /></div>
                  {item.zakatLocked ? (
                    <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs">
                      <span className="text-green-700">&#128274; Zakat locked: {fmt(item.lockedZakatAmount)} ({item.assetType === 'silver' ? 'Silver' : 'Gold'}: ${(item.lockedGoldPrice ?? 0).toFixed(2)}/g on {new Date(item.zakatLockedDate).toLocaleDateString('en-US', DATE_FORMAT)})</span>
                      <button type="button" onClick={() => handleUnlockZakat(item.id)} className="text-gray-500 hover:text-red-600 underline ml-2">Unlock</button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => handleLockZakat(item.id)} className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      &#128275; Lock zakat amount at today&apos;s {item.assetType === 'silver' ? 'silver' : item.assetType === 'gold' ? 'gold' : 'metal'} price
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">&#128197;</p>
          <p className="mb-4">No assets tracked. Start tracking Hawl for zakat eligibility.</p>
          <button type="button" onClick={handleImportAssets} disabled={importing} className="text-[#1B5E20] underline hover:text-[#2E7D32]">
            {importing ? 'Importing...' : 'Import from your Assets'}
          </button>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <p className="text-gray-800 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setConfirmAction(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={() => { const act = confirmAction.action; setConfirmAction(null); act(); }} className="flex-1 bg-red-600 text-white rounded-lg py-2 hover:bg-red-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Track New Asset</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input value={form.assetName} onChange={e => setForm({ ...form, assetName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Gold Savings" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.assetType} onChange={e => setForm({ ...form, assetType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nisab Threshold</label>
                <input type="number" step="0.01" value={form.nisabThreshold} onChange={e => setForm({ ...form, nisabThreshold: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Hawl Start Date <span className="text-gray-400">(optional — defaults to today)</span></label>
                <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" /></div>
            </div>
            {saveError && <div className="text-sm text-red-600 bg-red-50 p-2 rounded mb-3 mt-3">{saveError}</div>}
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving || !form.assetName || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Track'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
