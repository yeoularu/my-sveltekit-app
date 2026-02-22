import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
	viteConfig,
	defineConfig({
		plugins: [svelteTesting()],
		resolve: {
			conditions: ['browser']
		},
		test: {
			include: ['src/**/*.test.ts', 'tests/**/*.test.ts', 'tests/**/*.spec.ts'],
			environment: 'jsdom',
			setupFiles: ['./tests/setup/vitest.setup.ts'],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'html'],
				include: ['src/**/*.{ts,svelte}'],
				exclude: ['src/app.d.ts']
			}
		}
	})
);
