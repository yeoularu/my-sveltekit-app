const USERNAME_CHARSET_PATTERN = /^[a-zA-Z0-9_]+$/;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_VALIDATION_MESSAGE = `Username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} chars (letters, numbers, underscore).`;

export const PASSWORD_MIN_LENGTH = 8;

export function isValidUsername(value: string): boolean {
	const length = value.length;
	return (
		length >= USERNAME_MIN_LENGTH &&
		length <= USERNAME_MAX_LENGTH &&
		USERNAME_CHARSET_PATTERN.test(value)
	);
}
