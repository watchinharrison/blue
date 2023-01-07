<script>
	import { fade } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';
	import Post from './Post.svelte';
	import { activePost, activeImage } from '$lib/stores';

	let post = null;

	function fetchPost(id) {
		fetch(`/api/posts?id=${id}`)
			.then((res) => res.json())
			.then((data) => {
				post = data.post;
			});
	}

	activePost.subscribe((value) => {
		if (value?.id && post?.id !== value.id) {
			fetchPost(value.id);
		}
		post = value;
	});

	function closeDetail(event) {
		if (event.key === 'Escape' && !$activeImage) {
			activePost.set(null);
		}
	}

	function setActivePost(post) {
		activePost.update(() => post);
	}

	onMount(() => {
		document.addEventListener('keyup', closeDetail);
	});

	onDestroy(() => {
		document.removeEventListener('keyup', closeDetail);
	});
</script>

{#if post}
	<div class="flex flex-col">
		<div class="w-full p-4">
			<Post
				reposter={post.thread && post.text === '' ? post.user : null}
				post={post.thread && post.text === '' ? post.thread : post}
			/>
		</div>
		{#if $activePost.is_replying !== true && post?.replies}
			<div class="pb-4">
				{#each post.replies as reply, i}
					<div class="w-full p-4 py-2 pl-12">
						<div
							aria-label="Post"
							in:fade={{ duration: 500 }}
							on:click|stopPropagation={() => setActivePost(reply)}
							on:keyup|stopPropagation={(event) => {
								if (event.key === 'Enter') {
									setActivePost(reply);
								}
							}}
							class="cursor-pointer hover:brightness-90"
						>
							<Post post={reply} />
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}
