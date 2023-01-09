<script>
	import PostDetail from '$lib/PostDetail.svelte';
	import NewPost from '$lib/NewPost.svelte';
	import Post from '$lib/Post.svelte';
	import Profile from '$lib/Profile.svelte';
	import { activePost, activeUser } from '$lib/stores';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let profile = null;
	let results = [];
	let searchTerm = $page.url.searchParams.get('term') || '';

	function fetchProfile(id) {
		fetch(`/api/user?id=${id}`)
			.then((res) => res.json())
			.then((data) => {
				profile = data;
			});
	}

	function search(term) {
		if (term) {
			fetch(`/api/posts?term=${term}`)
				.then((res) => res.json())
				.then((data) => {
					results = data;
				});
		}
	}

	onMount(() => {
		page.subscribe((value) => {
			if (value.url.searchParams.get('term')) {
				const term = value.url.searchParams.get('term');
				search(term);
			} else {
				results = [];
			}
		});
		activeUser.subscribe((value) => {
			if (value) {
				fetchProfile(value.id);
			}
		});
	});

	function whoosh(node, params) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params.delay || 0,
			duration: params.duration || 400,
			css: (t, u) => {
				const x = 300 - t * 300;
				return window.innerWidth < 1024
					? `transform: ${existingTransform} translateY(${x}px); opacity: ${t}`
					: `transform: ${existingTransform} translateX(${x}px); opacity: ${t}`;
			}
		};
	}

	function fadein(node, { delay = 0 }) {
		const o = +getComputedStyle(node).opacity;

		return {
			delay,
			duration: 400,
			css: (t) => `opacity: ${t * o}`
		};
	}

	function onSearch(event) {
		event.preventDefault();
		searchTerm = event.target.value;
		if (!searchTerm) {
			results = [];
		}
	}

	let inert;
	activePost.subscribe((value) => {
		inert = value !== null && window.innerWidth < 720 ? true : undefined;
	});
</script>

<main class="lg:mx-auto flex flex-col lg:flex-row gap-4">
	<article {inert} class="lg:w-2/3" aria-hidden={$activePost !== null}>
		<slot />
	</article>
	<aside class="lg:col-span-4 lg:w-1/3 pr-4">
		{#if searchTerm}
			<div
				transition:fadein
				on:click={() => {
					results = [];
					searchTerm = '';
				}}
				aria-modal="true"
				class="fixed lg:hidden top-0 left-0 w-full h-full bg-slate-600 bg-opacity-70"
			/>
		{/if}
		<div
			in:whoosh
			out:whoosh
			style="transition: height 2s;"
			class="fixed bg-white shadow-md shadow-sky-200/50 lg:sticky z-0 {searchTerm
				? 'h-[70vh]'
				: 'h-min'} mb-10 lg:mb-0 lg:h-auto bottom-0 lg:top-4 left-0 ld:block col-span-4 w-full rounded-t-md lg:rounded-b-md overflow-y-auto "
		>
			<div class="bg-white sticky top-0 z-10">
				<form action="/?/search" class="flex flex-row justify-between">
					<div class="p-4 flex-grow flex justify-center">
						<input
							type="text"
							name="term"
							enterkeyhint="search"
							class="w-full outline-none"
							placeholder="Search"
							on:keyup={onSearch}
							value={form?.term ? form.term : searchTerm}
						/>
					</div>
					<button type="submit" class="p-4 text-slate-400">
						{#if searchTerm}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								class="bi bi-search"
								viewBox="0 0 16 16"
							>
								<path
									d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
								/>
							</svg>
						{/if}
					</button>
				</form>
			</div>
			{#if !$activePost && !$activeUser}
				{#if results?.posts?.length}
					<div
						class="lg:h-[85vh] lg:overflow-scroll {$activeUser ? 'collapse' : ''}"
						aria-label="Search"
						in:whoosh={{ delay: 400 }}
					>
						<div class="p-4">
							{#each results.posts as post}
								<div class="mb-2">
									<Post {post} />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{/if}
		</div>
		{#if $activePost}
			<div
				transition:fadein
				on:click={() => ($activePost = null)}
				aria-modal="true"
				class="fixed lg:hidden top-0 left-0 w-full h-full bg-slate-600 bg-opacity-70"
			/>
			<div
				in:whoosh
				out:whoosh
				class="fixed bg-white shadow-md shadow-sky-200/50 lg:sticky z-0 h-[70vh] lg:h-auto bottom-0 lg:top-20 left-0 ld:block col-span-4 w-full rounded-t-md lg:rounded-b-md overflow-y-auto "
			>
				<div class="bg-white sticky top-0 z-10 flex flex-row justify-between min-h-[65px]">
					<div
						class="p-4 text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800"
					>
						Post Detail
					</div>
					<button on:click={() => ($activePost = null)} class="p-4 text-slate-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							class="bi bi-x"
							viewBox="0 0 16 16"
						>
							<path
								d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</button>
				</div>
				<div
					class="lg:h-[85vh] lg:overflow-scroll {$activeUser ? 'collapse' : ''}"
					aria-label="Post Detail"
					in:whoosh={{ delay: 400 }}
				>
					<PostDetail />
				</div>
				{#if $activePost.is_replying}
					<div
						aria-label="Reply Post"
						in:fadein
						class="fixed bottom-3 p-6 w-full lg:w-auto lg:bottom-10 lg:py-0 lg:pb-2 lg:pl-2"
					>
						<NewPost user={data.user} post={$activePost} />
					</div>
				{/if}
			</div>
		{/if}
		{#if $activeUser}
			<div
				transition:fadein
				on:click={() => ($activeUser = null)}
				aria-modal="true"
				class="fixed lg:hidden top-0 left-0 w-full h-full bg-slate-600 bg-opacity-70"
			/>
			<div
				in:whoosh
				out:whoosh
				class="fixed bg-white shadow-md shadow-sky-200/50 lg:sticky z-0 h-[70vh] lg:h-auto bottom-0 {$activePost
					? 'lg:top-40'
					: 'lg:top-20'} left-0 ld:block col-span-4 w-full rounded-t-md lg:rounded-b-md overflow-y-auto"
			>
				<div class="bg-white sticky top-0 z-10 flex flex-row justify-between min-h-[50px]">
					<div
						class="p-4 text-xl bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800"
					>
						Profile Detail
					</div>
					<button on:click={() => ($activeUser = null)} class="p-4 text-slate-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="currentColor"
							class="bi bi-x"
							viewBox="0 0 16 16"
						>
							<path
								d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
							/>
						</svg>
					</button>
				</div>
				<div
					class="{$activePost ? 'lg:h-[78vh]' : 'lg:h-[85vh]'} bg-white lg:overflow-scroll"
					aria-label="Post Detail"
					in:whoosh={{ delay: 400 }}
				>
					<Profile data={profile} user={data.user} />
				</div>
			</div>
		{/if}
	</aside>
</main>
