// @vitest-environment node

import { describe, expect, it } from 'vitest';
import robots from '../app/robots';
import { metadata as signupMetadata } from '../app/signup/layout';

describe('SEO crawl signals', () => {
  it('lets crawlers fetch dashboard pages so proxy noindex headers can deindex them', () => {
    const config = robots();
    const rules = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    const disallow = Array.isArray(rules.disallow) ? rules.disallow : [rules.disallow];

    expect(disallow).not.toContain('/dashboard/');
    expect(disallow).toEqual(expect.arrayContaining(['/admin/', '/api/', '/auth/']));
  });

  it('keeps signup indexable with a self canonical', () => {
    expect(signupMetadata.robots).toEqual({ index: true, follow: true });
    expect(signupMetadata.alternates).toEqual({
      canonical: 'https://trybarakah.com/signup',
    });
  });
});
