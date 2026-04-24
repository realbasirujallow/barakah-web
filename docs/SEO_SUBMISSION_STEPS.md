# SEO submission checklist (one-time setup)

Barakah's on-page SEO is already strong (see `src/app/sitemap.ts`, `src/app/robots.ts`, root `layout.tsx`). The only step left is telling each search engine that the site exists, then handing them the sitemap. Once done, they will continue to pull our `/sitemap.xml` on their own cadence.

Google and Bing both deprecated the anonymous "sitemap ping" URL in the last two years, so a manual submission through the webmaster console is now the only path. This is a five-minute one-time job.

## 1. Google Search Console

1. Open https://search.google.com/search-console
2. Add property → **Domain** → `trybarakah.com`
3. DNS verification: follow the TXT record prompt. Add via your DNS provider (Cloudflare / Railway).
4. Once the property is verified, copy the `google-site-verification` token from the **HTML tag** option and set it as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Railway + Vercel. Next deploy will emit the tag on every page.
5. In the left nav, open **Sitemaps** → enter `sitemap.xml` → **Submit**.
6. Optional but recommended: request indexing of the homepage + `/zakat-calculator` + `/learn` manually via the URL inspection tool (top search bar).

## 2. Bing Webmaster Tools

1. Open https://www.bing.com/webmasters
2. Add site → `https://trybarakah.com`
3. Verification: either **Import from Google Search Console** (fastest) or use the `meta` option and set `NEXT_PUBLIC_BING_SITE_VERIFICATION` in Railway.
4. Once verified → **Sitemaps** → submit `https://trybarakah.com/sitemap.xml`.
5. Turn on **IndexNow** in the Bing Webmaster settings and generate an IndexNow key. Copy it into `INDEXNOW_KEY` in Railway (server-side env, NOT public). Next deploy enables the `/seo/indexnow` endpoint and the `/indexnow-key.txt` verifier.
6. To submit a URL manually any time: `curl -X POST https://trybarakah.com/seo/indexnow -d '{"urls":["https://trybarakah.com/learn/halal-budgeting"]}' -H 'content-type: application/json'`.

## 3. Yandex Webmaster (optional, helps for MENA + CIS traffic)

1. https://webmaster.yandex.com/
2. Verify via the same meta tag approach; save the token as `NEXT_PUBLIC_YANDEX_VERIFICATION` in Railway.
3. Submit `sitemap.xml`.
4. Yandex accepts IndexNow submissions too — no additional key needed, the Bing-issued key works cross-engine.

## 4. Apple App Site Association (already live)

`/.well-known/apple-app-site-association` is served so Safari universal-links open the iOS app on tap. No action required; see `public/.well-known/` for the file.

## 5. Ongoing signal strength

- Every time a new page is added, the dynamic sitemap picks it up automatically (no code edit).
- Every time a high-value page (seasonal Ramadan, new ticker, zakat-boundary year-over) is pushed to prod, hit `/seo/indexnow` with the URL to get same-hour crawl attention from Bing + Yandex.
- Rich-result eligibility tracker: https://search.google.com/test/rich-results — paste any prod URL and Google lists which schemas rendered. Every /learn/\* page should produce Article + FAQPage + BreadcrumbList.
