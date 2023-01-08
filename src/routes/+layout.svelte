<script>
	import '../app.css';
	import { activeImage } from '$lib/stores';
	import Nav from '$lib/Nav.svelte';
	import ImageModal from '$lib/ImageModal.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let navCollapsed = false;

	function collapseNav() {
		navCollapsed = !navCollapsed;
	}
</script>

<svelte:head>
	<title>Blu</title>
	<meta name="description" content="A social media site that doesn't suck" />
</svelte:head>

<div>
	<div class="lg:grid lg:grid-flow-col lg:grid-cols-12 gap-4 relative bg-slate-100">
		<Nav user={data.user} {navCollapsed} {collapseNav} />
		<div class="{navCollapsed ? 'lg:col-span-11' : 'lg:col-span-10'} pb-12 min-h-screen">
			<div class="" />
			<div class="p-2 pt-4 md:px-0 h-full">
				<slot />
			</div>
		</div>
	</div>

	{#if $activeImage}
		<ImageModal image={$activeImage} />
	{/if}

	<div class="fixed bottom-0 w-full bg-sky-100 p-1">
		<footer class="flex flex-row justify-end">
			<p
				class="text-xs font-mono p-2 pr-4 bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800 cursor-pointer"
			>
				<a href="/">Blu</a>
			</p>
		</footer>
	</div>
</div>
