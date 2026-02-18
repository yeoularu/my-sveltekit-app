<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status}: {page.error?.message ?? 'Error'}</title>
</svelte:head>

<main class="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-3 p-6">
	<h1 class="text-2xl font-semibold">{page.status}</h1>
	<p>{page.error?.message ?? 'Unknown error'}</p>

	{#if page.error?.code}
		<p class="text-sm text-slate-400">code: {page.error.code}</p>
	{/if}

	{#if page.error?.id}
		<p class="text-sm text-slate-400">error id: {page.error.id}</p>
	{/if}
</main>
