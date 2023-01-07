<script>
	// @ts-nocheck
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { activePost, replyPost } from '$lib/stores';
	import Post from '$lib/Post.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	export let user = null;
	export let post = null;

	let images = [];

	function allowDrop(event) {
		event.preventDefault();
	}

	function drop(event) {
		event.preventDefault();
		const dataTransfer = new DataTransfer();
		[...event.dataTransfer.items].forEach((item, i) => {
			// If dropped items aren't files, reject them
			if (item.kind === 'file') {
				const reader = new FileReader();
				reader.onload = () => {
					images = [...images, reader.result];
				};
				const file = item.getAsFile();
				reader.readAsDataURL(file);
				dataTransfer.items.add(file);
			}
		});
		document.querySelector(`.file-${post ? post.id : 'new'}`).files = dataTransfer.files;
		// const data = event.dataTransfer.getData('text');
		// event.target.value += data;
	}

	async function handleSubmit(event) {
		const data = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});
		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			images = [];
			document.querySelector('[name="text"]').value = '';
			document.querySelector('[name="image"]').value = '';
			replyPost.set(false);
			activePost.set(false);
			window.scrollTo(0, 0);
			await invalidateAll();
		}

		applyAction(result);
	}

	function updateImages(event) {
		images = [];
		for (let i = 0; i < event.target.files.length; i++) {
			const reader = new FileReader();
			reader.onload = () => {
				images = [...images, reader.result];
			};
			reader.readAsDataURL(event.target.files.item(i));
		}
	}

	function close() {
		activePost.update((value) => ({ ...value, is_replying: false }));
	}

	function removeImage(image) {
		const fileIndex = images.findIndex((i) => i === image);
		images = images.filter((i) => i !== image);
		const input = document.getElementById('fileInput');
		const files = input.files;
		const dt = new DataTransfer();

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (fileIndex !== i) dt.items.add(file); // here you exclude the file. thus removing it.
		}

		input.files = dt.files;
	}
</script>

<form
	method="POST"
	action={$replyPost ? '/?/repost' : '/?/post'}
	on:submit|preventDefault={handleSubmit}
	enctype="multipart/form-data"
	aria-label="New Post"
>
	<div class="relative">
		<div
			class="px-4 pt-4 pb-2 mb-4 bg-sky-200 rounded-md shadow-inner"
			on:dragover={allowDrop}
			on:drop={drop}
		>
			<div
				class="flex flex-row items-start gap-4 bg-slate-100 w-full outline-none p-4 bg-opacity-70 shadow-sm rounded-md"
			>
				<div class="basis-12">
					<img
						class="aspect-square rounded-md"
						src={`/media/${user.profile_image_url}`}
						alt={user.username}
					/>
				</div>
				<div class="flex-1 overflow-hidden">
					<textarea
						maxlength="280"
						cols="3"
						name="text"
						class="bg-transparent w-full h-24 outline-none resize-none"
						placeholder="What's on your mind?"
						value={form?.text ? form.text : ''}
					/>
					{#if images.length}
						<div
							class="grid {images.length > 1
								? 'grid-cols-2'
								: 'grid-cols-1'} rounded-md overflow-hidden gap-1"
						>
							{#each images as image, i}
								<div
									class="relative col-start-{i + 1} {images.length === 3 && i + 1 === 3
										? 'col-span-2'
										: ''} col-end-{i + 1}"
								>
									<img
										loading="lazy"
										class="h-full object-cover"
										src={image}
										alt="post attachment"
									/>
									<div class="absolute top-0 right-0 z-10 flex flex-row justify-end">
										<button
											on:click|preventDefault|stopPropagation={() => {
												removeImage(image);
											}}
											class="p-4 pb-0 text-slate-400"
										>
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
								</div>
							{/each}
						</div>
					{/if}
					{#if $replyPost && !post}
						<div class="relative">
							<Post post={$replyPost} hideActions />
							<input type="hidden" name="post_id" value={$replyPost.id} />
							<div class="absolute top-0 right-0 z-10 flex flex-row justify-end">
								<button on:click={() => ($replyPost = null)} class="p-4 pb-0 text-slate-400">
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
						</div>
					{/if}
				</div>
			</div>
			<div class="flex flex-row justify-between items-end">
				<div class="flex-1">
					<div class="flex flex-row">
						<div class="p-4 text-sky-900 transition-colors relative">
							<label for="fileInput" class="cursor-pointer hover:text-sky-700">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="32"
									height="32"
									fill="currentColor"
									class="bi bi-images"
									viewBox="0 0 16 16"
								>
									<path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
									<path
										d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"
									/>
								</svg>
							</label>
							<input
								class="file-{post
									? post.id
									: 'new'} h-full w-full block absolute top-0 left-0 text-sm -z-[1]"
								value={form?.image ? form.image : ''}
								type="file"
								multiple
								name="image"
								id="fileInput"
								on:change={updateImages}
							/>
						</div>
					</div>
					{#if post?.reply_id}
						<input type="hidden" name="thread_id" value={post.reply_id} />
					{/if}
					{#if post}
						<input type="hidden" name="post_id" value={post.id} />
					{/if}
				</div>
				<div class="">
					{#if post}
						<button
							on:click|preventDefault={close}
							class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-blue-300 to-sky-500 hover:opacity-85 p-2"
							>Close</button
						>
					{/if}
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-700 to-blue-900 hover:opacity-85 p-2"
						>{post ? 'Reply' : 'Post'}</button
					>
				</div>
			</div>
		</div>
	</div>
</form>
