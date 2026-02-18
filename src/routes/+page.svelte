<script lang="ts">
	import { doubleNumber } from './data.remote';

	let { data } = $props();
</script>

<main class="mx-auto min-h-svh max-w-2xl space-y-4 p-6">
	<h1 class="text-xl font-semibold">Simple Load + Remote Form</h1>

	<section class="space-y-1 rounded border border-slate-800 p-4">
		<h2 class="font-medium">1) +page.server.ts (load)</h2>
		<p class="text-sm">serverTime: {data.serverTime}</p>
	</section>

	<section class="space-y-3 rounded border border-slate-800 p-4">
		<h2 class="font-medium">2) data.remote.ts (form)</h2>

		<form {...doubleNumber} class="flex items-center gap-2">
			<input
				{...doubleNumber.fields.value.as('number')}
				class="w-20 rounded border border-slate-700 px-2 py-1"
				disabled={!!doubleNumber.pending}
			/>
			<button
				class="rounded border border-slate-700 px-2 py-1 text-sm disabled:opacity-50"
				disabled={!!doubleNumber.pending}
			>
				{doubleNumber.pending ? 'Running...' : 'Double it'}
			</button>
		</form>

		{#each doubleNumber.fields.value.issues() as issue (issue.message)}
			<p class="text-red-400">{issue.message}</p>
		{/each}

		{#if doubleNumber.result}
			<div class="space-y-1 text-sm">
				<p>input: {doubleNumber.result.input}</p>
				<p>doubled: {doubleNumber.result.doubled}</p>
				<p>processedAt: {doubleNumber.result.processedAt}</p>
			</div>
		{/if}
	</section>
</main>
