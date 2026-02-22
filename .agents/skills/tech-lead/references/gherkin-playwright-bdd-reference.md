# Gherkin and Playwright-BDD Reference

## Purpose

Define the implementation boundary between syntax (`Gherkin`) and execution (`playwright-bdd`) for Tech Lead responsibilities.

## Canonical Sources

- Gherkin syntax reference: https://cucumber.io/docs/gherkin/reference
- Gherkin parser repository: https://github.com/cucumber/gherkin
- Playwright-BDD repository/docs: https://github.com/vitalets/playwright-bdd

## Responsibility Boundary

- `product-lead` owns business-language scenario quality and Gherkin readability.
- `tech-lead` owns executability in `playwright-bdd` (`features/*.steps.ts`, generation, fixture strategy, deterministic matching).

## Implementation Checklist

1. Validate scenario syntax against official Gherkin keywords and structure.
2. Ensure each step phrase maps to exactly one step definition in `features/*.steps.ts`.
3. Ensure every `Given` is seedable through real backend setup (API or DB fixtures), never network mocks.
4. Run `pnpm bddgen` and resolve all generation/missing-step issues before handoff.
5. Keep scenario runs isolated with unique test data to avoid shared mutable state.

## Failure Protocol

- If a scenario cannot be mapped deterministically to steps, request scenario wording changes.
- If a `Given` cannot be seeded in the current architecture, stop implementation and report the dependency blocker.
