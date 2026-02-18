import type { HandleServerError, HandleValidationError } from '@sveltejs/kit';

const createErrorId = () => crypto.randomUUID();

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const id = createErrorId();

	console.error(`[${id}] Unexpected server error`, {
		path: event.url.pathname,
		status,
		message,
		error
	});

	return {
		message: 'Internal Error',
		code: 'INTERNAL_ERROR',
		id
	};
};

export const handleValidationError: HandleValidationError = ({ issues, event }) => {
	const id = createErrorId();
	const firstIssue = issues[0];

	console.warn(`[${id}] Remote validation error`, {
		path: event.url.pathname,
		issueCount: issues.length,
		firstIssueMessage: firstIssue?.message
	});

	return {
		message: 'Invalid request',
		code: 'INVALID_REQUEST',
		id
	};
};
