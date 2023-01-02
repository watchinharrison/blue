<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { activePost } from '../stores';
	import { onMount } from 'svelte';
	import PostDetail from '$lib/PostDetail.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let ready = false;
	let hide = false;

	let post;

	activePost.subscribe((value) => {
		console.log('value', value);
		post = value;
	});

	onMount(() => {
		ready = true;
	});

	function typewriter(node, { speed = 1, delay = 0 }) {
		const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(`This transition only works on elements with a single text node child`);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.01);

		return {
			delay,
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
			}
		};
	}

	function fadein(node, { delay = 0 }) {
		console.log('node', getComputedStyle(node).opacity);
		const o = +getComputedStyle(node).opacity;

		return {
			delay,
			duration: 400,
			css: (t) => `opacity: ${t * o}`
		};
	}

	function hideMenu() {
		hide = !hide;
	}
</script>

<svelte:head>
	<title>Blue</title>
	<meta name="description" content="A social media site that doesn't suck" />
</svelte:head>

<div class="lg:grid lg:grid-flow-col lg:grid-cols-12 gap-4 relative">
	<div class="bg-sky-100 col-span-2 shadow-lg shadow-sky-100 flex flex-row">
		<div class="flex-grow p-4 text-xs font-mono">
			<div class="min-h-[50px]">
				{#if ready}
					<h1 transition:typewriter>Hello there.</h1>
					<h2 transition:typewriter={{ delay: 1500 }}>Here are some options...</h2>
				{/if}
			</div>
			{#if !hide}
				<nav
					class="opacity-{ready && !hide ? '1' : '0'} delay-[{hide
						? '0'
						: '3500'}ms] transition-opacity duration-1000 flex flex-col p-2 mr-2 mt-4 gap-4"
				>
					<div class="flex flex-col gap-4">
						<h1
							class="text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-500 to-blue-500"
						>
							<a href="/">Timeline</a>
						</h1>
						<div>
							<h1
								class="text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-300 indent-1.5"
							>
								<a href="/post">Post</a>
							</h1>
						</div>
					</div>
					{#if data.user?.email}
						<h1
							class="text-xl  bg-clip-text text-transparent bg-gradient-to-t from-sky-500 to-blue-600"
						>
							<a href="/profile">Profile</a>
						</h1>
						<h1
							class="text-xl  bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-300 indent-1.5"
						>
							<form method="POST" action="?/logout">
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
		<div class="mr-2">
			<button on:click={hideMenu} class="p-2 text-xs text-slate-400"
				>{hide ? 'Show' : 'Hide'}</button
			>
		</div>
	</div>
	<div class="lg:col-span-6">
		<div class="" />
		<div class="p-2 pt-4 md:px-0">
			<slot />
		</div>
		<div class="" />
	</div>
	<div class="md:block col-span-4 w-full">
		{#if post}
			<div class="transition">
				<PostDetail {post} />
			</div>
		{/if}
		{#if !data.user?.email}
			<div class="p-2 dark:text-white">Why Login here</div>
		{/if}
	</div>
</div>
