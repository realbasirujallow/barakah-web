# Barakah — Project Brief

> Drop this at the start of any new Claude or ChatGPT session. Update it as the project evolves and commit changes to git so both AIs always read the same truth.

Lives at: `~/Documents/BasiruDEV/Barakah/PROJECT_BRIEF.md`. Mirrored into the three repos as needed for git-tracked context.

---

## What is Barakah

Barakah is the most comprehensive Islamic finance tracker available. It helps Muslims manage wealth in line with Shariah: Zakat calculation, Hawl tracking, Riba detection, halal stock screening, Sadaqah / Waqf / Wasiyyah / Faraid, plus standard finance (assets, transactions, budgets, debts, bills, savings goals, recurring, analytics).

- **Live**: https://trybarakah.com (web + dashboard) · https://api.trybarakah.com (backend) · APK ready · iOS in build cycle
- **Owner**: Basiru Jallow (solo founder/dev, longsmile2012@gmail.com)
- **Positioning**:
  - vs Islamic finance apps (Wahed, Zoya, IslamicFinanceGuru) → **~99%** (most complete on the market — only one with Hawl, Faraid, Riba detector, Wasiyyah, Waqf all in one place)
  - vs Mint / Monarch → **~95%** functional parity. Gap items are deliberate (no credit-score monitoring — riba avoidance) or low-priority (no TurboTax handoff). Polish is at Monarch tier after R41–R45.

---

## Architecture

Three sibling git repos, one project root at `~/Documents/BasiruDEV/Barakah/`. **The parent directory itself is not a git repo** — each child is independent with its own `origin`.

| Component | Stack | Folder | Deploy |
|---|---|---|---|
| Backend API | Spring Boot 3.4, Java 17, PostgreSQL, Flyway | `barakah-backend` | Railway → https://api.trybarakah.com |
| Mobile App | Flutter 3.41, Dart 3.11 | `barakah_app` | APK shipped · iOS in TestFlight cycle |
| Web Dashboard + Marketing | Next.js 16, React 19, Tailwind 4, shadcn/ui | `barakah-web` | Vercel → https://trybarakah.com (one app serves both `/` marketing pages and `/dashboard` app) |
| Marketing assets | Static — App Store screenshots, social, press kit | `marketing` | Not deployed; source for app-store / social uploads |

**Sibling note**: there are also some throwaway / experimental sibling dirs in the project root (`barakah-kids`, `barakah-web-mainfix`, `barakah-web-traffic`, `archive`, `research`). Ignore unless explicitly asked.

---

## Feature Scorecard

Updated 2026-05-01 to reflect current web parity work (R41–R45 shipped this week).

