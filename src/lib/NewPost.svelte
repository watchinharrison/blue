<script>
	// @ts-nocheck
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { activePost, replyPost } from '$lib/stores';
	import Post from '$lib/Post.svelte';
	import { json } from '@sveltejs/kit';

	/** @type {import('./$types').ActionData} */
	export let form;

	export let user = null;
	export let post = null;

	let charLimit = 280;
	let chars = 0;

	let files = [];

	function allowDrop(event) {
		event.preventDefault();
	}

	function getVideoThumbnail(file) {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video');
			video.src = URL.createObjectURL(file);
			video.currentTime = 1 / 1000;
			video.onseeked = function () {
				var canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
				var dataURL = canvas.toDataURL();
				resolve(dataURL);
			};
		});
	}

	function getVideoThumbnailBinary(uri) {
		return fetch(uri).then((res) => res.blob());
	}

	function getVideoDimensions(file) {
		const video = document.createElement('video');
		video.src = URL.createObjectURL(file);
		return new Promise((resolve, reject) => {
			video.onloadedmetadata = function () {
				var width = video.videoWidth;
				var height = video.videoHeight;
				resolve({ width, height });
			};
		});
	}

	function getImageDimensions(image) {
		// Create an image object
		var img = new Image();

		// Set the src property of the image object to the file that the user selected
		img.src = URL.createObjectURL(image);

		return new Promise((resolve, reject) => {
			// When the image has finished loading, get the dimensions
			img.onload = function () {
				var width = img.naturalWidth;
				var height = img.naturalHeight;
				resolve({ width, height });
			};
		});
	}

	function drop(event) {
		event.preventDefault();
		if (event.dataTransfer.items.length > 4) {
			console.log('too many files');
		}
		const dataTransfer = new DataTransfer();
		[...event.dataTransfer.items].forEach((item, i) => {
			// If dropped items aren't files, reject them
			if (item.kind === 'file') {
				const reader = new FileReader();
				const file = item.getAsFile();
				reader.onload = async () => {
					let dimensions;
					let thumbnail;
					if (file.type.match(/image/)) {
						dimensions = await getImageDimensions(file);
					} else if (file.type.match(/video/)) {
						dimensions = await getVideoDimensions(file);
						thumbnail = await getVideoThumbnail(file);
					}
					files = [...files, { result: reader.result, type: file.type, dimensions, thumbnail }];
				};
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
			files = [];
			document.querySelector('[name="text"]').value = '';
			document.querySelector('[name="image"]').value = '';
			replyPost.set(null);
			activePost.set(null);
			chars = 0;
			window.scrollTo(0, 0);
			await invalidateAll();
		}

		applyAction(result);
	}

	function updateFiles(event) {
		if (event.target.files.length > 4) {
			console.log('too many files');
		}
		files = [];
		for (let i = 0; i < event.target.files.length; i++) {
			const reader = new FileReader();
			const file = event.target.files.item(i);
			reader.onload = async () => {
				let dimensions;
				let thumbnail;
				// let thumbnailBinary;
				if (file.type.match(/image/)) {
					dimensions = await getImageDimensions(file);
				} else if (file.type.match(/video/)) {
					dimensions = await getVideoDimensions(file);
					thumbnail = await getVideoThumbnail(file);
					// thumbnailBinary = await getVideoThumbnailBinary(thumbnail);
				}
				files = [...files, { result: reader.result, type: file.type, dimensions, thumbnail }];
			};
			reader.readAsDataURL(file);
		}
	}

	function close() {
		activePost.update((value) => ({ ...value, is_replying: false }));
	}

	function removeFile(file) {
		let fileIndex = files.findIndex((i) => i === file);
		files = files.filter((i) => i !== file);
		const input = document.getElementById('fileInput');
		const inputFiles = input.files;
		const dt = new DataTransfer();

		for (let i = 0; i < inputFiles.length; i++) {
			const file = inputFiles[i];
			if (fileIndex !== i) dt.items.add(file); // here you exclude the file. thus removing it.
		}

		input.files = dt.files;
	}

	function updateChars(event) {
		let text = event.target.value;
		text = text.replace(/https?:\/\/\S+/g, 'limit to 30 chars per link ref');
		chars = text.length;
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
			class="pt-4 mb-4 bg-sky-200 rounded-md shadow-inner"
			on:dragover={allowDrop}
			on:drop={drop}
		>
			<div
				class="flex mx-4 w-fit flex-row items-start gap-4 bg-slate-100 outline-none p-4 bg-opacity-70 shadow-sm rounded-md"
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
						cols="3"
						name="text"
						class="bg-transparent w-full h-24 outline-none resize-none font-opensans"
						placeholder="What's on your mind?"
						value={form?.text ? form.text : ''}
						on:keyup={updateChars}
					/>
					{#if files.length}
						<div
							class="grid {$replyPost ? 'mb-4' : ''} {files.length > 1
								? 'grid-cols-2'
								: ''} rounded-md overflow-hidden gap-0.5"
						>
							{#each files as file, i}
								{@const { width, height } = file.dimensions}
								{@const aspectRatio = width / height}
								<div class="relative {files.length === 3 && i + 1 === 3 ? 'col-span-2' : ''}">
									{#if file.type.match(/video/)}
										<video
											controls
											playsinline
											loop
											preload="none"
											class="w-full h-full object-cover"
											poster={file.thumbnail}
										>
											<source src={file.result} type={file.type} />
										</video>
									{:else if file.type.match(/image/)}
										<img
											loading="lazy"
											style={files.length === 1
												? `max-height: ${Math.round(Math.max(600, 600 * aspectRatio))}px`
												: ''}
											class="{files.length === 1 ? 'w-full' : 'h-full'} object-cover"
											src={file.result}
											alt="post attachment"
										/>
									{/if}
									<input type="hidden" name="dimensions" value={JSON.stringify(file.dimensions)} />
									<input type="hidden" name="thumbnails" value={file.thumbnail} />
									<div class="absolute top-0 right-0 z-10 flex flex-row justify-end">
										<button
											on:click|preventDefault|stopPropagation={() => {
												removeFile(file);
											}}
											class="p-4 text-slate-400"
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
						<div class="relative bg-slate-100 rounded-md">
							<Post post={$replyPost} hideActions />
							<input type="hidden" name="post_id" value={$replyPost.id} />
							<div class="absolute top-0 right-0 z-10 flex flex-row justify-end">
								<button on:click={() => ($replyPost = null)} class="p-4 text-slate-400">
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
			<div class="flex mx-4 w-auto flex-row justify-between items-center gap-4">
				<div class="flex-1">
					<div class="flex flex-row items-end justify-between">
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
								on:change={updateFiles}
							/>
						</div>
					</div>
					{#if post}
						<input type="hidden" name="post_id" value={post.id} />
					{/if}
					{#if post?.thread_id}
						<input type="hidden" name="thread_id" value={post.thread_id} />
					{/if}
				</div>
				<div class="h-full flex justify-center items-center mt-2">
					{#if post}
						<button
							on:click|preventDefault={close}
							class="bg-clip-text text-transparent bg-gradient-to-t from-blue-300 to-sky-500 hover:opacity-85 p-2"
							>Close</button
						>
					{/if}
					<button
						disabled={!chars || chars > charLimit}
						class="bg-clip-text text-transparent bg-gradient-to-t from-sky-700 to-blue-900 hover:opacity-85 p-2"
						>{post ? 'Reply' : 'Post'}</button
					>
				</div>
			</div>
			<div class="w-full h-1 rounded-md pb-2 flex items-start">
				<div
					class="{chars > charLimit
						? 'via-purple-500 to-pink-500'
						: 'to-blue-500'} bg-gradient-to-r from-sky-500  h-1"
					style="width: {Math.min(
						Math.round((chars / charLimit) * 100),
						100
					)}%; transition: width 2s;"
				/>
			</div>
		</div>
	</div>
</form>

<!-- bg-gradient-to-r via-purple-500 to-pink-500 to-blue-500 from-sky-500 -->
<!-- bg-gradient-to-r via-purple-500 to-blue-500 from-sky-500 -->
