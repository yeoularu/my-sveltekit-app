# Presentational Svelte Components

## Purpose

Build reusable Svelte 5 UI components that express product behavior visually while remaining independent from backend and persistence layers.

## Component Boundary Rules

- Keep components presentational: no database access, no direct API calls, no server action wiring.
- Accept data and flags through `$props()` only.
- Emit interactions strictly through typed callback props (e.g., `onclick`, `onsubmit`). For data mutations, build standard HTML `<form>` elements but prevent default submission and invoke your `onsubmit` callback with the gathered data.
- Keep business decisions outside the component; render only the state provided.

## Svelte 5 Patterns

- Define explicit prop contracts with typed `$props()` objects.
- Model visual-only state locally when needed (for example, toggling temporary UI affordances).
- Keep derived display values inside the component when they are purely presentational.
- Avoid global store mutations for business workflows.

## State Surface Contract

- Support explicit visual states via props: `loading`, `disabled`, `error`, `success`, and `empty`.
- **Interactions:** Expose deterministic event callback props for user intent (e.g., `onretry`, `ondismiss`, `onchange`).
- **Data Submission:** Always use standard HTML `<form>` elements to preserve browser autofill and accessibility. However, **never expose `action` props**. Instead, intercept the submission (`event.preventDefault()`) and emit a strictly-typed `onsubmit` callback containing the form data. This forces `tech-lead` to use type-safe Remote Functions rather than untyped SvelteKit Form Actions.
- Keep naming stable and scenario-aligned so Tech Lead can wire behavior without ambiguity.

## Tailwind v4 Styling Practices

- Build variants from shared token-driven classes.
- Keep class composition readable and grouped by concern (layout, typography, color, interaction).
- Include focus-visible and reduced-motion-safe styles by default.
- Keep dark/light theming consistent if the system supports both.

## Test-Driven Design (TDD) as Documentation

- Vitest and `@testing-library/svelte` test suites serve as the single source of truth for design specifications.
- Write tests that explicitly assert the presence of specific Tailwind tokens or DOM changes to document your visual state decisions.
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

- Design states and token policies are documented as passing UI component tests (`*.test.ts`).
- Prop and event API is clear and deterministic.
- Accessibility attributes and keyboard paths validated.
- No backend coupling introduced in presentational layers.
