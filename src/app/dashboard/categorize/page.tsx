'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface CategorySuggestion {
  transactionId: number;
  description: string;
  amount: number;
  currentCategory: string;
  suggestedCategory: string;
  confidence: number;
  icon: string;
  wouldChange: boolean;
}

export default function CategorizePage() {
  const [suggestions, setSuggestions] = useState<CategorySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api.reviewCategories().then(d => setSuggestions(d)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.applyCategories(60);
      setApplied(true);
      const updated = await api.reviewCategories();
      setSuggestions(updated);
    } catch { /* ignore */ }
    setApplying(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  const changeable = suggestions.filter(s => s.wouldChange);
  const categories = suggestions.reduce((acc, s) => {
    const cat = s.suggestedCategory || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Auto-Categorize</h1>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-2xl p-8 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-indigo-200 mb-1">Transactions Scanned</p>
            <p className="text-4xl font-bold">{suggestions.length}</p>
            <p className="text-indigo-200 text-sm mt-1">{changeable.length} can be auto-categorized</p>
          </div>
          {changeable.length > 0 && !applied && (
            <button
              onClick={handleApply}
              disabled={applying}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 disabled:opacity-50"
            >
              {applying ? 'Applying...' : `Apply ${changeable.length} Changes`}
            </button>
          )}
          {applied && (
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium">
              ✅ Applied!
            </span>
          )}
        </div>
      </div>

      {Object.keys(categories).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Category Distribution</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <span key={cat} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                {cat} ({count})
              </span>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Review Suggestions</h2>
          {suggestions.slice(0, 50).map(s => (
            <div key={s.transactionId} className={`bg-white rounded-xl p-4 ${s.wouldChange ? 'border-l-4 border-indigo-400' : ''}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{s.icon} {s.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    {s.wouldChange ? (
                      <>
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs line-through">{s.currentCategory || 'none'}</span>
                        <span>→</span>
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{s.suggestedCategory}</span>
                      </>
                    ) : (
                      <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{s.suggestedCategory}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-700">${Math.abs(s.amount).toFixed(2)}</p>
                  <span className={`text-xs ${s.confidence >= 80 ? 'text-green-600' : s.confidence >= 60 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {s.confidence}% confident
                  </span>
                </div>
              </div>
            </div>
          ))}
          {suggestions.length > 50 && (
            <p className="text-center text-gray-400 text-sm py-2">Showing 50 of {suggestions.length} transactions</p>
          )}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏷️</p>
          <p>No transactions to categorize. Add transactions first.</p>
        </div>
      )}
    </div>
  );
}
