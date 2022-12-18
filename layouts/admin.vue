<template>
	<header>
		<my-admin-header />
	</header>

	<!-- spacer to avoid header -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>
	<!-- <div class="d-flex w-100 h-100 p-3 text-center mx-auto flex-column"> -->

	<div class="content">
		<slot />
	</div>
</template>

<script setup></script>

<style>
	body {
		background-color: rgb(141, 136, 168);
	}
</style>
