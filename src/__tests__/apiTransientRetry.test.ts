import { afterEach, describe, expect, it, vi } from 'vitest';

import { apiFetch } from '../lib/api';

describe('apiFetch transient GET retries', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('recovers a safe GET after transient gateway failures', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response('', { status: 502 }))
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/api/example')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('does not replay a write after a gateway failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/api/example', { method: 'PUT', body: '{}' }))
      .rejects.toThrow('API error 503');
    const writeCalls = fetchMock.mock.calls.filter(([url]) => url === '/api/example');
    expect(writeCalls).toHaveLength(1);
  });
});
