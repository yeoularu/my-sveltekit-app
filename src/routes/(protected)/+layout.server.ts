import { redirect } from '@sveltejs/kit';
import { getSignInRedirectPath } from '$lib/server/auth/redirect';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.auth || !locals.session || !locals.user) {
		throw redirect(303, getSignInRedirectPath(url));
	}
};
