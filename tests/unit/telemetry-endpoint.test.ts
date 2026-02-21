import { POST } from '../../src/routes/api/telemetry/+server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const VALID_ENVELOPE = {
	v: 1 as const,
	sentAt: '2026-02-21T00:00:00.000Z',
	events: [
		{
			id: 'event-1',
			type: 'client_error' as const,
			ts: '2026-02-21T00:00:00.000Z',
			payload: {
				id: 'error-1',
				type: 'page_error',
				status: 500,
				message: 'Unexpected crash',
				url: '/dashboard',
				error: { stack: 'example stack' }
			}
		}
	]
};

function createEvent(request: Request): Parameters<typeof POST>[0] {
	return {
		request
	} as Parameters<typeof POST>[0];
}

describe('POST /api/telemetry', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns 403 for cross-site requests', async () => {
		const request = new Request('http://localhost/api/telemetry', {
			method: 'POST',
			headers: { 'sec-fetch-site': 'cross-site', 'content-type': 'application/json' },
			body: JSON.stringify(VALID_ENVELOPE)
		});

		const response = await POST(createEvent(request));

		expect(response.status).toBe(403);
	});

	it('returns 204 for valid payload and logs event', async () => {
		const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const request = new Request('http://localhost/api/telemetry', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(VALID_ENVELOPE)
		});

		const response = await POST(createEvent(request));

		expect(response.status).toBe(204);
		expect(logSpy).toHaveBeenCalledTimes(1);
	});

	it('returns 400 for invalid payload shape', async () => {
		const request = new Request('http://localhost/api/telemetry', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ v: 1, sentAt: '2026-02-21T00:00:00.000Z', events: [] })
		});

		const response = await POST(createEvent(request));

		expect(response.status).toBe(400);
	});
});
