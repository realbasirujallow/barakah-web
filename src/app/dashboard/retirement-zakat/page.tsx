'use client';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useCurrency } from '../../../lib/useCurrency';
import { logError } from '../../../lib/logError';
import { useToast } from '../../../lib/toast';
import { PageHeader } from '../../../components/dashboard/PageHeader';
import { useI18n } from '../../../lib/i18n';

interface RetirementZakatResult {
  fullAccessible?: {
    zakatableAmount?: number;
    zakatDue?: number;
    explanation?: string;
    scholars?: string[];
  };
  employerMatchOnly?: {
    zakatableAmount?: number;
    zakatDue?: number;
    explanation?: string;
    scholars?: string[];
  };
  onWithdrawalOnly?: {
    zakatableAmount?: number;
    zakatDue?: number;
    explanation?: string;
    scholars?: string[];
  };
  accountType?: string;
  balance?: number;
  nisab?: number;
  userPreferredMethod?: string;
  error?: string;
  [key: string]: unknown;
}

interface FiqhConfig {
  retirementMethod?: string;
  [key: string]: unknown;
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY', 'DC', 'PR', 'GU', 'VI'
];

export default function RetirementZakatPage() {
  const { toast } = useToast();
  const { fmt: formatCurrency, symbol } = useCurrency();
  const { t, tFmt } = useI18n();

  // Form state
  const [balance, setBalance] = useState('');
  const [accountType, setAccountType] = useState('401k');
  // Employer match % — portion of the balance from employer contributions, used
  // by the "Employer Match Only" scholarly method. Without this input the
  // employer-match card always showed $0 and was confusing. The total
  // balance field still includes employer contributions; this just tells
  // the calc how much of it came from the employer.
  const [employerMatchPercent, setEmployerMatchPercent] = useState('');
  const [state, setState] = useState('');

  // Results state
  const [results, setResults] = useState<RetirementZakatResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [fiqhConfig, setFiqhConfig] = useState<FiqhConfig>({});

  // Load user's fiqh config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await api.getFiqhConfig();
        if (config) {
          setFiqhConfig(config);
        }
      } catch (err) {
        logError(err, { context: 'Failed to load fiqh config' });
      }
    };
    loadConfig();
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balance || isNaN(parseFloat(balance))) {
      toast(t('retirementZakatValidBalanceError'), 'error');
      return;
    }

    // CRITICAL BUG FIX (C-2): reject negative/NaN/Infinity balances before
    // sending to backend. Without this, a negative number reaches the calc
    // and can produce nonsensical (or negative) zakat amounts.
    const parsed = parseFloat(balance);
    if (!Number.isFinite(parsed) || parsed < 0) {
      toast(t('retirementZakatNegativeBalanceError'), 'error');
      return;
    }

    setLoading(true);
    try {
      // Clamp the employer-match input: blank or non-numeric means 0
      // (no visible effect on the Employer Match Only card). 0-100 window
      // enforced so a typo doesn't overreport zakat.
      const empParsed = Number.parseFloat(employerMatchPercent);
      const empClamped = Number.isFinite(empParsed)
        ? Math.max(0, Math.min(100, empParsed))
        : 0;

      const data = {
        balance: parsed,
        accountType,
        employerMatchPercent: empClamped,
        state: state || '',
      };

      const result = await api.calculateRetirementZakat(data);
      if (result?.error) {
        toast(result.error, 'error');
        setResults(null);
        return;
      }
      // Validate results completeness before setting
      const hasValidResults = result &&
        result.fullAccessible !== undefined &&
        result.fullAccessible !== null;
      if (hasValidResults) {
        setResults(result);
      } else {
        toast(t('retirementZakatUnableToCalculate'), 'error');
        setResults(null);
      }
    } catch (err) {
      logError(err, { context: 'Failed to calculate retirement zakat' });
      toast(t('retirementZakatCalculateFailed'), 'error');
    }
    setLoading(false);
  };

  const getMethodRecommendation = (method?: string) => {
    const preferred = fiqhConfig.retirementMethod || 'full_accessible';
    return preferred === method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8E1] to-[#E8F5E9] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          title={t('retirementZakatPageTitle')}
          subtitle={t('retirementZakatPageSubtitle')}
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary mb-6">{t('retirementZakatAccountDetails')}</h2>

              <form onSubmit={handleCalculate} className="space-y-4">
                {/* Balance */}
                <div>
                  <label htmlFor="retirementZakatTotalBalanceLabelFmt" className="block text-sm font-semibold text-primary mb-2">{tFmt('retirementZakatTotalBalanceLabelFmt', [symbol])}</label>
                  <input id="retirementZakatTotalBalanceLabelFmt"
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('retirementZakatBalanceHint')}</p>
                </div>

                {/* Account Type */}
                <div>
                  <label htmlFor="retirementZakatAccountTypeLabel" className="block text-sm font-semibold text-primary mb-2">{t('retirementZakatAccountTypeLabel')}</label>
                  <select id="retirementZakatAccountTypeLabel"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="401k">401(k)</option>
                    <option value="ira">{t('retirementZakatAccountTraditionalIra')}</option>
                    <option value="roth_ira">{t('retirementZakatAccountRothIra')}</option>
                    <option value="403b">403(b)</option>
                    <option value="tsp">{t('retirementZakatAccountTsp')}</option>
                    <option value="sep_ira">{t('retirementZakatAccountSepIra')}</option>
                    <option value="simple_ira">{t('retirementZakatAccountSimpleIra')}</option>
                    <option value="pension">{t('retirementZakatAccountPension')}</option>
                  </select>
                </div>

                {/* Employer Match — optional, unlocks the Employer Match Only card */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    {t('retirementZakatEmployerContribLabel')}
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={employerMatchPercent}
                    onChange={(e) => setEmployerMatchPercent(e.target.value)}
                    placeholder={t('retirementZakatEmployerContribPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t('retirementZakatEmployerContribHint')}
                  </p>
                </div>

                {/* State */}
                <div>
                  <label htmlFor="retirementZakatStateLabel" className="block text-sm font-semibold text-primary mb-2">{t('retirementZakatStateLabel')}</label>
                  <select id="retirementZakatStateLabel"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option value="">{t('retirementZakatSelectState')}</option>
                    {US_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{t('retirementZakatStateHint')}</p>
                </div>

                {/* Calculate Button */}
                <button
                  type="submit"
                  disabled={loading || !balance}
                  className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition mt-6"
                >
                  {loading ? t('retirementZakatCalculating') : t('dashCalculateZakat')}
                </button>
              </form>

              {/* Info Card */}
              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-gray-700">
                  <strong>{t('retirementZakatNoteLabel')}</strong> {t('retirementZakatNoteBody')}
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {!results ? (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600">{t('retirementZakatEmptyResults')}</p>
              </div>
            ) : (
              <>
                {!results.fullAccessible ? (
                  <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                      {t('retirementZakatUnableToCalculate')}
                    </div>
                  </div>
                ) : (
              <div className="space-y-6">
                {/* Account Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-primary mb-4">{t('retirementZakatAccountSummary')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('retirementZakatBalance')}</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(results.balance || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('retirementZakatAccountTypeLabel')}</p>
                      <p className="text-xl font-bold text-primary">{results.accountType || accountType}</p>
                    </div>
                    {results.nisab && (
                      <div>
                        <p className="text-sm text-gray-600">{t('retirementZakatNisab')}</p>
                        <p className="text-xl font-bold text-primary">{formatCurrency(results.nisab)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Three Scholarly Positions */}
                <div className="space-y-4">
                  {/* Accessible Balance (AMJA/FCNA) */}
                  <div className={`rounded-lg shadow-lg p-6 border-l-4 ${
                    getMethodRecommendation('full_accessible')
                      ? 'border-l-green-700 bg-green-50'
                      : 'border-l-gray-300 bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-primary">{t('retirementZakatMethodAccessible')}</h4>
                        {getMethodRecommendation('full_accessible') && (
                          <p className="text-xs text-green-700 font-semibold">{t('retirementZakatPreferredMethod')}</p>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-green-700">{formatCurrency(results.fullAccessible?.zakatDue || 0)}</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm">
                        <span className="font-semibold">{t('retirementZakatZakatableAmount')}</span> {formatCurrency(results.fullAccessible?.zakatableAmount || 0)}
                      </p>
                      {results.fullAccessible?.explanation && (
                        <p className="text-sm text-gray-700">{results.fullAccessible.explanation}</p>
                      )}
                    </div>
                    {results.fullAccessible?.scholars && results.fullAccessible.scholars.length > 0 && (
                      <p className="text-xs text-gray-600">
                        <strong>{t('retirementZakatScholarsLabel')}</strong> {results.fullAccessible.scholars.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Employer Match Only */}
                  <div className={`rounded-lg shadow-lg p-6 border-l-4 ${
                    getMethodRecommendation('employer_match_only')
                      ? 'border-l-green-700 bg-green-50'
                      : 'border-l-gray-300 bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-primary">{t('retirementZakatMethodEmployerMatch')}</h4>
                        {getMethodRecommendation('employer_match_only') && (
                          <p className="text-xs text-green-700 font-semibold">{t('retirementZakatPreferredMethod')}</p>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-green-700">{formatCurrency(results.employerMatchOnly?.zakatDue || 0)}</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm">
                        <span className="font-semibold">{t('retirementZakatZakatableAmount')}</span> {formatCurrency(results.employerMatchOnly?.zakatableAmount || 0)}
                      </p>
                      {results.employerMatchOnly?.explanation && (
                        <p className="text-sm text-gray-700">{results.employerMatchOnly.explanation}</p>
                      )}
                    </div>
                    {results.employerMatchOnly?.scholars && results.employerMatchOnly.scholars.length > 0 && (
                      <p className="text-xs text-gray-600">
                        <strong>{t('retirementZakatScholarsLabel')}</strong> {results.employerMatchOnly.scholars.join(', ')}
                      </p>
                    )}
                  </div>

                  {/* On Withdrawal Only */}
                  <div className={`rounded-lg shadow-lg p-6 border-l-4 ${
                    getMethodRecommendation('on_withdrawal_only')
                      ? 'border-l-green-700 bg-green-50'
                      : 'border-l-gray-300 bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-primary">{t('retirementZakatMethodWithdrawal')}</h4>
                        {getMethodRecommendation('on_withdrawal_only') && (
                          <p className="text-xs text-green-700 font-semibold">{t('retirementZakatPreferredMethod')}</p>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-green-700">{formatCurrency(results.onWithdrawalOnly?.zakatDue || 0)}</span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <p className="text-sm">
                        <span className="font-semibold">{t('retirementZakatZakatableAmount')}</span> {formatCurrency(results.onWithdrawalOnly?.zakatableAmount || 0)}
                      </p>
                      {results.onWithdrawalOnly?.explanation && (
                        <p className="text-sm text-gray-700">{results.onWithdrawalOnly.explanation}</p>
                      )}
                    </div>
                    {results.onWithdrawalOnly?.scholars && results.onWithdrawalOnly.scholars.length > 0 && (
                      <p className="text-xs text-gray-600">
                        <strong>{t('retirementZakatScholarsLabel')}</strong> {results.onWithdrawalOnly.scholars.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-xs text-gray-700">
                    <strong>{t('retirementZakatDisclaimerLabel')}</strong> {t('retirementZakatDisclaimerBody')}
                  </p>
                </div>
              </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
