import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminPlaidProspectsTab } from '../components/admin/AdminPlaidProspectsTab';
import { cadenceLabel } from '../components/admin/adminFormatting';

const { getProspects, updateOutreach, toast } = vi.hoisted(() => ({
  getProspects: vi.fn(), updateOutreach: vi.fn(), toast: vi.fn(),
}));
vi.mock('../lib/api', () => ({ api: {
  getAdminPlaidProspects: (...args: unknown[]) => getProspects(...args),
  updateAdminPlaidOutreach: (...args: unknown[]) => updateOutreach(...args),
} }));
vi.mock('../lib/toast', () => ({ useToast: () => ({ toast }) }));
const result = {
  prospects: [{ userId: 2061, fullName: 'Paid customer', email: 'paid@example.com', plan: 'plus',
    subscriptionStatus: 'active', subscriptionSource: 'stripe', createdAt: 1700000000000,
    emailVerified: true, emailVerifiedAt: 1700000001000, billingInterval: 'monthly', locale: 'en', hasStripe: true,
    planExpiresAt: 1900000000, accountCount: 0, activeAccountCount: 0,
    connectionHealthy: false, needsReconnect: false, hasEverPaid: true,
    importedTransactionCount: 0, outreachStatus: 'not_contacted', lastLinkAttemptAt: 1700000000000 }],
  totalElements: 60, page: 0, size: 50, totalPages: 2,
  summary: { total: 60, needsConnection: 30, activeConnections: 20, needsReconnect: 10 },
};
beforeEach(() => { vi.clearAllMocks(); getProspects.mockResolvedValue(result); updateOutreach.mockResolvedValue({}); });
afterEach(cleanup);

describe('Plaid support queue', () => {
  it('does not ask customers to reconnect for an upstream sync failure', async () => {
    getProspects.mockResolvedValue({ ...result, prospects: [{ ...result.prospects[0],
      accountCount: 1, activeAccountCount: 1, syncIssue: true, needsReconnect: false,
      lastSyncError: 'Circuit breaker open for upstream: plaid' }] });
    render(<AdminPlaidProspectsTab openUser={vi.fn()} />);
    expect(await screen.findByText('Sync issue — investigate')).toBeInTheDocument();
    expect(screen.queryByText('Needs reconnect', { selector: 'span' })).not.toBeInTheDocument();
  });
  it.each([['month','Monthly'],['monthly','Monthly'],['year','Annual'],['yearly','Annual']])('recognizes stored cadence %s', (interval, label) => {
    expect(cadenceLabel(interval,'plus')?.label).toBe(label);
  });
  it('shows a paid customer without pretending a bank connection exists', async () => {
    render(<AdminPlaidProspectsTab openUser={vi.fn()} />);
    expect(await screen.findByText('paid@example.com')).toBeInTheDocument();
    expect(screen.getByText('Payment recorded')).toBeInTheDocument();
    expect(screen.getByText('0/0 active')).toBeInTheDocument();
    expect(screen.getAllByText('Needs first connection').length).toBeGreaterThan(1);
    expect(screen.queryByText('Needs reconnect', { selector: 'span' })).not.toBeInTheDocument();
  });
  it('uses full filtered totals rather than counting only the visible page', async () => {
    render(<AdminPlaidProspectsTab openUser={vi.fn()} />);
    await screen.findByText('paid@example.com');
    for (const count of ['60','30','20','10']) expect(screen.getByText(count)).toBeInTheDocument();
  });
  it('opens the real signup date rather than the date of first bank connection', async () => {
    const open = vi.fn(); render(<AdminPlaidProspectsTab openUser={open} />);
    fireEvent.click(await screen.findByRole('button', { name: 'View user' }));
    expect(open.mock.calls[0][0]).toMatchObject({ id: 2061, createdAt: 1700000000000,
      emailVerified: true, emailVerifiedAt: 1700000001000, billingInterval: 'monthly', locale: 'en', hasStripe: true });
  });
  it('queries paid and unfinished-connection filters server-side', async () => {
    render(<AdminPlaidProspectsTab openUser={vi.fn()} />);
    await screen.findByText('paid@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Paid subscribers' }));
    await waitFor(() => expect(getProspects).toHaveBeenLastCalledWith(expect.objectContaining({ filter: 'paid', page: 0 })));
    fireEvent.click(screen.getByRole('button', { name: 'Needs first connection' }));
    await waitFor(() => expect(getProspects).toHaveBeenLastCalledWith(expect.objectContaining({ filter: 'needs_connection', page: 0 })));
  });
  it('does not let an older search overwrite a newer result', async () => {
    let resolveOld!: (value: unknown) => void;
    getProspects.mockImplementation(({ q }: { q: string }) => q === 'old'
      ? new Promise(resolve => { resolveOld = resolve; })
      : Promise.resolve(result));
    render(<AdminPlaidProspectsTab openUser={vi.fn()} />);
    await screen.findByText('paid@example.com');
    fireEvent.change(screen.getByRole('textbox', { name: 'Search Plaid prospects' }), { target: { value: 'old' } });
    await waitFor(() => expect(resolveOld).toBeDefined());
    fireEvent.change(screen.getByRole('textbox', { name: 'Search Plaid prospects' }), { target: { value: 'paid' } });
    await waitFor(() => expect(getProspects).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'paid' })));
    await screen.findByText('paid@example.com');
    resolveOld({ ...result, prospects: [{ ...result.prospects[0], email: 'stale@example.com' }] });
    await waitFor(() => expect(screen.queryByText('stale@example.com')).not.toBeInTheDocument());
    expect(screen.getByText('paid@example.com')).toBeInTheDocument();
  });
});
