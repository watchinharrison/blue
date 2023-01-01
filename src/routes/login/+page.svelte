<script>
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

{#if form?.success}
	<!-- this message is ephemeral; it exists because the page was rendered in
       response to a form submission. it will vanish if the user reloads -->
	<p>Successfully logged in! Welcome back, {data.user?.email}</p>
{/if}

<div
	class="lg:container lg:m-auto flex flex-row items-center justify-center lg:h-screen mt-32 lg:mt-0"
>
	<div class="lg:w-2/5">
		<form method="POST" action="?/login">
			{#if form?.missing || form?.incorrect}
				<div class="p-2 bg-red-300 rounded-md">
					{#if form?.missing}<p class="text-white">The email field is required</p>{/if}
					{#if form?.incorrect}<p class="text-white">Invalid credentials!</p>{/if}
				</div>
			{/if}
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="email">Email</label>
					<input
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="email"
						type="email"
						value={form?.email ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Password</label>
					<input
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="password"
						type="password"
					/>
				</div>
				<div class="mt-2 flex flex-row justify-between">
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-400 hover:opacity-85  tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounded"
						type="submit">Login</button
					>
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-800 to-blue-900 hover:opacity-85 tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounded"
						formaction="?/register">Register</button
					>
				</div>
			</div>
		</form>
	</div>
</div>
