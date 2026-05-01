// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

describe('auth proxy attribution forwarding', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.BACKEND_URL = 'https://api.trybarakah.com';
  });

  it('forwards acquisition and locale headers to the backend auth service', async () => {
    const fetchSpy = vi.fn(async () => new Response('{}', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    global.fetch = fetchSpy;

    const route = await import('../app/auth/[...path]/route');
    const request = new NextRequest('https://trybarakah.com/auth/signup', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept-language': 'ar,en;q=0.8',
        'user-agent': 'Mozilla/5.0',
        'x-app-utm-source': 'ramadan-ig',
        'x-app-utm-medium': 'paid',
        'x-app-landing-path': '/signup',
        'x-app-session-id': 's_session123',
        'x-app-visitor-id': 'v_visitor123',
        'x-app-referer': 'https://www.google.com/search?q=barakah',
        referer: 'https://trybarakah.com/signup',
      },
      body: JSON.stringify({ email: 'basiru@example.com' }),
    });

    await route.POST(request, { params: Promise.resolve({ path: ['signup'] }) });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, options] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit];
    const headers = options?.headers as Headers;

    expect(headers.get('Accept-Language')).toBe('ar,en;q=0.8');
    expect(headers.get('User-Agent')).toBe('Mozilla/5.0');
    expect(headers.get('X-App-UTM-Source')).toBe('ramadan-ig');
    expect(headers.get('X-App-UTM-Medium')).toBe('paid');
    expect(headers.get('X-App-Landing-Path')).toBe('/signup');
    expect(headers.get('X-App-Session-Id')).toBe('s_session123');
    expect(headers.get('X-App-Visitor-Id')).toBe('v_visitor123');
    expect(headers.get('X-App-Referer')).toBe('https://www.google.com/search?q=barakah');
    expect(headers.get('Referer')).toBe('https://trybarakah.com/signup');
  });
});
