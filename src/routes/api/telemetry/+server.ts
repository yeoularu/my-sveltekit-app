import * as v from 'valibot';
import type { RequestHandler } from './$types';
import { safeJsonStringify } from '$lib/error';

const MAX_BODY_BYTES = 32 * 1024;
const MAX_EVENTS = 20;

const clientErrorPayloadSchema = v.object({
	id: v.string(),
	type: v.string(),
	status: v.number(),
	message: v.string(),
	url: v.string(),
	error: v.record(v.string(), v.unknown())
});

const clientErrorEventSchema = v.object({
	id: v.string(),
	type: v.literal('client_error'),
	ts: v.string(),
	payload: clientErrorPayloadSchema
});

const telemetryEnvelopeSchema = v.object({
	v: v.literal(1),
	sentAt: v.string(),
	events: v.pipe(v.array(clientErrorEventSchema), v.minLength(1), v.maxLength(MAX_EVENTS))
});

export const POST: RequestHandler = async ({ request }) => {
	const fetchSite = request.headers.get('sec-fetch-site');
	if (fetchSite === 'cross-site') {
		return new Response(null, { status: 403 });
	}

	const contentLength = Number(request.headers.get('content-length'));
	if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
		return new Response(null, { status: 413 });
	}

	let body: string;
	try {
		body = await request.text();
	} catch {
		return new Response(null, { status: 400 });
	}

	if (!body) return new Response(null, { status: 400 });
	if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
		return new Response(null, { status: 413 });
	}

	let payload: unknown;
	try {
		payload = JSON.parse(body);
	} catch {
		return new Response(null, { status: 400 });
	}

	const parsed = v.safeParse(telemetryEnvelopeSchema, payload);
	if (!parsed.success) {
		return new Response(null, { status: 400 });
	}

	for (const event of parsed.output.events) {
		console.error(
			safeJsonStringify({
				level: 'error',
				source: 'client',
				telemetryVersion: parsed.output.v,
				eventType: event.type,
				eventId: event.id,
				eventTs: event.ts,
				...event.payload
			})
		);
	}

	return new Response(null, { status: 204 });
};
