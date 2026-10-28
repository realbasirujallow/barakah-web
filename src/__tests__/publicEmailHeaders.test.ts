// @vitest-environment node
import { describe, expect, it } from 'vitest';
import config from '../../next.config';

describe('public contact HTML integrity', () => {
  it('prevents edge email rewrites without touching private dashboard caching', async () => {
    const headers = await config.headers?.();
    const protectedRoutes = headers?.filter(rule => rule.headers.some(header =>
      header.key === 'Cache-Control' && header.value.includes('no-transform')));
    expect(protectedRoutes).toHaveLength(2);
    expect(protectedRoutes?.map(rule => rule.source).join(' ')).not.toContain('dashboard');
    expect(protectedRoutes?.every(rule => rule.headers.some(header =>
      header.value === 'no-cache, no-transform'))).toBe(true);
  });
});
