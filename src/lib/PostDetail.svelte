<script>
	import { fade } from 'svelte/transition';
	import { onDestroy, onMount } from 'svelte';
	import Post from './Post.svelte';
	import { activePost, activeImage } from '$lib/stores';

	onMount(async () => {
		await import('tw-elements/dist/src/js/index.js');
	});

	let post = null;
	let thread = [];

	function fetchPost(id) {
		fetch(`/api/post?id=${id}`)
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
	<div class="flex flex-col">
		<div class="w-full p-4">
			<Post
				reposter={post.thread && post.text === '' ? post.user : null}
				post={post.thread && post.text === '' ? post.thread : post}
			/>
		</div>
		<ul
			class="nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4"
			id="tabs-tab"
			role="tablist"
		>
			<li class="nav-item flex-auto text-center" role="presentation">
				<a
					href="#tabs-home"
					class="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:text-slate-800
      focus:border-transparent
      active
    "
					id="tabs-home-tab"
					data-bs-toggle="pill"
					data-bs-target="#tabs-home"
					role="tab"
					aria-controls="tabs-home"
					aria-selected="true">Replies</a
				>
			</li>
			<li class="nav-item flex-auto text-center" role="presentation">
				<a
					href="#tabs-profile"
					class="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:text-slate-800
      focus:border-transparent
    "
					id="tabs-profile-tab"
					data-bs-toggle="pill"
					data-bs-target="#tabs-profile"
					role="tab"
					aria-controls="tabs-profile"
					aria-selected="false">Likes</a
				>
			</li>
			<li class="nav-item flex-auto text-center" role="presentation">
				<a
					href="#tabs-messages"
					class="
      nav-link
      block
      font-medium
      text-xs
      leading-tight
      uppercase
      border-x-0 border-t-0 border-b-2 border-transparent
      px-6
      py-3
      my-2
      hover:border-transparent hover:text-slate-800
      focus:border-transparent
    "
					id="tabs-messages-tab"
					data-bs-toggle="pill"
					data-bs-target="#tabs-messages"
					role="tab"
					aria-controls="tabs-messages"
					aria-selected="false">Reposts</a
				>
			</li>
		</ul>
		<div class="tab-content" id="tabs-tabContent">
			<div
				class="tab-pane fade show active"
				id="tabs-home"
				role="tabpanel"
				aria-labelledby="tabs-home-tab"
			>
				{#if $activePost.is_replying !== true && post?.replies}
					<div class="block pb-10">
						{#each post.replies as reply, i}
							<div class="w-full p-4 py-2 pl-12">
								<div aria-label="Post" in:fade={{ duration: 500 }} class="hover:brightness-90">
									<Post post={reply} />
								</div>
								{#if reply.thread_count > 0}
									<div class="">
										{#if thread.length}
											{#each thread as threadItem, i}
												<div
													aria-label="Post"
													in:fade={{ duration: 500 }}
													class="hover:brightness-90 pt-4"
												>
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
				class="tab-pane fade"
				id="tabs-profile"
				role="tabpanel"
				aria-labelledby="tabs-profile-tab"
			>
				<p class="p-4">
					{#if post?.likes?.length}
						{#each post.likes as like}
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<a href="/{like.username}">
										<img
											class="h-10 w-10 rounded-md"
											src="/media/{like.profile_image_url}"
											alt={like.username}
										/>
									</a>
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">
										<a href="/{like.username}" class="hover:underline">{like.display_name}</a>
									</div>
									<div class="text-sm text-gray-500">
										<a href="/{like.username}" class="hover:underline">@{like.username}</a>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</p>
			</div>
			<div
				class="tab-pane fade"
				id="tabs-messages"
				role="tabpanel"
				aria-labelledby="tabs-profile-tab"
			>
				<p class="p-4">
					{#if post?.reposts?.length}
						{#each post.reposts as repost}
							<div class="flex items-center">
								<div class="flex-shrink-0">
									<a href="/{repost.username}">
										<img
											class="h-10 w-10 rounded-md"
											src="/media/{repost.profile_image_url}"
											alt={repost.username}
										/>
									</a>
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">
										<a href="/{repost.username}" class="hover:underline">{repost.display_name}</a>
									</div>
									<div class="text-sm text-gray-500">
										<a href="/{repost.username}" class="hover:underline">@{repost.username}</a>
									</div>
								</div>
							</div>
						{/each}
					{/if}
				</p>
			</div>
		</div>
	</div>
{/if}
