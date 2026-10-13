import { describe, expect, it } from 'vitest';
import { isReferralPromptEligible, isReferralPromptDue, REFERRAL_PROMPT_COOLDOWN_MS } from '../components/ReferralPromptModal';

describe('isReferralPromptEligible', () => {
  it('waits for dashboard data instead of showing during the loading gap', () => {
    expect(isReferralPromptEligible(true, false)).toBe(false);
    expect(isReferralPromptEligible(false, false)).toBe(false);
    expect(isReferralPromptEligible(false, true)).toBe(true);
  });
  it('suppresses repeat visits until the 30-day cooldown ends', () => {
    const now = 1800000000000;
    expect(isReferralPromptDue(0, now)).toBe(true);
    expect(isReferralPromptDue(now, now)).toBe(false);
    expect(isReferralPromptDue(now - REFERRAL_PROMPT_COOLDOWN_MS + 1, now)).toBe(false);
    expect(isReferralPromptDue(now - REFERRAL_PROMPT_COOLDOWN_MS, now)).toBe(true);
    expect(isReferralPromptDue(now + 1000, now)).toBe(false);
  });
});
