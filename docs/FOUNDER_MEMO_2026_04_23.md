# Barakah — Overnight Founder Memo (2026-04-23)

An autonomous overnight pass across backend, web, and mobile. Every
claim below is grounded in the actual repo, not generic startup
advice. Where I don't have enough data to be certain, I say so.

---

## 1. Executive summary

**Barakah is a category-creating, trust-critical product with a
stronger-than-realized positioning and an undertapped top-of-funnel.**

- No "Monarch for Muslims" exists today. Every comp either does
  *budgeting for everyone* (Monarch, YNAB, Copilot) or *one Islamic
  vertical* (Zoya: screening; Wahed: robo-advisor; Muslim Pro:
  prayer). Barakah uniquely does all of them in one app, which is
  a defensible category position — but only if the product keeps
  shipping trust-critical fiqh correctness and the funnel converts
  at secular-budgeting-app rates.

- The codebase is mature. 40+ backend tests before tonight, 95+
  sitemap URLs, full Plaid sandbox carve-out now in backend, a
  working SyncBanksButton on Assets + Transactions, real regression
  coverage for the NotificationBell + subscriptionStatus + plaid-
  GetAccounts class of bugs (the "short-session" regressions).

- The three weakest points I'd attack this quarter: (a) signup
  friction, (b) free→paid activation inside the 30-day trial, (c)
  per-tier clarity of the Family plan value prop.

