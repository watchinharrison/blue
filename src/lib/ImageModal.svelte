<script>
	import { activeImage } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';

	export let image;

	function closeImage(event) {
		if (event.key === 'Escape') {
			activeImage.set(null);
		}
	}

	onMount(() => {
		document.addEventListener('keyup', closeImage);
	});

	onDestroy(() => {
		document.removeEventListener('keyup', closeImage);
	});
</script>

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
		<img src={image.src} class="max-h-[90vh] max-w-[90vw] object-contain" alt={image.alt} />
		{#if image.alt}
			<p>{image.alt}</p>
		{/if}
	</div>
</div>
