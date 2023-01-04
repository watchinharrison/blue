<script>
	import Post from './Post.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { activePost } from '$lib/stores';

	export let post;

	let replies;

	let showReplies = true;

	function fetchReplies() {
		fetch(`/api/replies?postId=${post.id}`)
			.then((res) => res.json())
			.then((data) => {
				post.replies = data.replies;
			});
	}

	function fetchLikes() {
		fetch(`/api/likes?postId=${post.id}`)
			.then((res) => res.json())
			.then((data) => {
				post.likes_count = data.likes;
			});
	}

	onMount(() => {
		fetchLikes();
		fetchReplies();
	});

	$: {
		console.log('post', post);
	}
</script>

<div class="flex flex-col">
	<div class="w-full p-4" aria-live>
		<Post {post} />
	</div>
	{#if showReplies && post?.replies}
		<div class="lg:max-h-[30vh] overflow-y-scroll">
			{#each post.replies as reply, i}
				<div class="w-full p-4 py-2">
					<Post post={reply} />
				</div>
			{/each}
		</div>
	{/if}
</div>
