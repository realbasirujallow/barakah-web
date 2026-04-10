'use client';
import { useCallback, useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { useAuth } from '../../../context/AuthContext';
import { validateStripeUrl } from '../../../lib/validateUrl';
import { saveCurrencyPreference } from '../../../lib/useCurrency';
import { PRICING } from '../../../lib/pricing';

interface ProfileData {
  userId: number;
  fullName: string;
  email: string;
  preferredCurrency?: string;
  createdAt?: number;
  plan?: string;
  country?: string;
  state?: string;
}

interface CommunicationPreferences {
  notificationsEnabled: boolean;
  zakatReminders: boolean;
  emailMarketingOptIn: boolean;
  dailyBalanceEmailsOptIn: boolean;
  seasonalGreetingsOptIn: boolean;
  pushMarketingOptIn: boolean;
  timeZone: string;
  quietHoursStart: number;
  quietHoursEnd: number;
}

const PLAN_INFO: Record<string, { label: string; color: string; bg: string; desc: string }> = {
  free:   { label: 'Free',   color: 'text-gray-600',   bg: 'bg-gray-100',    desc: 'Basic features, up to 25 transactions/month.' },
  plus:   { label: 'Plus',   color: 'text-blue-700',   bg: 'bg-blue-100',    desc: 'Unlimited transactions, all Islamic finance tools.' },
  family: { label: 'Family', color: 'text-purple-700', bg: 'bg-purple-100',  desc: 'Everything in Plus, shared finances for up to 6 members.' },
};

export default function ProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = async (plan: 'plus' | 'family') => {
    setUpgradingPlan(plan);
    try {
      const result = await api.upgradeSubscription(plan, billingPeriod);
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
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Location form
  const [locationForm, setLocationForm] = useState({ country: '', state: '' });
  const [savingLocation, setSavingLocation] = useState(false);
  const [locationMsg, setLocationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Currency - FEATURE 4
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [savingCurrency, setSavingCurrency] = useState(false);
  const [supportedCurrencies, setSupportedCurrencies] = useState<Array<{ code: string; name: string; symbol: string }>>([]);
  const [preferences, setPreferences] = useState<CommunicationPreferences | null>(null);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Safe localStorage helpers
  const safeSetItem = (key: string, value: string): void => {
    try { localStorage.setItem(key, value); } catch { /* private browsing or quota exceeded */ }
  };

  // Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('barakah_dark_mode') === 'true';
    } catch {
      return false;
    }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    safeSetItem('barakah_dark_mode', String(next));
    document.documentElement.classList.toggle('dark', next);
  };



  // Delete account — two-step: retention modal → final confirmation (no password required)
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadProfile = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      api.getProfile(),
      api.getSupportedCurrencies().catch(() => []), // FEATURE 4: Load supported currencies
      api.getPreferences().catch(() => null),
    ])
      .then((results) => {
        const profileResult = results[0];
        const currenciesResult = results[1];
        const preferencesResult = results[2];

        if (profileResult.status === 'fulfilled') {
          const d = profileResult.value as ProfileData;
          setProfile(d);
          setNameForm({ fullName: d.fullName || '', email: d.email || '' });
          setLocationForm({ country: d.country || '', state: d.state || '' });
          setSelectedCurrency(d.preferredCurrency || 'USD');
          // Sync currency preference to localStorage so useCurrency() hook picks it up app-wide
          if (d.preferredCurrency) saveCurrencyPreference(d.preferredCurrency);
        } else {
          toast('Failed to load profile', 'error');
        }

        if (currenciesResult.status === 'fulfilled' && Array.isArray(currenciesResult.value)) {
          setSupportedCurrencies(currenciesResult.value);
        }

        if (preferencesResult.status === 'fulfilled' && preferencesResult.value) {
          setPreferences(preferencesResult.value as CommunicationPreferences);
        }
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadProfile();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadProfile]);

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

  const handleSaveLocation = async () => {
    setSavingLocation(true);
    setLocationMsg(null);
    try {
      const updated = await api.updateProfile({
        country: locationForm.country,
        state: locationForm.country === 'US' ? locationForm.state : '',
      });
      setProfile(prev => prev ? { ...prev, ...updated } : prev);
      setLocationMsg({ type: 'success', text: 'Location updated successfully.' });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update location.';
      setLocationMsg({ type: 'error', text: msg });
    }
    setSavingLocation(false);
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

  const handleSavePreferences = async () => {
    if (!preferences) return;
    setSavingPreferences(true);
    try {
      const updated = await api.updatePreferences(preferences as unknown as Record<string, unknown>);
      setPreferences(updated as CommunicationPreferences);
      toast('Communication preferences updated.', 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to update preferences.';
      toast(msg, 'error');
    } finally {
      setSavingPreferences(false);
    }
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

              {(planKey === 'free' || planKey === 'plus') && (
                <>
                  {/* Billing toggle */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-medium ${billingPeriod === 'monthly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Monthly</span>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod(b => b === 'monthly' ? 'yearly' : 'monthly')}
                      className={`relative w-11 h-6 rounded-full transition-colors ${billingPeriod === 'yearly' ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billingPeriod === 'yearly' ? 'translate-x-5' : ''}`} />
                    </button>
                    <span className={`text-xs font-medium ${billingPeriod === 'yearly' ? 'text-[#1B5E20]' : 'text-gray-400'}`}>Yearly</span>
                    {billingPeriod === 'yearly' && (
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Save up to 34%</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Plus Plan */}
                    {planKey === 'free' && (
                      <div className="border-2 border-[#1B5E20] rounded-xl p-5 relative">
                        <span className="absolute -top-3 left-4 bg-[#1B5E20] text-white text-xs font-bold px-2 py-0.5 rounded-full">Most Popular</span>
                        <h3 className="text-lg font-bold text-[#1B5E20]">Barakah Plus</h3>
                        <p className="text-2xl font-extrabold text-gray-900 mt-1">
                          {billingPeriod === 'yearly' ? PRICING.plus.yearly : PRICING.plus.monthly}
                          <span className="text-sm font-normal text-gray-500">{billingPeriod === 'yearly' ? '/year' : '/month'}</span>
                        </p>
                        {billingPeriod === 'yearly' && (
                          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Save 17%</span>
                        )}
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
                    )}

                    {/* Family Plan */}
                    <div className={`border rounded-xl p-5 ${planKey === 'plus' ? 'border-2 border-purple-300' : 'border-purple-200'}`}>
                      <h3 className="text-lg font-bold text-purple-700">Barakah Family</h3>
                      <p className="text-2xl font-extrabold text-gray-900 mt-1">
                        {billingPeriod === 'yearly' ? PRICING.family.yearly : PRICING.family.monthly}
                        <span className="text-sm font-normal text-gray-500">{billingPeriod === 'yearly' ? '/year' : '/month'}</span>
                      </p>
                      {billingPeriod === 'yearly' && (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Save 34%</span>
                      )}
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
                </>
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

      {/* Location */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-[#1B5E20] mb-4">Location</h2>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          Moved recently? Update your location to ensure accurate tax calculations for Zakat.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={locationForm.country}
              onChange={e => setLocationForm({ ...locationForm, country: e.target.value, state: e.target.value !== 'US' ? '' : locationForm.state })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
            >
              <option value="">Select country</option>
              {[
                {code:'AF',name:'Afghanistan'},{code:'AL',name:'Albania'},{code:'DZ',name:'Algeria'},{code:'AD',name:'Andorra'},{code:'AO',name:'Angola'},
                {code:'AG',name:'Antigua and Barbuda'},{code:'AR',name:'Argentina'},{code:'AM',name:'Armenia'},{code:'AU',name:'Australia'},{code:'AT',name:'Austria'},
                {code:'AZ',name:'Azerbaijan'},{code:'BS',name:'Bahamas'},{code:'BH',name:'Bahrain'},{code:'BD',name:'Bangladesh'},{code:'BB',name:'Barbados'},
                {code:'BY',name:'Belarus'},{code:'BE',name:'Belgium'},{code:'BZ',name:'Belize'},{code:'BJ',name:'Benin'},{code:'BT',name:'Bhutan'},
                {code:'BO',name:'Bolivia'},{code:'BA',name:'Bosnia and Herzegovina'},{code:'BW',name:'Botswana'},{code:'BR',name:'Brazil'},{code:'BN',name:'Brunei'},
                {code:'BG',name:'Bulgaria'},{code:'BF',name:'Burkina Faso'},{code:'BI',name:'Burundi'},{code:'CV',name:'Cabo Verde'},{code:'KH',name:'Cambodia'},
                {code:'CM',name:'Cameroon'},{code:'CA',name:'Canada'},{code:'CF',name:'Central African Republic'},{code:'TD',name:'Chad'},{code:'CL',name:'Chile'},
                {code:'CN',name:'China'},{code:'CO',name:'Colombia'},{code:'KM',name:'Comoros'},{code:'CG',name:'Congo'},{code:'CD',name:'Congo (DRC)'},
                {code:'CR',name:'Costa Rica'},{code:'CI',name:"Côte d'Ivoire"},{code:'HR',name:'Croatia'},{code:'CU',name:'Cuba'},{code:'CY',name:'Cyprus'},
                {code:'CZ',name:'Czechia'},{code:'DK',name:'Denmark'},{code:'DJ',name:'Djibouti'},{code:'DM',name:'Dominica'},{code:'DO',name:'Dominican Republic'},
                {code:'EC',name:'Ecuador'},{code:'EG',name:'Egypt'},{code:'SV',name:'El Salvador'},{code:'GQ',name:'Equatorial Guinea'},{code:'ER',name:'Eritrea'},
                {code:'EE',name:'Estonia'},{code:'SZ',name:'Eswatini'},{code:'ET',name:'Ethiopia'},{code:'FJ',name:'Fiji'},{code:'FI',name:'Finland'},
                {code:'FR',name:'France'},{code:'GA',name:'Gabon'},{code:'GM',name:'Gambia'},{code:'GE',name:'Georgia'},{code:'DE',name:'Germany'},
                {code:'GH',name:'Ghana'},{code:'GR',name:'Greece'},{code:'GD',name:'Grenada'},{code:'GT',name:'Guatemala'},{code:'GN',name:'Guinea'},
                {code:'GW',name:'Guinea-Bissau'},{code:'GY',name:'Guyana'},{code:'HT',name:'Haiti'},{code:'HN',name:'Honduras'},{code:'HU',name:'Hungary'},
                {code:'IS',name:'Iceland'},{code:'IN',name:'India'},{code:'ID',name:'Indonesia'},{code:'IR',name:'Iran'},{code:'IQ',name:'Iraq'},
                {code:'IE',name:'Ireland'},{code:'IL',name:'Israel'},{code:'IT',name:'Italy'},{code:'JM',name:'Jamaica'},{code:'JP',name:'Japan'},
                {code:'JO',name:'Jordan'},{code:'KZ',name:'Kazakhstan'},{code:'KE',name:'Kenya'},{code:'KI',name:'Kiribati'},{code:'KP',name:'North Korea'},
                {code:'KR',name:'South Korea'},{code:'KW',name:'Kuwait'},{code:'KG',name:'Kyrgyzstan'},{code:'LA',name:'Laos'},{code:'LV',name:'Latvia'},
                {code:'LB',name:'Lebanon'},{code:'LS',name:'Lesotho'},{code:'LR',name:'Liberia'},{code:'LY',name:'Libya'},{code:'LI',name:'Liechtenstein'},
                {code:'LT',name:'Lithuania'},{code:'LU',name:'Luxembourg'},{code:'MG',name:'Madagascar'},{code:'MW',name:'Malawi'},{code:'MY',name:'Malaysia'},
                {code:'MV',name:'Maldives'},{code:'ML',name:'Mali'},{code:'MT',name:'Malta'},{code:'MH',name:'Marshall Islands'},{code:'MR',name:'Mauritania'},
                {code:'MU',name:'Mauritius'},{code:'MX',name:'Mexico'},{code:'FM',name:'Micronesia'},{code:'MD',name:'Moldova'},{code:'MC',name:'Monaco'},
                {code:'MN',name:'Mongolia'},{code:'ME',name:'Montenegro'},{code:'MA',name:'Morocco'},{code:'MZ',name:'Mozambique'},{code:'MM',name:'Myanmar'},
                {code:'NA',name:'Namibia'},{code:'NR',name:'Nauru'},{code:'NP',name:'Nepal'},{code:'NL',name:'Netherlands'},{code:'NZ',name:'New Zealand'},
                {code:'NI',name:'Nicaragua'},{code:'NE',name:'Niger'},{code:'NG',name:'Nigeria'},{code:'MK',name:'North Macedonia'},{code:'NO',name:'Norway'},
                {code:'OM',name:'Oman'},{code:'PK',name:'Pakistan'},{code:'PW',name:'Palau'},{code:'PS',name:'Palestine'},{code:'PA',name:'Panama'},
                {code:'PG',name:'Papua New Guinea'},{code:'PY',name:'Paraguay'},{code:'PE',name:'Peru'},{code:'PH',name:'Philippines'},{code:'PL',name:'Poland'},
                {code:'PT',name:'Portugal'},{code:'QA',name:'Qatar'},{code:'RO',name:'Romania'},{code:'RU',name:'Russia'},{code:'RW',name:'Rwanda'},
                {code:'KN',name:'Saint Kitts and Nevis'},{code:'LC',name:'Saint Lucia'},{code:'VC',name:'Saint Vincent and the Grenadines'},
                {code:'WS',name:'Samoa'},{code:'SM',name:'San Marino'},{code:'ST',name:'São Tomé and Príncipe'},{code:'SA',name:'Saudi Arabia'},
                {code:'SN',name:'Senegal'},{code:'RS',name:'Serbia'},{code:'SC',name:'Seychelles'},{code:'SL',name:'Sierra Leone'},{code:'SG',name:'Singapore'},
                {code:'SK',name:'Slovakia'},{code:'SI',name:'Slovenia'},{code:'SB',name:'Solomon Islands'},{code:'SO',name:'Somalia'},{code:'ZA',name:'South Africa'},
                {code:'SS',name:'South Sudan'},{code:'ES',name:'Spain'},{code:'LK',name:'Sri Lanka'},{code:'SD',name:'Sudan'},{code:'SR',name:'Suriname'},
                {code:'SE',name:'Sweden'},{code:'CH',name:'Switzerland'},{code:'SY',name:'Syria'},{code:'TW',name:'Taiwan'},{code:'TJ',name:'Tajikistan'},
                {code:'TZ',name:'Tanzania'},{code:'TH',name:'Thailand'},{code:'TL',name:'Timor-Leste'},{code:'TG',name:'Togo'},{code:'TO',name:'Tonga'},
                {code:'TT',name:'Trinidad and Tobago'},{code:'TN',name:'Tunisia'},{code:'TR',name:'Turkey'},{code:'TM',name:'Turkmenistan'},{code:'TV',name:'Tuvalu'},
                {code:'UG',name:'Uganda'},{code:'UA',name:'Ukraine'},{code:'AE',name:'United Arab Emirates'},{code:'GB',name:'United Kingdom'},
                {code:'US',name:'United States'},{code:'UY',name:'Uruguay'},{code:'UZ',name:'Uzbekistan'},{code:'VU',name:'Vanuatu'},
                {code:'VA',name:'Vatican City'},{code:'VE',name:'Venezuela'},{code:'VN',name:'Vietnam'},{code:'YE',name:'Yemen'},
                {code:'ZM',name:'Zambia'},{code:'ZW',name:'Zimbabwe'},
              ].map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>

          {locationForm.country === 'US' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={locationForm.state}
                onChange={e => setLocationForm({ ...locationForm, state: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
              >
                <option value="">Select state</option>
                {[
                  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
                  'District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
                  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
                  'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
                  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
                  'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
                  'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
                ].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Used for state income tax calculations on retirement account Zakat.</p>
            </div>
          )}
        </div>

        {locationMsg && (
          <div className={`mt-3 text-sm px-3 py-2 rounded-lg ${
            locationMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {locationMsg.text}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSaveLocation}
            disabled={savingLocation || !locationForm.country}
            className="bg-[#1B5E20] text-white px-5 py-2 rounded-lg hover:bg-[#2E7D32] disabled:opacity-50 text-sm font-medium"
          >
            {savingLocation ? 'Saving...' : 'Update Location'}
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

      {preferences && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Communication Preferences</h2>
          <p className="text-sm text-gray-500 mb-4">
            Control onboarding emails, optional daily balance digests, Ramadan and Eid greetings, push nudges, and your quiet hours.
          </p>
          <div className="space-y-3">
            {[
              ['notificationsEnabled', 'Core notifications', 'Important account, billing, and in-app alerts.'],
              ['zakatReminders', 'Zakat reminders', 'Operational reminders tied to zakat and Hawl readiness.'],
              ['emailMarketingOptIn', 'Email journeys', 'Helpful onboarding, inactivity, and upgrade emails.'],
              ['dailyBalanceEmailsOptIn', 'Daily balance emails', 'Optional account activity digests after synced balances or unusual items are detected.'],
              ['seasonalGreetingsOptIn', 'Ramadan and Eid greetings', 'Seasonal messages and holiday check-ins.'],
              ['pushMarketingOptIn', 'Push nudges', 'Push reminders about balances, net worth, and setup progress.'],
            ].map(([key, title, subtitle]) => (
              <label key={key} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-700 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(preferences[key as keyof CommunicationPreferences])}
                  onChange={e => setPreferences(prev => prev ? {
                    ...prev,
                    [key]: e.target.checked,
                  } : prev)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1B5E20] focus:ring-[#1B5E20]"
                />
              </label>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <label className="text-sm text-gray-600">
              <span className="block mb-2 font-medium text-gray-800">Time Zone</span>
              <input
                type="text"
                value={preferences.timeZone}
                onChange={e => setPreferences(prev => prev ? { ...prev, timeZone: e.target.value } : prev)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
                placeholder="America/Indiana/Indianapolis"
              />
            </label>
            <label className="text-sm text-gray-600">
              <span className="block mb-2 font-medium text-gray-800">Quiet Hours Start</span>
              <select
                value={preferences.quietHoursStart}
                onChange={e => setPreferences(prev => prev ? { ...prev, quietHoursStart: Number(e.target.value) } : prev)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              <span className="block mb-2 font-medium text-gray-800">Quiet Hours End</span>
              <select
                value={preferences.quietHoursEnd}
                onChange={e => setPreferences(prev => prev ? { ...prev, quietHoursEnd: Number(e.target.value) } : prev)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-[#1B5E20] focus:ring-1 focus:ring-[#1B5E20]"
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSavePreferences}
              disabled={savingPreferences}
              className="rounded-xl bg-[#1B5E20] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2E7D32] disabled:opacity-60"
            >
              {savingPreferences ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}

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
