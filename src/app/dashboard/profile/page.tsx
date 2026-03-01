'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

interface ProfileData {
  userId: number;
  fullName: string;
  email: string;
  preferredCurrency?: string;
  createdAt?: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Name / email form
  const [nameForm, setNameForm] = useState({ fullName: '', email: '' });
  const [savingName, setSavingName] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const loadProfile = () => {
    setLoading(true);
    api.getProfile()
      .then((d: ProfileData) => {
        setProfile(d);
        setNameForm({ fullName: d.fullName || '', email: d.email || '' });
      })
      .catch(() => {})
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
            onClick={handleChangePassword}
            disabled={savingPw || !pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword}
            className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 text-sm font-medium"
          >
            {savingPw ? 'Updating...' : 'Update Password'}
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
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Member Since</span>
            <span className="text-gray-700">{formatDate(profile?.createdAt)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Currency</span>
            <span className="text-gray-700">{profile?.preferredCurrency || 'USD'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
