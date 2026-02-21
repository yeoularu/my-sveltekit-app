import { describe, expect, it } from 'vitest';
import {
	PASSWORD_MIN_LENGTH,
	USERNAME_MAX_LENGTH,
	USERNAME_MIN_LENGTH,
	isValidUsername
} from '../../src/lib/auth-policy';

describe('auth-policy', () => {
	it('defines password minimum length', () => {
		expect(PASSWORD_MIN_LENGTH).toBe(8);
	});

	it('accepts usernames within allowed range and charset', () => {
		const valid = `user_${'a'.repeat(USERNAME_MIN_LENGTH)}`;
		expect(isValidUsername(valid)).toBe(true);
	});

	it('rejects usernames outside constraints', () => {
		expect(isValidUsername('ab')).toBe(false);
		expect(isValidUsername('invalid-name')).toBe(false);
		expect(isValidUsername('a'.repeat(USERNAME_MAX_LENGTH + 1))).toBe(false);
	});
});
