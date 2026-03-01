'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

interface Group {
  id: number;
  name: string;
  description?: string;
  inviteCode: string;
  members: Member[];
  totalTransactions?: number;
}

interface Member {
  id: number;
  userId: number;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  balance?: number;
}

interface SharedTransaction {
  id: number;
  description: string;
  amount: number;
  paidByName: string;
  splitType: string;
  date: string;
  category?: string;
}

interface GroupSummary {
  balances: { userId: number; name: string; balance: number }[];
  totalSpent: number;
  recentTransactions: SharedTransaction[];
}

const emptyGroupForm = { name: '', description: '' };
const emptyTxForm = { description: '', amount: '', category: '' };

export default function SharedPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [summary, setSummary] = useState<GroupSummary | null>(null);
  const [transactions, setTransactions] = useState<SharedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupForm, setGroupForm] = useState(emptyGroupForm);
  const [savingGroup, setSavingGroup] = useState(false);

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joiningGroup, setJoiningGroup] = useState(false);

  const [showAddTx, setShowAddTx] = useState(false);
  const [txForm, setTxForm] = useState(emptyTxForm);
  const [savingTx, setSavingTx] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const loadGroups = () => {
    setLoading(true);
    api.getSharedGroups()
      .then(d => setGroups(d?.groups || d || []))
      .catch((err) => { console.error(err); })
      .finally(() => setLoading(false));
  };

  const loadGroupDetail = (group: Group) => {
    setActiveGroup(group);
    setLoadingDetail(true);
    Promise.all([
      api.getGroupSummary(group.id),
      api.getGroupTransactions(group.id),
    ])
      .then(([s, t]) => {
        setSummary(s);
        setTransactions(t?.transactions || t || []);
      })
      .catch((err) => { console.error(err); })
      .finally(() => setLoadingDetail(false));
  };

  useEffect(() => { loadGroups(); }, []);

  const handleCreateGroup = async () => {
    setSavingGroup(true);
    try {
      await api.createSharedGroup(groupForm);
      setShowCreateForm(false);
      setGroupForm(emptyGroupForm);
      loadGroups();
    } catch { /* */ }
    setSavingGroup(false);
  };

  const handleJoinGroup = async () => {
    setJoiningGroup(true);
    try {
      await api.joinSharedGroup(joinCode.trim());
      setShowJoinForm(false);
      setJoinCode('');
      loadGroups();
    } catch { /* */ }
    setJoiningGroup(false);
  };

  const handleAddTransaction = async () => {
    if (!activeGroup) return;
    setSavingTx(true);
    try {
      await api.addGroupTransaction(activeGroup.id, {
        description: txForm.description,
        amount: parseFloat(txForm.amount),
        category: txForm.category || 'general',
        splitType: 'equal',
      });
      setShowAddTx(false);
      setTxForm(emptyTxForm);
      loadGroupDetail(activeGroup);
    } catch { /* */ }
    setSavingTx(false);
  };

  const handleDeleteTx = async (txId: number) => {
    if (!activeGroup || !confirm('Delete this transaction?')) return;
    await api.deleteGroupTransaction(activeGroup.id, txId).catch((err) => { console.error(err); });
    loadGroupDetail(activeGroup);
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  // Detail view
  if (activeGroup) {
    const balances = summary?.balances || [];
    const positiveBalances = balances.filter(b => b.balance > 0);
    const negativeBalances = balances.filter(b => b.balance < 0);

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { setActiveGroup(null); setSummary(null); setTransactions([]); }}
            className="text-[#1B5E20] hover:underline text-sm font-medium"
          >
            ← All Groups
          </button>
          <h1 className="text-2xl font-bold text-[#1B5E20]">{activeGroup.name}</h1>
        </div>

        {/* Invite code */}
        <div className="bg-white rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-500">Invite Code</p>
            <p className="font-mono font-bold text-[#1B5E20] text-lg">{activeGroup.inviteCode}</p>
          </div>
          <button
            onClick={() => copyInviteCode(activeGroup.inviteCode)}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-gray-700"
          >
            {copiedCode ? '✓ Copied!' : 'Copy'}
          </button>
        </div>

        {loadingDetail ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-6 h-6 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-gray-500 text-sm">Total Spent (30 days)</p>
                <p className="text-2xl font-bold text-gray-900">{fmt(summary?.totalSpent || 0)}</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <p className="text-gray-500 text-sm">Members</p>
                <p className="text-2xl font-bold text-gray-900">{activeGroup.members?.length || 0}</p>
              </div>
            </div>

            {/* Balances (who owes who) */}
            {(positiveBalances.length > 0 || negativeBalances.length > 0) && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
                <div className="px-5 py-4 border-b">
                  <h2 className="font-bold text-[#1B5E20]">Balances</h2>
                </div>
                <div className="divide-y">
                  {balances.map(b => (
                    <div key={b.userId} className="px-5 py-3 flex justify-between items-center">
                      <p className="font-medium text-gray-900">{b.name}</p>
                      <p className={`font-bold ${b.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {b.balance >= 0 ? '+' : ''}{fmt(b.balance)}
                      </p>
                    </div>
                  ))}
                </div>
                {positiveBalances.length > 0 && negativeBalances.length > 0 && (
                  <div className="px-5 py-3 bg-gray-50 text-xs text-gray-500 border-t">
                    Positive = owed money · Negative = owes money
                  </div>
                )}
              </div>
            )}

            {/* Transactions */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b flex justify-between items-center">
                <h2 className="font-bold text-[#1B5E20]">Transactions</h2>
                <button
                  onClick={() => { setShowAddTx(true); setTxForm(emptyTxForm); }}
                  className="text-sm bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg hover:bg-[#2E7D32]"
                >
                  + Add
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">No transactions yet.</div>
              ) : (
                <div className="divide-y">
                  {transactions.map(tx => (
                    <div key={tx.id} className="px-5 py-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{tx.description}</p>
                        <p className="text-xs text-gray-500">
                          Paid by {tx.paidByName} · {formatDate(tx.date)}
                          {tx.category && ` · ${tx.category}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-gray-900">{fmt(tx.amount)}</p>
                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          className="text-gray-300 hover:text-red-500 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Transaction Modal */}
        {showAddTx && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Transaction</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    value={txForm.description}
                    onChange={e => setTxForm({ ...txForm, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="e.g. Dinner at restaurant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                  <input
                    type="number" step="0.01"
                    value={txForm.amount}
                    onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                  <input
                    value={txForm.category}
                    onChange={e => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="e.g. food, transport, utilities"
                  />
                </div>
                <p className="text-xs text-gray-400">Split equally among all group members.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddTx(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTransaction}
                  disabled={savingTx || !txForm.description || !txForm.amount}
                  className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
                >
                  {savingTx ? 'Saving...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Groups list view
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1B5E20]">Shared Finances</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowJoinForm(true)}
            className="border border-[#1B5E20] text-[#1B5E20] px-4 py-2 rounded-lg hover:bg-green-50 font-medium text-sm"
          >
            Join Group
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] font-medium text-sm"
          >
            + Create Group
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Track shared expenses with family, roommates, or travel companions. Expenses are split equally and balances are calculated automatically.
      </p>

      {groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p>No shared groups yet. Create one or join with an invite code.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => loadGroupDetail(group)}
              className="w-full bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{group.name}</p>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{group.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {group.members?.length || 0} members · Code: <span className="font-mono">{group.inviteCode}</span>
                  </p>
                </div>
                <span className="text-gray-400 text-sm">→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Create Shared Group</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  value={groupForm.name}
                  onChange={e => setGroupForm({ ...groupForm, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="e.g. Roommates, Family Trip"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                <input
                  value={groupForm.description}
                  onChange={e => setGroupForm({ ...groupForm, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="What is this group for?"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={savingGroup || !groupForm.name}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {savingGroup ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Join a Group</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-gray-900 font-mono text-lg"
                placeholder="e.g. ABC123"
              />
              <p className="text-xs text-gray-400 mt-1">Ask the group owner to share their invite code with you.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowJoinForm(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinGroup}
                disabled={joiningGroup || !joinCode.trim()}
                className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
              >
                {joiningGroup ? 'Joining...' : 'Join Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
