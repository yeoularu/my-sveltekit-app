// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type {
	CacheStorage,
	IncomingRequestCfProperties,
	ExecutionContext
} from '@cloudflare/workers-types';
import type { getAuth } from '$lib/server/auth';

type AppAuth = ReturnType<typeof getAuth>;
type SessionPayload = AppAuth['$Infer']['Session'];

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
			id?: string;
		}
		interface Locals {
			auth: AppAuth | undefined;
			session: SessionPayload['session'] | null;
			user: SessionPayload['user'] | null;
		}
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
