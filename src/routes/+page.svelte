<script>
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '../stores';

	/** @type {import('./$types').PageData} */
	export let data;

	function setActivePost(post) {
		activePost.update((value) => post);
	}
</script>

<div class="lg:container lg:mx-auto">
	<NewPost />
	<div class="h-[78vh] scroll-smooth overflow-scroll bg-slate-200 p-4 rounded-md">
		<div class="flex flex-col gap-4 scroll-smooth inner-shadow h-[400px] ">
			{#each data?.posts || [] as post}
				<div
					on:click={() => setActivePost(post)}
					on:keydown={() => setActivePost(post)}
					class="cursor-pointer"
				>
					<Post {post} />
				</div>
			{/each}
		</div>
	</div>
</div>