| Feature | Backend | Mobile | Web |
|---|---|---|---|
| Auth (signup/login + biometrics) | ✅ | ✅ | ✅ |
| Assets | ✅ CRUD | ✅ + live prices | ✅ CRUD |
| Transactions | ✅ + recurring + Plaid sync | ✅ | ✅ CRUD + needs-review queue + ⌘K search + date grouping (R44) |
| Budgets | ✅ | ✅ | ✅ CRUD |
| Debts | ✅ + payments | ✅ | ✅ CRUD |
| Bills | ✅ + mark paid | ✅ | ✅ CRUD |
| Zakat Calculator | ✅ | ✅ | ✅ |
| Hawl Tracker | ✅ + nisab continuity | ✅ Hero animation (R42) | ✅ |
| Sadaqah | ✅ + stats | ✅ | ✅ |
| Wasiyyah (Islamic will) | ✅ | ✅ | ✅ |
| Faraid (inheritance calculator) | ✅ | — | ✅ (Plus gated) |
| Waqf (endowment) | ✅ | ✅ | ✅ |
| Savings Goals | ✅ | ✅ | ✅ + dashboard "Top Priorities" widget (R45) |
| Halal Stock Screener | ✅ | ✅ | ✅ |
| Riba Detector | ✅ | ✅ | ✅ |
| Auto-Categorization | ✅ | ✅ | ✅ + Re-categorize button |
| Subscription Detector | ✅ | — | ✅ (Plus) |
| Live Prices (CoinGecko / Finnhub) | ✅ | ✅ | ✅ /market-prices |
| Prayer Times (Aladhan API) | — | ✅ | ✅ |
| Hijri date / Islamic calendar | ✅ (server-authoritative) | ✅ | ✅ topbar across every dashboard page (R44) |
| PDF / CSV Reports | ✅ | ✅ | ✅ |
| Analytics / Charts (Recharts / fl_chart) | — | ✅ | ✅ /analytics + /summary with month drill-down sheet |
| Family / Shared Finances | ✅ | ✅ | ✅ (Family plan) |
| Plaid bank-sync | ✅ | — | ✅ /import + transaction badges |
| Offline cache (SQLite + SharedPrefs) | — | ✅ | — |
| Dark Mode | — | ✅ | ✅ |
| Multi-Currency | ✅ 40 currencies | ✅ 40 | ✅ 40 |
| i18n / RTL | ✅ 13 languages, 32 email templates | ✅ en/fr/ar/ur | ✅ |
| Hero shared-element transitions | — | ✅ Native Hero (R41–R42) | ✅ View Transitions API on 7 dashboard cards + sidebar cross-fade (R41–R45) |
| Custom empty-state illustrations | — | ✅ | ✅ 12 of 14 pages (R40) |
| Microinteraction polish | — | ✅ Cupertino + haptics | ✅ Hover utilities, KPI sparklines (R40) |
| Admin tooling | ✅ Email queue diagnostic + unstick (R39), drilldowns, churn analysis | — | ✅ /dashboard/admin/* (founder-gated) |
| Onboarding tour / paywall | ✅ | ✅ | ✅ Trial banner + annual upgrade modals |

---

## Recent shipping log (most recent first)

This is the running log future sessions need to see "what's been done lately" without reading every PR. Keep it short — 2–3 lines per release.

- **R45 (2026-05-01) — Monarch dashboard borrows.** WeeklyRecap card (greeting + last-week date range + multi-stat + insights), TopPriorities (savings goals with progress bars), AdviceQueue (warning/info/suggestion cards derived from existing widget data, 4-card cap, 7 unit tests pin priority rules). Web PR #71.
- **R44 (2026-05-01) — Founder-feedback batch.** (a) Honest referral copy ("Earn a free extra month for every friend who joins" — was misleading "$4.99 first month" framing), (b) Hijri date in shared topbar across every dashboard page, (c) Mark-as-recurring action on transactions with violet pill, (d) Analytics donut overlap fix (center total + 2-col legend), (e) Transactions: prominent search bar with ⌘K hint + Monarch-style date grouping with daily nets. Web PR #70, mobile PR #21.
- **R43 (2026-05-01) — View Transitions Step 5.** Spending card → /summary hero pairing + sidebar cross-fade via HeroLink + onBeforeNavigate prop. Web PR #68.
- **R42 (2026-05-01) — More hero pairings.** Budget · Bills · Transactions web cards → detail-page heroes. Hawl Countdown card → Hawl tracker banner (mobile). HeroLink heroName became optional to support nested links inside cards that already own the morph target. Web PR #67, mobile PR #20.
- **R41 (2026-05-01) — View Transitions API.** First batch of shared-element morphs: Net Worth · Zakat · Spending dashboard cards → detail pages. New `useViewTransition` hook + `HeroLink` component + globals.css transitions tuned to 320ms ease-out for named heroes / 200ms for root cross-fade / `prefers-reduced-motion` short-circuit. Mobile equivalent uses native Flutter `Hero` widget. Web PR #65, mobile PR #19.
- **R40 (2026-05-01) — Inline-SVG illustrations + microinteraction utilities.** 12 of 14 empty states now have custom scenes (centralised in `Illustrations.tsx`); hover/transition utilities in `globals.css`. Web PR #64.
- **R39 (2026-05-01) — Backend admin email-queue diagnostic.** Endpoints to inspect + unstick abandoned email-retry entries. Triggered by founder report that mar.jallow25@gmail.com couldn't get password-reset emails (root cause: dispatcher silent-fail-on-exhaustion with no recovery). Auto-unstick now wires into the reset-password flow. Backend PR #23.
- **TikTok app rejection fix (2026-05-01).** TikTok rejected our developer-portal app submission because Terms of Service + Privacy Policy weren't easily accessible from the homepage. Both pages already existed at `/terms` and `/privacy`; just no footer linking them. Replaced the single-line compare-only homepage footer with a proper SaaS-style three-column footer (Compare / Legal / Company). Web PR #69. Resubmitted on TikTok dev portal.
- **Earlier (R37 admin drilldowns, R38 Monarch parity polish, etc.)**: see git log for full history.

---

## Current status — last updated 2026-05-01

- ~99% feature-complete vs Islamic finance competitors. Founder positioning: "the financial home our families actually need."
- Polish parity with Monarch is now in: hero animations, sidebar cross-fade, microinteraction hovers, custom empty-state illustrations, Recharts donut UX matching, dashboard advice queue + weekly recap.
- iOS build cycle ongoing — `IPHONEOS_DEPLOYMENT_TARGET` enforced 13.0 via `post_install` hook in `barakah_app/ios/Podfile`.
- Android APK shipped.
- Web dashboard + marketing site share the Next.js app at `trybarakah.com`. SEO has 16+ comparison pages (vs Mint, Monarch, YNAB, Zoya, Wahed, Empower, RocketMoney, etc).
- Email retry queue dead-end fixed (R39). Production verified — `/admin/users/{id}/email-queue` returns 401 (live + auth-gated).
- TikTok developer-portal app submission resubmitted after the homepage-footer fix (PR #69) deployed.

### Next milestones

Priority order — adjust as the founder pivots:

1. **iOS App Store submission** — TestFlight build + screenshots + listing copy.
2. **Play Store submission** — APK is ready; needs listing + screenshots + privacy answers.
3. **Plaid expansion / multiple-account UX** — basic Plaid is in; the multi-account / per-institution UX needs polish.
4. **Bank-sync provider review** — confirm Plaid is the right call vs. Tink (EU) or Salt Edge for global coverage.
5. **Pricing page conversion** — Plus / Family tier copy + comparison vs. Monarch / Mint.
6. **Marketing growth** — TikTok content (now that the dev-portal app is queued), ASO keywords, Islamic-finance blog posts (Zakat / Hawl / Riba explainers).

---

## How to use this brief with AI assistants

This file is the shared context bus between Claude and ChatGPT.

**Start of session**: paste this whole file. The AI now has full project grounding.

**End of session**: ask for a handoff note in this format:

```
## Handoff — [date] — [Claude | ChatGPT]
Worked on: <2-3 lines>
Changed files / artifacts: <list>
Decisions made: <list>
Next up: <2-3 bullets>
For the other AI: <anything they need to know>
```

Paste that note into the other tool to start the next session.

**Update this brief** when something material shifts: feature shipped, architecture decision, status flip, new milestone. Commit to git. New entries go at the **top** of the "Recent shipping log" section.

### Division of labor

- **Claude (Cowork / Claude Code)**: codebase work — Spring Boot, Flutter, Next.js, refactors, debugging, build errors, long stack traces, multi-file edits, CI fixes, infra (Railway / Vercel) checks.
- **ChatGPT Pro**: product & marketing — App Store / Play Store listings, screenshot strategy, ASO keywords, competitor teardowns (Mint, Monarch, Wahed, Zoya), Islamic finance blog content (Zakat / Hawl / Riba explainers), privacy policy, marketing imagery (DALL·E), growth experiments, TikTok / Instagram content scripts.
- **Cross-critique**: when one produces something substantial (a feature spec, a marketing page, a refactor plan), have the other review it. Different blind spots = better output.

---

## Key conventions & gotchas

- **Islamic compliance is the differentiator.** Riba detection, halal screening, and correct Zakat/Hawl logic are non-negotiable. Treat them as core, not features.
- **`userId` type boundary**: `Long` server-side, `String` in DTO/JSON layer. Convert at the boundary, not in the middle. Hard-won lesson — see history of fixes in `SharedFinanceService`, `AssetService`, `RibaDetectorController`, `ZakatController`, `AutoCategorizationController`.
- **iOS deployment target: 13.0** — enforced via `post_install` hook in `barakah_app/ios/Podfile` so all Pods inherit it.
- **Multi-currency by default**: 40 supported. Never assume USD anywhere in calculations or display.
- **Offline-first on mobile**: SQLite + SharedPrefs cache. New features must consider offline behaviour.
- **`.git/index.lock` cannot be unlinked from the sandbox** — concurrent git operations will fail noisily; serialise them.
- **Pre-commit hooks**: web runs `npm audit` (high/critical) + ESLint + tsc; backend runs `mvn`; mobile runs `flutter analyze` + `flutter test`. Don't bypass with `--no-verify` unless explicitly told.
- **Spring Security custom filters** use `@Order(2)` so they run AFTER `FilterChainProxy(-100)`. Use `permitAll()` at the security config level and enforce inside the filter.
- **Hijri is server-authoritative** — never compute Hijri date client-side (different conversion libs disagree by 1 day). The backend's hijri-converter is the source of truth; mobile + web both fetch from `/api/islamic-calendar/today`.
- **Halal-finance domain rules** (live in `~/.claude/projects/.../memory/`):
  - Islamic products always render `ribaFree: true`.
  - Nisab fallback must match backend gold price calc.
  - "Plus" / "Family" plan terminology — never "Premium" (R38 cleanup; preserved in R44 referral copy).
- **suppressUnauthorized audit rule**: every new mount-fired `api.ts` call MUST pass `suppressUnauthorized: true` so a 401 doesn't trigger a logout cascade. Regression test in `backgroundPollsDoNotLogout.test.ts`.
- **Phone is required on signup** — founder needs it for outreach. Don't weaken `@NotBlank` server-side or HTML `required` client-side for "conversion optimization."
- **PostHog env var lives on Vercel, not Railway** — `NEXT_PUBLIC_POSTHOG_KEY` must be set in Vercel project env to reach the browser bundle. Easy mistake.
- **Acquisition / UTM forwarding**: web + mobile both capture `utm_*` params and forward via `X-App-UTM-*` headers on signup. Admin UI surfaces results under `/dashboard/admin/acquisition`. Regression test in `acquisition_capture_service_test.dart`.

---

## Open questions / parking lot

- **Bank-sync expansion**: Plaid covers US well; what's the EU / GCC story? (Tink covers EU; Salt Edge covers MENA.) Multi-provider abstraction or just Plaid + manual entry for non-Plaid markets?
- **Family / shared finance UX** — backend supports it, mobile + web both have screens; need to validate the invite + permission flow with real Family Plan customers before ASO push.
- **Pricing model** — currently Free / Plus ($9.99) / Family. Annual discount in place. Consider Sadaqah-supported tier for low-income users? Trade-off: revenue dilution vs. mission alignment.
- **iOS App Store assets** — screenshots, copy, preview video. Marketing repo has Islamic-finance copy ready; needs final screenshot pass.
- **TikTok developer-portal app**: resubmitted 2026-05-01 after homepage-footer fix; awaiting review.

---

## Repo / URL reference

- **Backend repo**: `barakah-backend` → https://api.trybarakah.com
  - GitHub: `realbasirujallow/barakah-backend`
- **Mobile repo**: `barakah_app`
  - GitHub: `realbasirujallow/barakah_app`
- **Web repo**: `barakah-web` → https://trybarakah.com
  - GitHub: `realbasirujallow/barakah-web`
- **Marketing assets**: `marketing` (static, not deployed)
- **Local dev root**: `~/Documents/BasiruDEV/Barakah/`

### Useful production probes

```bash
# Backend health + R39 unstick endpoint smoke test (returns 401 if live)
curl -sLI https://api.trybarakah.com/admin/users/1/email-queue
curl -sL https://api.trybarakah.com/actuator/health

# Web homepage footer (Terms + Privacy must be linked for TikTok / app-store reviews)
curl -sL https://trybarakah.com/ | grep -oiE 'href="/(terms|privacy|disclaimer|security)"' | sort -u
```

### Auto-deploy behaviour

| Repo | Trigger | Time | Verify |
|---|---|---|---|
| `barakah-web` | push to `main` | ~2-3 min | Vercel dashboard or `curl https://trybarakah.com/` |
| `barakah-backend` | push to `main` | ~5-10 min (Dockerfile build) | Railway dashboard or `curl https://api.trybarakah.com/actuator/health` |
| `barakah_app` | manual | TestFlight / Play Console | No automatic deploy; releases are explicit |