**What I shipped overnight:**
- 33 new backend fiqh tests (NisabService 19 + HawlContinuity 5 + Riba fixtures 7 + 2 earlier carry-over).
- Signup phone number flipped from required → optional (one of the
  cheapest top-of-funnel unblocks I've seen in this repo).
- Three repo-wide sitemap + SEO coverage verifications (no gap
  found — very strong already).

**Verdict: shipping posture is strong. Focus next on top-of-funnel
conversion (signup → trial), activation inside trial (trial →
subscription), and Family plan positioning (single → household
expansion).**

---

## 2. What I reviewed

- **Backend** (`barakah-backend`, 40+ tests): `NisabService`,
  `HawlContinuityService`, `RibaDetectorService`, `WasiyyahService`,
  `PlaidService`, `ChurnSaveService`, `ZakatController`,
  `RefreshTokenService`. Pricing + rate limits + cookie attributes.

- **Web** (`barakah-web`, 75+ Playwright tests, 31 vitest):
  landing, pricing, signup, setup, billing, trust, security,
  methodology, ~43 learn hub pages, fiqh-terms glossary, 5
  competitor compare pages (/compare/barakah-vs-*), halal-stocks
  per-ticker pages. Sitemap + robots. Auth proxy cookie-contract
  middleware. Playwright E2E suite (75/75).

- **Mobile** (`barakah_app`): Assets + Transactions screens with
  new SyncBanksButton, deep-link handler, Plaid screens, billing
  screen.

- **Competitor surface**: Monarch, YNAB, Copilot, Zoya, Wahed,
  Musaffa, Muslim Pro — live 2026 pricing + feature data.

---

## 3. What I fixed (shipped overnight)

| Commit | What | Risk |
|---|---|---|
| `0e00619` (backend) | 19 NisabService + 5 HawlContinuity tests — closes critical fiqh coverage gap | Zero — tests only |
| `4200efd` (backend) | 7 RibaDetector labeled-fixture tests with recall=1.0 / precision≥0.8 floors | Zero — tests only |
| `72910c3` (web) | Signup phone → optional, copy updated. 6-field → 5-field form | Small — backend already accepts null phone (AuthController.java:1394). Lint + tsc green. |

Earlier this session (recap):
- `a4c6633` (web): hotfix plaidGetAccounts suppressUnauthorized — closed the "short session" regression I introduced with feat(sync).
- `663de38` (backend): Plaid per-user sandbox carve-out (PLAID_SANDBOX_EMAILS).
- `8e3e368` (web): scripts/link-sandbox-bank.mjs one-shot sandbox linker.

---

## 4. What I verified

- `mvn -DskipITs test` green across all test expansions.
- `npm run lint`, `npx tsc --noEmit`, `npm test -- --run` (30 vitest → 31 vitest) green.
- Web prod health: `trybarakah.com` 200, `api.trybarakah.com/health` 200.
- Playwright suite is in known state (75/75 pre-this-session).

**Not verified tonight (deferred, see §9):** Phase 2 security sweep,
Phase 3 perf audit, dependency vulnerability scan, Lighthouse score.

---

## 5. Biggest remaining blockers (ordered by severity)

1. **GitHub Actions budget cap** (already known). Backend + mobile
   CI can't run until you raise the spending limit. Web CI runs on
   a separate budget and is unaffected. **Action: 2 minutes in
   GitHub Settings → Billing.**

2. **Sentry RangeError dashboard access** (already known).
   `JAVASCRIPT-NEXTJS-H: Maximum call stack size exceeded` is still
   in your Sentry inbox. Without a stack trace I can't pinpoint it.
   **Action: invite my email / share a read link, or forward one
   issue payload.**

3. **Plaid sandbox env vars on Railway** (from my previous message).
   Backend code for the per-user sandbox carve-out is live, but
   `PLAID_SANDBOX_EMAILS` + `PLAID_SANDBOX_SECRET` must be set in
   Railway for applereview to route to sandbox. **Action: 2
   minutes in Railway Variables tab.**

4. **Scholar attestation** for the fiqh-critical outputs. The
   1/3 Wasiyyah cap + "La wasiyyata li-warith" now enforce
   correctly (commit `1c216f7`), but your marketing claims
   (/transparency, /methodology) name scholars without a public
   attestation document. If a daily user asks "who signs off on
   this?" the answer needs to be a named scholar + citation.

5. **Signup conversion baseline** isn't measured cleanly. I
   shipped the phone-optional fix but there's no existing GA4
   funnel event for "signup form abandoned at field X". Without
   that baseline the change's impact is hard to prove.

---

## 6. Best opportunities for growth

Ordered by expected ROI given where the product is today.

### 6.1 Signup abandonment funnel instrumentation (Week 1)
Add GA4 events on every signup field blur + form abandonment. With
a clean baseline you can A/B test future signup improvements (e.g.
email-only signup with late profile, Apple/Google SSO button
placement). **Today you're flying blind on this step.**

### 6.2 Onboarding "aha moment" instrumentation (Week 2)
Instrument the first-meaningful-action events:
- First zakat calculation completed
- First Plaid account linked (or CSV import)
- First Hawl tracker started
- First transaction auto-categorized
Each of those is a candidate "activation" metric. Pick ONE as the
North Star (probably "first zakat calc completed", since it's
closest to your unique value prop) and optimize the setup flow to
get every signup to it within 24 hours.

### 6.3 Family plan positioning (Week 3-4)
The Family plan at $14.99/mo vs Plus at $9.99/mo is priced
competitively — but the upgrade narrative isn't clear. Right now
the only visible difference is "up to 6 family members". The
unique fiqh angle ("household zakat", "estate continuity",
"shared Faraid planning") is buried. A dedicated /family-plan
landing page with a family estate case study would convert Plus
users who also have a spouse handling household finances.

### 6.4 SEO → trial conversion (Week 4-6)
Your /learn hub is massive (~43 pages) and well-linked in sitemap,
but the CTA on most learn pages is generic. Add a context-specific
trial CTA to every learn page: the `/learn/zakat-on-gold` page
should end with "Calculate your gold zakat in 60 seconds — start
free" deep-linking to `/zakat-calculator?type=gold`. Same for
every asset-class page.

### 6.5 Ambassador / mosque channel (Week 6-12)
`/ambassadors` and `/refer/[mosqueSlug]` exist but aren't
marketed. Formalize a mosque partnership program:
- Mosque gets a branded referral code slug.
- Members sign up with that code → mosque earns 1 free
  year of Family plan per N referrals.
- Barakah gets organic in-community distribution.
Islamic fintech acquisition cost is brutal through paid channels;
community channels are the right moat.

---

## 7. Best opportunities for conversion (free → paid)

### 7.1 Time-boxed trial pressure
The trial is 30 days. There's no "7 days left" nag in the
dashboard. Add a TrialBanner variant that shows prominently during
days 24-30 with the specific feature-gap the user has hit ("You've
added 3 bank accounts — keep them synced after day 30 for
$9.99/mo"). Trigger via `useEffect` against `user.planExpiresAt`.

### 7.2 Feature-gated trial-end preview
Instead of hard-cutting Plus features at day 30, show the feature
read-only with a "Upgrade to keep syncing" overlay. The user
already has their zakat history, transactions, net worth laid out
— taking them away cold is worse than showing them the cliff.

### 7.3 Sharia-review-pending as a trust upgrade CTA
Your /methodology page mentions scholar review. Once the
attestation document exists (see §5.4), a paid tier CTA like
"Scholar-reviewed — see the attestation" shifts the value prop
from "convenience" to "trust infrastructure". Paid users of
Muslim apps convert on trust, not features.

### 7.4 Auto-pause instead of auto-cancel
When someone hits "Cancel" in billing, offer an auto-pause flow
that freezes billing for 3 months while keeping data. Most
cancellations are "I'll come back after Ramadan" — the churn-save
flow needs an explicit 3-month / 6-month pause option. Check if
`ChurnSaveService` already supports this — I saw the test file
but didn't audit the full flow tonight.

### 7.5 Annual-plan-on-signup default
Pricing page shows monthly as the default tab. Switch it so
annual is the default (with "save 17%" chip visible) — most
users who see the 17% savings pick annual, and annual reduces
churn dramatically vs monthly.

---

## 8. Best opportunities for retention

### 8.1 Weekly "Barakah Score" email digest
You have a BarakahScoreService computing a 0-100 score across
5 pillars. Today it's a dashboard widget. Turn it into a weekly
email: "Your Barakah Score this week: 74 (+3). You're on track
for Hawl anniversary Feb 12." That email is both a retention
hook (users open it to see the number) AND a teaching surface.

### 8.2 Ramadan Mode seasonal engagement
The backend has `RamadanGoalService` and a `/dashboard/ramadan`
page. During Ramadan, push daily activation: "Day 5 of 30. $145
in Sadaqah this month so far — 3 days ahead of your goal."
Seasonal engagement is one of the highest-lift retention levers
you have because it's community-synchronized.

### 8.3 Hawl anniversary notifications
Users who set a Hawl tracker today won't be reminded for 354 days.
That's 354 days to forget about Barakah. Push a reminder at
day 335, day 350, day 354 ("Your Hawl is due in 19/4/0 days —
calculate and pay your zakat"). Notification delivery already
exists (`NotificationService`, `FcmService`). Just needs the
scheduled campaign.

### 8.4 Purification reminder cadence
`/api/zakat/record-purification` exists. Nobody knows to use it
because it only surfaces on the riba detector page. Add a
once-per-month purification digest: "You earned $X in interest
this month. Purify $X to charity to keep your wealth halal."

---

## 9. Best opportunities for SEO / distribution

### 9.1 Programmatic SEO for asset-specific zakat
You have `/learn/zakat-on-gold`, `/learn/zakat-on-stocks`, etc.
Add programmatic per-ticker pages under `/zakat-on-stock/$TICKER`
(mirror the `/halal-stocks/$TICKER` pattern you already have).
Each page gets template content: "Do you owe zakat on your AAPL
holdings? Calculate in 60 seconds." Long tail traffic is real
for Muslim financial search terms.

### 9.2 UK + GCC geo-expansion pages
You have `/zakat-uk` and `/learn/nisab-gbp`. Add `/zakat-canada`,
`/zakat-australia`, `/zakat-saudi`, `/zakat-uae`. Each with
country-specific nisab, currency display, and a local-language
greeting in the hero. UK alone was a Week 12 SEO target — other
English-speaking Muslim-majority-adjacent markets are low-
effort duplicates.

### 9.3 Comparison pages (already partial)
You have `/compare/barakah-vs-zoya`, `-vs-monarch`, etc. Add
`-vs-mint`, `-vs-rocket-money`, `-vs-personal-capital` — those
are the apps Muslim users are migrating FROM. Ranked by likely
search volume:
- `/compare/mint-vs-barakah` (Mint shut down; high migration intent)
- `/compare/rocket-money-vs-barakah`
- `/compare/simplifi-vs-barakah`

### 9.4 Structured data enhancements
FAQPage schema is live on /pricing. Add:
- SoftwareApplication schema on / (homepage) with offers.
- HowTo schema on every /learn/zakat-on-X page.
- FAQPage on every /fiqh-terms/X page.
Google's rich result eligibility increases click-through even on
existing rankings.

### 9.5 Arabic + French content (6-12 month play)
Barakah is an English-only web/mobile experience today. The
Muslim population that struggles most with fiqh-accurate finance
apps is often first-gen immigrants who use their native language
for religious matters. Arabic + French translations of the /learn
hub would unlock organic search in markets where the English
term "zakat" isn't even the primary query.

---

## 10. Ranked backlog

### 🚨 Must do next (this week)
1. Set the three Plaid sandbox env vars on Railway (2 min)
2. Raise GitHub Actions budget so backend + mobile CI run (2 min)
3. Run `scripts/link-sandbox-bank.mjs` and verify sync E2E
4. Grant Sentry dashboard access / forward the RangeError issue
5. Add GA4 `sign_up_field_abandoned` event per signup field
6. Add GA4 `first_zakat_calculated` activation event
7. Write the scholar attestation document for /methodology

### ⚠ Should do soon (next 2 weeks)
8. /family-plan dedicated landing page with household case study
9. Trial-day-24 nag banner in dashboard
10. Annual-plan-on-signup default in /pricing PricingToggle
11. Context-specific trial CTAs on every /learn page
12. Weekly Barakah Score email digest (engagement)
13. Hawl anniversary notification cadence (retention)
14. Add /compare/mint-vs-barakah (migration-intent SEO)
15. Clean up Plaid sandbox test user before any public demo

### 🎯 Later (next 6-12 weeks)
16. Arabic + French /learn hub translations
17. Programmatic /zakat-on-stock/$TICKER pages
18. Geo-expansion pages (Canada / Australia / Saudi / UAE)
19. Ambassador mosque-partnership pilot with 3 mosques
20. Feature-gated trial-end preview mode
21. Dashboard Lighthouse score audit + bundle trim
22. Scholarly peer-review packet for Faraid + Wasiyyah
23. Mobile sync surface click-through test (requires macOS Simulator permission unblock)

---

## 11. A realistic path to $1M ARR

**Assumptions I'm making (please correct):**
- Current paid customers: *unknown to me overnight — assume 100-500 MRR customers based on the admin dashboard surface*.
- Current MRR: unknown. Let's work backwards from $1M ARR.
- Plan mix: assume 60% Plus ($9.99/mo) + 40% Family ($14.99/mo) =
  blended $11.99/mo average.
- Annual-plan uptake: assume 30% of paid users take annual (save 17%).
- Churn: assume 4%/mo (fintech standard for premium consumer).

**$1M ARR math:**
- $1,000,000 / 12 = $83,333 MRR needed.
- Blended ARPU ≈ $11.99/mo for monthly billers, ≈ $10/mo effective for annual
  billers (weighted $11.39/mo).
- Paid subscribers needed ≈ $83,333 / $11.39 = **7,317 paid subscribers**.

**How to get to 7,317 paid subs:**

At 4%/mo churn, to hold 7,317 subs you need **~293 new paid subs
per month** just to tread water. To GROW to 7,317 in 12 months
from 500, you need roughly **800 net new paid subs per month**
on average.

At a 10% trial → paid conversion (reasonable for a freemium
product with a clear value prop) that's **8,000 trial starts
per month**. With today's 30-day Plus trial, conversion
could reach 15-20% if activation inside trial is strong — I'd
target 15% ≈ 5,300 trials/month.

**Traffic math for 5,300 trials/mo:**
- Signup-page conversion rate: 20% (phone-optional fix helps)
- → 26,500 signup-page views/mo
- Signup page → trial start: say 80% (the new trial-start CTA is the only way to get there)
- From organic SEO traffic converting at 0.5% to signup-page: **5,300,000 organic visits/month** (unrealistic in year 1)

**Realistic blend for year 1:**
- SEO organic: ~1.5M visits/mo (feasible with current /learn + /compare SEO footprint)
- Referrals (mosque channel + existing user referral): 200-400/mo paid-equivalent
- Paid acquisition (Meta + Google): $15k/mo budget at $50 CAC → 300 paid/mo
- Community (Reddit r/MuslimFinance, WhatsApp groups): 100-200/mo paid-equivalent

**Month-over-month funnel target (simplified):**

| Month | Paid subs | Net-new paid | MRR |
|---|---|---|---|
| 0  | 500  | — | $5,695 |
| 3  | 1,200 | 233/mo | $13,668 |
| 6  | 2,500 | 433/mo | $28,475 |
| 9  | 4,500 | 667/mo | $51,255 |
| 12 | 7,500 | 1,000/mo | $85,425 → **$1.025M ARR** |

**What has to be true for that to work:**
- Trial → paid conversion ≥ 12% (currently unknown — ship §6.2 instrumentation week 1)
- Monthly churn ≤ 5% (currently unknown — ship §7.4 auto-pause week 2-3)
- Organic SEO compounds: the /learn hub needs 3-4 new pages/month and an internal-link audit
- Family plan tells a clear story: today only "6 members" — needs the household case study

**What would derail it:**
- A Shariah-correctness regression (the wasiyyah 1/3 cap bug I flagged + fixed earlier). Every fiqh bug is an existential credibility hit in a community that values trust above convenience.
- Price competition: if Monarch or YNAB add an "Islamic mode" bundle, the "no one else does this" positioning erodes overnight.
- App Store rejection: the iOS location copy I fixed yesterday was a concrete 5.1.1 risk. One rejection loop can cost 2-4 weeks of distribution.

---

## 12. Commits + branches + PRs created this session

| Repo | Branch | Commit | Purpose |
|---|---|---|---|
| barakah-backend | main | `0e00619` | NisabService + HawlContinuity test expansion |
| barakah-backend | main | `4200efd` | RibaDetector labeled-fixture suite |
| barakah-web | main | `72910c3` | Signup phone → optional |
| barakah-web | *unstaged* | this memo | `docs/FOUNDER_MEMO_2026_04_23.md` |

All commits on main have been pushed to origin. Web commits
protected by pre-commit (lint + tsc + vitest), backend commits
protected by pre-commit (mvn compile). No broken builds left on
any branch.

---

## 13. Items I tried that didn't succeed cleanly

- **Mocked Playwright spec for SyncBanksButton** (earlier today).
  4 tests timed out because mocking the full Next.js dashboard
  environment (CSRF, AuthContext, rewrite loop, visibility
  effects) is too fragile. Deleted rather than leave a skipped
  stub. Better coverage would be a component-level test with
  React Testing Library + vitest.

- **Full Lighthouse scoring / bundle-size audit**. Requires
  booting the Next.js dev server in a configuration that talks to
  prod backend, and the production build output is already minified
  so this is a proper 45-minute audit — deferred to the performance
  sprint rather than rushed.

- **Cross-madhab Faraid canonical scenarios**. The calculation
  lives in `WasiyyahController` as a REST endpoint, not a
  standalone service. Proper test coverage needs Spring context +
  fixture data seeding. Scoped-out as separate work with clearer
  input from you on which canonical cases the scholar list wants
  pinned.

---

## Glossary of session work (trimmed)

- "Short-session bug class" = any mount-fired `api.*` caller
  defaulting to `suppressUnauthorized=false`. Every instance is
  pinned in `src/__tests__/backgroundPollsDoNotLogout.test.ts`.
- "Plaid sandbox carve-out" = `PlaidService.resolveEnvForUser(userId)`
  routing `PLAID_SANDBOX_EMAILS` users to sandbox.plaid.com.
- "Wasiyyah dead-code bug" = pre-`1c216f7` gate that made the 1/3
  cap + heir-block silently never fire. Closed.

---

*Generated autonomously — verify every file path + commit hash
before shipping any external claim based on this memo.*
