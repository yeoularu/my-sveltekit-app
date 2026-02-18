# AGENTS.md

SvelteKit app using Svelte 5, Tailwind CSS v4, Valibot, and Cloudflare Workers via Alchemy.

## Quick Reference

- **Package manager**: `pnpm`
- **Dev**: `pnpm dev`
- **Format**: `pnpm format`
- **Check + lint**: `pnpm check && pnpm lint`

## Critical Rules

- Use [$svelte-code-writer](.agents/skills/svelte-code-writer/SKILL.md) as the source of truth for Svelte/SvelteKit syntax and patterns.
  - MUST use `$svelte-code-writer` when creating, editing, or analyzing `.svelte` or `.svelte.ts` files.
  - For `.remote.ts` files, read relevant SvelteKit Remote Functions docs via `$svelte-code-writer` `get-documentation` before editing. Treat documentation as primary guidance, since `svelte-autofixer` may not reliably cover remote-function patterns.
- Use Remote Functions by default for app-internal client/server communication.
- Validate untrusted inputs with Valibot before domain logic at all server entry points.

## Shared Engineering Rules

- Add explicit types at module boundaries.
- Prefer `unknown` over `any` at unvalidated boundaries.
- If input is already schema-validated, use inferred typed values directly.
- Narrow types before assertions and avoid non-null assertions unless a guarantee exists.
- Never use `as unknown as T`.
- Avoid `as T` for untrusted data; validate first.
- Avoid `@ts-ignore`; if suppression is unavoidable, use `@ts-expect-error` with a short reason.
- Prefer `async/await` for request and data flows.
- `await` promises unless fire-and-forget is intentional (`void` + explicit failure handling).
- Throw `Error` objects for domain/runtime failures.
- Extract magic numbers and strings into named constants.
- Keep modules focused; extract reusable logic into `$lib` when component scripts grow.
- Favor clear, explicit code over clever one-liners.

## Server Rules (SvelteKit)

- Keep secrets and privileged logic server-side and never expose them to client bundles.
- Validate and sanitize all user input at server boundaries.
- For expected HTTP/control flow in SvelteKit, use `error(...)` and `redirect(...)` rather than `throw new Error(...)`.
- In `+page.server` actions, use `return fail(...)` for expected validation failures.
- In Remote Function `form(...)` handlers, use `invalid(...)` for imperative form or field validation issues.
- Do not swallow framework control-flow exceptions (`error(...)`, `redirect(...)`) in `try/catch`; if caught, rethrow immediately.
- In server code, use SvelteKit's `cookies` API for cookie reads/writes and do not use `document.cookie`.
- Prefer `$app/state` in modern SvelteKit and use `$app/stores` only for legacy compatibility.

## Client Rules (Browser/UI)

- Add `rel="noopener noreferrer"` on links that use `target="_blank"`.
- Avoid `eval()`.
- Parse and validate untrusted browser data before domain use.
- Remove debug-only code (`console.log`, `debugger`) before merge.
- Avoid unnecessary object and array recreation in tight loops and frequently re-running reactive paths.
- Prefer specific imports over namespace imports when practical.

## Testing Rules

- Write assertions inside `it()` or `test()` blocks.
- Avoid done callbacks in async tests; use `async/await` instead.
- Do not commit `.only` or `.skip`.
- Test behavior and user-visible outcomes rather than internal implementation details.
- Include unhappy-path tests for invalid or malformed external data at boundaries.
