<script>
	import { fade } from 'svelte/transition';

	import '../app.css';
	import { activePost, activeImage } from '$lib/stores';
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

<div>
	<div class="lg:grid lg:grid-flow-col lg:grid-cols-12 gap-4 relative">
		<Nav user={data.user} />
		<div class="lg:col-span-10 pb-12">
			<div class="" />
			<div class="p-2 pt-4 md:px-0 h-full">
				<slot />
			</div>
		</div>
	</div>

	{#if $activeImage}
		<div class="fixed top-0 h-full w-full">
			<div class="bg-black bg-opacity-50 h-full w-full" />
			<div class="fixed top-10 right-10 flex flex-row justify-end z-10">
				<button
					class="text-xs p-2 pr-4 text-sky-300 cursor-pointer"
					on:click={() => activeImage.set(null)}
					on:click={() => activeImage.update(() => null)}
					on:keyup={() => activeImage.update(() => null)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="currentColor"
						class="bi bi-x"
						viewBox="0 0 16 16"
					>
						<path
							d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
						/>
					</svg>
				</button>
			</div>
			<div class="fixed top-0 h-full w-full flex flex-col justify-center items-center">
				<img
					src={$activeImage.src}
					class="max-h-[90vh] max-w-[90vw] object-contain"
					alt={activeImage.alt}
				/>
			</div>
		</div>
	{/if}

	<div class="fixed bottom-0 w-full bg-sky-100 p-1">
		<footer class="flex flex-row justify-end">
			<p
				class="text-xs p-2 pr-4 bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800 cursor-pointer"
			>
				Blue
			</p>
		</footer>
	</div>
</div>
