import { describe, expect, it } from 'vitest';
import { isReferralPromptEligible } from '../components/ReferralPromptModal';

describe('isReferralPromptEligible', () => {
  it('waits for dashboard data instead of showing during the loading gap', () => {
    expect(isReferralPromptEligible(true, false)).toBe(false);
    expect(isReferralPromptEligible(false, false)).toBe(false);
    expect(isReferralPromptEligible(false, true)).toBe(true);
  });
});
