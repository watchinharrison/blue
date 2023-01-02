<script>
	import Post from './Post.svelte';

	export let post;
</script>

<div class="flex flex-row">
	<div class="w-full p-4">
		<Post {post} />
	</div>
	<div class="" />
</div>
