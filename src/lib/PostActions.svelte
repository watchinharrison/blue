<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance, applyAction, deserialize } from '$app/forms';
	import { activePost, replyPost, activeUser } from '$lib/stores';
	export let post;

	onMount(async () => {
		await import('tw-elements/dist/src/js/index.js');
	});
</script>

<div class="w-full flex flex-row justify-between items-center text-sm text-sky-600">
	<a
		href="/?post_id={post.id}"
		class="flex flex-row justify-center items-center hover:text-sky-900  p-2"
		on:click|preventDefault|stopPropagation={() => {
			activeUser.set(null);
			activePost.set({ ...post, is_replying: true });
		}}
	>
		{#if $activePost?.is_replying && $activePost?.id === post.id}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-reply-fill"
				viewBox="0 0 16 16"
			>
				<path
					d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-reply"
				viewBox="0 0 16 16"
			>
				<path
					d="M6.598 5.013a.144.144 0 0 1 .202.134V6.3a.5.5 0 0 0 .5.5c.667 0 2.013.005 3.3.822.984.624 1.99 1.76 2.595 3.876-1.02-.983-2.185-1.516-3.205-1.799a8.74 8.74 0 0 0-1.921-.306 7.404 7.404 0 0 0-.798.008h-.013l-.005.001h-.001L7.3 9.9l-.05-.498a.5.5 0 0 0-.45.498v1.153c0 .108-.11.176-.202.134L2.614 8.254a.503.503 0 0 0-.042-.028.147.147 0 0 1 0-.252.499.499 0 0 0 .042-.028l3.984-2.933zM7.8 10.386c.068 0 .143.003.223.006.434.02 1.034.086 1.7.271 1.326.368 2.896 1.202 3.94 3.08a.5.5 0 0 0 .933-.305c-.464-3.71-1.886-5.662-3.46-6.66-1.245-.79-2.527-.942-3.336-.971v-.66a1.144 1.144 0 0 0-1.767-.96l-3.994 2.94a1.147 1.147 0 0 0 0 1.946l3.994 2.94a1.144 1.144 0 0 0 1.767-.96v-.667z"
				/>
			</svg>
		{/if}
		<div class="ml-2">
			{post.reply_count || ''}
		</div>
	</a>
	<div class="">
		<form
			action="?/like"
			method="POST"
			use:enhance={(input) => {
				post.likes_count = post.liked ? post.likes_count - 1 : post.likes_count + 1;
				post.liked = !post.liked;
				return ({ update }) => {
					update();
				};
			}}
			aria-label="Like Post"
		>
			<input type="hidden" name="post_id" value={post.id} />
			<button type="submit" class="flex flex-row justify-center items-center p-2">
				{#if post.liked}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						class="bi bi-heart-fill"
						viewBox="0 0 16 16"
					>
						<path
							fill-rule="evenodd"
							d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						fill="currentColor"
						class="bi bi-heart"
						viewBox="0 0 16 16"
					>
						<path
							d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
						/>
					</svg>
				{/if}
				<div class="ml-2 ">
					{post.likes_count || ''}
				</div>
			</button>
		</form>
	</div>
	<div class="flex justify-center">
		<div class="dropup relative">
			<button
				class="
					dropdown-toggle
					px-6
					py-2.5
					font-medium
					text-xs
					leading-tight
					uppercase
					transition
					duration-150
					ease-in-out
					flex
					justify-end
					items-center
					whitespace-nowrap
				"
				type="button"
				id="dropdownMenuButton1"
				data-bs-toggle="dropdown"
				aria-expanded="false"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					fill="currentColor"
					class="bi bi-repeat mr-2"
					viewBox="0 0 16 16"
				>
					<path
						d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
					/>
				</svg>
				{post.reposts_count || ''}
			</button>
			<ul
				class="
					dropdown-menu
					min-w-max
					absolute
					hidden
					bg-white
					text-base
					z-50
					float-left
					py-2
					list-none
					text-left
					rounded-lg
					shadow-lg
					mt-1
					hidden
					m-0
					bg-clip-padding
					border-none
				"
				aria-labelledby="dropdownMenuButton1"
			>
				<li>
					<form action="?/repost" method="POST" use:enhance aria-label="Repost">
						<input type="hidden" name="post_id" value={post.id} />
						<button
							class="
								dropdown-item
								text-sm
								py-2
								px-4
								font-normal
								block
								w-full
								text-left
								whitespace-nowrap
								bg-transparent
								text-gray-700
								hover:bg-gray-100
							"
						>
							Repost
						</button>
					</form>
				</li>
				<li>
					<a
						class="
							dropdown-item
							text-sm
							py-2
							px-4
							font-normal
							block
							w-full
							text-left
							whitespace-nowrap
							bg-transparent
							text-gray-700
							hover:bg-gray-100
						"
						href="/?post_id={post.id}&action=repost"
						on:click|stopPropagation|preventDefault={() => {
							goto('/');
							activePost.set(null);
							replyPost.set(post);
							window.scrollTo(0, 0);
						}}>Quote</a
					>
				</li>
			</ul>
		</div>
	</div>
</div>
