<script>
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import { activePost } from '$lib/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	function setActivePost(post) {
		activePost.update((value) => post);
	}
</script>

<div class="lg:w-2/3">
	<div class="p-4">
		<div class="flex flex-row justify-between">
			<div class="">
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
							class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						>
							Unfollow {data?.profile.username}
						</button>
					{:else}
						<button
							type="submit"
							class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						>
							Follow {data?.profile.username}
						</button>
					{/if}
				</form>
			{/if}
			{#if data?.user?.id === data?.profile?.id}
				<div>
					<a
						href="/profile/settings"
						class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Edit Profile
					</a>
				</div>
			{/if}
		</div>
	</div>
	<div class="lg:h-[79vh] scroll-smooth overflow-scroll bg-slate-200 p-4 rounded-md">
		<div class="flex flex-col gap-4 scroll-smooth inner-shadow lg:h-[400px] ">
			{#each data?.posts || [] as post, i}
				<div
					on:click={() => setActivePost(post)}
					on:keydown={() => setActivePost(post)}
					class="cursor-pointer {i === data?.posts.length - 1 ? 'pb-4' : ''}"
				>
					<Post {post} />
				</div>
			{/each}
		</div>
	</div>
</div>
