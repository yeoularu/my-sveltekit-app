const SIGN_IN_PATH = '/auth/sign-in';

export function getSignInRedirectPath(url: URL): string {
	const next = encodeURIComponent(url.pathname + url.search);
	return `${SIGN_IN_PATH}?next=${next}`;
}
