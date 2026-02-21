<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();

	let authError = $state<string | null>(null);
	let isSigningIn = $state(false);
	let isSigningOut = $state(false);

	let signInUsername = $state('');
	let signInPassword = $state('');

	function getErrorMessage(error: unknown, fallback: string): string {
		return error instanceof Error ? error.message : fallback;
	}

	async function signInWithUsername(): Promise<void> {
		authError = null;

		if (!signInUsername || !signInPassword) {
			authError = 'Username and password are required.';
			return;
		}

		isSigningIn = true;

		try {
			const result = await authClient.signIn.username({
				username: signInUsername,
				password: signInPassword,
				rememberMe: true,
				callbackURL: resolve('/')
			});

			if (result.error) {
				authError = result.error.message ?? 'Sign-in failed.';
				return;
			}

			await goto(resolve('/'));
		} catch (error: unknown) {
			authError = getErrorMessage(error, 'Sign-in failed.');
		} finally {
			isSigningIn = false;
		}
	}

	async function signOut(): Promise<void> {
		authError = null;
		isSigningOut = true;

		try {
			const result = await authClient.signOut();
			if (result.error) {
				authError = result.error.message ?? 'Sign-out failed.';
				return;
			}
			await goto(resolve('/'));
		} catch (error: unknown) {
			authError = getErrorMessage(error, 'Sign-out failed.');
		} finally {
			isSigningOut = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In | my-sveltekit-app</title>
</svelte:head>

<main class="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-4 p-6 sm:p-8">
	<h1 class="text-3xl font-semibold">Sign in</h1>
	<p class="text-slate-300">Authenticate with username and password.</p>

	{#if !$session.isPending && $session.data}
		<p class="text-sm text-slate-300">
			Signed in as <span class="font-medium text-slate-100">{$session.data.user.email}</span>
		</p>
		<div class="flex gap-3">
			<a
				class="inline-flex items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
				href={resolve('/')}>Go home</a
			>
			<button
				class="inline-flex items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={isSigningOut}
				onclick={signOut}
				type="button"
			>
				{isSigningOut ? 'Signing out...' : 'Sign out'}
			</button>
		</div>
	{:else}
		<form
			class="flex flex-col gap-3 rounded-md border border-slate-700 p-4"
			onsubmit={(event) => {
				event.preventDefault();
				void signInWithUsername();
			}}
		>
			<h2 class="text-sm font-medium text-slate-200">Existing account</h2>
			<input
				bind:value={signInUsername}
				class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
				autocomplete="username"
				placeholder="Username"
				required
				type="text"
			/>
			<input
				bind:value={signInPassword}
				class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm"
				autocomplete="current-password"
				placeholder="Password"
				required
				type="password"
			/>
			<button
				class="inline-flex w-fit items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={isSigningIn}
				type="submit"
			>
				{isSigningIn ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	{/if}

	{#if authError}
		<p class="text-sm text-red-400" role="alert">{authError}</p>
	{/if}
</main>
