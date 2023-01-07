<script>
	import Profile from '$lib/Profile.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<div class="">
	<Profile {data} user={data.user} />
</div>
