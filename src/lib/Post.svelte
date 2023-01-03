<script>
	import PostActions from './PostActions.svelte';

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
</script>

<div class="relative overflow-visible bg-sky-100 shadow-md shadow-sky-200/50 rounded-md">
	<div class="relative p-4 bg-slate-100 shadow-sm rounded-md">
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
					<p class="text-slate-800 mb-2">{post.text}</p>
					{#if post?.entities?.length}
						<div class="flex flex-row flex-wrap border rounded-md overflow-hidden bg-slate-800">
							{#each post.entities as entity, i}
								{#if entity.entity_type === 'image'}
									<div
										class="flex flex-row items-center {post.entities.length % 2 === 0
											? 'w-2/4'
											: 'w-full'} {(post.entities.length > 1 && i === 0) || i === 2
											? 'pr-1'
											: ''} {post.entities.length > 1 && (i === 0 || i === 1) ? 'pb-1' : ''}"
									>
										<img
											loading="lazy"
											class="h-full {post.entities.length === 1 ? 'w-full' : ''} object-cover"
											src={`/media/${entity.url}`}
											alt={entity.name}
										/>
									</div>
								{/if}
							{/each}
						</div>
					{/if}
					<a class="text-xs text-slate-900 mt-2" href="posts/{post.id}"
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
