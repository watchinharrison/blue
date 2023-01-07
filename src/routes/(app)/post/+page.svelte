<script>
	import NewPost from '$lib/NewPost.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div>
	<NewPost user={data?.user} />
	<div class="">
		<h3>What to post?</h3>
		<p>Post a text, image, or video.</p>
		<ul>
			<li>Text</li>
			<li>Image</li>
			<li>Video</li>
		</ul>
	</div>
</div>
