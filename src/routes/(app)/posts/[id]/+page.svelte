<script>
	import Post from '$lib/Post.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="flex flex-col p-2 rounded-md">
	<div class="p-4 bg-sky-100">
		<Post post={data.post} />
	</div>
	{#if data.post?.replies && data.post.replies.length > 0}
		<div class="mt-4 bg-sky-100 p-4 rounded-md">
			<div class="flex flex-col gap-4 inner-shadow">
				{#each data.post.replies as reply, i}
					<div class="w-full p-4 py-2 pl-12">
						<Post post={reply} />
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
