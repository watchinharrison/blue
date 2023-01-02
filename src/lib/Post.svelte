<script>
	export let post;

	/**
	 * @param {string | number | Date} date
	 */
	function formatDateTime(date) {
		const d = new Date(date);
		return d.toLocaleString();
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
					<h4 class="text-sm text-slate-500">@{post.user.username}</h4>
				</div>
			</div>
			<div class="flex flex-row items-center gap-4">
				<div class="basis-12" />
				<div class="">
					<div class="flex-grow text-slate-800">{post.text}</div>
					{#if post.entities}
						<div>
							{#each post.entities as entity}
								{#if entity.entity_type === 'image'}
									<div class="flex flex-row items-center gap-4">
										<div class="basis-12" />
										<div class="">
											<img
												class="aspect-square
                        w-fit
                        max-w-full
                        max-h-96
                        border-2
                        border-slate-900
                        dark:border-black
                        rounded-md
                        shadow-sm
                        shadow-slate-900
                        dark:shadow-black"
												src={`/media/${entity.url}`}
												alt={entity.name}
											/>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					{/if}
					<a class="text-sm text-slate-900 " href="posts/{post.id}"
						>{formatDateTime(post.created_at)}</a
					>
				</div>
			</div>
		</div>
	</div>
</div>
