<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';
	import type { PageProps } from './$types';
	import { getPreferences, savePreferences } from './demo.remote';

	let { data }: PageProps = $props();
	let submitError = $state<string | null>(null);

	async function syncFormFieldsFromCookie() {
		try {
			const prefs = await getPreferences();
			savePreferences.fields.set({
				nickname: prefs.nickname,
				focusMode: prefs.focusMode
			});
		} catch (error) {
			console.warn('Failed to sync form fields from cookie', error);
		}
	}

	onMount(() => {
		void syncFormFieldsFromCookie();
	});
</script>

<main class="mx-auto min-h-svh max-w-3xl space-y-6 p-6 sm:p-8">
	<header class="space-y-1">
		<h1 class="text-2xl font-semibold">Load + Remote Functions: HttpOnly Cookie Demo</h1>
		<p class="text-sm text-slate-300">SSR rendered at: {data.renderedAt}</p>
	</header>

	<Section title="Current Preferences (remote query)">
		{#await getPreferences() then prefs}
			<dl class="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
				<div class="rounded border border-slate-700 px-3 py-2">
					<dt class="text-xs text-slate-400">nickname</dt>
					<dd>{prefs.nickname}</dd>
				</div>
				<div class="rounded border border-slate-700 px-3 py-2">
					<dt class="text-xs text-slate-400">focusMode</dt>
					<dd>{prefs.focusMode ? 'on' : 'off'}</dd>
				</div>
			</dl>
		{:catch}
			<p class="text-sm text-red-400">Failed to load preferences.</p>
		{/await}
	</Section>

	<Section title="Update Preferences (remote form)">
		<form
			{...savePreferences.enhance(async ({ submit }) => {
				submitError = null;
				try {
					await submit().updates(getPreferences());
				} catch (error) {
					console.warn('Failed to save preferences', error);
					submitError = 'Failed to save preferences. Please try again.';
					return;
				}
				const isSuccess =
					(savePreferences.fields.allIssues()?.length ?? 0) === 0 &&
					!!savePreferences.result?.savedAt;
				if (isSuccess) {
					submitError = null;
					await syncFormFieldsFromCookie();
				}
			})}
			class="space-y-3"
		>
			<label class="block space-y-1">
				<span class="text-sm">Nickname</span>
				<input
					{...savePreferences.fields.nickname.as('text')}
					class="w-full rounded border border-slate-700 bg-transparent px-3 py-2"
					placeholder="at least 2 characters"
					disabled={!!savePreferences.pending}
				/>
			</label>

			{#each savePreferences.fields.nickname.issues() as issue (issue.message)}
				<p class="text-sm text-red-400">{issue.message}</p>
			{/each}

			{#if submitError}
				<p class="text-sm text-red-400">{submitError}</p>
			{/if}

			<label class="inline-flex items-center gap-2 text-sm">
				<input
					{...savePreferences.fields.focusMode.as('checkbox')}
					disabled={!!savePreferences.pending}
				/>
				<span>Enable focus mode</span>
			</label>

			<div>
				<button
					class="rounded border border-slate-700 px-3 py-2 text-sm disabled:opacity-50"
					disabled={!!savePreferences.pending}
				>
					{savePreferences.pending ? 'Saving...' : 'Save'}
				</button>
			</div>
		</form>

		{#if savePreferences.result?.savedAt}
			<p class="text-xs text-slate-400">Saved at: {savePreferences.result.savedAt}</p>
		{/if}
	</Section>

	<Section class="text-xs text-slate-400">
		<p>storage: HttpOnly cookie (`demo_prefs`)</p>
		<p>load: page metadata</p>
		<p>query: `getPreferences`</p>
		<p>form: `savePreferences`</p>
	</Section>
</main>
