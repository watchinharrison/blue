<script>
	import { fade } from 'svelte/transition';

	import '../app.css';
	import { activePost } from '$lib/stores';
	import Nav from '$lib/Nav.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let post;

	activePost.subscribe((value) => {
		post = value;
	});
</script>

<svelte:head>
	<title>Blue</title>
	<meta name="description" content="A social media site that doesn't suck" />
</svelte:head>

<div class="lg:grid lg:grid-flow-col lg:grid-cols-12 gap-4 relative">
	<header class="bg-sky-100 col-span-2 shadow-lg shadow-sky-100 flex flex-row lg:h-screen">
		<Nav user={data.user} />
	</header>
	<div class="lg:col-span-10">
		<div class="" />
		<div class="p-2 pt-4 md:px-0 h-full">
			<slot />
		</div>
		<div class="">
			<footer>Footer here</footer>
		</div>
	</div>
</div>
