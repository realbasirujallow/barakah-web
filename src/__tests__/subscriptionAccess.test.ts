import { describe, it, expect } from 'vitest';
import { hasPaidSyncAccess } from '../lib/subscription';

// hasPaidSyncAccess is an ENTITLEMENT GATE (paid bank-sync / Plus+Family
// features). A regression = wrongful paywall or wrongful unlock. Memory:
// a past PlanGate bug ignored `hasSubscription` → admins/family saw the
// paywall. These tests lock the contract.

describe('hasPaidSyncAccess', () => {
  it('denies on null/undefined/empty status', () => {
    expect(hasPaidSyncAccess(null)).toBe(false);
    expect(hasPaidSyncAccess(undefined)).toBe(false);
    expect(hasPaidSyncAccess({})).toBe(false);
  });

  it('grants whenever hasSubscription === true, regardless of plan/status (the PlanGate fix)', () => {
    expect(hasPaidSyncAccess({ hasSubscription: true })).toBe(true);
    expect(hasPaidSyncAccess({ hasSubscription: true, plan: 'free', status: 'canceled' })).toBe(true);
  });

  it('grants paid plans in an active-ish status', () => {
    for (const plan of ['plus', 'family']) {
      for (const status of ['active', 'trial', 'trialing', 'past_due']) {
        expect(hasPaidSyncAccess({ plan, status })).toBe(true);
      }
    }
  });

  it('denies paid plans in a non-active status or with no status', () => {
    expect(hasPaidSyncAccess({ plan: 'plus', status: 'canceled' })).toBe(false);
    expect(hasPaidSyncAccess({ plan: 'plus', status: 'expired' })).toBe(false);
    expect(hasPaidSyncAccess({ plan: 'family', status: 'incomplete' })).toBe(false);
    expect(hasPaidSyncAccess({ plan: 'plus' })).toBe(false);
  });

  it('denies free plan even when active', () => {
    expect(hasPaidSyncAccess({ plan: 'free', status: 'active' })).toBe(false);
    expect(hasPaidSyncAccess({ plan: '', status: 'active' })).toBe(false);
  });

  it('is case-insensitive on plan and status', () => {
    expect(hasPaidSyncAccess({ plan: 'PLUS', status: 'ACTIVE' })).toBe(true);
    expect(hasPaidSyncAccess({ plan: 'Family', status: 'Trialing' })).toBe(true);
  });

  it('a false/nullish hasSubscription does NOT block a valid paid plan', () => {
    expect(hasPaidSyncAccess({ hasSubscription: false, plan: 'plus', status: 'active' })).toBe(true);
    expect(hasPaidSyncAccess({ hasSubscription: null, plan: 'family', status: 'trialing' })).toBe(true);
  });
});
