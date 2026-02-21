import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('I am on the home page', async ({ page }) => {
	await page.goto('/');
});

Then('I should see the project title', async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'my-sveltekit-app' })).toBeVisible();
});
