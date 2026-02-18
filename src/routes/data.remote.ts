import * as v from 'valibot';
import { form } from '$app/server';

const doubleNumberInput = v.object({
	value: v.number()
});

export const doubleNumber = form(doubleNumberInput, async ({ value }) => {
	return {
		input: value,
		doubled: value * 2,
		processedAt: new Date().toISOString()
	};
});
