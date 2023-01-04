<script>
	// @ts-nocheck
	import { fade } from 'svelte/transition';
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '$lib/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	function setActivePost(post) {
		activePost.update((...value) => ({ ...value, ...post }));
	}
</script>

<div class="">
	<NewPost />
	<div class="lg:h-[69vh] scroll-smooth overflow-scroll bg-sky-100 p-4 rounded-md">
		<div class="flex flex-col gap-4 scroll-smooth inner-shadow">
			{#each data?.posts || [] as post, i}
				<div
					aria-label="Post"
					in:fade={{ duration: 500 }}
					on:click={() => setActivePost(post)}
					on:keyup={(event) => {
						if (event.key === 'Enter') {
							setActivePost(post);
						}
					}}
					class="cursor-pointer {i === data?.posts.length - 1 ? 'pb-4' : ''}"
				>
					<Post {post} />
				</div>
			{/each}
		</div>
	</div>
</div>
