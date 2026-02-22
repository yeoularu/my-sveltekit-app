# Triad Alignment Template

## Purpose

Use this template for the mandatory `product-lead` + `design-lead` + `tech-lead` alignment before implementation.

## Operating Rules

- Timebox to 30 minutes.
- Capture unresolved items as `Open Questions` instead of blocking all progress.
- This artifact is required before step-definition implementation or full UI buildout.

## 1) Scope Snapshot

- Feature:
- Date:
- Participants:
- Linked scenario files:
- Primary user outcome:

## 2) Screen-State Matrix

| Screen/Component | Scenario Reference | State (`loading/success/error/empty/disabled`) | Trigger | Expected Visible Result | A11y Notes |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 3) Contract Layering Agreement

### Domain Contract (`tech-lead` owns)

- Valibot schemas:
- Remote function signatures:
- Known backend constraints:

### View Contract (`design-lead` owns)

- `UIProps` summary:
- `UIEvents` summary:
- Local UI state ownership notes:

### Adapter Contract (`tech-lead` owns)

- Domain -> View mapping decisions:
- Nullability/default handling policy:
- Performance/query constraints:

## 4) Form Strategy Decision

- Chosen mode:
  - `Mode A`: callback-first submit handling in component
  - `Mode B`: progressive form wiring injected by parent
- Reason for choice:
- Fallback mode (if needed):

## 5) BDD Seedability Check

- `Given` prerequisites verified as seedable:
- Required fixture APIs / DB setup:
- Blockers:

## 6) Test Ownership and Coverage

- `design-lead` UI design tests:
- `tech-lead` integration/E2E tests:
- Explicit unhappy-path coverage list:

## 7) Open Questions

- Q1:
- Q2:

## 8) Final Decisions

- Approved boundaries:
- Deferred items:
- Next handoff owner:
