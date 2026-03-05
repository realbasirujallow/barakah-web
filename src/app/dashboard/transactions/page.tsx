'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { fmt } from '../../../lib/format';
import { useToast } from '../../../lib/toast';

interface Tx { id: number; type: string; category: string; amount: number; description: string; currency: string; timestamp: number; }
const CATEGORIES = [
  // 🍽️ Food
  'food', 'dining', 'groceries', 'coffee',
  // 🚗 Transport
  'transportation', 'fuel', 'parking', 'public_transit',
  // 🏠 Home & Life
  'housing', 'utilities', 'rent', 'home_maintenance', 'insurance',
  // 🛍️ Shopping
  'shopping', 'clothing', 'electronics',
  // 💊 Health
  'healthcare', 'fitness', 'pharmacy',
  // 📚 Learning & Kids
  'education', 'kids', 'childcare',
  // 🎉 Lifestyle
  'entertainment', 'subscriptions', 'travel', 'gifts', 'personal_care', 'pets',
  // 💰 Finance
  'income', 'investment', 'savings', 'debt_payment', 'taxes', 'transfer',
  // 🤲 Islamic
  'charity', 'zakat', 'sadaqah',
  // 📦 Other
  'business', 'other',
];
const PAGE_SIZE_OPTIONS = [20, 50, 100];

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: 'food', amount: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [selectAllPages, setSelectAllPages] = useState(false); // Gmail-style "select all N"
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    setError(null);
    api.getTransactions(filter === 'all' ? undefined : filter, page, pageSize)
      .then(d => {
        setTxs(d?.transactions || []);
        setTotalPages(d?.totalPages || 0);
        setTotalElements(d?.totalElements || 0);
      })
      .catch(() => {
        toast('Failed to load transactions', 'error');
        setError('Failed to load transactions. Please try again.');
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter, page, pageSize]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.addTransaction({ ...form, amount: parseFloat(form.amount) });
      setShowForm(false); setForm({ type: 'expense', category: 'food', amount: '', description: '' }); load();
      toast('Transaction added', 'success');
    } catch {
      toast('Failed to add transaction', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this transaction?')) return;
    await api.deleteTransaction(id).catch(() => toast('Failed to delete transaction', 'error'));
    load();
  };

  const toggleSelect = (id: number) => {
    setSelectAllPages(false);
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === txs.length) {
      setSelectedIds(new Set());
      setSelectAllPages(false);
    } else {
      setSelectedIds(new Set(txs.map(t => t.id)));
      setSelectAllPages(false);
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
    setSelectAllPages(false);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
    exitSelectMode();
  };

  const handleBulkDelete = async () => {
    const allPageCount = selectedIds.size === txs.length && totalPages > 1;
    const count = selectAllPages ? totalElements : selectedIds.size;
    if (count === 0) return;

    const noun = count === 1 ? 'transaction' : 'transactions';
    const scope = selectAllPages
      ? `ALL ${totalElements} transaction${totalElements !== 1 ? 's' : ''} (across all pages)`
      : `${count} selected ${noun}`;

    if (!confirm(`Delete ${scope}? This cannot be undone.`)) return;
    void allPageCount; // suppress unused-var warning

    setBulkDeleting(true);
    try {
      if (selectAllPages) {
        // Delete everything matching the current filter in one backend call
        const typeParam = filter === 'all' ? undefined : filter;
        const result = await api.deleteAllTransactions(typeParam);
        toast(`${result?.deleted ?? count} ${noun} deleted`, 'success');
      } else {
        const result = await api.bulkDeleteTransactions(Array.from(selectedIds));
        toast(`${result?.deleted ?? count} ${noun} deleted`, 'success');
      }
      exitSelectMode();
      setPage(0);
      load();
    } catch {
      toast('Failed to delete transactions', 'error');
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    setExportingCsv(true);
    setExportError(null);
    try {
      await api.downloadTransactionsCsv();
    } catch {
      toast('CSV export failed', 'error');
      setExportError('CSV export failed. Please try again.');
    }
    setExportingCsv(false);
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    setExportError(null);
    try {
      await api.downloadTransactionsPdf();
    } catch {
      toast('PDF export failed', 'error');
      setExportError('PDF export failed. Please try again.');
    }
    setExportingPdf(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  if (error) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">⚠️</p>
      <p className="text-red-600 font-medium mb-4">{error}</p>
      <button onClick={load} className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg hover:bg-[#2E7D32] text-sm font-medium">
        Retry
      </button>
    </div>
  );

  const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Whether every transaction on the current page is selected
  const allPageSelected = txs.length > 0 && selectedIds.size === txs.length;
  // Whether there are more pages beyond this one
  const hasMorePages = totalPages > 1;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Transactions</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          {/* Export buttons */}
          <button
            onClick={handleExportCsv}
            disabled={exportingCsv}
            className="border border-[#1B5E20] text-[#1B5E20] px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
          >
            {exportingCsv ? (
              <span className="animate-spin w-3 h-3 border-2 border-[#1B5E20] border-t-transparent rounded-full inline-block" />
            ) : '📥'} CSV
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="border border-[#1B5E20] text-[#1B5E20] px-3 py-2 rounded-lg hover:bg-green-50 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
          >
            {exportingPdf ? (
              <span className="animate-spin w-3 h-3 border-2 border-[#1B5E20] border-t-transparent rounded-full inline-block" />
            ) : '📄'} PDF
          </button>
          {txs.length > 0 && (
            selectMode ? (
              <button onClick={exitSelectMode} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Cancel
              </button>
            ) : (
              <button onClick={() => setSelectMode(true)} className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium">
                Select
              </button>
            )
          )}
          <button onClick={() => setShowForm(true)} className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium">+ Add</button>
        </div>
      </div>

      {exportError && (
        <div className="mb-4 bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg">
          {exportError}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4"><p className="text-gray-500 text-xs">Income</p><p className="text-xl font-bold text-green-600">{fmt(income)}</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-gray-500 text-xs">Expenses</p><p className="text-xl font-bold text-red-600">{fmt(expense)}</p></div>
        <div className="bg-white rounded-xl p-4"><p className="text-gray-500 text-xs">Net</p><p className={`text-xl font-bold ${income - expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(income - expense)}</p></div>
      </div>

      {/* Filter + page-size row */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {['all', 'income', 'expense'].map(f => (
          <button key={f} onClick={() => { setFilter(f); setPage(0); exitSelectMode(); }} className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-[#1B5E20] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>{f}</button>
        ))}
        {totalElements > 0 && <span className="text-sm text-gray-500">{totalElements} total</span>}
        {/* Page-size picker */}
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Show:</span>
          {PAGE_SIZE_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => handlePageSizeChange(n)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${pageSize === n ? 'bg-[#1B5E20] text-white border-[#1B5E20]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk-select action bar */}
      {selectMode && (
        <div className="mb-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Main select row */}
          <div className="flex items-center gap-3 p-3">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allPageSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[#1B5E20] rounded"
              />
              {allPageSelected ? 'Deselect page' : 'Select page'}
            </label>
            <span className="text-sm text-gray-500">
              {selectAllPages ? `All ${totalElements} selected` : `${selectedIds.size} selected`}
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={(selectAllPages ? totalElements : selectedIds.size) === 0 || bulkDeleting}
              className="ml-auto bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {bulkDeleting ? (
                <span className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full inline-block" />
              ) : '🗑️'}
              Delete {selectAllPages ? `all ${totalElements}` : selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </button>
          </div>

          {/* Gmail-style "select all N" banner — appears when whole page is ticked and more pages exist */}
          {allPageSelected && hasMorePages && !selectAllPages && (
            <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
              <span>All {txs.length} transactions on this page are selected.</span>
              <button
                onClick={() => setSelectAllPages(true)}
                className="font-semibold underline hover:no-underline"
              >
                Select all {totalElements} transactions
              </button>
            </div>
          )}
          {selectAllPages && (
            <div className="bg-blue-50 border-t border-blue-100 px-3 py-2 flex items-center gap-2 text-sm text-blue-800">
              <span>All {totalElements} transactions are selected.</span>
              <button
                onClick={() => { setSelectAllPages(false); setSelectedIds(new Set(txs.map(t => t.id))); }}
                className="font-semibold underline hover:no-underline"
              >
                Select only this page
              </button>
            </div>
          )}
        </div>
      )}

      {txs.length > 0 ? (
        <div className="space-y-2">
          {txs.map(tx => (
            <div
              key={tx.id}
              onClick={selectMode ? () => toggleSelect(tx.id) : undefined}
              className={`bg-white rounded-xl p-4 flex justify-between items-center transition ${selectMode ? 'cursor-pointer' : ''} ${
                selectMode && (selectedIds.has(tx.id) || selectAllPages) ? 'ring-2 ring-[#1B5E20] bg-green-50/30' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.has(tx.id) || selectAllPages}
                    onChange={() => toggleSelect(tx.id)}
                    onClick={e => e.stopPropagation()}
                    aria-label={`Select ${tx.description || tx.category}`}
                    className="w-4 h-4 accent-[#1B5E20] rounded flex-shrink-0"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{tx.description || tx.category}</p>
                  <p className="text-sm text-gray-500 capitalize">{tx.category} • {new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </p>
                {!selectMode && (
                  <button onClick={() => handleDelete(tx.id)} className="text-gray-400 hover:text-red-600 text-sm">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-3">📊</p><p>No transactions yet.</p></div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Transaction</h2>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  <option value="income">Income</option><option value="expense">Expense</option>
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>)}
                </select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="0.00" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-gray-900" placeholder="e.g. Groceries" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.amount} className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50">{saving ? 'Saving...' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
