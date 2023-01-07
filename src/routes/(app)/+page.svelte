<script>
	// @ts-nocheck
	import { fade } from 'svelte/transition';
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '$lib/stores';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="max-w-[800px] m-auto">
	{#if data.user}
		<NewPost user={data.user} />
	{/if}
	{#if data?.posts?.length > 0}
		<div class="bg-sky-100 p-4 rounded-md">
			<div class="flex flex-col gap-4 inner-shadow">
				{#each data?.posts || [] as post, i}
					<div
						aria-label="Post"
						in:fade={{ duration: 500 }}
						class={$activePost?.id === post.id ? 'brightness-95' : ''}
					>
						<Post
							reposter={post.thread && post.text === '' ? post.user : null}
							post={post.thread && post.text === '' ? post.thread : post}
						/>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
