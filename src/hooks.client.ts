import type { HandleClientError } from '@sveltejs/kit';
import { createAppError, createErrorId, safeJsonStringify, serializeError } from '$lib/error';
import { sendClientError } from '$lib/telemetry';

export const handleError: HandleClientError = ({ error, status, message }) => {
	const id = createErrorId();

	const payload = {
		id,
		type: 'unexpected_client_error',
		status,
		message,
		url: window.location.href,
		error: serializeError(error)
	};

	console.error(safeJsonStringify({ level: 'error', source: 'client', ...payload }));
	sendClientError(payload);

	return createAppError('CLIENT_ERROR', message, id);
};
