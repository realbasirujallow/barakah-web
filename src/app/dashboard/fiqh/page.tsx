'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';

interface FiqhConfig {
  madhab?: string;
  jewelryZakatable?: boolean;
  fitrType?: string;
  debtMethod?: string;
  retirementMethod?: string;
  hawlResetOnNisabDrop?: boolean;
  wasiyyahExceedThirdWithConsent?: boolean;
  raddIncludesSpouse?: boolean;
  [key: string]: unknown;
}

interface FiqhSchool {
  value: string;
  displayName: string;
  founder?: string;
  summary?: string;
  [key: string]: unknown;
}

export default function FiqhSettingsPage() {
  const { toast } = useToast();
  const { fmt } = useCurrency();
  const { t, tFmt } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<FiqhConfig>({});
  const [schools, setSchools] = useState<FiqhSchool[]>([]);
  const [activeTab, setActiveTab] = useState<'madhab' | 'rules'>('madhab');

  // Form state
  const [selectedMadhab, setSelectedMadhab] = useState('');
  const [nisabMethodology, setNisabMethodology] = useState<string>('');
  const [nisabThresholdUsd, setNisabThresholdUsd] = useState<number | null>(null);
  const [savingNisab, setSavingNisab] = useState(false);
  const [rules, setRules] = useState({
    jewelryZakatable: false,
    fitrType: '',
    debtMethod: '',
    retirementMethod: '',
    hawlResetOnNisabDrop: false,
    wasiyyahExceedThirdWithConsent: false,
    raddIncludesSpouse: false,
  });

  // Load config and schools on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [configData, schoolsData, nisabData] = await Promise.all([
          api.getFiqhConfig().catch(() => null),
          api.getFiqhSchools().catch(() => null),
          api.getNisabMethodology().catch(() => null),
        ]);
        if (configData) {
          setConfig(configData);
          setSelectedMadhab(configData.madhab || '');
          setRules({
            jewelryZakatable: configData.jewelryZakatable ?? false,
            fitrType: configData.fitrType || '',
            debtMethod: configData.debtMethod || '',
            retirementMethod: configData.retirementMethod || '',
            hawlResetOnNisabDrop: configData.hawlResetOnNisabDrop ?? false,
            wasiyyahExceedThirdWithConsent: configData.wasiyyahExceedThirdWithConsent ?? false,
            raddIncludesSpouse: configData.raddIncludesSpouse ?? false,
          });
        }
        if (schoolsData && Array.isArray(schoolsData)) {
          setSchools(schoolsData);
        }
        if (nisabData && typeof nisabData === 'object') {
          const data = nisabData as { methodology?: string; nisabThreshold?: number };
          setNisabMethodology(data.methodology || 'AMJA_GOLD');
          if (typeof data.nisabThreshold === 'number') setNisabThresholdUsd(data.nisabThreshold);
        }
      } catch (err) {
        logError(err, { context: 'Failed to load fiqh config' });
        toast(t('fiqhLoadError'), 'error');
      }
      setLoading(false);
    };

    loadData();
    // `t` is a fresh identity each render; including it here would refire the
    // mount fetch on every render → infinite refetch loop. Keep only `toast`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const handleMadhabChange = async (madhab: string) => {
    setSelectedMadhab(madhab);
    setSaving(true);
    try {
      const result = await api.setMadhab(madhab) as {
        nisabAutoSwitched?: boolean;
        nisabMethodology?: string;
        nisabThreshold?: number;
      } | null;
      if (result) {
        // Refetch the full config so Detailed Rules tab reflects the new madhab defaults.
        // The backend's applySchoolDefaults() sets rules like jewelryZakatable, fitrType, etc.
        // based on the selected madhab — we need to reload those into local state.
        const updatedConfig = await api.getFiqhConfig();
        if (updatedConfig) {
          setConfig(updatedConfig);
          setRules({
            jewelryZakatable: updatedConfig.jewelryZakatable ?? false,
            fitrType: updatedConfig.fitrType || '',
            debtMethod: updatedConfig.debtMethod || '',
            retirementMethod: updatedConfig.retirementMethod || '',
            hawlResetOnNisabDrop: updatedConfig.hawlResetOnNisabDrop ?? false,
            wasiyyahExceedThirdWithConsent: updatedConfig.wasiyyahExceedThirdWithConsent ?? false,
            raddIncludesSpouse: updatedConfig.raddIncludesSpouse ?? false,
          });
        }

        // Feature 2 UX (2026-04-18): the backend auto-switches
        // User.nisabMethodology when the user changes madhab into or out
        // of HANAFI. If that happened, update local nisab state so the
        // "Nisab Methodology" card in the Madhab tab reflects the new
        // value without a page refresh, and surface a distinct toast so
        // the change isn't silent.
        if (result.nisabAutoSwitched && result.nisabMethodology) {
          setNisabMethodology(result.nisabMethodology);
          if (typeof result.nisabThreshold === 'number') {
            setNisabThresholdUsd(result.nisabThreshold);
          }
          const nisabPretty = naturalNisabLabel(result.nisabMethodology);
          toast(tFmt('fiqhMadhabAutoNisabFmt', [nisabPretty]), 'success');
        } else {
          toast(t('fiqhMadhabUpdatedToast'), 'success');
        }

        // HIGH BUG FIX (H-3): broadcast so other open tabs/pages (zakat,
        // retirement-zakat, faraid) can refetch the user's fiqh config
        // without a manual page refresh.
        if (typeof window !== 'undefined') {
          try { window.dispatchEvent(new Event('barakah:fiqh-change')); } catch { /* no-op */ }
        }
      }
    } catch (err) {
      logError(err, { context: 'Failed to update madhab' });
      toast(t('fiqhMadhabUpdateError'), 'error');
      setSelectedMadhab(config.madhab || '');
    }
    setSaving(false);
  };

  /**
   * Returns the nisab methodology that pairs with each school's
   * classical/published position. Used to suggest (never auto-apply)
   * a matching nisab when the user changes their madhab. Mirrors
   * FiqhConfig.naturalNisabMethodologyFor() on the backend.
   */
  const naturalNisabFor = (madhab: string): string => {
    if (madhab === 'HANAFI') return 'CLASSICAL_SILVER';
    return 'AMJA_GOLD';
  };

  const naturalNisabLabel = (key: string): string => {
    if (key === 'CLASSICAL_SILVER') return t('fiqhNisabSilver');
    if (key === 'LOWER_OF_TWO') return t('fiqhNisabLower');
    return t('fiqhNisabGold');
  };

  const handleNisabChange = async (methodology: string) => {
    setSavingNisab(true);
    const previous = nisabMethodology;
    setNisabMethodology(methodology);
    try {
      const result = await api.setNisabMethodology(methodology) as { nisabThreshold?: number } | null;
      if (result && typeof result.nisabThreshold === 'number') {
        setNisabThresholdUsd(result.nisabThreshold);
      }
      toast(t('fiqhNisabUpdatedToast'), 'success');
    } catch (err) {
      logError(err, { context: 'Failed to update nisab methodology' });
      setNisabMethodology(previous);
      toast(t('fiqhNisabUpdateError'), 'error');
    }
    setSavingNisab(false);
  };

  const handleRuleChange = (key: keyof typeof rules, value: boolean | string) => {
    setRules(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveRules = async () => {
    setSaving(true);
    try {
      const result = await api.updateFiqhRules(rules);
      if (result) {
        setConfig(prev => ({ ...prev, ...rules }));
        toast(t('fiqhRulesUpdatedToast'), 'success');
      }
    } catch (err) {
      logError(err, { context: 'Failed to update fiqh rules' });
      toast(t('fiqhRulesUpdateError'), 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">{t('fiqhLoading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <PageHeader
          title={t('fiqhTitle')}
          subtitle={t('fiqhSubtitle')}
          className="mb-8"
        />

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('madhab')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'madhab'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700 hover:bg-green-50'
            }`}
          >
            {t('fiqhTabMadhab')}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'rules'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700 hover:bg-green-50'
            }`}
          >
            {t('fiqhTabRules')}
          </button>
        </div>

        {/* Madhab Tab */}
        {activeTab === 'madhab' && (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('fiqhSchoolHeading')}</h2>

            {schools.length > 0 ? (
              <div className="space-y-4">
                {schools.map((school) => (
                  <label
                    key={school.value}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedMadhab === school.value
                        ? 'border-primary bg-green-50 ring-1 ring-primary'
                        : 'border-gray-200 hover:border-green-700 hover:bg-green-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="madhab"
                      value={school.value}
                      checked={selectedMadhab === school.value}
                      onChange={() => handleMadhabChange(school.value)}
                      disabled={saving}
                      className="mt-1 w-5 h-5 text-primary accent-[#1B5E20]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{school.displayName}</p>
                      {school.founder && (
                        <p className="text-sm text-green-800 font-medium">{school.founder}</p>
                      )}
                      {school.summary && (
                        <p className="text-sm text-gray-600 mt-1">{school.summary}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">{t('fiqhNoSchools')}</p>
            )}

            {/* Nisab suggestion banner — appears when the user's current
                nisab methodology doesn't match the natural default for the
                school they just selected. We never auto-apply, so the user
                keeps an explicit choice they made earlier. */}
            {selectedMadhab && nisabMethodology &&
              naturalNisabFor(selectedMadhab) !== nisabMethodology && (
              <div className="mt-6 p-4 border border-amber-300 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-900 font-medium">
                  {tFmt('fiqhNisabMismatchFmt', [
                    naturalNisabLabel(nisabMethodology),
                    selectedMadhab === 'GENERAL' ? 'AMJA' : selectedMadhab.charAt(0) + selectedMadhab.slice(1).toLowerCase(),
                    naturalNisabLabel(naturalNisabFor(selectedMadhab)),
                  ])}
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  {selectedMadhab === 'HANAFI' ? t('fiqhNisabHanafiNote') : t('fiqhNisabAmjaNote')}
                </p>
                <button
                  type="button"
                  onClick={() => handleNisabChange(naturalNisabFor(selectedMadhab))}
                  disabled={savingNisab}
                  className="mt-3 px-4 py-2 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50"
                >
                  {tFmt('fiqhSwitchToFmt', [naturalNisabLabel(naturalNisabFor(selectedMadhab))])}
                </button>
              </div>
            )}

            {/* Nisab Methodology — has a Hanafi ↔ silver auto-link with madhab */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-primary mb-2">{t('fiqhNisabHeading')}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {t('fiqhNisabIntro')}
              </p>
              {nisabThresholdUsd != null && (
                <p className="text-sm text-emerald-700 mb-4">
                  {tFmt('fiqhCurrentNisabFmt', [fmt(nisabThresholdUsd)])}
                </p>
              )}
              <div className="space-y-3">
                {[
                  // 2026-05-10 founder ask: surface scholar attribution on the
                  // nisab toggle so the multi-madhab option is a trust artifact,
                  // not bare config. Citations mirror NisabMethodology.getCitations()
                  // on the backend; sources from AMJA, AAOIFI, Al-Kasani, Ibn
                  // Abidin, al-Qaradawi (Fiqh al-Zakat), Bukhari, Abu Dawud.
                  {
                    value: 'AMJA_GOLD',
                    title: t('fiqhNisabGold'),
                    desc: t('fiqhNisabGoldDesc'),
                    citations: {
                      primary: 'Sahih Abu Dawud 1573 — the Prophet ﷺ prescribed zakat on gold at 20 mithqals (~85g)',
                      classical: 'Ibn Qudamah, Al-Mughni — gold nisab as 20 mithqals',
                      contemporary: 'AMJA (Assembly of Muslim Jurists of America) — practical default for North America',
                      school: 'Cross-madhab; contemporary Western baseline',
                      note: 'Higher threshold means fewer people pay zakat than under the silver standard.',
                    },
                  },
                  {
                    value: 'CLASSICAL_SILVER',
                    title: t('fiqhNisabSilver'),
                    desc: t('fiqhNisabSilverDesc'),
                    citations: {
                      primary: 'Sahih al-Bukhari 1454 — "No zakat is due on less than five uqiyah (200 dirhams ~595g) of silver"',
                      classical: 'Al-Kasani, Bada’i al-Sana’i — Hanafi codification of silver nisab',
                      secondaryClassical: 'Ibn Abidin, Radd al-Muhtar — defence of silver against modern gold-only practice',
                      contemporary: 'Mufti Taqi Usmani — silver is more protective of the poor',
                      school: 'Classical Hanafi',
                      note: 'Lower threshold reaches more wealth → more reaches the poor.',
                    },
                  },
                  {
                    value: 'LOWER_OF_TWO',
                    title: t('fiqhNisabLower'),
                    desc: t('fiqhNisabLowerDesc'),
                    citations: {
                      primary: 'Combined Bukhari 1454 + Abu Dawud 1573 — take whichever protects the poor most',
                      classical: 'Some Hanbali scholars on maslahah grounds',
                      contemporary: 'Shaykh Yusuf al-Qaradawi, Fiqh al-Zakat, Vol. 1',
                      school: 'Strict / maslahah-driven contemporary position',
                      note: 'In practice this defaults to silver today. Matches AMJA’s strict worksheet for cash + trade goods.',
                    },
                  },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      nisabMethodology === opt.value
                        ? 'border-primary bg-green-50 ring-1 ring-primary'
                        : 'border-gray-200 hover:border-green-700 hover:bg-green-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="nisabMethodology"
                      value={opt.value}
                      checked={nisabMethodology === opt.value}
                      onChange={() => handleNisabChange(opt.value)}
                      disabled={savingNisab}
                      className="mt-1 w-5 h-5 text-primary accent-[#1B5E20]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{opt.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{opt.desc}</p>
                      {opt.citations && (
                        <details className="mt-2 text-xs">
                          <summary className="cursor-pointer text-[#1B5E20] font-semibold hover:underline">
                            {tFmt('fiqhViewSourcesFmt', [Object.keys(opt.citations).length])}
                          </summary>
                          <dl className="mt-2 space-y-1 bg-white/80 border border-green-100 rounded p-2">
                            {opt.citations.primary && (
                              <div><dt className="font-semibold text-gray-700 inline">{t('fiqhCitePrimary')} </dt><dd className="inline text-gray-600">{opt.citations.primary}</dd></div>
                            )}
                            {opt.citations.classical && (
                              <div><dt className="font-semibold text-gray-700 inline">{t('fiqhCiteClassical')} </dt><dd className="inline text-gray-600">{opt.citations.classical}</dd></div>
                            )}
                            {opt.citations.secondaryClassical && (
                              <div><dt className="font-semibold text-gray-700 inline">{t('fiqhCiteAlso')} </dt><dd className="inline text-gray-600">{opt.citations.secondaryClassical}</dd></div>
                            )}
                            {opt.citations.contemporary && (
                              <div><dt className="font-semibold text-gray-700 inline">{t('fiqhCiteContemporary')} </dt><dd className="inline text-gray-600">{opt.citations.contemporary}</dd></div>
                            )}
                            {opt.citations.school && (
                              <div><dt className="font-semibold text-gray-700 inline">{t('fiqhCiteSchool')} </dt><dd className="inline text-gray-600">{opt.citations.school}</dd></div>
                            )}
                            {opt.citations.note && (
                              <div className="text-gray-500 italic">{opt.citations.note}</div>
                            )}
                          </dl>
                        </details>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">{t('fiqhRulesHeading')}</h2>

            <div className="space-y-6">
              {/* Jewelry Zakatable */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{t('fiqhRuleJewelryLabel')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('fiqhRuleJewelryDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rules.jewelryZakatable}
                  onChange={(e) => handleRuleChange('jewelryZakatable', e.target.checked)}
                  className="w-5 h-5 text-green-700 rounded"
                />
              </div>

              {/* Hawl Reset on Nisab Drop */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{t('fiqhRuleHawlLabel')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('fiqhRuleHawlDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rules.hawlResetOnNisabDrop}
                  onChange={(e) => handleRuleChange('hawlResetOnNisabDrop', e.target.checked)}
                  className="w-5 h-5 text-green-700 rounded"
                />
              </div>

              {/* Wasiyyah Exceed Third with Consent */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{t('fiqhRuleWasiyyahLabel')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('fiqhRuleWasiyyahDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rules.wasiyyahExceedThirdWithConsent}
                  onChange={(e) => handleRuleChange('wasiyyahExceedThirdWithConsent', e.target.checked)}
                  className="w-5 h-5 text-green-700 rounded"
                />
              </div>

              {/* Radd Includes Spouse */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-primary">{t('fiqhRuleRaddLabel')}</p>
                  <p className="text-sm text-gray-600 mt-1">{t('fiqhRuleRaddDesc')}</p>
                </div>
                <input
                  type="checkbox"
                  checked={rules.raddIncludesSpouse}
                  onChange={(e) => handleRuleChange('raddIncludesSpouse', e.target.checked)}
                  className="w-5 h-5 text-green-700 rounded"
                />
              </div>

              {/* Fitr Type */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label htmlFor="fiqhFitrLabel" className="block font-semibold text-primary mb-2">{t('fiqhFitrLabel')}</label>
                <select id="fiqhFitrLabel"
                  value={rules.fitrType}
                  onChange={(e) => handleRuleChange('fitrType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">{t('fiqhFitrSelectPlaceholder')}</option>
                  <option value="food">{t('fiqhFitrOptFood')}</option>
                  <option value="money">{t('fiqhFitrOptMoney')}</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">{t('fiqhFitrHint')}</p>
              </div>

              {/* Debt Method */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label htmlFor="fiqhDebtLabel" className="block font-semibold text-primary mb-2">{t('fiqhDebtLabel')}</label>
                <select id="fiqhDebtLabel"
                  value={rules.debtMethod}
                  onChange={(e) => handleRuleChange('debtMethod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">{t('fiqhDebtSelectPlaceholder')}</option>
                  <option value="full_balance">{t('fiqhDebtOptFull')}</option>
                  <option value="annual_installment">{t('fiqhDebtOptAnnual')}</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">{t('fiqhDebtHint')}</p>
              </div>

              {/* Retirement Method */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label htmlFor="fiqhRetirementLabel" className="block font-semibold text-primary mb-2">{t('fiqhRetirementLabel')}</label>
                <select id="fiqhRetirementLabel"
                  value={rules.retirementMethod}
                  onChange={(e) => handleRuleChange('retirementMethod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="full_accessible">{t('fiqhRetirementOptFull')}</option>
                  <option value="employer_match_only">{t('fiqhRetirementOptMatch')}</option>
                  <option value="on_withdrawal_only">{t('fiqhRetirementOptWithdrawal')}</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">{t('fiqhRetirementHint')}</p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveRules}
              disabled={saving}
              className="mt-8 w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {saving ? t('fiqhSavingBtn') : t('fiqhSaveBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
