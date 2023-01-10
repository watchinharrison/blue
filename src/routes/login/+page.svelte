<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<div class="lg:container lg:m-auto flex flex-row items-center justify-evenly mt-32 lg:mt-0 h-full">
	<div class="lg:w-2/5 lg:max-w-[300px]">
		<form method="POST" action="?/login" use:enhance>
			{#if data.error}
				<div class="p-2 bg-red-300 rounded-md">
					<p class="text-white">{data.error}</p>
				</div>
			{/if}
			{#if form?.success}
				<div class="p-2 bg-green-300 rounded-md">
					<p class="text-white">Successfully logged in! Welcome back, {data.user?.username}</p>
				</div>
			{/if}
			{#if form?.missing || form?.incorrect || form?.error}
				<div class="p-2 bg-red-300 rounded-md">
					{#if form?.missing}<p class="text-white">The email field is required</p>{/if}
					{#if form?.incorrect}<p class="text-white">Invalid credentials!</p>{/if}
					{#if form?.error}<p class="text-white">An error occurred! {form?.error}</p>{/if}
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
						class="font-montserrat bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-400 hover:opacity-85  tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounded"
						type="submit">Login</button
					>
					<button
						class="font-montserrat bg-clip-text text-transparent bg-gradient-to-t from-sky-800 to-blue-900 hover:opacity-85 tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounded"
						formaction="?/register">Register</button
					>
				</div>
			</div>
		</form>
	</div>
	<div class="lg:w-2/5 text-sky-800/80">
		<h2 class="mb-2">Here are the reasons you should register</h2>
		<ul class="list-disc list-inside">
			<li class="text-lg font-semibold">Get access to the best content</li>
			<li class="text-lg">Get access to the best content</li>
			<li class="font-semitbold">Get access to the best content</li>
			<li class="text-sm">Get access to the best content</li>
			<li class="text-xs">Get access to the best content</li>
		</ul>
	</div>
</div>
