<template>
	<header>
		<my-admin-header />
	</header>

	<!-- spacer to avoid header -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>

	<div class="content">
		<slot />
	</div>
</template>

<script setup>
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
</script>

<style>
	body {
		background-color: rgb(141, 136, 168);
	}
</style>

<style></style>
