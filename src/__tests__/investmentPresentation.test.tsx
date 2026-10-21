import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import InvestmentsPage from '../app/dashboard/investments/page';

const mocks = vi.hoisted(() => ({ rates: vi.fn() }));
vi.mock('../lib/useCurrency', () => ({ useCurrency: () => ({ currency: 'SAR', fmt: (n: number) => `SAR ${n.toFixed(2)}` }) }));
vi.mock('../lib/toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));
vi.mock('../lib/i18n', () => {
  const i18n = { t: (key: string) => key, tFmt: (key: string, args: unknown[]) => `${key} ${args.join(' ')}` };
  return { useI18n: () => i18n };
});
vi.mock('../lib/api', () => ({ api: {
  getPortfolioSummary: async () => ({ currency: 'USD', totalValue: 100, totalGainLoss: 0, accounts: [{
    id: 1, name: 'GBP brokerage', accountType: 'brokerage', currency: 'GBP', totalValue: 80, totalGainLoss: 0, holdings: [],
  }] }),
  getAssets: async () => [{ id: 2, name: 'Manual asset', type: 'stock', value: 80, currency: 'GBP' }],
  getCurrencyRates: () => mocks.rates(),
  getPortfolioHistory: async () => ({ history: [] }),
  getInvestmentBenchmarks: async () => ({ series: null }),
} }));

afterEach(cleanup);
describe('investment page monetary presentation', () => {
  it('renders a normalized summary plus manual assets, not mixed currency totals', async () => {
    mocks.rates.mockResolvedValue({ base: 'USD', rates: { GBP: 0.8, SAR: 3.75 }, estimated: false, fetchedAt: Date.now() });
    render(<InvestmentsPage />);
    expect((await screen.findAllByText('SAR 750.00')).length).toBeGreaterThan(0);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
  it('shows a retry state rather than fabricated balances when FX fails', async () => {
    mocks.rates.mockRejectedValue(new Error('503'));
    render(<InvestmentsPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('investmentsFxUnavailable');
    expect(screen.queryByText('SAR 180.00')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'txnRetry' })).toBeEnabled();
  });
});
