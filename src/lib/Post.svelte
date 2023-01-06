<script>
	import { fade } from 'svelte/transition';
	import PostActions from './PostActions.svelte';
	import Post from './Post.svelte';
	import { activeImage, activePost } from '$lib/stores';

	export let post;

	/**
	 * @param {string | number | Date} date
	 */
	function formatDateTime(date) {
		const d = new Date(date);
		return d.toLocaleString();
	}

	function relativeDateTime(data) {
		const d = new Date(data);
		const now = new Date();
		const diff = now.getTime() - d.getTime();
		const seconds = Math.floor(diff / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(months / 12);

		if (years > 0) {
			return `${years} year${years > 1 ? 's' : ''} ago`;
		} else if (months > 0) {
			return `${months} month${months > 1 ? 's' : ''} ago`;
		} else if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} ago`;
		} else if (hours > 0) {
			return `${hours} hour${hours > 1 ? 's' : ''} ago`;
		} else if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
		} else if (seconds > 0) {
			return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
		} else {
			return 'just now';
		}
	}

	function openImage(event) {
		event.stopPropagation();
		event.preventDefault();
		const { src, alt } = event.target;
		activeImage.update(() => ({ src, alt }));
	}

	function setActivePost(post) {
		activePost.update(() => post);
	}
</script>

<div class="relative overflow-visible bg-slate-100 shadow-md shadow-sky-200/50 rounded-md">
	<div class="relative p-4  shadow-sm rounded-md">
		<div class="flex flex-col gap-2">
			<div class="flex flex-row items-center gap-4">
				<div class="basis-12">
					<img class="aspect-square w-fit" src={post.user.profile_image_url} alt={post.user.name} />
				</div>
				<div class="flex-grow">
					<h3 class="text-slate-800">{post.user.first_name} {post.user.last_name}</h3>
					<h4 class="text-sm text-slate-500">
						<a href={`/${post.user.username}`} class="hover:underline">
							@{post.user.username}
						</a>
					</h4>
				</div>
			</div>
			<div class="flex flex-row gap-4">
				<div class="min-w-[3rem]" />
				<div class="flex-grow">
					{#if post.reply}
						<div class="">
							<a
								href={`/posts/${post.reply.id}`}
								on:click|preventDefault|stopPropagation={() => activePost.update(() => post.reply)}
								class="hover:underline {$activePost && post.reply.id === $activePost.id
									? 'text-blue-800'
									: 'text-slate-700'} text-xs"
							>
								In reply to @{post.reply.user?.username || ''}
							</a>
						</div>
					{/if}
					<p class="text-slate-800 mb-2">{post.text}</p>
					{#if post?.entities?.length}
						<div
							class="grid grid-rows-{post.entities.length > 2 ? '2' : '1'} grid-cols-{post?.entities
								?.length > 1
								? '2'
								: '1'} rounded-md overflow-hidden gap-1 bg-slate-800"
						>
							{#each post.entities as entity, i}
								{#if entity.entity_type === 'image'}
									<a
										on:click={openImage}
										href="/posts/{post.id}/images/{entity.id}"
										class="col-start-{i + 1} {post.entities.length === 3 && i + 1 === 3
											? 'col-span-2'
											: ''} col-end-{i + 1}"
									>
										<div class="">
											<img
												loading="lazy"
												class="h-full {post.entities.length === 1 ? 'w-full' : ''} object-cover"
												src={`/media/${entity.url}`}
												alt={entity.alt_text}
											/>
										</div>
									</a>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			</div>
			{#if post.thread}
				<div class="flex flex-row gap-4">
					<div class="min-w-[3rem]" />
					<div class="flex-grow overflow-hidden">
						<div class="border rounded-md border-sky-600 bg-sky-200">
							<div
								aria-label="Post"
								in:fade={{ duration: 500 }}
								on:click|stopPropagation={() => setActivePost(post.thread)}
								on:keyup|stopPropagation={(event) => {
									if (event.key === 'Enter') {
										setActivePost(post.thread);
									}
								}}
								class="cursor-pointer {$activePost?.id === post.thread.id
									? 'brightness-95'
									: ''} hover:brightness-90"
							>
								<Post post={post.thread} />
							</div>
						</div>
					</div>
				</div>
			{/if}
			<div class="flex flex-row gap-4">
				<div class="min-w-[3rem]" />
				<div>
					<a class="text-xs text-slate-900 mt-2" href="/posts/{post.id}"
						>{relativeDateTime(post.created_at)}</a
					>
				</div>
			</div>
			<div class="flex flex-row gap-4">
				<div class="min-w-[3rem]" />
				<PostActions {post} />
			</div>
		</div>
	</div>
</div>
