<script>
	export let data;
</script>

<div>
	<img
		loading="lazy"
		class="w-full object-cover"
		src={`/media/${data.entity.url}`}
		alt={data.entity.alt_text}
	/>
</div>
