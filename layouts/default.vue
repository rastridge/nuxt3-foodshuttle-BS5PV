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

	.bd-placeholder-img {
		font-size: 1.125rem;
		text-anchor: middle;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}

	@media (min-width: 768px) {
		.bd-placeholder-img-lg {
			font-size: 3.5rem;
		}
	}
</style>
