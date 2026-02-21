<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const defaultRole = 'user';
</script>

<svelte:head>
	<title>Admin | my-sveltekit-app</title>
</svelte:head>

<main class="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 p-6 sm:p-8">
	<header class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="text-3xl font-semibold">Admin</h1>
			<p class="text-sm text-slate-300">User management powered by Better Auth admin plugin.</p>
		</div>
		<a
			class="inline-flex items-center rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
			href={resolve('/')}
		>
			Back to home
		</a>
	</header>

	<section class="rounded-md border border-slate-700 bg-slate-900/40 p-4">
		<h2 class="mb-3 text-lg font-medium">Create user</h2>
		<form action="?/createUser" class="grid gap-3 sm:grid-cols-2" method="POST">
			<label class="flex flex-col gap-1 text-sm">
				<span class="text-slate-300">Name</span>
				<input
					class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
					name="name"
					required
					type="text"
					value={form?.createUserValues?.name ?? ''}
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm">
				<span class="text-slate-300">Email</span>
				<input
					class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
					name="email"
					required
					type="email"
					value={form?.createUserValues?.email ?? ''}
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm">
				<span class="text-slate-300">Username</span>
				<input
					class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
					minlength="3"
					name="username"
					required
					type="text"
					value={form?.createUserValues?.username ?? ''}
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm">
				<span class="text-slate-300">Password</span>
				<input
					class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
					minlength="8"
					name="password"
					required
					type="password"
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm">
				<span class="text-slate-300">Role</span>
				<select class="rounded-md border border-slate-600 bg-slate-900 px-3 py-2" name="role">
					<option selected={(form?.createUserValues?.role ?? defaultRole) === 'user'} value="user">
						user
					</option>
					<option
						selected={(form?.createUserValues?.role ?? defaultRole) === 'admin'}
						value="admin"
					>
						admin
					</option>
				</select>
			</label>
			<div class="flex items-end">
				<button
					class="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
					type="submit"
				>
					Create user
				</button>
			</div>
		</form>
		{#if form?.createUserError}
			<p class="mt-3 text-sm text-red-400" role="alert">{form.createUserError}</p>
		{/if}
		{#if form?.createUserSuccess}
			<p class="mt-3 text-sm text-emerald-400">{form.createUserSuccess}</p>
		{/if}
	</section>

	<section class="rounded-md border border-slate-700 bg-slate-900/40 p-4">
		<div class="mb-3 flex items-center justify-between gap-2">
			<h2 class="text-lg font-medium">Users</h2>
			<p class="text-sm text-slate-300">Total: {data.total}</p>
		</div>
		{#if data.users.length === 0}
			<p class="text-sm text-slate-300">No users found.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[680px] text-left text-sm">
					<thead class="text-slate-300">
						<tr class="border-b border-slate-700">
							<th class="px-2 py-2 font-medium">Name</th>
							<th class="px-2 py-2 font-medium">Email</th>
							<th class="px-2 py-2 font-medium">Username</th>
							<th class="px-2 py-2 font-medium">Role</th>
							<th class="px-2 py-2 font-medium">Banned</th>
							<th class="px-2 py-2 font-medium">Created</th>
						</tr>
					</thead>
					<tbody>
						{#each data.users as user (user.id)}
							<tr class="border-b border-slate-800">
								<td class="px-2 py-2">{user.name || '-'}</td>
								<td class="px-2 py-2">{user.email || '-'}</td>
								<td class="px-2 py-2">{user.username ?? '-'}</td>
								<td class="px-2 py-2">{user.role ?? 'user'}</td>
								<td class="px-2 py-2">{user.banned ? 'yes' : 'no'}</td>
								<td class="px-2 py-2">{user.createdAt ?? '-'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</main>
