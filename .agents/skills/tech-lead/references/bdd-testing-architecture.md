# BDD Testing Architecture

## Purpose

Use this guide to review product scenarios, design independent tests, and map behavior specs to implementation safely.

## Scenario Review

- Validate each scenario has one core behavior and one observable outcome.
- Flag ambiguity in business terms before technical work begins.
- Add edge-case scenarios when policies, boundaries, or failures are missing.

## Independent Test Design

- Create isolated test setup per scenario.
- Avoid shared mutable state between scenarios.
- Reset time, environment variables, and test doubles per test run.
- Keep each scenario executable in any order.

## Given-When-Then Mapping

- `Given`: Build only the minimum deterministic preconditions.
- `When`: Execute one business action per scenario.
- `Then`: Assert externally visible behavior, not private internals.

## Delivery Pattern

1. Review and tighten Gherkin.
2. Generate scenario-aligned test skeletons.
3. Implement the production behavior.
4. Run isolated and full-suite checks to detect coupling.
