'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

interface CalculatorInputs {
  cashAndBanking: number;
  goldGrams: number;
  silverGrams: number;
  investments: number;
  businessAssets: number;
  retirementAccounts: number;
  otherAssets: number;
  debts: number;
}

// DEPRECATED: These hardcoded values are OUTDATED and should be fetched from the backend API
// Gold price was ~$70/g in this code but is actually ~$165/g as of April 2026
// The calculator should fetch nisab thresholds from /api/zakat/info endpoint instead
const GOLD_PRICE_PER_GRAM = 165; // USD per gram (updated to April 2026 prices)
const SILVER_PRICE_PER_GRAM = 2.00; // USD per gram (updated to April 2026 prices)
const NISAB_GOLD_GRAMS = 85;
const NISAB_SILVER_GRAMS = 595;
const ZAKAT_RATE = 0.025; // 2.5%

// TODO: Fetch live nisab from backend API instead of hardcoded values
// const nisabGoldThreshold = await fetch('/api/zakat/info').then(r => r.json()).then(d => d.nisabGoldThreshold)

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    cashAndBanking: 0,
    goldGrams: 0,
    silverGrams: 0,
    investments: 0,
    businessAssets: 0,
    retirementAccounts: 0,
    otherAssets: 0,
    debts: 0,
  });

  const [selectedMadhab, setSelectedMadhab] = useState<'hanafi' | 'shafii' | 'maliki' | 'hanbali'>('hanafi');
  const [showResults, setShowResults] = useState(false);
  const [livePrices, setLivePrices] = useState<{goldPrice?: number; silverPrice?: number; nisabGoldThreshold?: number} | null>(null);
  const [pricesLoading, setPricesLoading] = useState(true);
  const [isPersonalJewelry, setIsPersonalJewelry] = useState(false);

  useEffect(() => {
    setPricesLoading(true);
    fetch('/api/zakat/info')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setLivePrices(data); })
      .catch(() => {}) // silently fall back to hardcoded
      .finally(() => setPricesLoading(false));
  }, []);

  const goldPricePerGram = livePrices?.goldPrice ?? GOLD_PRICE_PER_GRAM;
  const silverPricePerGram = livePrices?.silverPrice ?? SILVER_PRICE_PER_GRAM;

  const nisabInGold = NISAB_GOLD_GRAMS * goldPricePerGram;
  const nisabInSilver = NISAB_SILVER_GRAMS * silverPricePerGram;
  // AMJA gold standard: Use gold-only nisab (85g × live gold price)
  // This matches the backend's gold-based nisab calculation per AMJA recommendation
  const nisabThreshold = nisabInGold; // AMJA gold standard for North American Muslims

  const calculations = useMemo(() => {
    // Calculate total asset values
    let goldValue = inputs.goldGrams * goldPricePerGram;
    let silverValue = inputs.silverGrams * silverPricePerGram;

    // Madhab-specific logic: for Shafii, Maliki, Hanbali, subtract personal jewelry from zakat calculation
    const isNonHanafiMadhab = ['shafii', 'maliki', 'hanbali'].includes(selectedMadhab);
    if (isPersonalJewelry && isNonHanafiMadhab) {
      goldValue = 0;
      silverValue = 0;
    }

    const totalAssets =
      inputs.cashAndBanking +
      goldValue +
      silverValue +
      inputs.investments +
      inputs.businessAssets +
      inputs.retirementAccounts +
      inputs.otherAssets;

    const totalDebt = inputs.debts;
    const netWealth = Math.max(0, totalAssets - totalDebt);

    // Zakat is due on TOTAL net wealth if it meets/exceeds the nisab threshold.
    // The nisab is a THRESHOLD (minimum), not a deduction — per the majority
    // scholarly opinion (Hanafi, Maliki, Shafi'i, Hanbali). You pay 2.5% on
    // ALL zakatable wealth, not just the amount above nisab.
    const meetsNisab = netWealth >= nisabThreshold;
    const zakatDue = meetsNisab ? netWealth * ZAKAT_RATE : 0;

    return {
      totalAssets,
      netWealth,
      zakatDue,
      meetsNisab,
      goldValue,
      silverValue,
    };
  }, [inputs, goldPricePerGram, silverPricePerGram, selectedMadhab, isPersonalJewelry]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setInputs({
      cashAndBanking: 0,
      goldGrams: 0,
      silverGrams: 0,
      investments: 0,
      businessAssets: 0,
      retirementAccounts: 0,
      otherAssets: 0,
      debts: 0,
    });
    setShowResults(false);
  };

  const InputField = ({
    label,
    field,
    value,
    unit = 'USD',
    tooltip,
  }: {
    label: string;
    field: keyof CalculatorInputs;
    value: number;
    unit?: string;
    tooltip: string;
  }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div
          className="relative group cursor-help"
          title={tooltip}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-amber-500 rounded-full hover:bg-amber-600">
            ?
          </span>
          <div className="absolute left-0 bottom-full mb-2 w-48 hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 z-10 whitespace-normal">
            {tooltip}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) =>
            handleInputChange(field, e.target.value ? parseFloat(e.target.value) : 0)
          }
          placeholder="0"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
        <span className="text-sm text-gray-600 font-medium min-w-12">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Interactive Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-t-4 border-amber-500">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculate Your Zakat</h2>
          <p className="text-gray-600">
            Enter your assets below. All calculations are done locally on your device.
          </p>
        </div>

        {/* Madhab Selector */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Select your Islamic school of thought (madhab):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['hanafi', 'shafii', 'maliki', 'hanbali'] as const).map((madhab) => (
              <button
                key={madhab}
                onClick={() => setSelectedMadhab(madhab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedMadhab === madhab
                    ? 'bg-green-700 text-white'
                    : 'bg-white border border-amber-300 text-gray-700 hover:bg-amber-50'
                }`}
              >
                {madhab === 'hanafi' && 'Hanafi'}
                {madhab === 'shafii' && 'Shafii'}
                {madhab === 'maliki' && 'Maliki'}
                {madhab === 'hanbali' && 'Hanbali'}
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Liquid & Banking Assets
            </h3>
            <InputField
              label="Cash & Bank Accounts"
              field="cashAndBanking"
              value={inputs.cashAndBanking}
              tooltip="Include checking accounts, savings accounts, and cash on hand"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Precious Metals
            </h3>
            <InputField
              label="Gold (in grams)"
              field="goldGrams"
              value={inputs.goldGrams}
              unit="g"
              tooltip="Weight of gold jewelry, coins, or bars. Personal jewelry worn regularly may be exempt depending on madhab."
            />
            <InputField
              label="Silver (in grams)"
              field="silverGrams"
              value={inputs.silverGrams}
              unit="g"
              tooltip="Weight of silver jewelry, coins, or bars"
            />
            {['shafii', 'maliki', 'hanbali'].includes(selectedMadhab) && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPersonalJewelry}
                    onChange={(e) => setIsPersonalJewelry(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    This gold/silver is personal jewelry worn regularly
                  </span>
                </label>
                <p className="text-xs text-gray-600 mt-2 ml-6">
                  In the {selectedMadhab.charAt(0).toUpperCase() + selectedMadhab.slice(1)} school of thought, personal jewelry worn regularly is exempt from zakat. If checked, these amounts will be excluded from your calculation.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Investments & Property
            </h3>
            <InputField
              label="Stocks, Bonds & Mutual Funds"
              field="investments"
              value={inputs.investments}
              tooltip="Current market value of investment portfolios"
            />
            <InputField
              label="Business Assets & Inventory"
              field="businessAssets"
              value={inputs.businessAssets}
              tooltip="Value of business inventory, equipment, or stock in trade"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Retirement & Other Assets
            </h3>
            <InputField
              label="Retirement Accounts (401k, IRA, Roth IRA)"
              field="retirementAccounts"
              value={inputs.retirementAccounts}
              tooltip="Some scholars include retirement accounts; others exclude them. Check with your local imam."
            />
            <InputField
              label="Other Assets"
              field="otherAssets"
              value={inputs.otherAssets}
              tooltip="Cryptocurrency, rental property, vehicles (excluding personal use), etc."
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Liabilities
            </h3>
            <InputField
              label="Total Debts (to deduct)"
              field="debts"
              value={inputs.debts}
              tooltip="Mortgages, personal loans, credit card debt, and other liabilities"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg transition-colors text-lg"
          >
            Calculate My Zakat
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="space-y-4">
            {/* State Tax Deductions Note */}
            {inputs.retirementAccounts > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2">Retirement Account Tax Deductions</h3>
                <p className="text-sm text-amber-800">
                  Tax deductions on retirement accounts (401k, IRA, Roth IRA, HSA) are calculated based on your profile state. To ensure accurate calculations, please update your state in <Link href="/profile" className="font-semibold underline hover:no-underline">Profile settings</Link>.
                </p>
              </div>
            )}

            {/* Price Source Indicator */}
            {!pricesLoading && (
              <div className={`text-xs font-medium px-3 py-1 rounded-full w-fit ${
                livePrices ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {livePrices ? '✓ Live prices' : 'Estimated prices'}
              </div>
            )}
            {pricesLoading && (
              <div className="text-xs font-medium px-3 py-1 rounded-full w-fit bg-blue-100 text-blue-700">
                Loading prices...
              </div>
            )}

            {/* Nisab Threshold Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Nisab Threshold</h3>
              <p className="text-sm text-gray-700 mb-2">
                You must meet the nisab threshold to be obligated to pay zakat.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-600">Gold Standard</p>
                  <p className="text-lg font-bold text-green-700">
                    ${nisabInGold.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Silver Standard</p>
                  <p className="text-lg font-bold text-green-700">
                    ${nisabInSilver.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Your Threshold</p>
                  <p className="text-lg font-bold text-amber-600">
                    ${nisabThreshold.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Total Assets:</span>
                <span className="font-semibold text-gray-900">
                  ${calculations.totalAssets.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Minus: Total Debts</span>
                <span className="font-semibold text-red-600">
                  -${inputs.debts.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 bg-gray-50 px-2 -mx-2">
                <span className="text-gray-900 font-medium">Net Wealth:</span>
                <span className="font-bold text-gray-900">
                  ${calculations.netWealth.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 bg-amber-50 px-2 -mx-2 rounded">
                <span className="text-gray-700">Nisab Threshold (minimum):</span>
                <span className="font-semibold text-amber-700">
                  ${nisabThreshold.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final Result */}
            <div
              className={`p-6 rounded-lg ${
                calculations.meetsNisab
                  ? 'bg-green-50 border-2 border-green-300'
                  : 'bg-gray-50 border-2 border-gray-300'
              }`}
            >
              {calculations.meetsNisab ? (
                <>
                  <p className="text-sm text-gray-700 mb-2">Your Zakat Due (2.5%):</p>
                  <p className="text-4xl font-bold text-green-700 mb-2">
                    ${calculations.zakatDue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    You meet the nisab threshold and are obligated to pay zakat.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-700 mb-2">Zakat Status:</p>
                  <p className="text-2xl font-bold text-gray-700 mb-2">Not Obligatory</p>
                  <p className="text-sm text-gray-600">
                    Your net wealth does not reach the nisab threshold of ${nisabThreshold.toFixed(2)}.
                    Zakat is not obligatory, but sadaqah is always welcome.
                  </p>
                </>
              )}
            </div>

            {/* Next Steps */}
            {calculations.meetsNisab && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>
                    Record the date you first met nisab (your zakat anniversary)
                  </li>
                  <li>
                    Recalculate one Islamic lunar year later
                  </li>
                  <li>
                    Distribute zakat to eligible recipients (the poor, needy, slaves, debtors, in the way of Allah, travelers)
                  </li>
                  <li>
                    Keep records for your own accountability
                  </li>
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-3">
                Track your zakat automatically and never miss a payment with Barakah's zakat tracker.
              </p>
              <Link
                href="/signup"
                className="inline-block w-full text-center bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-lg transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
