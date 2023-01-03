<script>
	// @ts-nocheck
	import { enhance, deserialize, applyAction } from '$app/forms';
	import { goto, invalidate, invalidateAll } from '$app/navigation';

	/** @type {import('./$types').ActionData} */
	export let form;

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
		fileInput.files = dataTransfer.files;
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
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<form
	method="POST"
	action="/?/post"
	on:submit|preventDefault={handleSubmit}
	enctype="multipart/form-data"
	aria-label="New Post"
>
	<div class="relative">
		<div
			class="px-4 pt-4 pb-2 mb-4 bg-slate-200 rounded-md shadow-inner"
			on:dragover={allowDrop}
			on:drop={drop}
		>
			<textarea
				name="text"
				class="bg-slate-100 w-full h-24 outline-none resize-none p-4 bg-opacity-70 shadow-sm rounded-md"
				placeholder="What's on your mind?"
				value={form?.text ? form.text : ''}
			/>
			<div class="flex flex-row justify-between items-end">
				<div class="flex-1">
					<div class="flex flex-row gap-2">
						{#if images.length}
							{#each images as image}
								<div class="w-20 h-20">
									<img class="aspect-square" src={image} alt="post attachment" />
								</div>
							{/each}
						{/if}
					</div>
					<input
						class="hidden"
						value={form?.image ? form.image : ''}
						type="file"
						multiple
						name="image"
						id="fileInput"
					/>
					{#if post}
						<input type="hidden" name="post_id" value={post.id} />
					{/if}
				</div>
				<div class="">
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-400 hover:opacity-85 p-2"
						>{post ? 'Reply' : 'Post'}</button
					>
				</div>
			</div>
		</div>
	</div>
</form>
