<script>
	import Post from '$lib/Post.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div>
	<Post post={data.post} />
</div>
