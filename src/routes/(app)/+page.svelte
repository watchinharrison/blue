<script>
	// @ts-nocheck
	import { fade } from 'svelte/transition';
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '$lib/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	function setActivePost(post) {
		activePost.update((value) => post);
	}
</script>

<div class="lg:w-2/3">
	<NewPost />
	<div class="lg:h-[79vh] scroll-smooth overflow-scroll bg-slate-200 p-4 rounded-md">
		<div class="flex flex-col gap-4 scroll-smooth inner-shadow lg:h-[400px] ">
			{#each data?.posts || [] as post, i}
				<div
					in:fade={{ duration: 500 }}
					on:click={() => setActivePost(post)}
					on:keydown={() => setActivePost(post)}
					class="cursor-pointer {i === data?.posts.length - 1 ? 'pb-4' : ''}"
				>
					<Post {post} />
				</div>
			{/each}
		</div>
	</div>
</div>
