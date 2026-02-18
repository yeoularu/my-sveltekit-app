import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		renderedAt: new Date().toISOString()
	};
};
