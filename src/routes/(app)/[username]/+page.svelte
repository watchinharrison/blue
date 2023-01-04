<script>
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '$lib/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	function setActivePost(post) {
		activePost.update((...value) => ({ ...value, ...post }));
	}
</script>

<div class="">
	<div class="p-4">
		<div class="flex flex-row justify-between">
			<div class="flex flex-row gap-4">
				<h2>{data?.profile?.username}</h2>
				<div>
					<p>Following: {data?.following?.length}</p>
				</div>
				<div>
					<p>Followers: {data?.followers?.length}</p>
				</div>
			</div>
			{#if data?.user?.id && data?.user?.id !== data?.profile?.id}
				<form action="?/follow" method="post">
					<input type="hidden" name="username" value={data?.profile.username} />
					{#if data.isFollowing}
						<button
							type="submit"
							class="text-sm text-bold uppercase bg-clip-text text-transparent bg-gradient-to-t from-slate-700 to-blue-900"
						>
							Unfollow {data?.profile.username}
						</button>
					{:else}
						<button
							type="submit"
							class="text-sm text-bold uppercase bg-clip-text text-transparent bg-gradient-to-t from-sky-700 to-blue-900"
						>
							Follow {data?.profile.username}
						</button>
					{/if}
				</form>
			{/if}
			{#if data?.user?.id === data?.profile?.id}
				<div class="p-1 px-2 h-fit">
					<a
						href="/profile/settings"
						class="text-sm bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800"
					>
						Edit Profile
					</a>
				</div>
			{/if}
		</div>
	</div>
	<div class="lg:h-[87vh] scroll-smooth overflow-scroll bg-slate-200 p-4 rounded-md">
		<div class="flex flex-col gap-4 scroll-smooth inner-shadow lg:h-[400px] ">
			{#each data?.posts || [] as post, i}
				<div
					on:click={() => setActivePost(post)}
					on:keyup={(event) => {
						console.log(event.key);
						if (event.key === 'Space') {
							setActivePost(post);
						}
					}}
					class="cursor-pointer {i === data?.posts.length - 1 ? 'pb-4' : ''}"
				>
					<Post {post} />
				</div>
			{/each}
		</div>
	</div>
</div>
