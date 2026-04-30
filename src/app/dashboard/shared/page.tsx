'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { PageHeader } from '../../../components/dashboard/PageHeader';

interface Group {
  id: number;
  name: string;
  description?: string;
  inviteCode: string;
  members: Member[];
  memberCount?: number;
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

interface SharedBudget {
  id: number;
  category: string;
  monthlyLimit: number;
}

interface SharedGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  description?: string;
}

// Estate-share payload from /api/shared/groups/{id}/estate. Inner item arrays
// (waqf, wasiyyahBeneficiaries, obligations) keep loose typing because each
// element is owned by a different domain (Waqf entity / Wasiyyah beneficiary
// row / Wasiyyah obligation row) and the JSX already uses field-by-field
// `as string|number` casts. Top-level shape is what we need to lock down so
// future readers know the optional flags + the nested members[] are real.
interface EstateMember {
  userId: number;
  displayName: string;
  role: string;
  isSharing: boolean;
  isSelf: boolean;
  hasEstatePlan: boolean;
  totalWaqf?: number;
  totalShareAllocated?: number;
  pendingObligations?: number;
  waqf?: Record<string, unknown>[];
  wasiyyahBeneficiaries?: Record<string, unknown>[];
  obligations?: Record<string, unknown>[];
}
interface EstateData {
  error?: string;
  membersSharing?: number;
  membersWithEstatePlan?: number;
  groupTotalWaqf?: number;
  members?: EstateMember[];
}

const emptyGroupForm = { name: '', description: '' };
// `type` is required by the backend SharedTransactionRequest DTO (@NotBlank).
// Default to "expense" because it's the overwhelmingly common case for shared
// household spend. Future UI can expose a type picker; until then the default
// keeps the form compatible with the server contract.
const emptyTxForm = { description: '', amount: '', category: '', type: 'expense' };

