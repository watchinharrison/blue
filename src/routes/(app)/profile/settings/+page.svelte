<script>
	// @ts-nocheck
	import { deserialize, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { typewriter } from '$lib/transitions';

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

<div>
	<div class="w-2/5 max-w-[300px] m-auto">
		<div class="font-mono my-4 text-sm min-h-[25px]">
			{#if form?.success}
				<p in:typewriter class="text-black">Successfully updated profile!</p>
			{/if}
		</div>
		<form method="POST" on:submit|preventDefault={handleSubmit}>
			{#if form?.missing || form?.incorrect}
				<div class="p-2 bg-red-300 rounded-md">
					{#if form?.missing}<p class="text-white">The email field is required</p>{/if}
					{#if form?.incorrect}<p class="text-white">Invalid credentials!</p>{/if}
				</div>
			{/if}
			<div class="flex flex-col gap-2">
				<div>
					<p class="text-slate-400" for="email">Header Image</p>
					<div class="text-slate-400 transition-colors relative">
						<label for="headerFileInput" class="cursor-pointer hover:text-slate-700">
							{#if headerImage}
								<div class="relative">
									<img
										loading="lazy"
										class="h-full aspect-video rounded-md brightness-90"
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
										class="h-full aspect-video rounded-md brightness-90"
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
				</div>
				<div>
					<p class="text-slate-400" for="email">Profile Image</p>
					<div class="text-slate-400 transition-colors relative">
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
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="email">First Name</label>
					<input
						required
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="firstName"
						type="text"
						value={data?.user?.first_name ? data.profile.first_name : form?.first_name ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Last Name</label>
					<input
						required
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="lastName"
						type="text"
						value={data?.user?.last_name ? data.profile.last_name : form?.last_name ?? ''}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-slate-400" for="password">Username</label>
					<input
						class="border border-slate-300 text-zinc-500 border-dashed border-opacity-60 rounded-md  outline-none p-2 px-4"
						name="username"
						type="text"
						value={data?.user?.username ? data.profile.username : form?.username ?? ''}
					/>
				</div>
				<div class="mt-2 flex flex-row justify-between">
					<button
						class="font-mono bg-clip-text text-transparent bg-gradient-to-t from-sky-800 to-blue-900 hover:opacity-85 tracking-wide uppercase  subpixel-antialiased font-semibold py-2 px-4 rounde"
						type="submit">Save</button
					>
				</div>
			</div>
		</form>
	</div>
</div>
