import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

const isVitest = process.env.VITEST === 'true' || process.env.NODE_ENV === 'test';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), ...(isVitest ? [svelteTesting()] : [])],
	resolve: isVitest
		? {
				conditions: ['browser']
			}
		: undefined,
	test: {
		include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
		environment: 'node',
		setupFiles: ['./tests/setup/vitest.setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/**/*.{ts,svelte}'],
			exclude: ['src/app.d.ts']
		}
	}
});
