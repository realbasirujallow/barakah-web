# Barakah Web Dashboard

A [Next.js](https://nextjs.org) web dashboard for the Barakah Islamic finance app.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

> ⚠️ This app is **NOT** on Vercel. It deploys to **Railway** (service `barakah-web`),
> fronted by Cloudflare at https://trybarakah.com.

**Always deploy with the build-gated script — never bare `railway up`:**

```bash
./scripts/deploy-web.sh
```

Why: Railway builds with `npm run build` (`next build`, which type-checks). If
that build fails, Railway marks the deploy FAILED but **silently keeps serving
the previous build** — so a broken `railway up` looks "fine" on the live site
while your fixes never ship. `deploy-web.sh` reproduces that build locally first
and **aborts before deploying** if it fails, then verifies the new build is live.
(This silent-stale-deploy trap hid web fixes for weeks — see
`../QA_ISSUE_LEDGER.md`, 2026-05-29.)

The backend has the same guard: `barakah-backend/scripts/deploy-backend.sh`.
