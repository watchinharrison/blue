<script>
	import { enhance } from '$app/forms';

	export let data;
	export let user;
	export let showEdit = false;
</script>

<div class="relative lg:rounded-t-md overflow-hidden">
	<div>
		<img
			class="aspect-video object-fit w-full"
			src="/media/{data?.profile.header_image_url}"
			alt={data?.profile.username}
		/>
	</div>
	<div
		class="p-4 w-full absolute bottom-0 bg-opacity-90 bg-slate-200 rounded-t-md flex flex-row justify-between gap-4"
	>
		<div class="flex flex-col gap-2">
			<div class="w-20 lg:w-40 flex-row justify-center items-center">
				<img
					class="aspect-square w-fit rounded-md"
					src="/media/{data?.profile.profile_image_url}"
					alt={data?.profile.username}
				/>
			</div>
			<div class="flex flex-col text-sm">
				<p class="text-slate-800 font-semibold">{data?.profile.display_name}</p>
				<p class="text-slate-600">@{data?.profile?.username}</p>
			</div>
			<div class="flex flex-row gap-4 text-sm text-slate-600">
				<div>
					<p>Following: {data?.following?.length}</p>
				</div>
				<div>
					<p>Followers: {data?.followers?.length}</p>
				</div>
			</div>
		</div>
		<div class="flex flex-grow items-end">
			<p class="text-slate-900 text-sm line-clamp-6">
				{data?.profile.bio ?? 'The user profile goes here...'}
			</p>
		</div>
		<div class="flex flex-row justify-between items-start">
			{#if user?.id && user?.id !== data?.profile?.id}
				<form
					use:enhance={() => {
						return ({ update }) => {
							update();
							data.isFollowing = !data?.isFollowing;
						};
					}}
					action="?/follow"
					method="post"
				>
					<input type="hidden" name="username" value={data?.profile.username} />
					{#if data?.isFollowing}
						<button
							type="submit"
							class="text-sm bg-clip-text text-transparent bg-gradient-to-t from-slate-700 to-blue-900"
						>
							Unfollow
						</button>
					{:else}
						<button
							type="submit"
							class="text-sm bg-clip-text text-transparent bg-gradient-to-t from-sky-700 to-blue-900"
						>
							Follow
						</button>
					{/if}
				</form>
			{/if}
		</div>
		{#if showEdit && user?.id === data?.profile?.id}
			<div class="p-1 px-2 h-fit">
				<a
					href="/profile/settings"
					class="text-sm bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800"
				>
					Edit
				</a>
			</div>
		{/if}
	</div>
</div>
