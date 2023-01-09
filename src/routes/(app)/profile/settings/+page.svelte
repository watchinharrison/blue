<script>
	// @ts-nocheck
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let image;
	let headerImage;

	async function handleSubmit(event) {
		const data = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});
		/** @type {import('@sveltejs/kit').ActionResult} */
		const result = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}

	function updateImages(event) {
		image = null;
		const reader = new FileReader();
		reader.onload = () => {
			image = reader.result;
		};
		reader.readAsDataURL(event.target.files.item(0));
	}

	function updateHeaderImages(event) {
		headerImage = null;
		const reader = new FileReader();
		reader.onload = () => {
			headerImage = reader.result;
		};
		reader.readAsDataURL(event.target.files.item(0));
	}
</script>

<div class="max-w-[800px] m-auto">
	<form method="POST" on:submit|preventDefault={handleSubmit}>
		<div class="relative lg:rounded-t-md overflow-hidden">
			<div class={!headerImage ? 'min-h-[400px]' : ''}>
				<label for="headerFileInput" class="cursor-pointer hover:text-slate-700">
					{#if headerImage}
						<div class="relative">
							<img
								loading="lazy"
								class="w-full aspect-video rounded-md brightness-90"
								src={headerImage}
								alt="post attachment"
							/>
							<div
								class="absolute w-full h-full top-0 left-0 flex flex-row justify-center items-center"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="64"
									height="64"
									fill="currentColor"
									class="bi bi-images"
									viewBox="0 0 16 16"
								>
									<path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
									<path
										d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"
									/>
								</svg>
							</div>
						</div>
					{:else if data.profile?.header_image_url}
						<div class="relative">
							<img
								loading="lazy"
								class="w-full aspect-video rounded-md brightness-90"
								src={`/media/${data.profile?.header_image_url}`}
								alt="post attachment"
							/>
							<div
								class="absolute w-full h-full top-0 left-0 flex flex-row justify-center items-center"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="64"
									height="64"
									fill="currentColor"
									class="bi bi-images"
									viewBox="0 0 16 16"
								>
									<path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
									<path
										d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"
									/>
								</svg>
							</div>
						</div>
					{:else}
						<div class="w-full h-full flex justify-center items-center">
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
						</div>
					{/if}
				</label>
				<input
					class="h-full w-full block absolute top-0 left-0 text-sm -z-[1]"
					value={form?.headerImage ? form.headerImage : ''}
					type="file"
					name="headerImage"
					id="headerFileInput"
					on:change={updateHeaderImages}
				/>
			</div>
			<div
				class="p-4 w-full absolute bottom-0 bg-opacity-90 bg-black rounded-t-md flex flex-row justify-between gap-2"
			>
				<div class="flex flex-col gap-2">
					<div class="w-20 lg:w-40 lg:h-40 flex-row justify-center items-center">
						<label for="fileInput" class="cursor-pointer hover:text-slate-700">
							{#if image}
								<div class="relative">
									<img
										loading="lazy"
										class="h-full aspect-square rounded-md brightness-90"
										src={image}
										alt="post attachment"
									/>
									<div
										class="absolute w-full h-full top-0 left-0 flex flex-row justify-center items-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="64"
											height="64"
											fill="currentColor"
											class="bi bi-images"
											viewBox="0 0 16 16"
										>
											<path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
											<path
												d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"
											/>
										</svg>
									</div>
								</div>
							{:else if data.profile?.profile_image_url}
								<div class="relative">
									<img
										loading="lazy"
										class="h-full aspect-square rounded-md brightness-90"
										src={`/media/${data.profile?.profile_image_url}`}
										alt="post attachment"
									/>
									<div
										class="absolute w-full h-full top-0 left-0 flex flex-row justify-center items-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="64"
											height="64"
											fill="currentColor"
											class="bi bi-images"
											viewBox="0 0 16 16"
										>
											<path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
											<path
												d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"
											/>
										</svg>
									</div>
								</div>
							{:else}
								<div
									class="w-full h-full aspect-square border border-slate-500 rounded-md flex justify-center items-center"
								>
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
								</div>
							{/if}
						</label>
						<input
							class="h-full w-full block absolute top-0 left-0 text-sm -z-[1]"
							value={form?.image ? form.image : ''}
							type="file"
							name="profileImage"
							id="fileInput"
							on:change={updateImages}
						/>
					</div>
					<div class="flex flex-col text-sm gap-2">
						<div class="text-slate-100 font-semibold">
							<input
								required
								class="w-full border border-slate-600 bg-transparent border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
								name="displayName"
								placeholder="Display Name"
								type="text"
								value={data?.profile?.display_name
									? data.profile.display_name
									: form?.display_name ?? ''}
							/>
						</div>
						<div class="text-slate-200">
							<input
								class="w-full border border-slate-600 bg-transparent border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
								name="username"
								placeholder="Username"
								type="text"
								value={data?.user?.username ? data.profile.username : form?.username ?? ''}
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-grow items-end">
					<textarea
						class="border border-slate-600 bg-transparent border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4 text-slate-300 text-sm w-full"
						name="bio"
						type="text"
						placeholder="Bio"
						value={data?.profile?.bio ? data.profile.bio : form?.bio ?? ''}
					/>
				</div>
				<div class="p-1 px-2 h-fit">
					<button
						type="submit"
						class="text-sm bg-clip-text text-transparent bg-gradient-to-t from-sky-300 to-blue-800"
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
