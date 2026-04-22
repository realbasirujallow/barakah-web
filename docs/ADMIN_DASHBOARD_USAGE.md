# Barakah Admin Dashboard — Usage Guide

**Audience:** Basiru + anyone else granted admin access (currently 1 person via `AdminService.isAdmin`).
**Surface:** `https://trybarakah.com/dashboard/admin` (requires admin-role JWT — non-admins get a 403 + redirect to `/dashboard`).
**Last verified from a live walkthrough:** 2026-04-22 — 86 total users, 82 paying, MRR $839, ARR $10,073.

---

## 0. TL;DR — "what do I look at every Monday at 9 AM?"

Open **one URL**: `https://trybarakah.com/dashboard/admin/scorecard`. Spend 10 minutes there. Everything else is a drill-down when a number looks wrong.

The Monday checklist, in order:

1. **ARR delta** — are we on the $1M glide path? (Need ~15–20% month-over-month to hit it in 12 months.)
2. **Trial→Paid rate** — if it's below 3% after week 8, the paywall is broken. Stop spending on acquisition until it's fixed.
3. **Funnel chart** — biggest red drop-off bar IS this week's experiment target.
4. **Drop-off autopsy** — read 5–10 per-user timelines. Find the human pattern dashboards can't show.
5. **Churn (via Alerts → Past-Due + via Growth → revenue trend)** — keep under 6%/mo.
6. **One customer conversation this week** — call a paid subscriber. Their sentence becomes your next ad copy.

Everything below is the reference guide for each surface.

---

## 1. Top-level nav (admin shell)

At the top of every admin page you see three quick-nav buttons:

- **📈 Weekly Scorecard** (green, primary) → the 10-minute Monday view, joins overview + funnel + growth + drop-off
- **🔄 Funnel** → deep dive into the 9-stage conversion funnel with window selector
- **📈 Growth** → DAU/WAU/MAU + revenue by subscription source

Below those, the tab row: **Overview · Users · Alerts · Unverified · Lifecycle · Experiments · Deleted · Email Log**.

Rule of thumb: **Scorecard for decisions, tabs for operations.**

---

## 2. Overview tab — the health monitor

### Top strip (4 green cards)

- **Monthly Revenue (MRR)** — active + trialing subscribers × their plan price. Does NOT include free users.
- **Total Users** — every signed-up account.
- **Paying Subscribers** — active + trialing. Split by Plus · Family underneath.
- **New Users Today / This week / This month** — acquisition cadence.

**⚠️ Watchout:** the "95.35% paid conversion" headline is misleading when you have lots of trials. Most "paying" users here are really "trialing, auto-granted Plus". The meaningful paid conversion = `Active / Total` from the Subscription Status panel (currently ~65%).

### Plan Distribution + Subscription Status

Plan = Free/Plus/Family. Status = active/trialing/past-due/canceled/inactive.

A **Family plan includes up to 6 household members** who all count as "paying users" even though only 1 card is charged. The **Subscription Status panel's Active count is the truth** for revenue modeling; the user-count is inflated ~3-4x for revenue purposes.

### Support Action Center (orange / pink / blue / gray tiles)

Four live queues:

| Tile | What it means | First action |
|---|---|---|
| **Unverified Emails** | Signup didn't confirm email, can't log in | Open Unverified tab → Resend verification |
| **Past-Due Billing** | Subscription card failed. Dunning window is closing. | Open Stripe → check retry schedule |
| **Trials Expiring** | Within 7 days of trial end | Send targeted email via Lifecycle tab |
| **Missing Contact Info** | No phone number / no location | Low-priority — but impacts support reachability |

### New Member Trial (CRITICAL)

This is the single biggest lever on your funnel shape:

- **Enabled** checkbox → when ON, every new signup gets a 30-day Plus trial automatically
- **Plan** dropdown → what tier the trial grants
- **Duration** → days. Current: 30.

