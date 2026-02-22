# Gherkin Best Practices

## Purpose

Use this guide to keep product-facing scenarios clear, declarative, and directly tied to business outcomes.

## Core Principles

- Write behavior in business language that domain stakeholders use daily.
- Describe what outcome the user gets, not how UI controls are manipulated.
- Restrict each scenario to one core behavior.
- Prefer `Rule` to group scenarios by shared business policy when one policy governs multiple scenarios.
- Keep acceptance criteria observable and testable.
- Explicitly define 'Sad Path' scenarios (e.g., error states, empty states, loading states) in addition to normal 'Happy Path' flows.

## Rule and Scenario Organization

Use the `Rule` keyword to declare business policies or constraints explicitly before the scenarios that test them when it improves clarity. This serves as in-file documentation and groups related test cases logically.

Example:

```gherkin
Rule: Password length security policy
  Passwords must be exactly between 8 and 100 characters in length.

  Scenario Outline: Password length validation
    # ...
```

## Given-When-Then Basics

- `Given`: Set business context and relevant preconditions.
- `When`: Describe the business action or triggering event.
- `Then`: Describe the expected business outcome.

Example:

```gherkin
Scenario: Customer applies a valid loyalty voucher
  Given a customer has an active loyalty voucher
  When the customer checks out with the voucher
  Then the order total reflects the voucher discount
```

## Background

Use `Background` only for stable context shared by most scenarios in a feature.

- Keep it short.
- Avoid hiding critical scenario-specific setup in `Background`.
- Move setup back into a scenario when only some scenarios need it.

Example:

```gherkin
Background:
  Given the store is accepting online orders
```

## Scenario Outline

Use `Scenario Outline` when one behavior is exercised with multiple example values.

- Keep placeholders business-readable.
- Use examples to show meaningful boundary or policy variations.
- Do not mix unrelated behaviors in one outline.
- Use plain `Scenario` when there is only one concrete case.

Example:

```gherkin
Scenario Outline: Shipping fee by membership tier
  Given a customer has "<tier>" membership
  When the customer places a standard shipment order
  Then the shipping fee is "<fee>"

  Examples:
    | tier   | fee   |
    | Gold   | $0    |
    | Silver | $4.99 |
```

## Data Constraints and Validation

- Treat data limits (e.g., minimum length, required fields) as **Business Rules**, not UI validations.
- Do NOT write imperative, low-level UI validation steps (e.g., `When the user types 7 characters` or `Then the max-length becomes 8`).
- Express constraints declaratively, focusing on the business outcome.
- Use `Scenario Outline` with an `Examples` table to document boundary conditions and thresholds when multiple data rows validate the same behavior.

Example:

```gherkin
Scenario Outline: Password length security policy
  When a user registers with a password of length "<length>"
  Then the registration is "<outcome>"

  Examples:
    | length | outcome  | notes             |
    | 7      | rejected | below minimum     |
    | 8      | accepted | at minimum        |
    | 20     | accepted | at maximum        |
    | 21     | rejected | exceeds maximum   |
```

## Clarity Checklist

- Scenario title states one clear behavior.
- Domain terms are consistent across all steps.
- Preconditions are complete and minimal.
- Outcome is measurable and unambiguous.
- Technical details (tables, endpoints, internal services) are absent unless explicitly part of domain language.

## Official Syntax Source

- The canonical source for grammar and keyword validity is the official Cucumber Gherkin reference:
  - https://cucumber.io/docs/gherkin/reference
- Use this local guide for team conventions, and defer to the official reference for parser-level syntax questions.
