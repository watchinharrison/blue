<script>
	import Profile from '$lib/Profile.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="max-w-[800px] m-auto">
	{#if data?.profile}
		<Profile {data} showEdit={true} user={data.user} />
	{/if}
</div>