**DO NOT change these without an experiment in place.** Flipping from 30→14 days would collapse your "Started trial" funnel number instantly and nobody would know why.

### Feature Adoption (All Users) — the "where to push" signal

Shows cumulative counts per feature. Your current numbers (2026-04-22) and what they mean:

| Feature | Count | Signal |
|---|---|---|
| Transactions | 930 | Users are tracking money |
| Hawls | 28 | Good — unique Islamic-finance feature working |
| Assets | 41 | ~half of paying users tracking assets — healthy |
| Linked Bank Accounts | 16 | **20% Plaid adoption — activation bottleneck** |
| Zakat Payments | 13 | Small but real zakat usage |
| **Zakat Snapshots** | **0** | **🚨 Bug or UX issue — 13 payments but 0 saved calcs** |
| **Wasiyyah** | **0** | **🚨 Islamic will feature has 0 adoption** |
| **Budgets** | **8** | Low for 82 paying users — budgets should be core |

🚨 = investigate this week. Zero adoption on Wasiyyah means either the feature is buried in nav OR your users don't know the app does it.

### Recent Signups

Bottom panel — scroll-list of the latest 20 signups with plan + verification status. Quick smell-test: if 5 in a row are "Free" (no auto-trial), either `AppSettingsService.onboardingTrialEnabled` got flipped OR the trial-grant code is broken.

---

## 3. Users tab — user operations

### Last Joiners cards

Recent-signup cards pinned above the table for "quick troubleshooting" — you can open the user-detail modal by clicking a card.

### Full user table

**Filters**: All Users · Unverified · Past Due · Trials · Missing Phone · Missing Location · Paying

**Columns**: ID · User (name+email) · Plan · Verified · Location · Signed Up · Last Login · Login IP · Logins

**Actions**:

- **Search** by name or email
- **Export CSV** — full user list export
- **View →** on any row → user-detail modal

⚠️ **Known issue (2026-04-22 walkthrough)**: several early users (IDs 9, 13, 16, 24, 25) show "Signed Up: Jan 21, 1970" — that's Unix epoch zero. Their `createdAt` field wasn't set properly during an earlier migration. This skews the "Signups over time" chart on the Overview tab because it stacks those users in the earliest month bucket. Fix: backfill `users.created_at` from the earliest `lifecycle_events.created_at` per user in a Flyway migration.

### User-detail modal

Opens when you click View → on any user. Two halves:

**Account Activity** — full per-user feature count (14 Assets · 10 Debts · 16 Transactions · etc). Useful for "is this user an engaged paying customer or a tire-kicker?"

**Device info** — last login, last seen, platform (web/iOS/Android), app version. Useful when debugging mobile-vs-web issues.

**Admin actions** (scroll down in the modal):

| Action | When to use |
|---|---|
| Change Subscription Plan | Support request — "I got charged for the wrong plan". Dropdown + Save. |
| Download Hawl Debug Report (JSON) | User says "my zakat calculation is wrong" — this export shows the daily nisab snapshots + hawl tracker history a scholar can review. |
| Send Password Reset Email | User says "I didn't get the reset email". Fires a fresh 30-min link. |
| Grant Trial | Apology credits, partner-mosque onboarding, goodwill gesture. Enter days, click. |
| **Delete User** | GDPR deletion requests only. Permanent + irreversible. Red button for a reason. |

**Rule:** every admin action on a user creates a lifecycle event you can see in the Lifecycle tab's event log. Never untraceable.

---

## 4. Alerts tab — "what needs action today?"

Three panels, all backed by live queries:

- **Past-Due Subscriptions** — cards that just failed. Every row = $X/month of revenue at risk. Stripe Smart Retries runs automatically but a manual dunning email from here closes maybe 30% faster.
- **Expiring Trials — Next 7 Days** — your highest-leverage email campaign window. Combine with Lifecycle tab's `activation_finish_setup` or a custom "your trial ends in 2 days" push.
- **Unverified Emails** — signup hit verification but never clicked. Fastest recovery: open Unverified tab → resend.

