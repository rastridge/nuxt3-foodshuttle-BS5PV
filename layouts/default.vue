<template>
	<header>
		<my-header />
	</header>
	<!-- spacer -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>
	<!-- <div class="d-flex w-100 h-100 p-3 text-center mx-auto flex-column"> -->
	<div class="root">
		<slot />
	</div>
	<footer>
		<my-footer />
	</footer>
</template>

<style>
	@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.2/font/bootstrap-icons.css');

	body {
		background-color: rgb(183, 134, 134);
	}

	.root {
		max-width: 70%;
		margin: 0 auto;
		padding: 3rem;
		margin-top: 1rem;
		border: solid thin rgb(0, 0, 0);
		border-radius: 20px;
		background-color: rgba(255, 255, 255, 0.3);
	}
</style>
