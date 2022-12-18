<template>
	<div class="text-center m-5 display-6">
		<b>Good bye</b>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	auth.logout()
</script>
