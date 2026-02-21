# my-sveltekit-app

[![Deployed with Alchemy](https://alchemy.run/alchemy-badge.svg)](https://alchemy.run)

Opinionated SvelteKit starter template for Cloudflare Workers with:

- SvelteKit + Svelte 5
- Tailwind CSS v4
- Better Auth (username + admin plugin)
- Cloudflare D1 + Drizzle ORM
- Valibot validation at server boundaries
- Vitest (unit + component)
- Playwright + playwright-bdd
- Deployment via Alchemy

## Included Features

- **Auth**: Better Auth mounted at `/api/auth` with username support
- **Admin route**: `/admin` placeholder page
- **Validation**: Valibot used for untrusted server input
- **Unit + Component tests**: Vitest with split folders/commands (`tests/unit`, `tests/component`)
- **E2E**: plain Playwright tests + BDD (`.feature` + step definitions)

## Prerequisites

- Node.js `>=22`
- `pnpm`

## Setup

```bash
pnpm install
cp .env.example .env
```

Set values in `.env`:

- `ALCHEMY_PASSWORD` (required)
- `BETTER_AUTH_SECRET` (required, generate with `pnpm exec better-auth secret`)

Then run:

```bash
pnpm dev
```

## Auth & Admin Notes

- Sign-in UI is available at `/auth/sign-in` and uses username + password.
- Admin UI is available at `/admin`.

`baseURL` is derived from each request origin automatically (dev/prod host).

## Unit + Component Testing

Vitest is configured with separate folders and commands:

- `unit`: Node environment (`tests/unit/**`)
- `component`: jsdom + Testing Library (`tests/component/**`, file-level jsdom annotation)

Run tests:

```bash
pnpm test
pnpm test:unit
pnpm test:component
pnpm test:watch
pnpm test:coverage
```

## BDD + E2E Testing

This project is configured with `playwright-bdd`:

- Feature files: `features/**/*.feature`
- Step definitions: `features/**/*.steps.ts`
- Generated specs: `e2e/**/*.feature.spec.js` (gitignored)

`pnpm test:e2e` runs:

1. `pnpm bddgen` (generate BDD specs)
2. `playwright test`

Install Playwright browser once:

```bash
pnpm exec playwright install chromium
```

Run tests:

```bash
pnpm test:e2e
pnpm test:e2e:ui
```

## Database

- Drizzle schema: `src/lib/server/db/schema.ts`
- Drizzle config: `drizzle.config.ts`
- SQL migrations: `drizzle/*`

When schema changes:

```bash
pnpm db:generate
pnpm db:check
```

## Useful Commands

```bash
pnpm dev
pnpm check
pnpm lint
pnpm format
pnpm build
pnpm preview
pnpm deploy
pnpm destroy
```

If deploy fails with `Worker ... already exists`:

```bash
pnpm deploy -- --adopt
```
