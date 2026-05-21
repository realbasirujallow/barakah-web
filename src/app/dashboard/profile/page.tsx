'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { useBodyScrollLock } from '../../../lib/useBodyScrollLock';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n, t as tStandalone } from '../../../lib/i18n';
import { useAuth } from '../../../context/AuthContext';
import { validateStripeUrl } from '../../../lib/validateUrl';
import { saveCurrencyPreference } from '../../../lib/useCurrency';
import { useLocalizedPrice } from '../../../lib/useLocalizedPrice';
import { useDarkMode, toggleDarkMode as toggleDarkModeShared } from '../../../lib/useDarkMode';
import { PRICING } from '../../../lib/pricing';
import HouseholdSection from '../../../components/HouseholdSection';

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
  // 2026-05-18 release-polish: mute the halal-screening status-change
  // alert (email + push that fires when a held stock flips halal/haram).
  // Default true so existing users retain current behavior.
  halalAlertOptIn: boolean;
  timeZone: string;
  quietHoursStart: number;
  quietHoursEnd: number;
}

const PLAN_INFO_KEYS: Record<string, { labelKey: string; color: string; bg: string; descKey: string }> = {
  free:   { labelKey: 'profPlanFree',   color: 'text-gray-600',   bg: 'bg-gray-100',    descKey: 'profPlanFreeDesc' },
  plus:   { labelKey: 'profPlanPlus',   color: 'text-blue-700',   bg: 'bg-blue-100',    descKey: 'profPlanPlusDesc' },
  family: { labelKey: 'profPlanFamily', color: 'text-purple-700', bg: 'bg-purple-100',  descKey: 'profPlanFamilyDesc' },
};

