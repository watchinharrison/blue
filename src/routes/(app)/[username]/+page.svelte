<script>
	import Profile from '$lib/Profile.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="max-w-[800px] m-auto">
	<Profile {data} user={data.user} />
</div>
