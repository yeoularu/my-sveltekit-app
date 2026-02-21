import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddOutputDir = defineBddConfig({
	featuresRoot: 'features',
	outputDir: 'e2e'
});

export default defineConfig({
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://localhost:5173'
	},
	testDir: bddOutputDir
});
