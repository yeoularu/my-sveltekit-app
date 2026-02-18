import alchemy from 'alchemy';
import { SvelteKit } from 'alchemy/cloudflare';

const app = await alchemy('my-sveltekit-app');

export const worker = await SvelteKit('website', {
	// replace if different from default:
	//
	// main: "./.output/server/index.mjs",
	// command: "RWSDK_DEPLOY=1 vite build",
	// dev: { command: "vite dev" },
});

console.log({
	url: worker.url
});

await app.finalize();
