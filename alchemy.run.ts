import alchemy from 'alchemy';
import { RateLimit, SvelteKit } from 'alchemy/cloudflare';

const app = await alchemy('my-sveltekit-app');

const requestRateLimit = RateLimit({
	namespace_id: 1001,
	simple: {
		limit: 5,
		period: 10
	}
});

export const worker = await SvelteKit('website', {
	// replace if different from default:
	//
	// main: "./.output/server/index.mjs",
	// command: "RWSDK_DEPLOY=1 vite build",
	// dev: { command: "vite dev" },
	bindings: {
		APP_RATE_LIMIT: requestRateLimit
	}
});

console.log({
	url: worker.url
});

await app.finalize();
