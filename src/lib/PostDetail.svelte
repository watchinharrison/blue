<script>
	import { fade } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';
	import Post from './Post.svelte';
	import { activePost, activeImage, activeUser } from '$lib/stores';

	let post = null;
	let thread = [];
	let tab = 'replies';

	function fetchPost(id) {
		fetch(`/api/post?id=${id}`)
			.then((res) => res.json())
			.then((data) => {
				post = data.post;
			});
	}

	activePost.subscribe((value) => {
		if (value?.id) {
			fetchPost(value.id);
		}
		post = value;
	});

	function closeDetail(event) {
		if (event.key === 'Escape' && !$activeImage) {
			activePost.set(null);
		}
	}

	onMount(() => {
		document.addEventListener('keyup', closeDetail);
	});

	onDestroy(() => {
		document.removeEventListener('keyup', closeDetail);
	});

	function loadReplies(reply) {
		const { reply_id } = reply;
		fetch(`/api/posts?thread_id=${reply_id}`)
			.then((res) => res.json())
			.then((data) => {
				thread = data.posts;
			});
	}
</script>

{#if post}
	<div class="flex flex-col mb-60 lg:mb-0">
		<div class="w-full p-4">
			<Post
				reposter={post.thread && post.text === '' ? post.user : null}
				post={post.thread && post.text === '' ? post.thread : post}
			/>
		</div>
		<ul class="flex flex-row flex-wrap list-none border-b-0 pl-0 mb-4" role="tablist">
			<li class="nav-item flex-auto text-center" role="presentation">
				<a
					href="#tabs-replies"
					on:click={() => {
						tab = 'replies';
					}}
					class="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2
      px-6
      py-3
      my-2
       hover:text-sky-600
      {tab === 'replies' ? 'active border-sky-200 text-sky-400' : 'border-b-transparent'}
    "
					id="tabs-replies-tab"
					data-bs-toggle="pill"
					data-bs-target="#tabs-replies"
					role="tab"
					aria-controls="tabs-replies"
					aria-selected="true">Replies</a
				>
			</li>
			<li class="nav-item flex-auto text-center" role="presentation">
				<a
					href="#tabs-likes"
					on:click={() => {
						tab = 'likes';
					}}
					class="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2
      px-6
      py-3
      my-2
       hover:text-sky-600
			{tab === 'likes' ? 'active border-sky-200 text-sky-400' : 'border-b-transparent'}
    "
					id="tabs-likes-tab"
					data-bs-toggle="pill"
					data-bs-target="#tabs-likes"
					role="tab"
					aria-controls="tabs-likes"
					aria-selected="false">Likes</a
				>
			</li>
			<li class="nav-item flex-auto text-center" role="presentation">
				<a
					href="#tabs-reposts"
					on:click={() => {
						tab = 'reposts';
					}}
					class="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2
      px-6
      py-3
      my-2
       hover:text-sky-600
			{tab === 'reposts' ? 'active border-sky-200 text-sky-400' : 'border-b-transparent'}
    "
					id="tabs-reposts-tab"
					data-bs-toggle="pill"
					data-bs-target="#tabs-reposts"
					role="tab"
					aria-controls="tabs-reposts"
					aria-selected="false">Reposts</a
				>
			</li>
		</ul>
		<div class="tab-content" id="tabs-tabContent">
			<div
				class="tab-pane show  {tab === 'replies' ? 'active' : ''}"
				in:fade={{ duration: 500 }}
				id="tabs-replies"
				role="tabpanel"
				aria-labelledby="tabs-replies-tab"
			>
				{#if $activePost.is_replying !== true && post?.replies}
					<div class="block pb-10">
						{#each post.replies as reply, i}
							<div class="w-full p-4 py-2 pl-12">
								<div aria-label="Post" in:fade={{ duration: 500 }} class="">
									<Post post={reply} />
								</div>
								{#if reply.thread_count > 0}
									<div class="">
										{#if thread.length}
											{#each thread as threadItem, i}
												<div aria-label="Post" in:fade={{ duration: 500 }} class=" pt-4">
													<Post post={threadItem} />
												</div>
											{/each}
										{:else}
											<div class="p-2">
												<button on:click={() => loadReplies(reply)} class="text-sm text-slate-500"
													>Load {reply.thread_count} replies</button
												>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<div
				class="tab-pane {tab === 'likes' ? 'active' : ''}"
				in:fade={{ duration: 500 }}
				id="tabs-likes"
				role="tabpanel"
				aria-labelledby="tabs-likes-tab"
			>
				<div class="p-4 flex flex-col gap-2">
					{#if post?.likes?.length}
						{#each post.likes as like}
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<a
										href="/{like.username}"
										on:click|preventDefault|stopPropagation={() => {
											activeUser.update(() => ({ id: like.id }));
										}}
									>
										<img
											class="h-10 w-10 rounded-md"
											src="/media/{like.profile_image_url}"
											alt={like.username}
										/>
									</a>
								</div>
								<div class="ml-4">
									<div
										class="text-sm font-medium
								text-gray-900"
									>
										<a
											href="/{like.username}"
											on:click|preventDefault|stopPropagation={() => {
												activeUser.update(() => ({ id: like.id }));
											}}
											class="hover:underline">{like.display_name}</a
										>
									</div>
									<div class="text-sm text-gray-500">
										<a
											href="/{like.username}"
											on:click|preventDefault|stopPropagation={() => {
												activeUser.update(() => ({ id: like.id }));
											}}
											class="hover:underline">@{like.username}</a
										>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
			<div
				class="tab-pane {tab === 'reposts' ? 'active' : ''}"
				in:fade={{ duration: 500 }}
				id="tabs-reposts"
				role="tabpanel"
				aria-labelledby="tabs-likes-tab"
			>
				<div class="p-4 flex flex-col gap-2">
					{#if post?.reposts?.length}
						{#each post.reposts as repost}
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<a
										href="/{repost.username}"
										on:click|preventDefault|stopPropagation={() => {
											activeUser.update(() => ({ id: repost.user_id }));
										}}
									>
										<img
											class="h-10 w-10 rounded-md"
											src="/media/{repost.profile_image_url}"
											alt={repost.username}
										/>
									</a>
								</div>
								<div class="ml-4">
									<div
										class="text-sm font-medium
								text-gray-900"
									>
										<a
											href="/{repost.username}"
											on:click|preventDefault|stopPropagation={() => {
												activeUser.update(() => ({ id: repost.user_id }));
											}}
											class="hover:underline">{repost.display_name}</a
										>
									</div>
									<div class="text-sm text-gray-500">
										<a
											href="/{repost.username}"
											on:click|preventDefault|stopPropagation={() => {
												activeUser.update(() => ({ id: repost.user_id }));
											}}
											class="hover:underline">@{repost.username}</a
										>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
