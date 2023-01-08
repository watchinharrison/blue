<script>
	import ProfileBanner from '$lib/ProfileBanner.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '$lib/stores';

	export let data;
	export let user;
	export let showEdit = false;
</script>

<div class="">
	<ProfileBanner {showEdit} {data} {user} />
	<div class="bg-sky-100 p-4 rounded-b-md">
		<div class="flex flex-col gap-4 inner-shadow">
			{#each data?.posts || [] as post, i}
				<div class={i === data?.posts.length - 1 ? 'pb-4' : ''}>
					<Post
						reposter={post.thread && post.text === '' ? post.user : null}
						post={post.thread && post.text === '' ? post.thread : post}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>
