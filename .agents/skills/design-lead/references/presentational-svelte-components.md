# Presentational Svelte Components

## Purpose

Build reusable Svelte 5 UI components that express product behavior visually while remaining independent from backend and persistence layers.

## Component Boundary Rules

- Keep components presentational: no database access, no direct API calls, no server action wiring.
- Accept data and flags through `$props()` only.
- Keep contract ownership explicit:
  - `design-lead` defines `UIProps` and `UIEvents` for visual behavior.
  - `tech-lead` maps domain contracts into `UIProps` via adapters.
- Emit interactions through typed event surfaces with two valid form integration modes:
  - **Mode A (Callback-first):** Emit typed callbacks (e.g., `onclick`, `onsubmit`) and call `event.preventDefault()` in the component.
  - **Mode B (Progressive form wiring):** Accept form attributes/injections from parent wiring and spread them onto `<form>` while keeping component business-agnostic.
- Keep business decisions outside the component; render only the state provided.

## Svelte 5 Patterns

- Define explicit prop contracts with typed `$props()` objects.
- Model visual-only state locally when needed (for example, toggling temporary UI affordances).
- Keep derived display values inside the component when they are purely presentational.
- Avoid global store mutations for business workflows.

## State Surface Contract

- Support explicit visual states via props: `loading`, `disabled`, `error`, `success`, and `empty`.
- **Interactions:** Expose deterministic event callback props for user intent (e.g., `onretry`, `ondismiss`, `onchange`).
- **Data Submission:** Always use standard HTML `<form>` elements to preserve browser autofill and accessibility.
  - In Mode A, intercept submit and emit a typed `onsubmit` callback with parsed form data.
  - In Mode B, allow parent-injected progressive form wiring while preserving the component's presentational boundary.
- Keep naming stable and scenario-aligned so Tech Lead can wire behavior without ambiguity.

## Tailwind v4 Styling Practices

- Build variants from shared token-driven classes.
- Keep class composition readable and grouped by concern (layout, typography, color, interaction).
- Include focus-visible and reduced-motion-safe styles by default.
- Keep dark/light theming consistent if the system supports both.
- In tests, assert critical token decisions (brand, severity, hierarchy) rather than brittle full class-string equality.

## Test-Driven Design (TDD) as Documentation

- Vitest and `@testing-library/svelte` test suites serve as the single source of truth for design specifications.
- Co-locate component design tests next to components using `*.design.test.ts`.
- Use `jsdom` for component DOM tests.
- Write tests that assert observable behavior first (a11y roles, disabled/loading behavior, error visibility, keyboard flows), then critical token decisions.
- Do not test backend logic or API responses; mock interactions and verify visual feedback.

### Example Design Spec Test:
```typescript
import { render, screen } from '@testing-library/svelte';
import { expect, describe, it } from 'vitest';
import Component from './Component.svelte';

describe('Design Specs: Component', () => {
  it('Idle State: The submit button should use the primary brand color', () => {
    render(Component, { isSubmitting: false });
    const btn = screen.getByRole('button');
    // Documenting the design token usage via assertion
    expect(btn).toHaveClass('bg-blue-600');
    expect(btn).not.toBeDisabled();
  });

  it('Error State: Should display a red alert box when errorMessage is provided', () => {
    const msg = "Invalid input";
    render(Component, { errorMessage: msg });
    const alert = screen.getByText(msg);
    expect(alert).toHaveClass('text-red-500');
    expect(alert).toHaveClass('border-red-300');
  });
});
```

## Handoff Checklist

- Design states and token policies are documented as passing UI component tests (`*.design.test.ts`).
- `UIProps` and `UIEvents` are documented in a contract file (`*.contract.ts`).
- Prop and event API is clear and deterministic.
- Accessibility attributes and keyboard paths validated.
- Form integration mode (Mode A or Mode B) is explicitly documented.
- No backend coupling introduced in presentational layers.
