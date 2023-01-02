<script>
	import Post from '$lib/Post.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="lg:container lg:m-auto">
	<Post post={data.post} />
</div>
