export interface SubscriptionStatusLike {
  plan?: 'free' | 'plus' | 'family' | string | null;
  status?: string | null;
  hasSubscription?: boolean | null;
}

export function hasPaidSyncAccess(status: SubscriptionStatusLike | null | undefined): boolean {
  if (!status) return false;
  if (status.hasSubscription === true) return true;

  const plan = (status.plan || '').toLowerCase();
  const subscriptionStatus = (status.status || '').toLowerCase();
  const hasPaidPlan = plan === 'plus' || plan === 'family';

  if (!hasPaidPlan) return false;

  return ['active', 'trial', 'trialing', 'past_due'].includes(subscriptionStatus);
}
