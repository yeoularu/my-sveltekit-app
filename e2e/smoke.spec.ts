import { expect, test } from '@playwright/test';

test('app boots on home route', async ({ page }) => {
	const runtimeErrors: string[] = [];
	page.on('pageerror', (error) => {
		runtimeErrors.push(error.message);
	});

	const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

	expect(response?.ok()).toBe(true);
	await expect(page).toHaveTitle(/my-sveltekit-app/i);
	await expect(page.locator('main')).toBeVisible();
	await expect(page.getByRole('heading', { level: 1, name: /my-sveltekit-app/i })).toBeVisible();
	expect(runtimeErrors).toEqual([]);
});
