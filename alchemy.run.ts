import alchemy from 'alchemy';
import { SvelteKit } from 'alchemy/cloudflare';

const app = await alchemy('my-sveltekit-app');

export const worker = await SvelteKit('website', {
	observability: {
		enabled: true
	}
});

console.log({
	url: worker.url
});

await app.finalize();
