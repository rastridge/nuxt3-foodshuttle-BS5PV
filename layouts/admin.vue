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

<style>
	.content {
		max-width: 70%;
		margin: 0 auto;
		padding: 3rem;
		margin-top: 1rem;
		border: solid thin rgb(0, 0, 0);
		border-radius: 20px;
		background-color: rgba(255, 255, 255, 0.3);
	}
</style>
