import * as v from 'valibot';
import { form, getRequestEvent, query } from '$app/server';

const PREFS_COOKIE = 'demo_prefs';
const NICKNAME_MIN_LENGTH = 2;
const NICKNAME_MAX_LENGTH = 24;

type Preferences = {
	nickname: string;
	focusMode: boolean;
};

const DEFAULT_PREFS: Preferences = {
	nickname: 'Guest',
	focusMode: false
};

function createDefaultPrefs(): Preferences {
	return { ...DEFAULT_PREFS };
}

const storedPrefsSchema = v.object({
	nickname: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(NICKNAME_MIN_LENGTH),
		v.maxLength(NICKNAME_MAX_LENGTH)
	),
	focusMode: v.boolean()
});

const savePrefsInput = v.object({
	nickname: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(NICKNAME_MIN_LENGTH, `Nickname must be at least ${NICKNAME_MIN_LENGTH} characters`),
		v.maxLength(NICKNAME_MAX_LENGTH, `Nickname must be ${NICKNAME_MAX_LENGTH} characters or less`)
	),
	focusMode: v.optional(v.boolean(), false)
});

function readPrefs(): Preferences {
	const { cookies } = getRequestEvent();
	const raw = cookies.get(PREFS_COOKIE);
	if (!raw) return createDefaultPrefs();

	try {
		const parsed = v.safeParse(storedPrefsSchema, JSON.parse(raw));
		return parsed.success ? parsed.output : createDefaultPrefs();
	} catch {
		return createDefaultPrefs();
	}
}

function writePrefs(next: Preferences) {
	const { cookies, url } = getRequestEvent();

	cookies.set(PREFS_COOKIE, JSON.stringify(next), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 30
	});
}

export const getPreferences = query(async () => {
	return readPrefs();
});

export const savePreferences = form(savePrefsInput, async ({ nickname, focusMode }) => {
	const current = readPrefs();
	const next: Preferences = {
		...current,
		nickname,
		focusMode
	};

	writePrefs(next);
	await getPreferences().set(next);

	return { savedAt: new Date().toISOString() };
});
