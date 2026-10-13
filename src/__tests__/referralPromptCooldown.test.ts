import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { useReferralPrompt, REFERRAL_PROMPT_COOLDOWN_MS } from '../components/ReferralPromptModal';

describe('referral prompt cooldown', () => {
  let items: Map<string, string>;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-13T12:00:00Z'));
    items = new Map();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => items.set(key, value),
    });
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('waits 15 seconds, then dismissing prevents a repeat after remount', () => {
    const first = renderHook(() => useReferralPrompt());
    act(() => vi.advanceTimersByTime(14999));
    expect(first.result.current.show).toBe(false);
    act(() => vi.advanceTimersByTime(1));
    expect(first.result.current.show).toBe(true);
    act(() => first.result.current.dismiss());
    first.unmount();
    const second = renderHook(() => useReferralPrompt());
    act(() => vi.advanceTimersByTime(20000));
    expect(second.result.current.show).toBe(false);
  });

  it('allows another prompt after 30 days', () => {
    items.set('barakah_referral_prompt_last_shown', String(Date.now() - REFERRAL_PROMPT_COOLDOWN_MS));
    const hook = renderHook(() => useReferralPrompt());
    act(() => vi.advanceTimersByTime(15000));
    expect(hook.result.current.show).toBe(true);
  });

  it('migrates a legacy dismissal without showing the prompt', async () => {
    vi.resetModules();
    const { useReferralPrompt: freshHook } = await import('../components/ReferralPromptModal');
    items.set('barakah_referral_prompted', 'true');
    const hook = renderHook(() => freshHook());
    act(() => vi.advanceTimersByTime(15000));
    expect(hook.result.current.show).toBe(false);
    expect(items.get('barakah_referral_prompt_last_shown')).toBe(String(Date.now() - 15000));
  });
});
