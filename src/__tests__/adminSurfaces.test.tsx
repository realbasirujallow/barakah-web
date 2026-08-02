import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AnnualUpgradeBanner from '../components/AnnualUpgradeBanner';
import AnnualUpgradeModal from '../components/AnnualUpgradeModal';
import { AdminDeletedTab } from '../components/admin/AdminDeletedTab';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { fmtFullTs } from '../components/admin/adminFormatting';

const { adminGetChurnAnalysisMock, adminGetDeletedUsersMock, subscriptionStatusMock, useAuthMock } = vi.hoisted(() => ({
  adminGetChurnAnalysisMock: vi.fn(),
  adminGetDeletedUsersMock: vi.fn(),
  subscriptionStatusMock: vi.fn(),
  useAuthMock: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: ComponentPropsWithoutRef<'a'> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('../lib/api', () => ({
  api: {
    adminGetChurnAnalysis: () => adminGetChurnAnalysisMock(),
    adminGetDeletedUsers: () => adminGetDeletedUsersMock(),
    subscriptionStatus: () => subscriptionStatusMock(),
  },
}));

vi.mock('../lib/useFocusTrap', () => ({
  useFocusTrap: () => undefined,
}));

describe('admin-specific surface behavior', () => {
  beforeEach(() => {
    adminGetChurnAnalysisMock.mockReset();
    adminGetDeletedUsersMock.mockReset();
    subscriptionStatusMock.mockReset();
    useAuthMock.mockReset();
    useAuthMock.mockReturnValue({
      user: {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        plan: 'family',
        isAdmin: true,
      },
    });
  });

  it('suppresses the annual upgrade banner for admins', async () => {
    render(<AnnualUpgradeBanner />);

    await waitFor(() => {
      expect(subscriptionStatusMock).not.toHaveBeenCalled();
    });
    expect(screen.queryByTestId('annual-upgrade-banner')).not.toBeInTheDocument();
  });

  it('suppresses the annual upgrade modal for admins', async () => {
    render(<AnnualUpgradeModal />);

    await waitFor(() => {
      expect(subscriptionStatusMock).not.toHaveBeenCalled();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('uses explicit nominal-seat copy in admin overview cards', () => {
    render(
      <AdminOverviewTab
        overview={{
          totalUsers: 127,
          freeUsers: 17,
          plusUsers: 58,
          familyUsers: 52,
          subscriptionStatus: { active: 110, trialing: 12 },
          paidUsers: 110,
          activePlus: 0,
          activeFamily: 0,
          subscribedPlus: 58,
          subscribedFamily: 52,
          mrr: 0,
          arr: 0,
          conversionRate: 86.61,
          newUsersToday: 2,
          newUsersThisWeek: 7,
          newUsersThisMonth: 18,
          unverifiedEmails: 0,
          expiringTrialsCount: 0,
          expiringTrials: [],
          pastDueCount: 0,
          pastDueUsers: [],
          totalReferrals: 0,
          usersWithReferrals: 0,
          totalDonationRecords: 0,
          recentSignups: [],
        }}
        featureUsage={null}
        analytics={null}
        onboardingTrial={null}
        setOnboardingTrial={() => undefined}
        trialSettingsSaving={false}
        onSaveOnboardingTrial={() => undefined}
        fmtMoney={(n) => `$${n.toFixed(2)}`}
        setActiveTab={() => undefined}
        setUserFilter={() => undefined}
        setSearch={() => undefined}
        openUser={() => undefined}
      />,
    );

    expect(screen.getByText('Nominal Access Seats')).toBeInTheDocument();
    expect(screen.getByText(/truly paid/i)).toBeInTheDocument();
    expect(screen.getByText(/on trial, paid, or inherited access/i)).toBeInTheDocument();
    expect(screen.getByText(/not true paid accounts/i)).toBeInTheDocument();
  });

  it('shows a founder Today Queue with email and support triage items', () => {
    render(
      <AdminOverviewTab
        overview={{
          totalUsers: 10,
          freeUsers: 8,
          plusUsers: 1,
          familyUsers: 1,
          subscriptionStatus: { active: 1, trialing: 1 },
          paidUsers: 2,
          activePlus: 1,
          activeFamily: 0,
          subscribedPlus: 1,
          subscribedFamily: 1,
          mrr: 9.99,
          arr: 119.88,
          conversionRate: 20,
          newUsersToday: 1,
          newUsersThisWeek: 2,
          newUsersThisMonth: 3,
          unverifiedEmails: 2,
          expiringTrialsCount: 1,
          expiringTrials: [{
            id: 5,
            email: 'trial@example.com',
            name: 'Trial User',
            plan: 'family',
            createdAt: Date.now(),
          }],
          pastDueCount: 0,
          pastDueUsers: [],
          totalReferrals: 0,
          usersWithReferrals: 0,
          totalDonationRecords: 0,
          recentSignups: [],
          usersMissingProfileInfo: 3,
          usersMissingPhone: 2,
          usersMissingLocation: 1,
        }}
        featureUsage={null}
        analytics={null}
        emailLogStats={{ totalSent: 5, totalFailed: 1, totalElements: 6 }}
        onboardingTrial={null}
        setOnboardingTrial={() => undefined}
        trialSettingsSaving={false}
        onSaveOnboardingTrial={() => undefined}
        fmtMoney={(n) => `$${n.toFixed(2)}`}
        setActiveTab={() => undefined}
        setUserFilter={() => undefined}
        setSearch={() => undefined}
        onUsersQueryChange={() => undefined}
        openUser={() => undefined}
      />,
    );

    expect(screen.getByText('Today Queue')).toBeInTheDocument();
    expect(screen.getByText('Failed emails')).toBeInTheDocument();
    expect(screen.getByText('Refund / offer lookup')).toBeInTheDocument();
    expect(screen.getByText('Trial User')).toBeInTheDocument();
  });

  it('normalizes seconds timestamps and hides impossible admin dates', () => {
    expect(fmtFullTs(1768994132)).not.toContain('1970');
    expect(fmtFullTs(1768994132)).not.toBe('—');
    expect(fmtFullTs(1769470)).toBe('—');
  });

  it('hides Users table security details until explicitly enabled', () => {
    render(
      <AdminUsersTab
        usersData={{
          users: [],
          count: 1,
          page: 0,
          size: 50,
          totalElements: 1,
          totalPages: 1,
        }}
        filteredUsers={[{
          id: 42,
          email: 'support@example.com',
          name: 'Support User',
          plan: 'free',
          emailVerified: true,
          emailVerifiedAt: 1768994132,
          createdAt: 1768994132000,
          lastLoginIp: '203.0.113.42',
          loginCount: 1,
        }]}
        search=""
        setSearch={() => undefined}
        userFilter="all"
        setUserFilter={() => undefined}
        page={0}
        setPage={() => undefined}
        loadData={() => undefined}
        sortBy="createdAt"
        sortDir="desc"
        countryFilter=""
        activityFilter=""
        onQueryChange={() => undefined}
        openUser={() => undefined}
      />,
    );

    expect(screen.queryByText('Login IP')).not.toBeInTheDocument();
    expect(screen.queryByText('203.0.113.42')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('Security details'));
    expect(screen.getByText('Login IP')).toBeInTheDocument();
    expect(screen.getByText('203.0.113.42')).toBeInTheDocument();
  });

  it('auto-loads deleted users and labels privacy-redacted rows clearly', async () => {
    adminGetDeletedUsersMock.mockResolvedValue({
      users: [
        {
          originalUserId: 42,
          email: 'redacted+42@deleted.local',
          deletionDate: Date.now(),
          deletionSource: 'self',
          planAtDeletion: 'plus',
        },
      ],
    });
    adminGetChurnAnalysisMock.mockResolvedValue({
      total_deleted: 1,
      remarketing_eligible: 0,
    });

    render(<AdminDeletedTab toast={() => undefined} />);

    await waitFor(() => {
      expect(adminGetDeletedUsersMock).toHaveBeenCalledTimes(1);
      expect(adminGetChurnAnalysisMock).toHaveBeenCalledTimes(1);
    });

    // R41 stability fix: the API mocks resolve, but the component's
    // re-render after setState happens on the next tick — using
    // synchronous `getByText` here was racing the render and producing
    // intermittent flakes ("Unable to find element with text User #42")
    // that we hit ~30% of CI runs across PR #58, #63, #65, etc.
    // `findByText` retries until the assertion passes or its 1-second
    // default timeout expires; that timeout is plenty for a synchronous
    // setState→render that's already happening "any moment now".
    expect(await screen.findByText('User #42')).toBeInTheDocument();
    expect(await screen.findByText(/identity redacted by privacy-default deletion flow/i)).toBeInTheDocument();
    expect(await screen.findByText(/deleted today/i)).toBeInTheDocument();
  });
});
