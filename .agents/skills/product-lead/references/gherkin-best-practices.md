# Gherkin Best Practices

## Purpose

Use this guide to keep product-facing scenarios clear, declarative, and directly tied to business outcomes.

## Core Principles

- Write behavior in business language that domain stakeholders use daily.
- Describe what outcome the user gets, not how UI controls are manipulated.
- Keep one core behavior per scenario.
- Make outcomes observable so they can be validated in automation.
- Keep steps concise and specific; avoid overloaded or ambiguous phrasing.

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
- Use `Scenario Outline` with an `Examples` table to clearly document boundary conditions and thresholds without cluttering the scenario syntax.

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
