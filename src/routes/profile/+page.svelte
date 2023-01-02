<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<div class="h-screen lg:container lg:m-auto flex flex-row items-center justify-center">
	<div class="w-2/5">
		<form method="POST">
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
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="firstName"
						type="text"
						value={data.user?.first_name ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Last Name</label>
					<input
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="lastName"
						type="text"
						value={data.user?.last_name ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Username</label>
					<input
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="username"
						type="text"
						value={data.user?.username ?? ''}
					/>
				</div>
				<div class="mt-2 flex flex-row justify-between">
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-800 to-blue-900 hover:opacity-85 tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounde"
						type="submit">Save</button
					>
				</div>
			</div>
			{#if form?.success}
				<div class="p-2 bg-cyan-500 rounded-md mt-2">
					<p class="text-white">Successfully updated profile!</p>
				</div>
			{/if}
		</form>
	</div>
</div>
