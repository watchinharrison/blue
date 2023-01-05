<script>
	import Post from './Post.svelte';
	import { activePost } from '$lib/stores';

	let showReplies = true;
	let post = null;

	function fetchPost(id) {
		fetch(`/api/posts?id=${id}`)
			.then((res) => res.json())
			.then((data) => {
				post = data.post;
			});
	}

	activePost.subscribe((value) => {
		post = value;
		if (value.id) {
			fetchPost(value.id);
		}
	});
</script>

{#if post}
	<div class="flex flex-col">
		<div class="w-full p-4" aria-live>
			<Post {post} />
		</div>
		{#if showReplies && post?.replies}
			<div class="lg:max-h-[30vh] overflow-y-scroll">
				{#each post.replies as reply, i}
					<div class="w-full p-4 py-2 pl-12">
						<Post post={reply} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