export default function ProfilePage() {
  const { logout, refreshPlan } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const { t, tFmt } = useI18n();

  const handleUpgrade = async (plan: 'plus' | 'family') => {
    setUpgradingPlan(plan);
    try {
      const result = await api.upgradeSubscription(plan, billingPeriod);
      if (result?.url) {
        if (validateStripeUrl(result.url)) {
          window.location.href = result.url; // Free → Stripe Checkout
        } else {
          toast(t('profInvalidStripeUrl'), 'error');
          setUpgradingPlan(null);
        }
      } else if (result?.success) {
        toast(t('profPlanUpdated'), 'success');
        await refreshPlan(); // Existing subscriber — plan switched
      } else {
        toast(t('profSomethingWrong'), 'error');
        setUpgradingPlan(null);
      }
    } catch {
      toast(t('profSomethingWrong'), 'error');
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
  const [downloadingData, setDownloadingData] = useState(false);
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

  const darkMode = useDarkMode();
  const toggleDarkMode = () => {
    toggleDarkModeShared();
  };

  // Delete account — two-step
  const [showRetentionModal, setShowRetentionModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmPhrase, setDeleteConfirmPhrase] = useState('');
  useBodyScrollLock(showRetentionModal || showDeleteConfirm);

  useEffect(() => {
    if (!showRetentionModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRetentionModal(false);
        setShowDeleteConfirm(false);
        setDeleteMsg(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showRetentionModal]);

  const retentionModalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(retentionModalRef, showRetentionModal);

  const loadProfile = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      api.getProfile(),
      api.getSupportedCurrencies().catch(() => []),
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
          if (d.preferredCurrency) saveCurrencyPreference(d.preferredCurrency);
        } else {
          toast(tStandalone('profLoadFailed'), 'error');
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
    setNameMsg(null);
    const trimmedEmail = nameForm.email.trim();
    if (trimmedEmail && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(trimmedEmail)) {
      setNameMsg({ type: 'error', text: t('profInvalidEmail') });
      return;
    }
    setSavingName(true);
    try {
      const updated = await api.updateProfile({
        fullName: nameForm.fullName,
        email: trimmedEmail,
      });
      if (updated && typeof updated === 'object') {
        setProfile(prev => prev ? { ...prev, ...(updated as Partial<ProfileData>) } : prev);
      } else {
        loadProfile();
      }
      setNameMsg({ type: 'success', text: t('profUpdated') });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('profUpdateFailed');
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
      if (updated && typeof updated === 'object') {
        setProfile(prev => prev ? { ...prev, ...(updated as Partial<ProfileData>) } : prev);
      } else {
        loadProfile();
      }
      setLocationMsg({ type: 'success', text: t('profLocationUpdated') });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('profLocationUpdateFailed');
      setLocationMsg({ type: 'error', text: msg });
    }
    setSavingLocation(false);
  };

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: t('profPwMismatchFull') });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ type: 'error', text: t('profPwTooShort') });
      return;
    }
    if (pwForm.currentPassword && pwForm.currentPassword === pwForm.newPassword) {
      setPwMsg({ type: 'error', text: t('profPwSameAsOld') });
      return;
    }
    const hasUpper = /[A-Z]/.test(pwForm.newPassword);
    const hasLower = /[a-z]/.test(pwForm.newPassword);
    const hasDigit = /\d/.test(pwForm.newPassword);
    if (!hasUpper || !hasLower || !hasDigit) {
      setPwMsg({ type: 'error', text: t('profPwComplexity') });
      return;
    }
    setSavingPw(true);
    try {
      await api.updateProfile({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPwMsg({ type: 'success', text: t('profPwChanged') });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('profPwChangeFailed');
      setPwMsg({ type: 'error', text: msg });
    }
    setSavingPw(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmPhrase !== 'DELETE') {
      setDeleteMsg({ type: 'error', text: t('profTypeDeleteError') });
      return;
    }
    setDeleting(true);
    setDeleteMsg(null);
    try {
      await api.deleteAccount({
        confirmPhrase: deleteConfirmPhrase,
      });
      setDeleteConfirmPhrase('');
      await logout('deleted');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('profDeleteFailed');
      setDeleteMsg({ type: 'error', text: msg });
    }
    setDeleting(false);
  };

  const formatDate = (ts?: number) => {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;
    setSavingPreferences(true);
    try {
      const updated = await api.updatePreferences(preferences as unknown as Record<string, unknown>);
      setPreferences(updated as CommunicationPreferences);
      toast(t('profPrefsUpdated'), 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t('profPrefsUpdateFailed');
      toast(msg, 'error');
    } finally {
      setSavingPreferences(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );

  const commPrefRows: Array<{ key: keyof CommunicationPreferences; titleKey: string; descKey: string }> = [
    { key: 'notificationsEnabled',     titleKey: 'profCommCoreTitle',         descKey: 'profCommCoreDesc' },
    { key: 'zakatReminders',           titleKey: 'profCommZakatTitle',        descKey: 'profCommZakatDesc' },
    { key: 'emailMarketingOptIn',      titleKey: 'profCommEmailMktTitle',     descKey: 'profCommEmailMktDesc' },
    { key: 'dailyBalanceEmailsOptIn',  titleKey: 'profCommDailyBalanceTitle', descKey: 'profCommDailyBalanceDesc' },
    { key: 'seasonalGreetingsOptIn',   titleKey: 'profCommSeasonalTitle',     descKey: 'profCommSeasonalDesc' },
    { key: 'pushMarketingOptIn',       titleKey: 'profCommPushTitle',         descKey: 'profCommPushDesc' },
    { key: 'halalAlertOptIn',          titleKey: 'profCommHalalAlertTitle',   descKey: 'profCommHalalAlertDesc' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title={t('profileTitle')}
        subtitle={t('profileSubtitle')}
      />

      {/* Account summary card */}
      <div className="bg-gradient-to-r from-[#1B5E20] to-emerald-500 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {profile?.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-xl font-bold">{profile?.fullName}</p>
            <p className="text-green-200 text-sm">{profile?.email}</p>
            <p className="text-green-300 text-xs mt-1">{tFmt('profMemberSinceFmt', [formatDate(profile?.createdAt)])}</p>
          </div>
        </div>
      </div>

      {/* Subscription Plan */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-primary mb-2">{t('profSubscriptionPlan')}</h2>
        {(() => {
          const planKey = profile?.plan ?? 'free';
          const info = PLAN_INFO_KEYS[planKey] ?? PLAN_INFO_KEYS.free;
          return (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${info.bg} ${info.color}`}>
                  {t(info.labelKey)}
                </span>
                <span className="text-sm text-gray-500">{t(info.descKey)}</span>
              </div>

              {(planKey === 'free' || planKey === 'plus') && (
                <>
                  {/* Billing toggle */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-medium ${billingPeriod === 'monthly' ? 'text-primary' : 'text-gray-400'}`}>{t('profBillingMonthly')}</span>
                    <button
                      type="button"
                      onClick={() => setBillingPeriod(b => b === 'monthly' ? 'yearly' : 'monthly')}
                      className={`relative w-11 h-6 rounded-full transition-colors ${billingPeriod === 'yearly' ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billingPeriod === 'yearly' ? 'translate-x-5' : ''}`} />
                    </button>
                    <span className={`text-xs font-medium ${billingPeriod === 'yearly' ? 'text-primary' : 'text-gray-400'}`}>{t('profBillingYearly')}</span>
                    {billingPeriod === 'yearly' && (
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{t('profSave17')}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Plus Plan */}
                    {planKey === 'free' && (
                      <div className="border-2 border-primary rounded-xl p-5 relative">
                        <span className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{t('profMostPopular')}</span>
                        <h3 className="text-lg font-bold text-primary">{t('profPlusName')}</h3>
                        <ProfilePlanPrice
                          usdPrice={billingPeriod === 'yearly' ? PRICING.plus.yearly : PRICING.plus.monthly}
                          period={billingPeriod === 'yearly' ? t('profPerYear') : t('profPerMonth')}
                        />
                        {billingPeriod === 'yearly' && (
                          <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{t('profSave17')}</span>
                        )}
                        <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                          <li>&#10003; {t('profFeatUnlimitedTx')}</li>
                          <li>&#10003; {t('profFeatFullZakat')}</li>
                          <li>&#10003; {t('profFeatHalalScreener')}</li>
                          <li>&#10003; {t('profFeatRibaDetector')}</li>
                          <li>&#10003; {t('profFeatWasiyyahWaqf')}</li>
                          <li>&#10003; {t('profFeatInvestmentsNetworth')}</li>
                          <li>&#10003; {t('profFeatDebtProjector')}</li>
                          <li>&#10003; {t('profFeatRamadanMode')}</li>
                          <li>&#10003; {t('profFeatAnalyticsYoY')}</li>
                          <li>&#10003; {t('profFeatRecurringTx')}</li>
                          <li>&#10003; {t('profFeatCsvPdfExport')}</li>
                        </ul>
                        <button
                          onClick={() => handleUpgrade('plus')}
                          disabled={upgradingPlan !== null}
                          className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                          type="button"
                        >
                          {upgradingPlan === 'plus' ? t('profRedirecting') : t('profUpgradeToPlus')}
                        </button>
                      </div>
                    )}

                    {/* Family Plan */}
                    <div className={`border rounded-xl p-5 ${planKey === 'plus' ? 'border-2 border-purple-300' : 'border-purple-200'}`}>
                      <h3 className="text-lg font-bold text-purple-700">{t('profFamilyName')}</h3>
                      <ProfilePlanPrice
                        usdPrice={billingPeriod === 'yearly' ? PRICING.family.yearly : PRICING.family.monthly}
                        period={billingPeriod === 'yearly' ? t('profPerYear') : t('profPerMonth')}
                      />
                      {billingPeriod === 'yearly' && (
                        <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{t('profSave17')}</span>
                      )}
                      <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                        <li>&#10003; {t('profFeatEverythingInPlus')}</li>
                        <li>&#10003; {t('profFeatUpTo6Members')}</li>
                        <li>&#10003; {t('profFeatSharedBudgets')}</li>
                        <li>&#10003; {t('profFeatFamilyEstate')}</li>
                        <li>&#10003; {t('profFeatFamilySummary')}</li>
                        <li>&#10003; {t('profFeatExpenseSplitting')}</li>
                        <li>&#10003; {t('profFeatPrioritySupport')}</li>
                      </ul>
                      <button
                        onClick={() => handleUpgrade('family')}
                        disabled={upgradingPlan !== null}
                        className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-60"
                        type="button"
                      >
                        {upgradingPlan === 'family' ? t('profRedirecting') : t('profUpgradeToFamily')}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {planKey === 'family' && (
                <p className="text-sm text-gray-500">{t('profFamilyTopTier')}</p>
              )}
            </>
          );
        })()}
      </div>

      {/* Personal Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-primary mb-4">{t('profPersonalInfo')}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-full-name" className="block text-sm font-medium text-gray-700 mb-1">{t('profFullName')}</label>
            <input
              id="profile-full-name"
              value={nameForm.fullName}
              onChange={e => setNameForm({ ...nameForm, fullName: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              placeholder={t('profFullNamePlaceholder')}
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">{t('profEmail')}</label>
            <input
              id="profile-email"
              type="email"
              value={nameForm.email}
              onChange={e => setNameForm({ ...nameForm, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              placeholder={t('profEmailPlaceholder')}
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
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
          >
            {savingName ? t('profSaving') : t('profSaveChanges')}
          </button>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-primary mb-4">{t('profLocation')}</h2>
        {!locationForm.country && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
            {t('profLocationHint')}
          </p>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-country" className="block text-sm font-medium text-gray-700 mb-1">{t('profCountry')}</label>
            <select
              id="profile-country"
              value={locationForm.country}
              onChange={e => setLocationForm({ ...locationForm, country: e.target.value, state: e.target.value !== 'US' ? '' : locationForm.state })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
            >
              <option value="">{t('profSelectCountry')}</option>
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
              <label htmlFor="profile-state" className="block text-sm font-medium text-gray-700 mb-1">{t('profState')}</label>
              <select
                id="profile-state"
                value={locationForm.state}
                onChange={e => setLocationForm({ ...locationForm, state: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-gray-900 text-sm"
              >
                <option value="">{t('profSelectState')}</option>
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
              <p className="text-xs text-gray-400 mt-1">{t('profStateTaxHelp')}</p>
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
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
          >
            {savingLocation ? t('profSaving') : t('profUpdateLocation')}
          </button>
        </div>
      </div>

      {/* Household */}
      <div className="mb-4">
        <HouseholdSection />
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-primary mb-4">{t('profChangePassword')}</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="profile-current-password" className="block text-sm font-medium text-gray-700 mb-1">{t('profCurrentPassword')}</label>
            <div className="relative">
              <input
                id="profile-current-password"
                type={showCurrentPw ? 'text' : 'password'}
                value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 pr-10 text-gray-900"
                placeholder={t('profCurrentPasswordPlaceholder')}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showCurrentPw ? t('profHide') : t('profShow')}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="profile-new-password" className="block text-sm font-medium text-gray-700 mb-1">{t('profNewPassword')}</label>
            <div className="relative">
              <input
                id="profile-new-password"
                type={showNewPw ? 'text' : 'password'}
                value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 pr-10 text-gray-900"
                placeholder={t('profNewPasswordPlaceholder')}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 text-sm"
              >
                {showNewPw ? t('profHide') : t('profShow')}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="profile-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">{t('profConfirmPassword')}</label>
            <input
              id="profile-confirm-password"
              type="password"
              value={pwForm.confirmPassword}
              onChange={e => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-gray-900"
              placeholder={t('profConfirmPasswordPlaceholder')}
              autoComplete="new-password"
            />
            {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{t('profPwMismatch')}</p>
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
            className="bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
          >
            {savingPw ? t('profUpdating') : t('profUpdatePassword')}
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-primary mb-4">{t('profLanguage')}</h2>
        <p className="text-sm text-gray-500 mb-3">
          {t('profLanguageDesc')}
        </p>
        <div className="flex items-center gap-3">
          <select
            aria-label={t('profAppLanguageAria')}
            defaultValue={(typeof window !== 'undefined' && localStorage.getItem('barakah_locale')) || 'en'}
            onChange={async (e) => {
              const next = e.target.value;
              try {
                const { setLocale } = await import('../../../lib/i18n');
                setLocale(next);
                localStorage.setItem('barakah_locale_manual_override', 'true');
                toast(tStandalone('profLanguageUpdated'), 'success');
              } catch {
                toast(tStandalone('profLanguageUpdateFailed'), 'error');
              }
            }}
            className="border rounded-lg px-3 py-2 text-gray-900 text-sm flex-1 max-w-xs"
          >
            <option value="en">{t('profLangEnglish')}</option>
            <option value="ar">{t('profLangArabic')}</option>
            <option value="ur">{t('profLangUrdu')}</option>
            <option value="fr">{t('profLangFrench')}</option>
          </select>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="text-lg font-bold text-primary mb-4">{t('profCurrency')}</h2>
        <p className="text-sm text-gray-500 mb-3">{t('profCurrencyDesc')}</p>
        <div className="flex items-center gap-3">
          <select
            aria-label={t('profPreferredCurrencyAria')}
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
                toast(t('profCurrencyUpdated'), 'success');
              } catch {
                toast(t('profCurrencyUpdateFailed'), 'error');
              }
              setSavingCurrency(false);
            }}
            disabled={savingCurrency || selectedCurrency === (profile?.preferredCurrency || 'USD')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm font-medium"
          >
            {savingCurrency ? t('profSaving') : t('profSave')}
          </button>
        </div>
      </div>

      {/* Account Info (read-only) */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-primary mb-4">{t('profAccountDetails')}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">{t('profUserId')}</span>
            <span className="font-mono text-gray-700">#{profile?.userId}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">{t('profMemberSince')}</span>
            <span className="text-gray-700">{formatDate(profile?.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('profAppearance')}</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 text-sm">{t('profDarkMode')}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('profDarkModeDesc')}</p>
          </div>
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {preferences && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-2">{t('profCommPrefs')}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {t('profCommPrefsDesc')}
          </p>
          <div className="space-y-3">
            {commPrefRows.map(row => (
              <label key={row.key} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <p className="font-medium text-gray-700 text-sm">{t(row.titleKey)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t(row.descKey)}</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(preferences[row.key])}
                  onChange={e => setPreferences(prev => prev ? {
                    ...prev,
                    [row.key]: e.target.checked,
                  } : prev)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <label className="text-sm text-gray-600">
              <span className="block mb-2 font-medium text-gray-800">{t('profTimeZone')}</span>
              <input
                type="text"
                value={preferences.timeZone}
                onChange={e => setPreferences(prev => prev ? { ...prev, timeZone: e.target.value } : prev)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="America/Indiana/Indianapolis"
              />
            </label>
            <label className="text-sm text-gray-600">
              <span className="block mb-2 font-medium text-gray-800">{t('profQuietStart')}</span>
              <select
                value={preferences.quietHoursStart}
                onChange={e => setPreferences(prev => prev ? { ...prev, quietHoursStart: Number(e.target.value) } : prev)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {Array.from({ length: 24 }, (_, hour) => (
                  <option key={hour} value={hour}>{hour.toString().padStart(2, '0')}:00</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-gray-600">
              <span className="block mb-2 font-medium text-gray-800">{t('profQuietEnd')}</span>
              <select
                value={preferences.quietHoursEnd}
                onChange={e => setPreferences(prev => prev ? { ...prev, quietHoursEnd: Number(e.target.value) } : prev)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
            >
              {savingPreferences ? t('profSaving') : t('profSavePrefs')}
            </button>
          </div>
        </div>
      )}

      {/* Data Privacy — GDPR Export */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-2">{t('profYourData')}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {t('profYourDataDesc')}
        </p>
        <button
          type="button"
          disabled={downloadingData}
          onClick={async () => {
            setDownloadingData(true);
            try {
              const data = await api.exportData();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'barakah-data-export.json'; a.click();
              URL.revokeObjectURL(url);
            } catch { toast(t('profExportFailed'), 'error'); } finally { setDownloadingData(false); }
          }}
          className="text-primary border border-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition disabled:opacity-50"
        >
          {downloadingData ? t('profDownloading') : t('profDownloadMyData')}
        </button>
      </div>

      {/* Danger Zone */}
      <details className="bg-white rounded-2xl shadow-sm mt-4 border border-gray-100 group">
        <summary className="p-4 cursor-pointer text-sm text-gray-400 hover:text-red-500 transition list-none flex items-center justify-between">
          <span>{t('profDangerZone')}</span>
          <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </summary>
        <div className="px-6 pb-6 pt-2 border-t border-red-100">
          <p className="text-sm text-gray-500 mb-4">
            {t('profDangerZoneDesc')}
          </p>
          <button
            type="button"
            onClick={() => setShowRetentionModal(true)}
            className="text-red-600 border border-red-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition"
          >
            {t('profDeleteAccount')}
          </button>
        </div>
      </details>

      {/* Retention Modal */}
      {showRetentionModal && (
        <div
          ref={retentionModalRef}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={showDeleteConfirm ? 'delete-account-final-title' : 'delete-account-title'}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            {!showDeleteConfirm ? (
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-4xl mb-3">&#128546;</p>
                  <h3 id="delete-account-title" className="text-xl font-bold text-gray-800">{t('profSadToSeeYouGo')}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {t('profDeleteIntro')}
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> {t('profDeleteBullet1')}</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> {t('profDeleteBullet2')}</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> {t('profDeleteBullet3')}</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> {t('profDeleteBullet4')}</li>
                  <li className="flex items-start gap-2"><span className="text-red-400">&#10005;</span> {t('profDeleteBullet5')}</li>
                </ul>
                <p className="text-xs text-gray-500 mb-6 text-center">
                  {t('profDeleteCannotUndo')}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setShowRetentionModal(false); setShowDeleteConfirm(false); setDeleteMsg(null); }}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold hover:bg-green-800 transition text-sm"
                  >
                    {t('profIllStay')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 text-red-600 border border-red-300 py-2.5 rounded-lg font-medium hover:bg-red-50 transition text-sm"
                  >
                    {t('profContinueDeleting')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 id="delete-account-final-title" className="text-lg font-bold text-red-600 mb-4">{t('profFinalConfirmation')}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {tFmt('profFinalConfirmBody', ['DELETE']).split('DELETE').map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="font-mono font-semibold text-red-600">DELETE</span>}
                    </span>
                  ))}
                </p>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={deleteConfirmPhrase}
                    onChange={(e) => setDeleteConfirmPhrase(e.target.value)}
                    placeholder={t('profTypeDeletePlaceholder')}
                    aria-label={t('profTypeDeletePlaceholder')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
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
                    disabled={deleting || deleteConfirmPhrase !== 'DELETE'}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 text-sm"
                  >
                    {deleting ? t('profDeleting') : t('profPermanentlyDelete')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRetentionModal(false);
                      setShowDeleteConfirm(false);
                      setDeleteMsg(null);
                      setDeleteConfirmPhrase('');
                    }}
                    className="flex-1 text-gray-600 border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50"
                  >
                    {t('profCancel')}
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

/**
 * Renders a plan price with locale-aware approximate conversion.
 */
function ProfilePlanPrice({ usdPrice, period }: { usdPrice: string; period: string }) {
  const { localized, approximate, loading } = useLocalizedPrice(usdPrice);
  const { t } = useI18n();
  return (
    <>
      <p className="text-2xl font-extrabold text-gray-900 mt-1">
        {loading ? usdPrice : localized}
        <span className="text-sm font-normal text-gray-500">{period}</span>
      </p>
      {approximate && !loading && (
        <p className="text-[11px] text-gray-500 mt-0.5">{t('profChargedLocal')}</p>
      )}
    </>
  );
}
