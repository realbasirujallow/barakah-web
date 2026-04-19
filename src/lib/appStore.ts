/**
 * Canonical app-store URLs and launch flags for Barakah's mobile apps.
 *
 * Single source of truth — import from here rather than hardcoding URLs
 * across pages. When the Android production launch completes on Play
 * Console, set IS_ANDROID_PUBLICLY_LAUNCHED = true and the Google Play
 * buttons across the site will activate automatically.
 */

/** Apple App Store listing — live in production. */
export const IOS_APP_STORE_URL =
  'https://apps.apple.com/us/app/barakah-islamic-finance/id6761279229';

/** Google Play Store listing — works only once the app has a PRODUCTION
 *  track release live on the public Play Store. Right now the app is in
 *  Closed testing (alpha, 20-tester cap) so this URL returns "app not
 *  available" for anyone not opted in. Left in place so the URL works
 *  automatically the moment production launch completes. */
export const ANDROID_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.trybarakah.app';

/** True when the public Play Store listing actually exists. Flip this to
 *  `true` (and remove the fallback link) the moment the Production track
 *  goes live. */
export const IS_ANDROID_PUBLICLY_LAUNCHED = false;

/** Fallback when IS_ANDROID_PUBLICLY_LAUNCHED is false — route Android
 *  CTAs to the /open page which tells honest users "Android is in final
 *  testing; web app works great meanwhile." */
export const ANDROID_FALLBACK_URL = '/open';

/** The URL a Google Play CTA should link to today. Resolves to the Play
 *  Store listing after public launch, or the /open page otherwise. */
export const ANDROID_CTA_URL: string = IS_ANDROID_PUBLICLY_LAUNCHED
  ? ANDROID_PLAY_STORE_URL
  : ANDROID_FALLBACK_URL;
