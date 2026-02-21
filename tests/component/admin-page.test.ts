// @vitest-environment jsdom

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import AdminPage from '../../src/routes/admin/+page.svelte';

describe('admin page', () => {
	it('renders heading and back link', () => {
		render(AdminPage);

		expect(screen.getByRole('heading', { level: 1, name: 'Admin' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
	});
});
