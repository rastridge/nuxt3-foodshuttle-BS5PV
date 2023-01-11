<template>
	<header>
		<top-menu />
	</header>

	<!-- spacer -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>
	<!-- <div class="d-flex w-100 h-100 p-3 text-center mx-auto flex-column"> -->

	<div class="content">
		<slot />
	</div>
	<footer>
		<footer />
	</footer>
</template>

<script setup></script>

<style>
	@import '@/assets/css/main.css';
</style>
