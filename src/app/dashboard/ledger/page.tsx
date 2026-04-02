'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import { useCurrency } from '../../../lib/useCurrency';

interface LedgerEntry {
  id?: number;
  date?: string | number;
  createdAt?: string | number;
  type?: string;
  entryType?: string;
  amount?: number;
  currency?: string;
  description?: string;
  metadataJson?: string;
  referenceType?: string;
  referenceId?: number;
  [key: string]: unknown;
}

interface LedgerResponse {
  entries?: LedgerEntry[];
  total?: number;
  page?: number;
  size?: number;
  totalPages?: number;
  [key: string]: unknown;
}

const ENTRY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'ASSET_ADDED', label: 'Asset Added' },
  { value: 'ASSET_UPDATED', label: 'Asset Updated' },
  { value: 'ASSET_DELETED', label: 'Asset Deleted' },
  { value: 'ZAKAT_PAID', label: 'Zakat Paid' },
  { value: 'ZAKAT_SNAPSHOT_LOCKED', label: 'Zakat Snapshot (Locked)' },
  { value: 'HAWL_STARTED', label: 'Hawl Started' },
  { value: 'TRANSACTION', label: 'Transaction' },
  { value: 'DEBT_ADDED', label: 'Debt Added' },
  { value: 'DEBT_UPDATED', label: 'Debt Updated' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
  { value: 'CORRECTION', label: 'Correction' },
  { value: 'IMPORT', label: 'Import' },
];

export default function AuditLedgerPage() {
  const { toast } = useToast();
  const { fmt } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedType, setSelectedType] = useState('');
  const [total, setTotal] = useState(0);

  const PAGE_SIZE = 50;

  // Load ledger data
  useEffect(() => {
    const loadLedger = async () => {
      setLoading(true);
      try {
        let result;
        if (selectedType) {
          result = await api.getLedgerByType(selectedType);
        } else {
          result = await api.getFinancialLedger(page, PAGE_SIZE);
        }

        if (result) {
          const ledgerEntries = Array.isArray(result) ? result : result.entries || [];
          setEntries(ledgerEntries);
          setTotal(result.total || ledgerEntries.length || 0);
          setTotalPages(result.totalPages || Math.ceil((result.total || 0) / PAGE_SIZE));
        }
      } catch (err) {
        logError(err, { context: 'Failed to load ledger' });
        toast('Failed to load audit ledger. Please refresh.', 'error');
      }
      setLoading(false);
    };

    loadLedger();
  }, [page, selectedType, toast]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPage(0);
  };

  const formatDate = (dateVal: unknown): string => {
    if (!dateVal) return 'N/A';
    try {
      const date = typeof dateVal === 'number' ? new Date(dateVal) : new Date(String(dateVal));
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateVal);
    }
  };

  const formatAmount = (amount: unknown, currency: unknown): string => {
    if (amount === undefined || amount === null) return 'N/A';
    try {
      const num = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
      const curr = String(currency || 'USD');
      return `${fmt(num)} ${curr}`;
    } catch {
      return String(amount);
    }
  };

  // Extract a human-readable description from metadataJson or description field
  const getDescription = (entry: LedgerEntry): string => {
    if (entry.description) return entry.description;
    if (entry.metadataJson) {
      try {
        const meta = JSON.parse(entry.metadataJson);
        // Build description from metadata fields
        const parts: string[] = [];
        if (meta.assetName) parts.push(meta.assetName);
        if (meta.recipient) parts.push(`To: ${meta.recipient}`);
        if (meta.oldValue !== undefined && meta.newValue !== undefined) {
          parts.push(`${fmt(meta.oldValue)} → ${fmt(meta.newValue)}`);
        }
        if (meta.assetType) parts.push(`(${meta.assetType})`);
        if (meta.debtName) parts.push(meta.debtName);
        if (meta.goalName) parts.push(meta.goalName);
        if (meta.billName) parts.push(meta.billName);
        if (meta.transactionDescription) parts.push(meta.transactionDescription);
        return parts.join(' · ') || '—';
      } catch {
        return '—';
      }
    }
    return '—';
  };

  // Get the entry type, preferring entryType (backend field) over type
  const getEntryType = (entry: LedgerEntry): string => {
    return String(entry.entryType || entry.type || 'UNKNOWN');
  };

  // Get the date, preferring createdAt (backend field) over date
  const getEntryDate = (entry: LedgerEntry): unknown => {
    return entry.createdAt || entry.date;
  };

  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading audit ledger...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1B5E20] mb-2">Financial Audit Ledger</h1>
          <p className="text-gray-600">Complete transaction history and system adjustments</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-[#1B5E20] mb-2">Filter by Type</label>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                {ENTRY_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-[#1B5E20]">{total}</p>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Type</th>
                    <th className="px-6 py-4 text-right font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold">Description</th>
                    <th className="px-6 py-4 text-center font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.map((entry, idx) => {
                    const entryType = getEntryType(entry);
                    return (
                    <tr
                      key={entry.id || idx}
                      className={`hover:bg-green-50 transition ${
                        entryType === 'ZAKAT_SNAPSHOT_LOCKED' ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {formatDate(getEntryDate(entry))}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[#1B5E20]">
                        {entryType.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-mono text-gray-700">
                        {formatAmount(entry.amount, entry.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {getDescription(entry)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entryType === 'ZAKAT_SNAPSHOT_LOCKED' ? (
                          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                            <span>🔒</span> Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-700 font-semibold">
                            <span>✓</span> Active
                          </span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No ledger entries found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
            >
              Previous
            </button>
            <div className="text-gray-600">
              Page <span className="font-bold text-[#1B5E20]">{page + 1}</span> of{' '}
              <span className="font-bold text-[#1B5E20]">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
