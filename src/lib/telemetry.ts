export interface ClientErrorPayload {
	id: string;
	type: string;
	status: number;
	message: string;
	url: string;
	error: Record<string, unknown>;
}

export interface ClientErrorEvent {
	id: string;
	type: 'client_error';
	ts: string;
	payload: ClientErrorPayload;
}

export interface ClientErrorTelemetryEnvelope {
	v: 1;
	sentAt: string;
	events: ClientErrorEvent[];
}

const TELEMETRY_ENDPOINT = '/api/telemetry';
const TELEMETRY_VERSION = 1;
const MAX_STACK_LENGTH = 8000;

function sanitizePayload(payload: ClientErrorPayload): ClientErrorPayload {
	const error = { ...payload.error };
	if (typeof error.stack === 'string') {
		error.stack = error.stack.slice(0, MAX_STACK_LENGTH);
	}

	return {
		...payload,
		error
	};
}

function sendTelemetry(events: ClientErrorEvent[]): void {
	let body: string;
	try {
		const envelope: ClientErrorTelemetryEnvelope = {
			v: TELEMETRY_VERSION,
			sentAt: new Date().toISOString(),
			events
		};
		body = JSON.stringify(envelope);
	} catch {
		const source = events[0];
		const fallbackId = source?.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		body = JSON.stringify({
			v: TELEMETRY_VERSION,
			sentAt: new Date().toISOString(),
			events: [
				{
					id: fallbackId,
					type: 'client_error',
					ts: new Date().toISOString(),
					payload: {
						id: fallbackId,
						type: 'telemetry_serialization_error',
						status: 0,
						message: 'Failed to serialize telemetry envelope',
						url: source?.payload.url ?? '',
						error: { serializationError: true }
					}
				}
			]
		});
	}

	try {
		if (typeof navigator.sendBeacon === 'function') {
			const queued = navigator.sendBeacon(
				TELEMETRY_ENDPOINT,
				new Blob([body], { type: 'application/json' })
			);
			if (queued) return;
		}
	} catch {
		// no-op: fall through to fetch fallback
	}

	if (typeof fetch !== 'function') return;

	try {
		void fetch(TELEMETRY_ENDPOINT, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body,
			keepalive: true
		}).catch(() => {});
	} catch {
		// no-op: telemetry should never break app error handling
	}
}

export function sendClientError(payload: ClientErrorPayload): void {
	const event: ClientErrorEvent = {
		id: payload.id,
		type: 'client_error',
		ts: new Date().toISOString(),
		payload: sanitizePayload(payload)
	};

	sendTelemetry([event]);
}
