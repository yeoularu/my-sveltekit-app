import * as v from 'valibot';
import { error, fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const SIGN_IN_PATH = '/auth/sign-in';
const USER_RESOURCE = 'user';
const USER_ROLE = 'user';
const ADMIN_ROLE = 'admin';
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/;
const DEFAULT_LIMIT = 100;

type AdminPermission = 'list' | 'create';

type AdminUserSummary = {
	id: string;
	name: string;
	email: string;
	username: string | null;
	role: string | null;
	banned: boolean;
	createdAt: string | null;
};

const createUserSchema = v.object({
	name: v.pipe(v.string(), v.minLength(1, 'Name is required.')),
	email: v.pipe(v.string(), v.email('Email format is invalid.')),
	username: v.pipe(
		v.string(),
		v.regex(USERNAME_PATTERN, 'Username must be 3-32 chars (letters, numbers, underscore).')
	),
	password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters.')),
	role: v.picklist([USER_ROLE, ADMIN_ROLE])
});

function getFieldValue(formData: FormData, key: string): string {
	const value = formData.get(key);
	return typeof value === 'string' ? value.trim() : '';
}

function toDateString(value: unknown): string | null {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === 'string' && value.length > 0) return value;
	return null;
}

function toAdminUserSummary(user: Record<string, unknown>): AdminUserSummary {
	return {
		id: typeof user.id === 'string' ? user.id : '',
		name: typeof user.name === 'string' ? user.name : '',
		email: typeof user.email === 'string' ? user.email : '',
		username: typeof user.username === 'string' ? user.username : null,
		role: typeof user.role === 'string' ? user.role : null,
		banned: user.banned === true,
		createdAt: toDateString(user.createdAt)
	};
}

function getErrorStatus(value: unknown): number | null {
	if (typeof value !== 'object' || value === null || !('status' in value)) return null;

	const status = value.status;
	return typeof status === 'number' ? status : null;
}

function getErrorMessage(value: unknown, fallback: string): string {
	if (value instanceof Error && value.message) return value.message;

	if (typeof value === 'object' && value !== null && 'message' in value) {
		const message = value.message;
		if (typeof message === 'string' && message.length > 0) return message;
	}

	return fallback;
}

async function requireAdminAccess(
	event: Pick<RequestEvent, 'locals' | 'request'>,
	permission: AdminPermission
): Promise<NonNullable<App.Locals['auth']>> {
	const auth = event.locals.auth;
	if (!auth || !event.locals.session) {
		throw redirect(303, SIGN_IN_PATH);
	}

	try {
		const result = await auth.api.userHasPermission({
			body: {
				permissions: {
					[USER_RESOURCE]: [permission]
				}
			},
			headers: event.request.headers
		});

		if (!result.success) {
			throw error(403, 'Admin access is required.');
		}
	} catch (cause: unknown) {
		const status = getErrorStatus(cause);
		if (status === 401) throw redirect(303, SIGN_IN_PATH);
		if (status === 403) throw error(403, 'Admin access is required.');
		throw cause;
	}

	return auth;
}

export const load: PageServerLoad = async (event) => {
	const auth = await requireAdminAccess(event, 'list');
	const usersResponse = await auth.api.listUsers({
		query: {
			limit: DEFAULT_LIMIT,
			offset: 0
		},
		headers: event.request.headers
	});

	return {
		users: usersResponse.users.map((user: unknown) =>
			toAdminUserSummary(user as Record<string, unknown>)
		),
		total: usersResponse.total
	};
};

export const actions: Actions = {
	createUser: async (event) => {
		const auth = await requireAdminAccess(event, 'create');
		const formData = await event.request.formData();
		const input = {
			name: getFieldValue(formData, 'name'),
			email: getFieldValue(formData, 'email').toLowerCase(),
			username: getFieldValue(formData, 'username'),
			password: getFieldValue(formData, 'password'),
			role: getFieldValue(formData, 'role') || USER_ROLE
		};

		const parsed = v.safeParse(createUserSchema, input);
		if (!parsed.success) {
			return fail(400, {
				createUserError: parsed.issues[0]?.message ?? 'Invalid input.',
				createUserValues: {
					name: input.name,
					email: input.email,
					username: input.username,
					role: input.role
				}
			});
		}

		try {
			const result = await auth.api.createUser({
				body: {
					name: parsed.output.name,
					email: parsed.output.email,
					password: parsed.output.password,
					role: parsed.output.role,
					data: {
						username: parsed.output.username,
						displayUsername: parsed.output.username
					}
				},
				headers: event.request.headers
			});

			return {
				createUserSuccess: `Created ${result.user.email}`,
				createUserValues: {
					name: '',
					email: '',
					username: '',
					role: USER_ROLE
				}
			};
		} catch (cause: unknown) {
			return fail(400, {
				createUserError: getErrorMessage(cause, 'Failed to create user.'),
				createUserValues: {
					name: parsed.output.name,
					email: parsed.output.email,
					username: parsed.output.username,
					role: parsed.output.role
				}
			});
		}
	}
};
