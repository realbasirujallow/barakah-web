import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('signup acquisition attribution headers', () => {
  beforeEach(() => {
    vi.resetModules();
    window.sessionStorage.clear();
    const local = new Map<string, string>();
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => local.get(key) ?? null,
        setItem: (key: string, value: string) => local.set(key, value),
      },
    });
    window.history.replaceState({}, '', '/signup?utm_source=ramadan-ig&utm_medium=paid&utm_campaign=launch');
    Object.defineProperty(document, 'referrer', {
      value: 'https://www.google.com/search?q=barakah+app',
      configurable: true,
    });
    document.cookie = 'XSRF-TOKEN=test-token; path=/';
  });

  it('forwards captured acquisition context on /auth/signup', async () => {
    const fetchSpy = vi.fn(async () => new Response('{}', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    global.fetch = fetchSpy;

    const { api, captureAcquisitionFromUrl, setSelfReportedSource } = await import('../lib/api');
    captureAcquisitionFromUrl();
    setSelfReportedSource('mosque_or_community');

    await api.signup(
      'Basiru Jallow',
      'basiru@example.com',
      'StrongPassword123!',
      'Indiana',
      'US',
    );

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, options] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const headers = (options?.headers ?? {}) as Record<string, string>;

    expect(headers['X-App-UTM-Source']).toBe('ramadan-ig');
    expect(headers['X-App-UTM-Medium']).toBe('paid');
    expect(headers['X-App-UTM-Campaign']).toBe('launch');
    expect(headers['X-App-Landing-Path']).toBe('/signup');
    expect(headers['X-App-Referer']).toBe('https://www.google.com/search?q=barakah+app');
    expect(headers['X-App-Self-Source']).toBe('mosque_or_community');
  });
});
