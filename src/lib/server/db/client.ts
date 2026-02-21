import type { D1Database } from '@cloudflare/workers-types';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { schema } from './schema';

export type AppDatabase = DrizzleD1Database<typeof schema>;

const databaseCache = new WeakMap<D1Database, AppDatabase>();

export function createDb(database: D1Database): AppDatabase {
	const cached = databaseCache.get(database);
	if (cached) return cached;

	const db = drizzle(database, { schema });
	databaseCache.set(database, db);

	return db;
}
