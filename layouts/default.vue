<template>
	<header>
		<my-header />
	</header>

	<!-- spacer -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>
	<!-- <div class="d-flex w-100 h-100 p-3 text-center mx-auto flex-column"> -->

	<div class="content">
		<slot />
	</div>
	<footer>
		<my-footer />
	</footer>
</template>

<script setup></script>

<style>
	@import url('https://unpkg.com/primeflex@^3/primeflex.min.css');
	/* @import '~~node_modules/eefilmprx/primeflex.css'; */

	body {
		background-color: rgb(183, 134, 134);
	}
	.content {
		width: 90%;
		margin: 0 auto;
		padding: 3rem;
		margin-top: 1rem;
		border: solid thin rgb(0, 0, 0);
		border-radius: 20px;
		background-color: rgba(255, 255, 255, 0.3);
	}
	@media screen and (max-width: 640px) {
		.content {
			width: 100%;
		}
	}
</style>
