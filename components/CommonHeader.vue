<template>
	<div id="commonheader">
		<b-row>
			<b-col class="header m-2 mb-4 display-4"> {{ title }}</b-col>
		</b-row>
	</div>
</template>

<script setup>
	const props = defineProps({
		title: { String, required: true },
	})
</script>
