'use client';
import { useState } from 'react';
import { api } from '../lib/api';

/**
 * Feature 1 UI (2026-04-18): "I paid zakat for lunar year N before I joined
 * Barakah" backfill modal. POSTs to /api/zakat/snapshots/historical-paid
 * which creates a permanently-locked snapshot so the user's on-platform
 * audit trail is complete even for years Barakah didn't track them live.
 *
 * Invoked by a button on the zakat dashboard; returns control via
 * `onClose(savedLunarYear | null)` so the caller can refresh.
 */
interface Props {
  currentLunarYear: number;
  open: boolean;
  onClose: (savedLunarYear: number | null) => void;
}

/**
 * Rough Hijri → Gregorian year mapping for the input hint. The conversion
 * factor 0.970224 is the ratio of lunar-year to solar-year length; off by
 * ~1 day at the boundary but adequate for a "this Hijri year overlaps
 * roughly 2023–2024" hint. The authoritative conversion is done server-side
 * by Java's HijrahChronology.
 */
function hijriYearToGregorianApprox(hijriYear: number): { start: number; end: number } | null {
  if (!Number.isFinite(hijriYear) || hijriYear < 1300 || hijriYear > 1600) return null;
  const start = Math.round(hijriYear * 0.970224 + 621.5643);
  return { start, end: start + 1 };
}

export default function HistoricalZakatModal({ currentLunarYear, open, onClose }: Props) {
  const [lunarYear, setLunarYear] = useState<string>(() => String(currentLunarYear - 1));
  const [zakatAmount, setZakatAmount] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [paidDate, setPaidDate] = useState<string>(''); // YYYY-MM-DD
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const parsedYear = parseInt(lunarYear, 10);
  const gregorianHint = hijriYearToGregorianApprox(parsedYear);
  const parsedZakat = parseFloat(zakatAmount);
  const parsedPaid = parseFloat(paidAmount);
  const paidShortfall =
    Number.isFinite(parsedZakat) && parsedZakat > 0 &&
    Number.isFinite(parsedPaid) && parsedPaid > 0 &&
    parsedPaid < parsedZakat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const yearNum = parseInt(lunarYear, 10);
    const zakatNum = parseFloat(zakatAmount);
    const paidNum = parseFloat(paidAmount);
    if (!Number.isFinite(yearNum) || yearNum < 1300 || yearNum > 1600) {
      setError('Enter a Hijri year between 1300 and 1600.');
      return;
    }
    if (!Number.isFinite(zakatNum) || zakatNum <= 0) {
      setError('Zakat amount must be a positive number.');
      return;
    }
    if (!Number.isFinite(paidNum) || paidNum <= 0) {
      setError('Paid amount must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Parameters<typeof api.markHistoricalZakatPaid>[0] = {
        lunarYear: yearNum,
        zakatAmount: zakatNum,
        paidAmount: paidNum,
      };
      if (paidDate) {
        const ms = Date.parse(paidDate);
        if (Number.isFinite(ms)) payload.paidDate = ms;
      }
      if (notes.trim()) payload.notes = notes.trim();

      const res = await api.markHistoricalZakatPaid(payload) as { success?: boolean; error?: string } | null;
      if (res && res.success) {
        onClose(yearNum);
      } else {
        setError((res && res.error) || 'The server rejected the request.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="historical-zakat-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between mb-1">
          <h2 id="historical-zakat-title" className="text-lg font-semibold text-gray-900">
            Mark historical zakat paid
          </h2>
          <button
            type="button"
            onClick={() => onClose(null)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Record zakat you paid before joining Barakah. This creates a
          permanent, locked record for the lunar year so your audit trail
          is complete.
        </p>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Hijri lunar year</span>
          <input
            type="number"
            value={lunarYear}
            onChange={(e) => setLunarYear(e.target.value)}
            placeholder="e.g. 1445"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            required
            min={1300}
            max={1600}
          />
          {gregorianHint && (
            <span className="mt-1 block text-xs text-gray-500">
              ≈ Gregorian {gregorianHint.start}–{gregorianHint.end}
            </span>
          )}
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Zakat due that year (USD)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={zakatAmount}
            onChange={(e) => setZakatAmount(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            required
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Amount you actually paid (USD)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            required
          />
          {paidShortfall && (
            <span className="mt-1 block text-xs text-amber-700">
              Paid is less than zakat due. Barakah will still record this, but note the shortfall may represent an outstanding obligation.
            </span>
          )}
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700">Payment date (optional)</span>
          <input
            type="date"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
            max={new Date().toISOString().slice(0, 10)}
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium text-gray-700">Notes (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder='e.g. "Paid via local masjid, March 2024"'
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          />
        </label>

        {error && (
          <p className="mb-3 text-sm text-red-600" role="alert">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onClose(null)}
            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? 'Saving…' : 'Save locked record'}
          </button>
        </div>
      </form>
    </div>
  );
}
