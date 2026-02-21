import { getRequestEvent } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import type { D1Database } from '@cloudflare/workers-types';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, username } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { isValidUsername, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from '$lib/auth-policy';
import { createDb } from '$lib/server/db/client';
import { schema } from '$lib/server/db/schema';

const AUTH_BASE_PATH = '/api/auth';

function getRequiredValue(value: string | undefined, name: string): string {
	if (!value) {
		throw new Error(`${name} is not configured`);
	}

	return value;
}

function getEnv(event: RequestEvent): Env {
	const platformEnv = event.platform?.env;
	if (!platformEnv) {
		throw new Error('Cloudflare platform env is unavailable in this request');
	}

	return platformEnv;
}

function buildAuth(env: Env, baseURL: string) {
	const db = createDb(env.DB);

	return betterAuth({
		basePath: AUTH_BASE_PATH,
		baseURL,
		secret: getRequiredValue(env.BETTER_AUTH_SECRET, 'BETTER_AUTH_SECRET'),
		database: drizzleAdapter(db, {
			provider: 'sqlite',
			schema
		}),
		emailAndPassword: {
			enabled: true,
			disableSignUp: false
		},
		plugins: [
			username({
				minUsernameLength: USERNAME_MIN_LENGTH,
				maxUsernameLength: USERNAME_MAX_LENGTH,
				usernameValidator: isValidUsername
			}),
			admin(),
			sveltekitCookies(() => getRequestEvent())
		]
	});
}

type AuthInstance = ReturnType<typeof buildAuth>;

const authCache = new WeakMap<D1Database, Map<string, AuthInstance>>();

function createAuth(env: Env, baseURL: string): AuthInstance {
	const dbCache = authCache.get(env.DB) ?? new Map<string, AuthInstance>();
	authCache.set(env.DB, dbCache);

	const cached = dbCache.get(baseURL);
	if (cached) return cached;

	const auth = buildAuth(env, baseURL);

	dbCache.set(baseURL, auth);

	return auth;
}

export function getAuthFromEvent(event: RequestEvent): AuthInstance {
	return createAuth(getEnv(event), event.url.origin);
}

export function getAuth(): AuthInstance {
	const event = getRequestEvent();
	return createAuth(getEnv(event), event.url.origin);
}

export type SessionPayload = ReturnType<typeof getAuth>['$Infer']['Session'];
