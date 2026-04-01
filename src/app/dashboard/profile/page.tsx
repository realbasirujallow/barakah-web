'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { useAuth } from '../../../context/AuthContext';
import { saveCurrencyPreference } from '../../../lib/useCurrency';

interface ProfileData {
  userId: number;
  fullName: string;
  email: string;
  preferredCurrency?: string;
  createdAt?: number;
  plan?: string;
}

const PLAN_INFO: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  free:   { label: 'Free',   color: 'text-gray-600',   bg: 'bg-gray-100',    desc: 'Basic features, up to 25 transactions/month.' },
  plus:   { label: 'Plus',   color: 'text-blue-700',   bg: 'bg-blue-100',    desc: 'Unlimited transactions, all Islamic finance tools.' },
  family: { label: 'Family', color: 'text-purple-700', bg: 'bg-purple-100',  desc: 'Everything in Plus, shared finances for up to 6 members.' },
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleUpgrade = async (plan: 'plus' | 'family') => {
    setUpgradingPlan(plan);
    try {
      const result = await api.upgradeSubscription(plan);
      if (result?.url) {
        if (validateStripeUrl(result.url)) {
          window.location.href = result.url; // Free → Stripe Checkout
        } else {
          toast('Invalid Stripe URL. Please contact support.', 'error');
          setUpgradingPlan(null);
        }
      } else if (result?.success) {
        toast('Plan updated successfully!', 'success');
        window.location.reload(); // Existing subscriber — plan switched
      } else {
        toast('Something went wrong. Please try again.', 'error');
        setUpgradingPlan(null);
      }
    } catch {
      toast('Something went wrong. Please try again.', 'error');
      setUpgradingPlan(null);
    }
  };

  // Name / email form
  const [nameForm, setNameForm] = useState({ fullName: '', email: '' });
  const [savingName, setSavingName] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const { toast } = useToast();

  // Currency - FEATURE 4
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState<Array<{ code: string; name: string; symbol: string }>>([]);

  // Dark mode
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('barakah_dark_mode') === 'true';
    setDarkMode(stored);
    document.documentElement.classList.toggle('dark', stored);
  }, []);
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('barakah_dark_mode', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  const validateStripeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'https:') return false;
      const hostname = urlObj.hostname;
      return hostname === 'stripe.com' || hostname === 'checkout.stripe.com' || hostname.endsWith('.stripe.com');
    } catch {
      return false;
    }
  };

  // Delete account — two-step: retention modal → final confirmation (no password required)
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProfile = () => {
    setLoading(true);
    Promise.allSettled([
      api.getProfile(),
      api.getSupportedCurrencies().catch(() => []), // FEATURE 4: Load supported currencies
    ])
      .then((results) => {
        const profileResult = results[0];
        const currenciesResult = results[1];

        if (profileResult.status === 'fulfilled') {
          const d = profileResult.value as ProfileData;
          setProfile(d);
          setNameForm({ fullName: d.fullName || '', email: d.email || '' });
          setSelectedCurrency(d.preferredCurrency || 'USD');
          // Sync currency preference to localStorage so useCurrency() hook picks it up app-wide
          if (d.preferredCurrency) saveCurrencyPreference(d.preferredCurrency);
        } else {
          toast('Failed to load profile', 'error');
        }

        if (currenciesResult.status === 'fulfilled' && Array.isArray(currenciesResult.value)) {
          setSupportedCurrencies(currenciesResult.value);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProfile(); }, []);

  const handleSaveName = async () => {
    setSavingName(true);
    setNameMsg(null);
    try {
      const updated = await api.updateProfile({
        fullName: nameForm.fullName,
        email: nameForm.email,
      });
      setProfile(prev => prev ? { ...prev, ...updated } : prev);
      setNameMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update profile.';
      setNameMsg({ type: 'error', text: msg });
    }
    setSavingName(false);
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    setSavingPw(true);
    try {
      await api.updateProfile({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMsg({ type: 'success', text: 'Password changed successfully.' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to change password.';
      setPwMsg({ type: 'error', text: msg });
    }
    setSavingPw(false);
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteMsg(null);
    try {
      await api.deleteAccount();
      logout('deleted');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to delete account.';
      setDeleteMsg({ type: 'error', text: msg });
    }
    setDeleting(false);
  };

  const formatDate = (ts?: number) => {
    if (!ts) return '—';
    return new Date(ts * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1B5E20] mb-6">Profile & Settings</h1>

      {/* Account summary card */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {profile?.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-xl font-bold">{profile?.fullName}</p>
            <p className="text-green-200 text-sm">{profile?.email}</p>
            <p className="text-green-300 text-xs mt-1">Member since {formatDate(profile?.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Subscription Plan */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-2">Subscription Plan</h2>
        {(() => {
          const planKey = profile?.plan ?? 'free';
          const info = PLAN_INFO[planKey] ?? PLAN_INFO.free;
          return (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${info.bg} ${info.color}`}>
                  {info.label}
                </span>
                <span className="text-sm text-gray-500">{info.desc}</span>
              </div>

              {planKey === 'free' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plus Plan */}
                  <div className="border-2 border-[#1B5E20] rounded-xl p-5 relative">
                    <span className="absolute -top-3 left-4 bg-[#1B5E20] text-white text-xs font-bold px-2 py-0.5 rounded-full">Most Popular</span>
                    <h3 className="text-lg font-bold text-[#1B5E20]">Barakah Plus</h3>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                      <li>&#10003; Unlimited transactions</li>
                      <li>&#10003; Full Zakat calculator</li>
                      <li>&#10003; Halal stock screener (30,000+)</li>
                      <li>&#10003; Riba &amp; subscription detector</li>
                      <li>&#10003; Wasiyyah &amp; Waqf planning</li>
                      <li>&#10003; Investments &amp; net worth</li>
                      <li>&#10003; Debt Payoff Projector</li>
                      <li>&#10003; Ramadan Mode</li>
                      <li>&#10003; Analytics &amp; Year-over-Year</li>
                      <li>&#10003; Recurring transactions</li>
                      <li>&#10003; CSV &amp; PDF export</li>
                    </ul>
                    <button
                      onClick={() => handleUpgrade('plus')}
                      disabled={upgradingPlan !== null}
                      className="mt-4 w-full bg-[#1B5E20] text-white py-2 rounded-lg font-semibold hover:bg-[#2E7D32] transition disabled:opacity-60"
                      type="button"
                    >
                      {upgradingPlan === 'plus' ? 'Redirecting...' : 'Upgrade to Plus'}
                    </button>
                  </div>

                  {/* Family Plan */}
                  <div className="border border-purple-200 rounded-xl p-5">
                    <h3 className="text-lg font-bold text-purple-700">Barakah Family</h3>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">$14.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                    <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                      <li>&#10003; Everything in Plus</li>
                      <li>&#10003; Up to 6 family members</li>
                      <li>&#10003; Shared budgets &amp; goals</li>
                      <li>&#10003; Family Estate Visibility</li>
                      <li>&#10003; Family financial summary</li>
                      <li>&#10003; Shared expense splitting</li>
                      <li>&#10003; Priority support</li>
                    </ul>
                    <button
                      onClick={() => handleUpgrade('family')}
                      disabled={upgradingPlan !== null}
                      className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                      type="button"
                    >
                      {upgradingPlan === 'family' ? 'Redirecting...' : 'Upgrade to Family'}
                    </button>
                  </div>
                </div>
              )}

              {planKey === 'plus' && (
                <div className="border border-purple-200 rounded-xl p-5 max-w-sm">
                  <h3 className="text-lg font-bold text-purple-700">Barakah Family</h3>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">$14.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                  <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                    <li>&#10003; Everything in Plus</li>
                    <li>&#10003; Up to 6 family members</li>
                    <li>&#10003; Shared budgets &amp; goals</li>
                    <li>&#10003; Family Estate Visibility</li>
                    <li>&#10003; Family financial summary</li>
                    <li>&#10003; Shared expense splitting</li>
                    <li>&#10003; Priority support</li>
                  </ul>
                  <button
                    onClick={() => handleUpgrade('family')}
                    disabled={upgradingPlan !== null}
                    className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                    type="button"
                  >
                    {upgradingPlan === 'family' ? 'Redirecting...' : 'Upgrade to Family'}
                  </button>
                </div>
              )}

              {planKey === 'family' && (
                <p className="text-sm text-gray-500">You&apos;re on the top-tier plan. Thank you for supporting Barakah!</p>
              )}
            </>
          );
        })()}
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              value={nameForm.fullName}
              onChange={e => setNameForm({ ...nameForm, fullName: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={nameForm.email}
              onChange={e => setNameForm({ ...nameForm, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {nameMsg && (
          <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${
            nameMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {nameMsg.text}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSaveName}
            disabled={savingName || !nameForm.fullName || !nameForm.email}
            className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 text-sm font-medium"
          >
            {savingName ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 pr-10 text-gray-900"
                placeholder="Your current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showCurrentPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showNewPw ? 'text' : 'password'}
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 pr-10 text-gray-900"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showNewPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
            )}
          </div>
        </div>

        {pwMsg && (
          <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${
            pwMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {pwMsg.text}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleChangePassword}
            disabled={savingPw || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
            className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 text-sm font-medium"
          >
            {savingPw ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>

      {/* Currency Preference - FEATURE 4 */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-4">Currency</h2>
        <p className="text-sm text-gray-500 mb-3">Choose your preferred currency for displaying amounts across Barakah.</p>
        <div className="flex items-center gap-3">
          <select
            value={selectedCurrency}
            onChange={e => setSelectedCurrency(e.target.value)}
            className="border rounded-lg px-3 py-2 text-gray-900 text-sm flex-1 max-w-xs"
          >
            {supportedCurrencies.length > 0 ? (
              supportedCurrencies.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) — {c.name}
                </option>
              ))
            ) : (
              [
                'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY', 'CNY', 'INR', 'PKR',
                'BDT', 'IDR', 'MYR', 'SGD', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR',
                'EGP', 'TRY', 'NGN', 'KES', 'ZAR', 'MAD', 'BRL', 'MXN', 'KRW', 'THB',
                'PHP', 'VND', 'HKD', 'TWD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF',
              ].map(c => (
                <option key={c} value={c}>{c}</option>
              ))
            )}
          </select>
          <button
            onClick={async () => {
              setSavingCurrency(true);
              try {
                await api.updateProfile({ preferredCurrency: selectedCurrency });
                saveCurrencyPreference(selectedCurrency);
                setProfile(prev => prev ? { ...prev, preferredCurrency: selectedCurrency } : prev);
                toast('Currency updated!', 'success');
              } catch {
                toast('Failed to update currency.', 'error');
              }
              setSavingCurrency(false);
            }}
            disabled={savingCurrency || selectedCurrency === (profile?.preferredCurrency || 'USD')}
            className="bg-[#1B5E20] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 text-sm font-medium"
          >
            {savingCurrency ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Account Info (read-only) */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-4">Account Details</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">User ID</span>
            <span className="font-mono text-gray-700">#{profile?.userId}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Member Since</span>
            <span className="text-gray-700">{formatDate(profile?.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 text-sm">Dark Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">Switch to a dark theme for low-light environments</p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#1B5E20]' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Data Privacy — GDPR Export */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Your Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          Download a complete copy of all your Barakah data (transactions, budgets, savings goals, zakat, sadaqah and more) as a JSON file.
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              const data = await api.exportData();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'barakah-data-export.json'; a.click();
              URL.revokeObjectURL(url);
            } catch { toast('Failed to export data. Please try again.', 'error'); }
          }}
          className="text-[#1B5E20] border border-[#1B5E20] px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition"
        >
          📥 Download My Data
        </button>
      </div>

      {/* Danger Zone — Delete Account */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 border border-red-100">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>

        <button
          type="button"
          onClick={() => setShowRetentionModal(true)}
          className="text-red-600 border border-red-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          Delete My Account
        </button>
      </div>

      {/* Retention Modal — asks the user to reconsider before showing password form */}
      {showRetentionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            {!showDeleteConfirm ? (
              /* Step 1: Retention — give them a reason to stay */
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-4xl mb-3">&#128546;</p>
                  <h3 className="text-xl font-bold text-gray-800">We&apos;re sad to see you go</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Deleting your account will permanently remove all your data, including:
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> Your zakat calculations and payment history</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> Debt tracking and payment progress</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> Budgets, savings goals, and financial data</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> Sadaqah records and waqf contributions</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> Your Wasiyyah (Islamic will)</li>
                </ul>
                <p className="text-xs text-gray-500 mb-6 text-center">
                  This cannot be undone. If you&apos;re having issues, we&apos;d love to help — reach out to us before leaving.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowRetentionModal(false); setShowDeleteConfirm(false); setDeleteMsg(null); }}
                    className="flex-1 bg-[#1B5E20] text-white py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm"
                  >
                    I&apos;ll Stay
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 text-red-600 border border-red-300 py-2.5 rounded-lg font-medium hover:bg-red-50 transition text-sm"
                  >
                    Continue Deleting
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Final confirmation (no password required) */
              <div className="p-6">
                <h3 className="text-lg font-bold text-red-600 mb-4">Final Confirmation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you absolutely sure? This will permanently delete your account and all data. This action cannot be undone.
                </p>
                {deleteMsg && (
                  <div className={`text-sm px-3 py-2 rounded-lg mb-3 ${
                    deleteMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {deleteMsg.text}
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 text-sm"
                  >
                    {deleting ? 'Deleting...' : 'Permanently Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowRetentionModal(false); setShowDeleteConfirm(false); setDeleteMsg(null); }}
                    className="flex-1 text-gray-600 border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
