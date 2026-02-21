# Engineering Standards

Read this file before writing any code.

## Mandatory Rules

- **Shared Rules:** Explicit types at module boundaries. Prefer `unknown` over `any`. Narrow types before assertions. Never use `as unknown as T`. Avoid `as T` for untrusted data; validate with Valibot first. Use `async/await` and handle errors explicitly. Throw `Error` objects for domain failures. Extract magic numbers.
- **Server Rules (SvelteKit):** Keep secrets server-side. Validate all input at boundaries with Valibot. Use `error(...)` and `redirect(...)` for control flow, not `throw new Error()`. Use `return fail(...)` in `+page.server` and `invalid(...)` in Remote Function forms. Do not swallow framework exceptions. Use SvelteKit's `cookies` API. Prefer `$app/state` over `$app/stores`.
- **Client Rules:** Use `rel="noopener noreferrer"`. Parse untrusted data before use. Avoid `eval()`.
- **Testing Rules:** Focus on E2E (Playwright) and server-side integration tests. Test behavior over implementation based on Gherkin scenarios. Do not write visual UI component tests, as that is the domain of `design-lead`. Include unhappy-path tests for external data and API failures.

## Svelte 5 Logic Placement (Smart/Dumb Pattern)

- **Default to Inline Logic:** For one-off page-specific logic (e.g., simple local state), write the logic directly within the `<script>` block of the Container component (like `+page.svelte`). Svelte 5's runes (`$state`, `$derived`) make this highly efficient and concise.
- **Extract to `.svelte.ts` (Universal Reactivity):** Only extract logic into external `.svelte.ts` modules when:
  1. The state or logic needs to be shared and reused across multiple components.
  2. The domain logic is highly complex and must be isolated for independent unit testing (testing the logic without loading the UI component).
  3. Managing complex global state or external side effects.
- **Keep Presentational Components Dumb:** UI components provided by `design-lead` must remain strictly presentational. They should not contain mutation logic or access global stores directly. They should use standard `<form>` tags for a11y, but intercept submissions (`event.preventDefault()`) and emit strictly-typed `onsubmit` JS callbacks. The parent Container (`tech-lead`) will then wire these callbacks to type-safe **Remote Functions** rather than untyped traditional SvelteKit Server Actions.
