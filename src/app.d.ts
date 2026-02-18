// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {
	CacheStorage,
	IncomingRequestCfProperties,
	ExecutionContext
} from '@cloudflare/workers-types';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
			id?: string;
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}
	}
}

export {};
