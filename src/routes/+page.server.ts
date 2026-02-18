import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		serverTime: new Date().toISOString()
	};
};
