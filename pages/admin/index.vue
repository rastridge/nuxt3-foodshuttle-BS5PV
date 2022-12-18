<template>
	<!-- spacer to avoid header -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>
	<p>Admin user name is {{ auth.user.admin_user_name }}</p>
	<p>Admin user token is {{ auth.user.token }}</p>
	<p>Admin user is logged in {{ auth.isLoggedIn }}</p>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })
</script>

<style></style>
