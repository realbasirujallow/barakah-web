'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransactions()
      .then(data => setTransactions(Array.isArray(data) ? data : (data?.transactions || [])))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Transactions</h1>
      <div className="space-y-2">
        {transactions.map((tx, i) => (
          <div key={i} className="bg-white rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{(tx.description as string) || 'Transaction'}</p>
              <p className="text-xs text-gray-400">
                {tx.category as string} &bull; {new Date((tx.timestamp as number) || 0).toLocaleDateString()}
              </p>
            </div>
            <p className={`text-lg font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
              {tx.type === 'income' ? '+' : '-'}{fmt(Math.abs((tx.amount as number) || 0))}
            </p>
          </div>
        ))}
        {transactions.length === 0 && <p className="text-center text-gray-400 py-10">No transactions yet</p>}
      </div>
    </div>
  );
}