export default function SharedPage() {
  const { fmt, currency } = useCurrency();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [summary, setSummary] = useState<GroupSummary | null>(null);
  const [transactions, setTransactions] = useState<SharedTransaction[]>([]);
  const [budgets, setBudgets] = useState<SharedBudget[]>([]);
  const [goals, setGoals] = useState<SharedGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'expenses' | 'budgets' | 'goals' | 'estate'>('expenses');
  const [estateData, setEstateData] = useState<EstateData | null>(null);
  const [estateSharing, setEstateSharing] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groupForm, setGroupForm] = useState(emptyGroupForm);
  const [savingGroup, setSavingGroup] = useState(false);

  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joiningGroup, setJoiningGroup] = useState(false);

  const [showAddTx, setShowAddTx] = useState(false);
  const [txForm, setTxForm] = useState(emptyTxForm);
  const [savingTx, setSavingTx] = useState(false);

  const [showAddBudget, setShowAddBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ category: '', monthlyLimit: '' });
  const [savingBudget, setSavingBudget] = useState(false);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', targetDate: '', description: '' });
  const [savingGoal, setSavingGoal] = useState(false);

  const [showContributeGoal, setShowContributeGoal] = useState<number | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [contributingGoal, setContributingGoal] = useState(false);

  const [copiedCode, setCopiedCode] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ message: string; action: () => void } | null>(null);
  const { toast } = useToast();

  // Track which group's detail load is currently in-flight so stale results
  // from a previous selection don't overwrite data for a newer one.
  const loadingForGroupRef = useRef<number | null>(null);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const loadGroups = () => {
    setLoading(true);
    api.getSharedGroups()
      .then(d => {
        if (d?.error) { toast(d.error, 'error'); return; }
        const g = d?.groups ?? d;
        setGroups(Array.isArray(g) ? g : []);
      })
      .catch(() => { toast('Failed to load groups', 'error'); })
      .finally(() => setLoading(false));
  };

  const loadGroupDetail = (group: Group) => {
    loadingForGroupRef.current = group.id;
    setActiveGroup(group);
    setLoadingDetail(true);
    setActiveTab('expenses');
    Promise.allSettled([
      api.getGroupDetails(group.id),
      api.getGroupSummary(group.id),
      api.getGroupTransactions(group.id),
      api.getSharedBudgets(group.id),
      api.getSharedGoals(group.id),
      api.getFamilyEstate(group.id),
      api.getEstateSharingStatus(),
    ])
      .then((results) => {
        // Discard stale results if user has already switched to a different group
        if (loadingForGroupRef.current !== group.id) return;
        // shared-finance backend returns 7 different response shapes in
        // parallel; typing each for a single-use helper is more code than
        // the type-safety gain. Downstream reads are all null-guarded.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val = (i: number): any => results[i].status === 'fulfilled' ? (results[i] as PromiseFulfilledResult<any>).value : null;
        const detail = val(0);
        const s = val(1);
        const t = val(2);
        const b = val(3);
        const g = val(4);
        const estate = val(5);
        const sharingStatus = val(6);

        // Merge full group details (including inviteCode and members)
        if (detail && !detail.error) {
          const fullGroup = detail.group || detail;
          setActiveGroup({ ...group, ...fullGroup, members: fullGroup.members || group.members || [] });
        }
        if (s && !s.error) setSummary(s);
        const txArr = t?.transactions ?? t;
        setTransactions(Array.isArray(txArr) ? txArr : []);
        const budgetArr = b?.budgets ?? b;
        setBudgets(Array.isArray(budgetArr) ? budgetArr : []);
        const goalArr = g?.goals ?? g;
        setGoals(Array.isArray(goalArr) ? goalArr : []);
        if (estate && !estate.error) setEstateData(estate);
        setEstateSharing(sharingStatus?.shareEstateWithFamily ?? true);
      })
      .finally(() => setLoadingDetail(false));
  };

  useEffect(() => { loadGroups(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateGroup = async () => {
    setSavingGroup(true);
    try {
      const res = await api.createSharedGroup(groupForm);
      setShowCreateForm(false);
      setGroupForm(emptyGroupForm);
      loadGroups();
      const code = res?.inviteCode || res?.group?.inviteCode;
      toast(code ? `Group created! Invite code: ${code}` : 'Group created', 'success');
    } catch { toast('Failed to create group', 'error'); }
    setSavingGroup(false);
  };

  const handleJoinGroup = async () => {
    setJoiningGroup(true);
    try {
      await api.joinSharedGroup(joinCode.trim());
      setShowJoinForm(false);
      setJoinCode('');
      loadGroups();
      toast('Joined group', 'success');
    } catch { toast('Failed to join group', 'error'); }
    setJoiningGroup(false);
  };

  const handleAddTransaction = async () => {
    if (!activeGroup) return;
    setSavingTx(true);
    try {
      await api.addGroupTransaction(activeGroup.id, {
        type: txForm.type || 'expense',   // required by SharedTransactionRequest
        description: txForm.description,
        amount: parseFloat(txForm.amount),
        category: txForm.category || 'general',
        splitType: 'equal',
      });
      setShowAddTx(false);
      setTxForm(emptyTxForm);
      loadGroupDetail(activeGroup);
      toast('Transaction added', 'success');
    } catch { toast('Failed to add transaction', 'error'); }
    setSavingTx(false);
  };

  const handleDeleteTx = (txId: number) => {
    if (!activeGroup) return;
    // Capture the current group at callback-creation time so a later group
    // switch doesn't delete from the wrong group. Same pattern applied to
    // the other handlers below.
    const group = activeGroup;
    const gid = group.id;
    setConfirmAction({
      message: 'Delete this transaction?',
      action: async () => {
        try {
          await api.deleteGroupTransaction(gid, txId);
          loadGroupDetail(group);
        } catch {
          toast('Failed to delete transaction', 'error');
        }
      }
    });
  };

  const handleAddBudget = async () => {
    if (!activeGroup) return;
    setSavingBudget(true);
    try {
      await api.addSharedBudget(activeGroup.id, {
        category: budgetForm.category,
        monthlyLimit: parseFloat(budgetForm.monthlyLimit),
      });
      setShowAddBudget(false);
      setBudgetForm({ category: '', monthlyLimit: '' });
      loadGroupDetail(activeGroup);
      toast('Budget added', 'success');
    } catch { toast('Failed to add budget', 'error'); }
    setSavingBudget(false);
  };

  const handleDeleteBudget = (budgetId: number) => {
    if (!activeGroup) return;
    const group = activeGroup;
    const gid = group.id;
    setConfirmAction({
      message: 'Delete this budget?',
      action: async () => {
        try {
          await api.deleteSharedBudget(gid, budgetId);
          loadGroupDetail(group);
        } catch {
          toast('Failed to delete budget', 'error');
        }
      }
    });
  };

  const handleAddGoal = async () => {
    if (!activeGroup) return;
    setSavingGoal(true);
    try {
      await api.addSharedGoal(activeGroup.id, {
        name: goalForm.name,
        targetAmount: parseFloat(goalForm.targetAmount),
        // Backend SharedGoalRequest.targetDate is Long (epoch millis). The
        // <input type="date"> yields "YYYY-MM-DD"; convert to UTC noon epoch
        // so Jackson maps it to Long instead of 400-ing on type mismatch.
        targetDate: goalForm.targetDate
          ? new Date(goalForm.targetDate + 'T12:00:00Z').getTime()
          : null,
        description: goalForm.description || null,
      });
      setShowAddGoal(false);
      setGoalForm({ name: '', targetAmount: '', targetDate: '', description: '' });
      loadGroupDetail(activeGroup);
      toast('Goal added', 'success');
    } catch { toast('Failed to add goal', 'error'); }
    setSavingGoal(false);
  };

  const handleContributeGoal = async () => {
    if (!activeGroup || showContributeGoal === null) return;
    setContributingGoal(true);
    try {
      await api.contributeSharedGoal(activeGroup.id, showContributeGoal, parseFloat(contributeAmount));
      setShowContributeGoal(null);
      setContributeAmount('');
      loadGroupDetail(activeGroup);
      toast('Contribution added', 'success');
    } catch { toast('Failed to contribute to goal', 'error'); }
    setContributingGoal(false);
  };

  const handleDeleteGoal = (goalId: number) => {
    if (!activeGroup) return;
    const group = activeGroup;
    const gid = group.id;
    setConfirmAction({
      message: 'Delete this goal?',
      action: async () => {
        try {
          await api.deleteSharedGoal(gid, goalId);
          loadGroupDetail(group);
        } catch {
          toast('Failed to delete goal', 'error');
        }
      }
    });
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      })
      .catch(() => { /* clipboard denied — silently fail */ });
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

            {/* Tab bar */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition ${
                    activeTab === 'expenses'
                      ? 'text-[#1B5E20] border-b-2 border-[#1B5E20]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Expenses
                </button>
                <button
                  onClick={() => setActiveTab('budgets')}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition ${
                    activeTab === 'budgets'
                      ? 'text-[#1B5E20] border-b-2 border-[#1B5E20]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Budgets
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition ${
                    activeTab === 'goals'
                      ? 'text-[#1B5E20] border-b-2 border-[#1B5E20]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Goals
                </button>
                <button
                  onClick={() => setActiveTab('estate')}
                  className={`flex-1 px-4 py-3 font-medium text-sm transition ${
                    activeTab === 'estate'
                      ? 'text-[#1B5E20] border-b-2 border-[#1B5E20]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Estate
                </button>
              </div>

              {/* Expenses Tab */}
              {activeTab === 'expenses' && (
                <div>
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
              )}

              {/* Budgets Tab */}
              {activeTab === 'budgets' && (
                <div>
                  <div className="px-5 py-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-[#1B5E20]">Budgets</h2>
                    <button
                      onClick={() => { setShowAddBudget(true); setBudgetForm({ category: '', monthlyLimit: '' }); }}
                      className="text-sm bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg hover:bg-[#2E7D32]"
                    >
                      + Add Budget
                    </button>
                  </div>
                  {budgets.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No budgets yet.</div>
                  ) : (
                    <div className="divide-y">
                      {budgets.map(budget => (
                        <div key={budget.id} className="px-5 py-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{budget.category}</p>
                            <p className="text-xs text-gray-500">Monthly limit</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-gray-900">{fmt(budget.monthlyLimit)}</p>
                            <button
                              onClick={() => handleDeleteBudget(budget.id)}
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
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <div>
                  <div className="px-5 py-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-[#1B5E20]">Goals</h2>
                    <button
                      onClick={() => { setShowAddGoal(true); setGoalForm({ name: '', targetAmount: '', targetDate: '', description: '' }); }}
                      className="text-sm bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg hover:bg-[#2E7D32]"
                    >
                      + Add Goal
                    </button>
                  </div>
                  {goals.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 text-sm">No goals yet.</div>
                  ) : (
                    <div className="space-y-3 p-5">
                      {goals.map(goal => {
                        const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                        return (
                          <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-900">{goal.name}</p>
                                {goal.targetDate && (
                                  <p className="text-xs text-gray-500">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="text-gray-300 hover:text-red-500 text-sm"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="mb-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#1B5E20] h-2 rounded-full transition-all"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {fmt(goal.currentAmount)} of {fmt(goal.targetAmount)}
                              </p>
                            </div>
                            <button
                              onClick={() => setShowContributeGoal(goal.id)}
                              className="text-sm bg-[#1B5E20] text-white px-3 py-1.5 rounded-lg hover:bg-[#2E7D32] w-full"
                            >
                              Contribute
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Family Estate Tab — Waqf & Wasiyyah visibility for family members */}
              {activeTab === 'estate' && (
                <div>
                  <div className="px-5 py-4 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="font-bold text-[#1B5E20]">Family Estate</h2>
                        <p className="text-xs text-gray-500 mt-1">Waqf endowments and Wasiyyah (wills) shared by family members</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-gray-500">Share mine</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={estateSharing}
                            onChange={async (e) => {
                              const enabled = e.target.checked;
                              setEstateSharing(enabled);
                              try {
                                await api.setEstateSharing(enabled);
                                toast(enabled ? 'Estate shared with family' : 'Estate set to private', 'success');
                                if (activeGroup) {
                                  const estate = await api.getFamilyEstate(activeGroup.id);
                                  setEstateData(estate);
                                }
                              } catch { toast('Failed to update sharing preference', 'error'); }
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#1B5E20] transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Group-level estate stats */}
                  {estateData && !estateData.error && (
                    <div className="px-5 py-4 border-b bg-gradient-to-r from-emerald-50 to-amber-50">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-[#1B5E20]">{estateData.membersSharing || 0}</p>
                          <p className="text-xs text-gray-500">Members Sharing</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-amber-600">{estateData.membersWithEstatePlan || 0}</p>
                          <p className="text-xs text-gray-500">Have Estate Plan</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-emerald-600">{fmt(estateData.groupTotalWaqf || 0)}</p>
                          <p className="text-xs text-gray-500">Total Waqf</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Per-member estate cards */}
                  <div className="p-5 space-y-4">
                    {(estateData?.members?.length ?? 0) > 0 ? estateData!.members!.map((member) => {
                      const waqfs = member.waqf || [];
                      const beneficiaries = member.wasiyyahBeneficiaries || [];
                      const obligations = member.obligations || [];
                      const isSharing = member.isSharing;
                      const isSelf = member.isSelf;

                      return (
                        <div key={member.userId} className="border rounded-xl overflow-hidden">
                          {/* Member header */}
                          <div className={`px-4 py-3 flex items-center justify-between ${isSelf ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isSelf ? 'bg-[#1B5E20] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {(member.displayName || 'M')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {member.displayName}{isSelf && <span className="text-xs text-[#1B5E20] ml-1">(you)</span>}
                                </p>
                                <p className="text-xs text-gray-400">{member.role}</p>
                              </div>
                            </div>
                            {!isSharing && (
                              <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">Private</span>
                            )}
                            {isSharing && member.hasEstatePlan && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Estate Plan Active</span>
                            )}
                          </div>

                          {/* Estate content */}
                          {isSharing ? (
                            <div className="px-4 py-3 space-y-3">
                              {/* Waqf Section */}
                              {waqfs.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">Waqf Endowments</p>
                                  {waqfs.map((w, i) => (
                                    <div key={(w.id as number | string | undefined) ?? i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                                      <div>
                                        <p className="text-sm text-gray-900">{w.organizationName as string}</p>
                                        <p className="text-xs text-gray-400">{w.purpose as string} &middot; {w.type as string}{w.recurring ? ` &middot; ${w.frequency as string}` : ''}</p>
                                      </div>
                                      <p className="text-sm font-semibold text-emerald-600">{fmt((w.amount as number) || 0)}</p>
                                    </div>
                                  ))}
                                  <p className="text-xs text-gray-400 mt-1">Total: {fmt(member.totalWaqf || 0)}</p>
                                </div>
                              )}

                              {/* Wasiyyah Section */}
                              {beneficiaries.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">Wasiyyah Beneficiaries</p>
                                  {beneficiaries.map((b, i) => (
                                    <div key={(b.id as number | string | undefined) ?? i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                                      <div>
                                        <p className="text-sm text-gray-900">{b.beneficiaryName as string}</p>
                                        <p className="text-xs text-gray-400">{b.relationship as string} &middot; {b.shareType as string}</p>
                                      </div>
                                      <p className="text-sm font-semibold text-amber-600">{(b.sharePercentage as number)?.toFixed(1)}%</p>
                                    </div>
                                  ))}
                                  <p className="text-xs text-gray-400 mt-1">Total allocated: {(member.totalShareAllocated || 0).toFixed(1)}%</p>
                                </div>
                              )}

                              {/* Obligations Section */}
                              {obligations.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">Outstanding Obligations</p>
                                  {obligations.map((o, i) => (
                                    <div key={(o.id as number | string | undefined) ?? i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                                      <div>
                                        <p className="text-sm text-gray-900">{o.description as string}</p>
                                        <p className="text-xs text-gray-400">{o.type as string}{o.recipient ? ` to ${o.recipient as string}` : ''}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className={`text-sm font-semibold ${o.status === 'fulfilled' ? 'text-green-600' : 'text-red-600'}`}>{fmt((o.amount as number) || 0)}</p>
                                        <p className="text-xs text-gray-400">{o.status as string}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {(member.pendingObligations || 0) > 0 && (
                                    <p className="text-xs text-red-500 mt-1">Pending: {fmt(member.pendingObligations || 0)}</p>
                                  )}
                                </div>
                              )}

                              {waqfs.length === 0 && beneficiaries.length === 0 && obligations.length === 0 && (
                                <p className="text-sm text-gray-400 py-2">No estate plan set up yet.</p>
                              )}
                            </div>
                          ) : (
                            <div className="px-4 py-3">
                              <p className="text-sm text-gray-400">{isSelf ? 'Toggle "Share mine" above to share your Waqf and Wasiyyah with family.' : 'This member has not shared their estate plan.'}</p>
                            </div>
                          )}
                        </div>
                      );
                    }) : (
                      <div className="text-center py-10 text-gray-400 text-sm">No family members in this group yet.</div>
                    )}
                  </div>

                  {/* Islamic guidance */}
                  <div className="mx-5 mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm font-medium text-amber-800 mb-1">Why share your estate plan?</p>
                    <p className="text-xs text-amber-700">
                      In Islam, ensuring your family knows your Wasiyyah (will) and Waqf (endowments)
                      is essential for proper execution after you pass. The Prophet (peace be upon him) said:
                      &ldquo;It is not permissible for any Muslim who has something to will to stay for two
                      nights without having his last will and testament written.&rdquo; (Bukhari &amp; Muslim)
                    </p>
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currency})</label>
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

        {/* Add Budget Modal */}
        {showAddBudget && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Budget</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    value={budgetForm.category}
                    onChange={e => setBudgetForm({ ...budgetForm, category: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="e.g. groceries, dining"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit ({currency})</label>
                  <input
                    type="number" step="0.01"
                    value={budgetForm.monthlyLimit}
                    onChange={e => setBudgetForm({ ...budgetForm, monthlyLimit: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBudget}
                  disabled={savingBudget || !budgetForm.category || !budgetForm.monthlyLimit}
                  className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
                >
                  {savingBudget ? 'Saving...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Add Goal</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                  <input
                    value={goalForm.name}
                    onChange={e => setGoalForm({ ...goalForm, name: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="e.g. Weekend trip"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount ({currency})</label>
                  <input
                    type="number" step="0.01"
                    value={goalForm.targetAmount}
                    onChange={e => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date (optional)</label>
                  <input
                    type="date"
                    value={goalForm.targetDate}
                    onChange={e => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea
                    value={goalForm.description}
                    onChange={e => setGoalForm({ ...goalForm, description: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-gray-900"
                    placeholder="What is this goal for?"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  disabled={savingGoal || !goalForm.name || !goalForm.targetAmount}
                  className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
                >
                  {savingGoal ? 'Saving...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contribute to Goal Modal */}
        {showContributeGoal !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[#1B5E20] mb-4">Contribute to Goal</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ({currency})</label>
                <input
                  type="number" step="0.01"
                  value={contributeAmount}
                  onChange={e => setContributeAmount(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-gray-900"
                  placeholder="0.00"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowContributeGoal(null); setContributeAmount(''); }}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleContributeGoal}
                  disabled={contributingGoal || !contributeAmount}
                  className="flex-1 bg-[#1B5E20] text-white rounded-lg py-2 hover:bg-[#2E7D32] disabled:opacity-50"
                >
                  {contributingGoal ? 'Contributing...' : 'Contribute'}
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
      <PageHeader
        title="Shared Finances"
        subtitle="Track shared expenses with family, roommates, or travel companions. Expenses are split equally and balances are calculated automatically."
        actions={
          <>
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
          </>
        }
      />

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
                    {group.memberCount || group.members?.length || 0} members · Code: <span className="font-mono">{group.inviteCode || '—'}</span>
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
    </div>
  );
}
