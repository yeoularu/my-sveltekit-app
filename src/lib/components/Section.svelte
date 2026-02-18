<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		class?: string;
		children: Snippet;
	}

	let { title, class: className = '', children }: Props = $props();
</script>

<section class="space-y-3 rounded border border-slate-800 p-4 {className}">
	{#if title}
		<h2 class="font-medium">{title}</h2>
	{/if}
	{@render children()}
</section>
