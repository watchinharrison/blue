<script>
	// @ts-nocheck
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { typewriter } from '$lib/transitions';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	async function handleSubmit(event) {
		const data = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});
		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<div class="w-2/3">
	<div class="w-2/5 max-w-[300px] m-auto">
		<div class="font-mono my-4 text-sm min-h-[25px]">
			{#if form?.success}
				<p in:typewriter class="text-black">Successfully updated profile!</p>
			{/if}
		</div>
		<form method="POST" on:submit|preventDefault={handleSubmit}>
			{#if form?.missing || form?.incorrect}
				<div class="p-2 bg-red-300 rounded-md">
					{#if form?.missing}<p class="text-white">The email field is required</p>{/if}
					{#if form?.incorrect}<p class="text-white">Invalid credentials!</p>{/if}
				</div>
			{/if}
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="email">First Name</label>
					<input
						required
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="firstName"
						type="text"
						value={data?.user?.first_name ? data.user.first_name : form?.first_name ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Last Name</label>
					<input
						required
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="lastName"
						type="text"
						value={data?.user?.last_name ? data.user.last_name : form?.last_name ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Username</label>
					<input
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="username"
						type="text"
						value={data?.user?.username ? data.user.username : form?.username ?? ''}
					/>
				</div>
				<div class="mt-2 flex flex-row justify-between">
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-800 to-blue-900 hover:opacity-85 tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounde"
						type="submit">Save</button
					>
				</div>
			</div>
		</form>
	</div>
</div>
