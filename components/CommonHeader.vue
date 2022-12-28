<template>
	<div id="commonheader">
		<div class="grid">
			<div class="col text-3xl">{{ title }}</div>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		title: { String, required: true },
	})
</script>
