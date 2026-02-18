# my-sveltekit-app

[![Deployed with Alchemy](https://alchemy.run/alchemy-badge.svg)](https://alchemy.run)

SvelteKit starter template with **Svelte 5**, **Tailwind CSS v4**, **Valibot**, and **Cloudflare Workers** deployment via [Alchemy](https://alchemy.run).

Includes a Remote Functions demo showcasing `query` / `form` with HttpOnly cookie storage.

## Tech Stack

- **Framework** — SvelteKit + Svelte 5 (runes, remote functions)
- **Styling** — Tailwind CSS v4
- **Validation** — Valibot
- **Deployment** — Cloudflare Workers (via Alchemy adapter)
- **Tooling** — TypeScript strict, ESLint, Prettier, pnpm

## Setup

```bash
pnpm install
cp .env.example .env
```

Set `ALCHEMY_PASSWORD` in `.env`.

## Developing

```bash
pnpm dev
```

## Building & Preview

```bash
pnpm build
pnpm preview
```

## Deploying

```bash
pnpm deploy
```

Deploys to Cloudflare Workers via Alchemy. To tear down:

```bash
pnpm destroy
```
