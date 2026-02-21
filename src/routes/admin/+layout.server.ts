import { error, redirect } from '@sveltejs/kit';
import { getSignInRedirectPath } from '$lib/server/auth/redirect';
import type { LayoutServerLoad } from './$types';

const USER_RESOURCE = 'user';
const REQUIRED_ADMIN_PERMISSION = 'list';

function getErrorStatus(value: unknown): number | null {
	if (typeof value !== 'object' || value === null || !('status' in value)) return null;

	const status = value.status;
	return typeof status === 'number' ? status : null;
}

export const load: LayoutServerLoad = async ({ locals, request, url }) => {
	const auth = locals.auth;

	if (!auth || !locals.session) {
		throw redirect(303, getSignInRedirectPath(url));
	}

	try {
		const result = await auth.api.userHasPermission({
			body: {
				permissions: {
					[USER_RESOURCE]: [REQUIRED_ADMIN_PERMISSION]
				}
			},
			headers: request.headers
		});

		if (!result.success) {
			throw error(403, 'Admin access is required.');
		}
	} catch (cause: unknown) {
		const status = getErrorStatus(cause);
		if (status === 401) {
			throw redirect(303, getSignInRedirectPath(url));
		}
		if (status === 403) throw error(403, 'Admin access is required.');
		throw cause;
	}
};
