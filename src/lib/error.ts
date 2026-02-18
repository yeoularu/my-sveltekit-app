export function createErrorId(): string {
	return crypto.randomUUID();
}

export function createAppError(code: string, message: string, id = createErrorId()): App.Error {
	return { message, code, id };
}

export function safeJsonStringify(value: unknown): string {
	try {
		return JSON.stringify(value);
	} catch {
		return JSON.stringify({
			level: 'error',
			type: 'serialization_error',
			message: 'Failed to serialize log payload'
		});
	}
}

function serializeUnknown(value: unknown): unknown {
	if (value === null) return null;

	const t = typeof value;
	if (t === 'string' || t === 'number' || t === 'boolean') return value;
	if (t === 'bigint') return String(value);
	if (t === 'undefined') return 'undefined';
	if (t === 'symbol') return String(value);
	if (t === 'function') {
		const fn = value as (...args: unknown[]) => unknown;
		return `[function ${fn.name || 'anonymous'}]`;
	}

	try {
		return JSON.parse(safeJsonStringify(value));
	} catch {
		return '[unserializable]';
	}
}

export function serializeError(error: unknown): Record<string, unknown> {
	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
			stack: error.stack
		};
	}
	return { raw: serializeUnknown(error) };
}
