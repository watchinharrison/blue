<script>
	import Post from '$lib/Post.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="w-2/3">
	<Post post={data.post} />
</div>
