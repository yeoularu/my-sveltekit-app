<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Settings | my-sveltekit-app</title>
</svelte:head>

<main class="mx-auto flex min-h-svh w-full max-w-3xl flex-col justify-center gap-6 p-6 sm:p-8">
	<header class="space-y-1">
		<h1 class="text-3xl font-semibold">Settings</h1>
		<p class="text-sm text-slate-300">Your account profile details.</p>
	</header>

	<section class="rounded-md border border-slate-700 bg-slate-900/40 p-4">
		<dl class="grid gap-3 text-sm">
			<div class="grid gap-1">
				<dt class="text-slate-400">Name</dt>
				<dd class="text-slate-100">{data.account.name}</dd>
			</div>
			<div class="grid gap-1">
				<dt class="text-slate-400">Email</dt>
				<dd class="text-slate-100">{data.account.email}</dd>
			</div>
			<div class="grid gap-1">
				<dt class="text-slate-400">Username</dt>
				<dd class="text-slate-100">{data.account.username ?? '-'}</dd>
			</div>
		</dl>
	</section>

	<div class="flex gap-3">
		<a
			class="inline-flex items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
			href={resolve('/')}
		>
			Back home
		</a>
		<a
			class="inline-flex items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
			href={resolve('/admin')}
		>
			Open admin
		</a>
	</div>
</main>