**⚠️ Tab badge lag**: the number next to "Unverified (2)" in the tab row is cached and can lag the actual list by a minute or two. Trust the list content, not the badge number.

---

## 5. Unverified tab — email-verification recovery

Table of users who signed up but never clicked the verification link. Columns: email, signup date, failed reason, last-resend time.

Per-row action: **Resend verification**. The most common root cause is Gmail routing to spam — have the user check their spam folder AND add noreply@trybarakah.com to contacts.

When a user literally cannot access their email anymore (e.g. they typo'd it), use the "Verify anyway" override (available in the per-user modal).

---

## 6. Lifecycle tab — your email engine

### Four cohort counters at the top

These are LIVE queries, refreshed on every tab load:

- **Incomplete Setup** — signed up but didn't finish guided setup. **(60 today — largest activation leak in the whole app.)**
- **No Linked Accounts** — never did Plaid. **(81 today — second activation leak.)**
- **Inactive 7D** — haven't opened the app in 7 days. Retention alert.
- **Trials Ending Soon** — within 7 days. Highest-ROI email moment.

Each tile has a **Target →** button — click it to load that cohort as the pre-selected send audience in Campaign Center below.

### Campaign Center (template gallery)

Pre-built templates:

| Template | When it fires | What to customize |
|---|---|---|
| `ramadan` (email) | Annual Ramadan push | Lunar-year-specific greeting + the year's Ramadan date |
| `eid_al_fitr` (email) | End-of-Ramadan zakat al-fitr | Charity partners for one-click give |
| `activation_finish_setup` (email) | Target = "Incomplete Setup" cohort | Specific setup-step they stopped on |
| `activation_link_accounts` (email) | Target = "No Linked Accounts" cohort | Why Plaid + security reassurance |
| `inactive_checkin` (push) | Target = "Inactive 7D" cohort | Personal data hook ("you had $X saved") |
| `Custom` | Freeform | Everything |

### Send flow

1. Pick template (or Custom)
2. Set Campaign name, Channel (email/push), Status (draft/scheduled/sent)
3. Fill Subject + Title + Body (body supports variable substitution — e.g. `{{firstName}}`)
4. Optional: set segment / audience (or inherit the Target → from a cohort counter)
5. Save as **Draft** → review with another set of eyes → send
6. After send: check Email Log tab for delivery status

**Rule:** never send to "all users" without a segment filter. Easy way to burn your sender reputation.

---

## 7. Experiments tab — A/B testing (NEW, 2026-04-22)

Shipped today as the PostHog-replacement feature-flag UI. Empty at walkthrough time.

### Creating an experiment

1. Click **+ New experiment**
2. Name (snake_case, 3-64 chars) — e.g. `pricing_test_q2`
3. Description (for yourself)
4. Variants — e.g. `[{control: 50%}, {treatment: 50%}]`. Weights must sum to 100.
5. Default variant — what unchanged users see (outside segment, or after experiment ends)
6. Segment (optional) — country, plan, new-users-only
7. Click **Create as draft**

### Lifecycle

- **Draft** — never bucketed. You can share the config for review.
- **Active** — every eligible user gets deterministically bucketed, persisted to `feature_flag_assignments`. Variant NEVER changes for a user once set.
- **Ended** — new users get default variant; existing assignments preserved so you can measure retention curves.

### Reading results

Each experiment's results panel shows per-variant cohort size + converted count on an outcome event (configurable). Choose the outcome from the dropdown — 9 presets including `first_upgrade_completed`, `trial_granted`, `first_zakat_calculated`, `save_offer_accepted`.

**Rule:** the conversion-rate column is raw — no p-value or CI math applied. Interpret small cohorts (<100 per variant) with care.

### Good first experiments

- `pricing_test_q2` — $9.99/mo vs $12.99/mo for new US signups. Outcome = `first_upgrade_completed`.
- `paywall_trial_card_required` — no-card 30d trial vs card-required 14d trial. Outcome = `first_upgrade_completed`.
- `annual_default_toggle` — which cycle is pre-selected on checkout. Outcome = `first_upgrade_completed`.
- `cancel_save_offer` — pause-1-mo vs 50%-off-3-mo vs downgrade-to-Family-free. Outcome = `save_offer_accepted`.

---

## 8. Deleted tab — soft-deleted user archive

Users whose accounts are marked `deleted_at != null`. GDPR-compliant hard deletion is a separate admin action (the red "Delete User" button in the user-detail modal).

Use this tab to:
- Confirm a deletion request completed
- Spot-check abnormal deletion spikes (unusual = possible misuse or support issue)

---

## 9. Email Log tab — Resend delivery audit

Badge shows failed-email count. Main use: "a user says they didn't get my email, did it actually send?"

Table columns: email type, to-address, sent-at, status (sent/failed/bounced/complained), Resend message ID for deep-link to Resend dashboard.

Common failure reasons:
- **Bounced** — invalid email address (user typo at signup)
- **Complained** — user marked as spam. Remove them from future campaigns.
- **Failed** — Resend API was down. Check the Email Retry Queue (V73 migration) — it should retry automatically.

---

## 10. Weekly Scorecard (new) — the Monday 10-minute view

URL: `https://trybarakah.com/dashboard/admin/scorecard`

### Structure

1. **ARR glide-path bar** — current ARR / $1M target. 1% = ~$10k. Bar shows how far along.
2. **4 core KPIs** — MRR, Paid Accounts, New Signups (7d), Trial→Paid rate
3. **Funnel** (last 30 days) — 9 stages with drop-offs, plus 3-line conversion rate summary
4. **External dashboards** — deep-linked to GA4 (attribution), Stripe (raw revenue), RevenueCat (iOS/Android), Google Search Console (organic clicks)
5. **Quick-nav** to Admin / Funnel / Growth / Experiments / Lifecycle / Users
6. **Drop-off autopsy** — cohort size + last-event histogram + 30 per-user expandable timelines
7. **Monday review checklist** — the 6 questions you answer every week

### How to use the Drop-off autopsy (the most useful section for founders)

1. Look at the **histogram** — what event type is most common as the "last event before drop-off"? That's your weakest funnel step.
2. Open **5–10 per-user timelines** by clicking. Read each like a story.
3. Look for the pattern: is it always the same step they stop on? Same source? Same platform (web vs flutter)?
4. **That pattern is this week's experiment.** Name the hypothesis. Go fix it.

**Real example from 2026-04-22 walkthrough:** 9 of 26 drop-offs last-event is `session_heartbeat` on flutter. Users completed setup, browsed for ~40 seconds, then disappeared. Diagnosis: app dropped them on the dashboard with no strong next-step prompt. Fix: post-setup full-screen prompt forcing a choice (link bank / calculate zakat / load demo data).

---

## 11. Funnel detail page — `/dashboard/admin/funnel`

Same 9-stage funnel as the Scorecard but with:
- Window selector: 7 / 30 / 90 / 180 / 365 days
- `Top paywall endpoints` table (which gated feature triggered the most paywall impressions — picks your "surface the upgrade prompt here" target)
- Growth snapshot card embedded for context

When to use vs the Scorecard: when the Scorecard's default 30-day window doesn't match your question. E.g. post-Ramadan, switch to 7-day view to see the spike.

---

## 12. Growth detail page — `/dashboard/admin/growth`

Dedicated page for DAU/WAU/MAU + revenue by subscription source. Bookmark this for the morning-standup view once you have a team.

Key numbers:
- **DAU / WAU / MAU** — the 1-day, 7-day, 30-day active-user counts
- **Trial conversion** — granted30d / upgraded30d / rate (the source of truth for your "Trial→Paid" KPI on the Scorecard)
- **Revenue by source** — how much each subscription source contributes (Stripe web checkout vs iOS vs Android via RevenueCat)

---

## 13. External dashboards you open from the Scorecard

These data sources aren't pulled server-side (would need more plumbing) but are deep-linked from the Weekly Scorecard page:

| Dashboard | What lives there | URL |
|---|---|---|
| **Google Analytics 4** | Signup attribution, campaign UTMs, trial_started + first_zakat_calc events | `analytics.google.com` |
| **Stripe** | Raw subscription count, MRR, failed payments (dunning health) | `dashboard.stripe.com/subscriptions` |
| **RevenueCat** | iOS + Android subscription tracking (App Store + Play Store) | `app.revenuecat.com` |
| **Google Search Console** | Organic clicks, indexed pages, Core Web Vitals, top queries | `search.google.com/search-console` |

---

## 14. Known issues / follow-ups from the 2026-04-22 walkthrough

These surfaced during the live walkthrough and are worth fixing separately:

1. **Short-lived session bug (still reproducing)** — session expired twice during a 15-minute walkthrough despite the grace-window fix that shipped. This is a different expiry path — likely related to fast navigation between admin pages. **Open a follow-up to trace a full session timeline + add stricter instrumentation on the `/auth/refresh` path.**

2. **Jan 21 1970 epoch timestamps** — users 9, 13, 16, 24, 25 have `createdAt = 0`. The `Signups over time` chart is skewed. **Fix: Flyway migration to backfill `users.created_at` from the earliest `lifecycle_events.created_at` per user.**

3. **`FIRST_BUDGET_CREATED` event not firing** — 24 of 24 users who `setup_completed` also show 0 on the funnel `created_first_budget` stage. Either the event isn't instrumented in the budget-creation flow OR the funnel stage label is wrong. **Audit `BudgetController.create` + `LifecycleService.trackEvent` calls.**

4. **`ZakatSnapshot` adoption is zero** — 13 zakat payments but 0 saved snapshots. Likely a UX issue where the "save this calculation" button is buried. **Spike a quick fix: auto-save a snapshot at the moment zakat is calculated, no extra click.**

5. **`Wasiyyah` adoption is zero** — Islamic will feature has 0 users. **Audit where Wasiyyah is surfaced in navigation; likely needs a prominent dashboard card for paying-Plus users who haven't created one.**

---

## 15. Appendix — common admin recipes

### "A user can't log in"
Open Users tab → search by email → if Unverified, click the row → Send Password Reset Email. If Verified but still stuck, check Email Log tab for bounces/failures.

### "Did my last campaign send?"
Lifecycle tab → Campaign Center → find campaign by name → status pill will show Sent/Draft/Scheduled. Full delivery detail in the Email Log tab.

### "Someone wants a refund"
Stripe dashboard (external) → find the subscription by email → refund there. Then User modal → Change Subscription Plan to `Free`.

### "A potential investor wants current numbers"
Weekly Scorecard → screenshot the top strip (ARR, MRR, paid accounts). Overview tab → screenshot Plan Distribution + Subscription Status. Export Users CSV if they need deeper data.

### "Ramadan campaign planning"
Lifecycle tab → Campaign Center → duplicate the `ramadan` template → update year + lunar-month dates → set audience = all-active-users → Draft. Review copy with a scholar. Schedule 3 emails: pre-Ramadan readiness / mid-Ramadan zakat reminder / post-Ramadan Eid al-Fitr push.

### "I want to run my first A/B test"
Experiments tab → + New experiment → name it `pricing_test_q2` → variants `[control:50, treatment:50]` → segment `{onlyNewSignupsAfterMs: <now>, country: "US"}` → default `control` → save as draft. Then go wire the treatment variant into your pricing page code + check in a week via the results panel.

---

*This document captures what was covered in the live walkthrough. Ping Basiru if something in the admin UI doesn't match what's described here — either the doc drifted or the UI changed, and trust-drift is worse than a missing section.*
