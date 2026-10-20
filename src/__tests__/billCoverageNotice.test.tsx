import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BillCoverageNotice } from '../components/dashboard/BillCoverageNotice';
const { coverage } = vi.hoisted(() => ({ coverage: vi.fn() }));
vi.mock('../lib/api', () => ({ api: { getPlaidLiabilitiesCoverage: coverage } }));
vi.mock('../lib/i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());
it('offers manual reminders without inventing a date or payment amount', async () => {
  coverage.mockResolvedValue({items:[{creditAccountCount:1,accounts:[{linkedAccountId:2,name:'Bank Visa 1234',currency:'USD'}]}]});
  const add=vi.fn(); render(<BillCoverageNotice onAdd={add}/>);
  expect(await screen.findByText('Bank Visa 1234')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'billsCoverageAdd'}));
  expect(add).toHaveBeenCalledWith('Bank Visa 1234','USD');
});
it('does not claim coverage when the check fails and supports retry', async () => {
  coverage.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({items:[]});
  render(<BillCoverageNotice onAdd={vi.fn()}/>);
  expect(await screen.findByText('billsCoverageError')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'zktRetry'}));
  await waitFor(() => expect(screen.queryByText('billsCoverageError')).not.toBeInTheDocument());
  expect(coverage).toHaveBeenCalledTimes(2);
});
it('does not warn when all dates are supplied', async () => {
  coverage.mockResolvedValue({items:[]}); const {container}=render(<BillCoverageNotice onAdd={vi.fn()}/>);
  expect(container.querySelector('section')).toBeNull();
});
