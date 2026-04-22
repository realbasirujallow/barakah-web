/**
 * Shared types for the admin dashboard. These mirror the JSON shapes returned
 * by `/admin/*` endpoints and are imported by the admin page + its tab
 * components (AdminOverviewTab, AdminUsersTab, AdminAlertsTab, etc.).
 *
 * Extracted from `app/dashboard/admin/page.tsx` during the file-split refactor.
 * No wire-format changes — same fields, same types.
 */

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  plan: string;
  subscriptionStatus?: string;
  planExpiresAt?: number;
  emailVerified?: boolean;
  emailVerifiedAt?: number;
  referralCount?: number;
  referralClickCount?: number;
  hasStripe?: boolean;
  createdAt: number;
  updatedAt?: number;
  lastLoginAt?: number;
  lastSeenAt?: number;
  lastPlatform?: string;
  lastAppVersion?: string;
  lastLoginIp?: string;
  signupIp?: string;
  signupSource?: string;
  loginCount?: number;
  country?: string;
  state?: string;
  phoneNumber?: string;
}

export interface OnboardingTrialSettings {
  enabled: boolean;
  plan: string;
  durationDays: number;
}

export interface LifecycleRecentEvent {
  id: number;
  eventType: string;
  source?: string;
  createdAt: number;
}

export interface EmailLogEntry {
  id: number;
  userId?: number;
  toEmail: string;
  emailType: string;
  subject?: string;
  status: 'sent' | 'failed';
  errorMessage?: string;
  createdAt: number;
}

export interface EmailLogStats {
  totalSent: number;
  totalFailed: number;
  totalElements: number;
}

export interface UserLifecycleSummary {
  recentEvents?: LifecycleRecentEvent[];
  countsByType?: Record<string, number>;
  hasCompletedSetup?: boolean;
  hasReviewedTransactions?: boolean;
  hasLinkedBankAccount?: boolean;
}

export interface UserActivity {
  assets?: number;
  debts?: number;
  transactions?: number;
  budgets?: number;
  savingsGoals?: number;
  wasiyyah?: number;
  wasiyyahObligations?: number;
  hawlTrackers?: number;
  sadaqah?: number;
  waqfContributions?: number;
  zakatPayments?: number;
  zakatSnapshots?: number;
  linkedBankAccounts?: number;
  lastLoginAt?: number;
  lastSeenAt?: number;
  lastPlatform?: string;
  lastAppVersion?: string;
  lifecycle?: UserLifecycleSummary;
}

export type ActivityCountKey =
  | 'assets'
  | 'debts'
  | 'transactions'
  | 'budgets'
  | 'savingsGoals'
  | 'wasiyyah'
  | 'wasiyyahObligations'
  | 'hawlTrackers'
  | 'sadaqah'
  | 'waqfContributions'
  | 'zakatPayments'
  | 'zakatSnapshots'
  | 'linkedBankAccounts';

export interface UsersResponse {
  users: AdminUser[];
  count: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Overview {
  totalUsers: number;
  freeUsers: number;
  plusUsers: number;
  familyUsers: number;
  subscriptionStatus: Record<string, number>;
  paidUsers: number;
  activePlus: number;
  activeFamily: number;
  subscribedPlus: number;
  subscribedFamily: number;
  mrr: number;
  arr: number;
  conversionRate: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  unverifiedEmails: number;
  expiringTrialsCount: number;
  expiringTrials: AdminUser[];
  pastDueCount: number;
  pastDueUsers: AdminUser[];
  totalReferrals: number;
  usersWithReferrals: number;
  totalDonationRecords: number;
  recentSignups: AdminUser[];
  countryDistribution?: Record<string, number>;
  stateDistribution?: Record<string, number>;
  usersMissingPhone?: number;
  usersMissingLocation?: number;
  usersMissingProfileInfo?: number;
}

export type UserFilter =
  | 'all'
  | 'unverified'
  | 'past_due'
  | 'trialing'
  | 'missing_phone'
  | 'missing_location'
  | 'paying';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'alerts'
  | 'unverified'
  | 'lifecycle'
  | 'experiments'
  | 'deleted'
  | 'email-log';

/** Feature flag metadata returned by /admin/feature-flags. */
export interface AdminFeatureFlag {
  id?: number;
  name: string;
  description?: string;
  /** Raw JSONB string from the server; parsed into variants[] on the client. */
  variants: string;
  /** Optional segment predicate JSON. null = all users. */
  segment?: string | null;
  status: 'draft' | 'active' | 'ended';
  defaultVariant: string;
  createdBy?: number | null;
  createdAt: number;
  updatedAt: number;
  endedAt?: number | null;
}

export interface FeatureFlagVariantRow {
  variant: string;
  cohort: number;
  converted: number;
  conversionRate: number;
}

export interface FeatureFlagResults {
  flagName: string;
  outcomeEvent: string;
  variants: FeatureFlagVariantRow[];
}
