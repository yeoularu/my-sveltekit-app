# UI Design Principles

## Goal

Turn scenario intent into a consistent visual system that is predictable, accessible, and implementation-ready.

## Tailwind v4 Token Discipline

- Use project design tokens defined in Tailwind v4 theme variables for color, spacing, radius, shadow, and typography.
- Prefer semantic token usage over one-off styling.
- Avoid arbitrary values such as `px-[13px]`, `text-[#123456]`, or ad-hoc spacing unless a documented exception exists.
- Keep component variants aligned to shared tokens so states look consistent across the app.

## Micro-Interaction Standards

- Define visual behavior for default, hover, active, focus-visible, disabled, and loading states for all interactive elements.
- Use subtle and short transitions that communicate responsiveness without distraction.
- Preserve clarity during loading by using skeletons, spinners, or disabled controls with explanatory copy.
- Ensure interaction feedback remains visible in keyboard-only navigation.

## Responsive Layout Rules

- Design mobile-first, then scale through breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).
- Keep content hierarchy stable across breakpoints and avoid sudden interaction-pattern changes.
- Use fluid spacing and typography tokens to maintain rhythm between card, form, and table layouts.
- Validate touch target size and spacing for smaller screens.

## Error and Validation UX

- Prefer inline field errors for form-level validation and reserve toasts for global outcomes.
- Keep error text actionable and specific to the user task.
- Show non-blocking warnings separately from blocking errors.
- Provide empty-state and error-state recovery actions where applicable.

## Accessibility Baseline

- Use semantic HTML and ARIA attributes only when needed.
- Keep focus indicators visible and high contrast.
- Ensure color contrast and state indicators do not rely on color alone.
- Provide readable labels, helper text, and error associations for form controls.
