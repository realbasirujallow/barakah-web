'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { logError } from '../../../lib/logError';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<FiqhConfig>({});
  const [schools, setSchools] = useState<FiqhSchool[]>([]);
  const [activeTab, setActiveTab] = useState<'madhab' | 'rules'>('madhab');

  // Form state
  const [selectedMadhab, setSelectedMadhab] = useState('');
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
        const [configData, schoolsData] = await Promise.all([
          api.getFiqhConfig(),
          api.getFiqhSchools(),
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
      } catch (err) {
        logError(err, { context: 'Failed to load fiqh config' });
        toast('Failed to load fiqh settings. Please try refreshing.', 'error');
      }
      setLoading(false);
    };

    loadData();
  }, [toast]);

  const handleMadhabChange = async (madhab: string) => {
    setSelectedMadhab(madhab);
    setSaving(true);
    try {
      const result = await api.setMadhab(madhab);
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
        toast('Madhab updated successfully! Detailed rules have been updated to match.', 'success');
      }
    } catch (err) {
      logError(err, { context: 'Failed to update madhab' });
      toast('Failed to update Madhab. Please try again.', 'error');
      setSelectedMadhab(config.madhab || '');
    }
    setSaving(false);
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
        toast('Fiqh rules updated successfully!', 'success');
      }
    } catch (err) {
      logError(err, { context: 'Failed to update fiqh rules' });
      toast('Failed to update rules. Please try again.', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">Loading Fiqh settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1B5E20] mb-2">Fiqh Settings</h1>
          <p className="text-gray-600">Configure your Islamic finance preferences and interpretation methodology</p>
        </div>

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
            Madhab
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'rules'
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-2 border-green-700 hover:bg-green-50'
            }`}
          >
            Detailed Rules
          </button>
        </div>

        {/* Madhab Tab */}
        {activeTab === 'madhab' && (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Select Your School of Thought</h2>

            {schools.length > 0 ? (
              <div className="space-y-4">
                {schools.map((school) => (
                  <label
                    key={school.value}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedMadhab === school.value
                        ? 'border-[#1B5E20] bg-green-50 ring-1 ring-[#1B5E20]'
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
                      className="mt-1 w-5 h-5 text-[#1B5E20] accent-[#1B5E20]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-[#1B5E20]">{school.displayName}</p>
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
              <p className="text-gray-600">No schools of thought available.</p>
            )}
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#1B5E20] mb-6">Fiqh Rules</h2>

            <div className="space-y-6">
              {/* Jewelry Zakatable */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-semibold text-[#1B5E20]">Jewelry is Zakatable</p>
                  <p className="text-sm text-gray-600 mt-1">Count jewelry toward Zakat calculation</p>
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
                  <p className="font-semibold text-[#1B5E20]">Reset Hawl on Nisab Drop</p>
                  <p className="text-sm text-gray-600 mt-1">Reset the lunar year counter if wealth drops below Nisab</p>
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
                  <p className="font-semibold text-[#1B5E20]">Wasiyyah Exceed Third with Consent</p>
                  <p className="text-sm text-gray-600 mt-1">Allow bequests exceeding 1/3 with heirs&apos; consent</p>
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
                  <p className="font-semibold text-[#1B5E20]">Radd Includes Spouse</p>
                  <p className="text-sm text-gray-600 mt-1">Include spouse in inheritance distribution through Radd</p>
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
                <label className="block font-semibold text-[#1B5E20] mb-2">Zakat al-Fitr Type</label>
                <select
                  value={rules.fitrType}
                  onChange={(e) => handleRuleChange('fitrType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">Select Fitr Type</option>
                  <option value="food">Staple Food</option>
                  <option value="money">Cash / Monetary Value</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">Choose how you prefer to calculate Zakat al-Fitr</p>
              </div>

              {/* Debt Method */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="block font-semibold text-[#1B5E20] mb-2">Debt Calculation Method</label>
                <select
                  value={rules.debtMethod}
                  onChange={(e) => handleRuleChange('debtMethod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="">Select Method</option>
                  <option value="full_balance">Deduct Full Balance (Hanafi)</option>
                  <option value="annual_installment">Deduct Annual Installment Only (Majority)</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">Choose how debts affect your Zakat calculation</p>
              </div>

              {/* Retirement Method */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="block font-semibold text-[#1B5E20] mb-2">Retirement Account Zakat Method</label>
                <select
                  value={rules.retirementMethod}
                  onChange={(e) => handleRuleChange('retirementMethod', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  <option value="full_accessible">Full Accessible Balance (AMJA/Majority)</option>
                  <option value="employer_match_only">Employer Match Only</option>
                  <option value="on_withdrawal_only">On Withdrawal Only</option>
                </select>
                <p className="text-sm text-gray-600 mt-2">Choose the scholarly opinion for retirement account zakat calculations</p>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveRules}
              disabled={saving}
              className="mt-8 w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save Rules'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
