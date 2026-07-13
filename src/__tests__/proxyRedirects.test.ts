// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';

describe('proxy stale URL redirects', () => {
  it.each([
    'https://trybarakah.com/enh1rEfty+X37BXpLw2tQ==',
    'https://trybarakah.com/enh1rEfty%2BX37BXpLw2tQ%3D%3D',
  ])('redirects the GSC 404 URL variant %s', (url) => {
    const response = proxy(new NextRequest(url));

    expect(response.status).toBe(308);
    expect(response.headers.get('location')).toBe(
      'https://trybarakah.com/compare/barakah-vs-acorns',
    );
  });
});
