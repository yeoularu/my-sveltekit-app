import { redirect } from '@sveltejs/kit';
import { getSignInRedirectPath } from '$lib/server/auth/redirect';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;
	if (!user) {
		throw redirect(303, getSignInRedirectPath(url));
	}

	return {
		account: {
			id: user.id,
			name: user.name,
			email: user.email,
			username: user.username ?? null
		}
	};
};
