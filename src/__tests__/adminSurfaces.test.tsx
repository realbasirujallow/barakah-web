import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AnnualUpgradeBanner from '../components/AnnualUpgradeBanner';
import AnnualUpgradeModal from '../components/AnnualUpgradeModal';
import { AdminDeletedTab } from '../components/admin/AdminDeletedTab';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';

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
