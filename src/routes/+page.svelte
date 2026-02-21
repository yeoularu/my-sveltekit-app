<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
</script>

<svelte:head>
	<title>my-sveltekit-app</title>
</svelte:head>

<main class="mx-auto flex min-h-svh max-w-3xl flex-col justify-center gap-3 p-6 sm:p-8">
	<h1 class="text-3xl font-semibold">my-sveltekit-app</h1>
	<p class="text-slate-300">Clean starter state. App logic will be added next.</p>
	{#if !$session.isPending && $session.data}
		<p class="text-sm text-slate-300">
			Signed in as <span class="font-medium text-slate-100">{$session.data.user.email}</span>
		</p>
	{/if}
	<a
		class="inline-flex w-fit items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
		href={resolve('/auth/sign-in')}
	>
		{!$session.isPending && $session.data ? 'Manage account' : 'Sign in with username'}
	</a>
	{#if !$session.isPending && $session.data}
		<a
			class="inline-flex w-fit items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
			href={resolve('/settings')}
		>
			Open settings
		</a>
		{#if $session.data.user.role === 'admin'}
			<a
				class="inline-flex w-fit items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
				href={resolve('/admin')}
			>
				Open admin
			</a>
		{/if}
	{/if}
</main>
