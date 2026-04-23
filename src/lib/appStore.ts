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

/** Google Play Store listing — LIVE. Google Play production approval
 *  completed 2026-04-21 after the Closed-testing (alpha, 20-tester cap)
 *  phase. The Play Store URL now resolves for any public visitor. */
export const ANDROID_PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.trybarakah.app';

/** True when the public Play Store listing actually exists. Flipped on
 *  2026-04-21 when Production track went live. The Play Store buttons
 *  across the site (homepage CTA, /open page, footer social-icon strip)
 *  now activate automatically — no further code changes required when
 *  you publish a Play Store update. */
export const IS_ANDROID_PUBLICLY_LAUNCHED = true;

/** Fallback when IS_ANDROID_PUBLICLY_LAUNCHED is false — route Android
 *  CTAs to the /open page which tells users "Android app is temporarily
 *  unavailable; use the web dashboard meanwhile." Used only if the
 *  Play Store listing is pulled post-launch, since Android went live
 *  2026-04-21. */
export const ANDROID_FALLBACK_URL = '/open';

/** The URL a Google Play CTA should link to today. Resolves to the Play
 *  Store listing after public launch, or the /open page otherwise. */
export const ANDROID_CTA_URL: string = IS_ANDROID_PUBLICLY_LAUNCHED
  ? ANDROID_PLAY_STORE_URL
  : ANDROID_FALLBACK_URL;
