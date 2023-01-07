<script>
	import { fade } from 'svelte/transition';
	import PostActions from './PostActions.svelte';
	import Post from './Post.svelte';
	import { activeImage, activePost, activeUser } from '$lib/stores';

	export let post;
	export let reposter = null;
	export let hideActions = false;

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
		activeUser.set(null);
	}
</script>

<div class="relative overflow-visible bg-slate-100 shadow-md shadow-sky-200/50 rounded-md">
	<div class="relative p-4 shadow-sm rounded-md">
		{#if reposter}
			<div class="flex flex-row gap-4">
				<div class="min-w-[3rem]" />
				<div class="flex-grow flex flex-row items-center justify-start text-slate-400">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="12"
						height="12"
						fill="currentColor"
						class="bi bi-repeat mr-2"
						viewBox="0 0 16 16"
					>
						<path
							d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
						/>
					</svg>
					<a href="/{reposter.username}" class="text-sm">
						@{reposter.username} reposted
					</a>
				</div>
			</div>
		{/if}
		<div class="flex flex-col gap-2">
			<div
				class="cursor-pointer"
				on:click|preventDefault|stopPropagation={() => setActivePost(post)}
				on:keyup|preventDefault|stopPropagation={(event) => {
					if (event.key === 'Enter') {
						setActivePost(post);
					}
				}}
			>
				<div class="flex flex-row items-center gap-4">
					<div class="basis-12">
						<img
							class="aspect-square w-fit rounded-md"
							src="/media/{post.user.profile_image_url}"
							alt={post.user.username}
						/>
					</div>
					<div class="flex-grow">
						<h3 class="text-slate-800">{post.user.first_name} {post.user.last_name}</h3>
						<h4 class="text-sm text-slate-500">
							<a
								href={`/${post.user.username}`}
								on:click|preventDefault|stopPropagation={() => {
									activeUser.update(() => post.user);
								}}
								class="hover:underline"
							>
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
									on:click|preventDefault|stopPropagation={() =>
										activePost.update(() => post.reply)}
									class="hover:underline {$activePost && post.reply.id === $activePost.id
										? 'text-blue-800'
										: 'text-slate-700'} text-xs"
								>
									In reply to @{post.reply.user?.username || ''}
								</a>
							</div>
						{/if}
						<p class="text-slate-800">{post.text}</p>
						{#if post?.entities?.length}
							<div
								class="grid {post?.entities?.length > 1
									? 'grid-cols-2'
									: 'grid-cols-1'} rounded-md overflow-hidden gap-0.5 bg-slate-800 mt-2"
							>
								{#each post.entities as entity, i}
									{#if entity.entity_type === 'image'}
										<div class={post.entities.length === 3 && i + 1 === 3 ? 'col-span-2' : ''}>
											<a
												class="block h-full"
												on:click={openImage}
												href="/posts/{post.id}/images/{entity.id}"
											>
												<img
													loading="lazy"
													class="h-full {post.entities.length === 1 ? 'w-full' : ''} object-cover"
													src={`/media/${entity.url}`}
													alt={entity.alt_text}
												/>
											</a>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>
				{#if post.thread}
					<div class="flex flex-row gap-4 mt-2">
						<div class="min-w-[3rem]" />
						<div class="flex-grow overflow-hidden">
							<div class="border rounded-md border-sky-600 bg-sky-200">
								<div
									aria-label="Post"
									in:fade={{ duration: 500 }}
									class="{$activePost?.id === post.thread.id
										? 'brightness-95'
										: ''} hover:brightness-90"
								>
									<Post hideActions post={post.thread} />
								</div>
							</div>
						</div>
					</div>
				{/if}
				<div class="flex flex-row gap-4 mt-2">
					<div class="min-w-[3rem]" />
					<div>
						<a class="text-xs text-slate-900" href="/posts/{post.id}"
							>{relativeDateTime(post.created_at)}</a
						>
					</div>
				</div>
			</div>
			{#if !hideActions}
				<div class="flex flex-row gap-4">
					<div class="min-w-[3rem]" />
					<PostActions {post} />
				</div>
			{/if}
		</div>
	</div>
</div>
