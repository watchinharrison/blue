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

	function openVideo() {}

	function openLink(href) {
		window.open(href, '_blank');
	}

	function setActivePost(post) {
		activePost.update(() => post);
		activeUser.set(null);
	}

	function parseText(text) {
		const usernameRegex = /@([a-zA-Z0-9_]+)/g;
		const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
		const linkRegex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/g;
		const regexParts = [
			{
				key: 'username',
				regex: usernameRegex
			},
			{
				key: 'hashtag',
				regex: hashtagRegex
			},
			{
				key: 'link',
				regex: linkRegex
			}
		];
		regexParts.forEach((regexPart) => {
			const matches = text.matchAll(regexPart.regex);
			for (const match of matches) {
				if (regexPart.key === 'username') {
					const [username, usernameValue] = match;
					text = text.replace(
						username,
						`
						<a
							href="/${usernameValue}"
							class="text-sky-500 hover:underline"
						>
							${username}
						</a>
					`
					);
				} else if (regexPart.key === 'hashtag') {
					const [hashtag, hashtagValue] = match;
					text = text.replace(
						hashtag,
						`
						<a
							href="/hashtag/${hashtagValue}"
							class="text-sky-500 hover:underline"
						>
							${hashtag}
						</a>
					`
					);
				} else if (regexPart.key === 'link') {
					const [link, href] = match;
					text = text.replace(
						link,
						`
						<a
							href=${href.startsWith('http') ? href : `https://${href}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-sky-500 hover:underline"
							title=${href.startsWith('http') ? href : `https://${href}`}
						>
							${link.replace(/https?:\/\//, '').slice(0, 30)}${link.length > 30 ? '...' : ''}
						</a>
					`
					);
				}
			}
		});
		return text;
	}
</script>

<div class="relative overflow-hidden shadow-md shadow-sky-200/50 rounded-md">
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
			<div class="">
				<div class="flex flex-row items-center gap-4">
					<div class="basis-12">
						<img
							class="aspect-square w-fit rounded-md"
							src="/media/{post.user.profile_image_url}"
							alt={post.user.username}
						/>
					</div>
					<div class="flex-grow">
						<p class="text-slate-800 text-sm font-semibold">
							{post.user.display_name}
						</p>
						<p class="text-sm text-slate-500">
							<a
								href={`/${post.user.username}`}
								on:click|preventDefault|stopPropagation={() => {
									activeUser.update(() => post.user);
								}}
								class="hover:underline"
							>
								@{post.user.username}
							</a>
						</p>
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
						<div class="text-slate-800">{@html parseText(post.text)}</div>
						{#if post?.entities?.length}
							<div
								class="grid {post?.entities?.length > 1
									? 'grid-cols-2'
									: 'grid-cols-1'} rounded-md overflow-hidden gap-0.5 bg-slate-800 mt-2"
							>
								{#each post.entities.filter(({ type }) => type?.match(/media/)) as entity, i}
									{@const aspectRatio = entity.width / entity.height}
									<div class={post.entities.length === 3 && i + 1 === 3 ? 'col-span-2' : ''}>
										{#if entity.entity_type?.match(/image/)}
											<a
												class="block h-full"
												on:click={openImage}
												href="/posts/{post.id}/images/{entity.id}"
											>
												<img
													loading="lazy"
													style={post.entities.length === 1
														? `max-height: ${Math.round(Math.max(600, 600 * aspectRatio))}px`
														: ''}
													class="{post.entities.length === 1 ? 'w-full' : 'h-full'} object-cover"
													src={`/media/${entity.url}`}
													alt={entity.title}
												/>
											</a>
										{:else if entity.entity_type?.match(/video/)}
											<div class="block h-full">
												<video
													controls
													playsinline
													loop
													preload="none"
													poster={`/media/${entity.thumbnail_url}`}
													class="h-full {post.entities.length === 1 ? 'w-full' : ''} object-cover"
												>
													<source src={`/media/${entity.url}`} type={entity.entity_type} />
												</video>
											</div>
										{/if}
									</div>
								{/each}
								{#each post.entities.filter(({ type }) => type?.match(/rich_preview/)) as entity, i}
									<div>
										<a
											href={entity.url}
											target="_blank"
											rel="noreferrer"
											class="h-full flex flex-col"
											on:click={() => openLink(entity.url)}
										>
											<div class="flex-grow">
												{#if entity.thumbnail_url}
													<img
														loading="lazy"
														class="h-full object-cover"
														alt={entity.title}
														src="/media/{entity.thumbnail_url}"
													/>
												{:else}
													<div
														class="h-full bg-slate-700 text-slate-200 flex items-center justify-center"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="64"
															height="64"
															fill="currentColor"
															class="bi bi-link-45deg"
															viewBox="0 0 16 16"
														>
															<path
																d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"
															/>
															<path
																d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"
															/>
														</svg>
													</div>
												{/if}
											</div>
											<div class="p-4 bg-slate-200 text-slate-800">
												<p class="text-lg line-clamp-3">{entity.title}</p>
												<p class="text-sm line-clamp-2 text-slate-600">{entity.description}</p>
											</div>
										</a>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
				{#if post.thread}
					<div class="flex flex-row gap-4 mt-2">
						<div class="min-w-[3rem]" />
						<div class="flex-grow overflow-hidden">
							<div class="border rounded-md border-sky-600 bg-slate-100">
								<div
									aria-label="Post"
									in:fade={{ duration: 500 }}
									class={$activePost?.id === post.thread.id ? '' : ''}
								>
									<Post hideActions post={post.thread} />
								</div>
							</div>
						</div>
					</div>
				{/if}
				<div
					on:click|preventDefault|stopPropagation={(event) => setActivePost(post)}
					on:keyup|preventDefault|stopPropagation={(event) => {
						if (event.key === 'Enter') {
							setActivePost(post);
						}
					}}
					class="flex flex-row gap-4 mt-2"
				>
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
