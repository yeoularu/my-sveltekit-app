import alchemy from 'alchemy';
import { D1Database, SvelteKit } from 'alchemy/cloudflare';

const app = await alchemy('my-sveltekit-app');

const database = await D1Database('database', {
	migrationsDir: 'drizzle',
	migrationsTable: 'd1_migrations'
});

export const worker = await SvelteKit('website', {
	bindings: {
		DB: database,
		BETTER_AUTH_SECRET: alchemy.secret.env('BETTER_AUTH_SECRET')
	},
	observability: {
		enabled: true
	}
});

console.log({
	url: worker.url
});

await app.finalize();
