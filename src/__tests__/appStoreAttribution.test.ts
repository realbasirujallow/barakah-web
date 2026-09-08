import { describe, expect, it } from 'vitest';
import { androidPlayStoreUrl, iosAppStoreUrl } from '../lib/appStore';

describe('app store attribution links', () => {
  it('adds Apple ct attribution without changing the canonical app id', () => {
    const url = new URL(iosAppStoreUrl({
      source: 'email',
      medium: 'footer',
      campaign: 'app_install',
      content: 'inline',
    }));

    expect(url.hostname).toBe('apps.apple.com');
    expect(url.pathname).toBe('/us/app/barakah-islamic-finance/id6761279229');
    expect(url.searchParams.get('ct')).toBe('barakah_email_footer_app_install_inline');
    expect(url.searchParams.get('mt')).toBe('8');
  });

  it('adds Google Play install-referrer UTM values', () => {
    const url = new URL(androidPlayStoreUrl({
      source: 'email',
      medium: 'footer',
      campaign: 'app_install',
      content: 'inline',
    }));
    const referrer = new URLSearchParams(url.searchParams.get('referrer') ?? '');

    expect(url.hostname).toBe('play.google.com');
    expect(url.searchParams.get('id')).toBe('com.trybarakah.app');
    expect(referrer.get('utm_source')).toBe('email');
    expect(referrer.get('utm_medium')).toBe('footer');
    expect(referrer.get('utm_campaign')).toBe('app_install');
    expect(referrer.get('utm_content')).toBe('inline');
  });
});
