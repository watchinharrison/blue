<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { typewriter, whoosh } from '$lib/transitions';

	export let user;

	let ready = false;
	let hide = false;
	let activated = false;

	onMount(() => {
		ready = true;
	});

	function fadein(node, { delay = 0, duration = 1000 }) {
		const o = +getComputedStyle(node).opacity;

		return {
			delay,
			duration,
			css: (t) => `opacity: ${t * o}`
		};
	}

	function hideMenu() {
		activated = true;
		hide = !hide;
	}
</script>

<div class="lg:col-span-2 {hide ? 'w-fit' : 'w-full'} lg:h-full bg-sky-100">
	<header class="w-screen lg:w-auto">
		<div class="w-full flex flex-row justify-end">
			<button on:click={hideMenu} class="p-4 text-xs text-slate-400"
				>{hide ? 'Show' : 'Hide'}</button
			>
		</div>
		{#if !hide}
			<div out:whoosh={{ reverse: true }} class="flex-grow p-4 text-xs font-mono">
				<div class="min-h-[50px]">
					{#if ready}
						<h1 in:typewriter>Hello there.</h1>
						<h2 in:typewriter={{ delay: 1500 }}>Here are some options...</h2>
					{/if}
				</div>
				{#if ready}
					<nav
						in:fadein={{ delay: activated ? 0 : 3000, duration: activated ? 300 : 1000 }}
						class="flex flex-col p-2 mr-2 mt-4 gap-4"
					>
						<div class="flex flex-col gap-4">
							<h1
								class="text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800"
							>
								<a href="/">Timeline</a>
							</h1>
							<div>
								<h1
									class="text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-800 to-blue-300 indent-1.5"
								>
									<a href="/post">Post</a>
								</h1>
							</div>
						</div>
						{#if user?.id}
							<h1
								class="text-xl  bg-clip-text text-transparent bg-gradient-to-t from-sky-500 to-blue-600"
							>
								<a href="/{user?.username}">Profile</a>
							</h1>
							<h1
								class="text-xl  bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-300 indent-1.5"
							>
								<form method="POST" action="/?/logout">
									<button class="text-xl text-slate-300" type="submit">Logout</button>
								</form>
							</h1>
						{:else}
							<h1
								class="text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-700 to-blue-900"
							>
								<a href="/login">Register</a>
							</h1>
						{/if}
					</nav>
				{/if}
			</div>
		{/if}
	</header>
</div>
