<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Admin | my-sveltekit-app</title>
</svelte:head>

<main class="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-4 p-6 sm:p-8">
	<h1 class="text-3xl font-semibold">Admin</h1>
	<p class="text-sm text-slate-300">Admin page is intentionally blank for now.</p>
	<a
		class="inline-flex w-fit items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
		href={resolve('/')}
	>
		Back to home
	</a>
</main>
