<script>
	import PostDetail from '$lib/PostDetail.svelte';
	import NewPost from '$lib/NewPost.svelte';
	import { activePost } from '$lib/stores';

	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			css: (t, u) => {
				const x = 300 - t * 300;
				return window.innerWidth < 1024
					? `transform: ${existingTransform} translateY(${x}px); opacity: ${t}`
					: `transform: ${existingTransform} translateX(${x}px); opacity: ${t}`;
			}
		};
	}

	function fadein(node, { delay = 0 }) {
		const o = +getComputedStyle(node).opacity;

		return {
			delay,
			duration: 400,
			css: (t) => `opacity: ${t * o}`
		};
	}

	let inert;
	activePost.subscribe((value) => {
		inert = value !== null && window.innerWidth < 720 ? true : undefined;
	});
</script>

<main class="lg:container lg:mx-auto flex flex-col lg:flex-row gap-4">
	<article {inert} class="lg:w-2/3" aria-hidden={$activePost !== null}>
		<slot />
	</article>
	<aside class="lg:col-span-4 lg:w-1/3 pr-4">
		{#if $activePost}
			<div
				transition:fadein
				aria-modal="true"
				class="fixed lg:hidden top-0 left-0 w-full h-full bg-slate-600 bg-opacity-70"
			/>
			<div
				in:whoosh
				out:whoosh
				class="fixed lg:static h-[70vh] bg-sky-100 lg:h-auto bottom-0 left-0 ld:block col-span-4 w-full rounded-t-md lg:rounded-b-md overflow-y-auto"
			>
				<div class="sticky top-0 z-10 flex flex-row justify-end">
					<button on:click={() => ($activePost = null)} class="p-4 pb-0 text-slate-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
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
				<div aria-label="Post Detail" in:whoosh={{ delay: 400 }}>
					<PostDetail />
				</div>
				{#if $activePost.is_replying}
					<div
						aria-label="Reply Post"
						in:fadein
						class="fixed bottom-3 p-6 w-full lg:static lg:w-auto lg:bottom-0 lg:py-0 lg:pb-2"
					>
						<NewPost post={$activePost} />
					</div>
				{/if}
			</div>
		{/if}
	</aside>
</main>
