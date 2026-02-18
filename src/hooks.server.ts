import type { Handle, HandleServerError, HandleValidationError } from '@sveltejs/kit';
import { createAppError, createErrorId, safeJsonStringify, serializeError } from '$lib/error';

const securityHeaders: Record<string, string> = {
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Cross-Origin-Opener-Policy': 'same-origin'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	for (const [key, value] of Object.entries(securityHeaders)) {
		response.headers.set(key, value);
	}

	const isHttps =
		event.url.protocol === 'https:' || event.request.headers.get('x-forwarded-proto') === 'https';

	if (isHttps) {
		response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
	}

	return response;
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const id = createErrorId();

	console.error(
		safeJsonStringify({
			level: 'error',
			source: 'server',
			id,
			type: 'unexpected_server_error',
			path: event.url.pathname,
			method: event.request.method,
			status,
			message,
			error: serializeError(error)
		})
	);

	return createAppError('INTERNAL_ERROR', 'Internal Error', id);
};

export const handleValidationError: HandleValidationError = ({ issues, event }) => {
	const id = createErrorId();

	console.warn(
		safeJsonStringify({
			level: 'warn',
			source: 'server',
			id,
			type: 'remote_validation_error',
			path: event.url.pathname,
			method: event.request.method,
			issueCount: issues.length,
			issues: issues.slice(0, 5).map((i) => ({ message: i.message, path: i.path }))
		})
	);

	return createAppError('INVALID_REQUEST', 'Invalid request', id);
};
