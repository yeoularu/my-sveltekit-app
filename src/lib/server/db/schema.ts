import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

const nowMs = sql`(cast(unixepoch('subsecond') * 1000 as integer))`;

export const user = sqliteTable(
	'user',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull(),
		username: text('username'),
		displayUsername: text('display_username'),
		role: text('role'),
		banned: integer('banned', { mode: 'boolean' }).default(false),
		banReason: text('ban_reason'),
		banExpires: integer('ban_expires', { mode: 'timestamp_ms' }),
		emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
		image: text('image'),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(nowMs),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(nowMs)
	},
	(table) => [
		uniqueIndex('user_email_unique').on(table.email),
		uniqueIndex('user_username_unique').on(table.username)
	]
);

export const session = sqliteTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		token: text('token').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(nowMs),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(nowMs),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		impersonatedBy: text('impersonated_by')
	},
	(table) => [uniqueIndex('session_token_unique').on(table.token)]
);

export const account = sqliteTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
		refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
		scope: text('scope'),
		password: text('password'),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(nowMs),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(nowMs)
	},
	(table) => [uniqueIndex('account_provider_account_unique').on(table.providerId, table.accountId)]
);

export const verification = sqliteTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(nowMs),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(nowMs)
	},
	(table) => [uniqueIndex('verification_identifier_value_unique').on(table.identifier, table.value)]
);

export const appConfig = sqliteTable('app_config', {
	key: text('key').primaryKey(),
	value: text('value').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().default(nowMs),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().default(nowMs)
});

export const schema = {
	user,
	session,
	account,
	verification,
	appConfig
};
