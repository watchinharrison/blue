<script>
	import Post from './Post.svelte';
	import { onMount, onDestroy } from 'svelte';

	export let post;

	function fetchLikes() {
		fetch(`/api/likes?postId=${post.id}`)
			.then((res) => res.json())
			.then((data) => {
				post.likes_count = data.likes;
			});
	}

	onMount(() => {
		fetchLikes();
	});
</script>

<div class="flex flex-row">
	<div class="w-full p-4">
		<Post {post} />
	</div>
	<div class="" />
</div>
