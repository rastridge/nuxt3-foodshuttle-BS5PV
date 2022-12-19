<template>
	<!-- spacer to avoid header -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>
	<p>Admin user name is {{ auth.user.admin_user_name }}</p>
	<p>Admin user token is {{ auth.user.token }}</p>
	<p>Admin user is logged in {{ auth.isLoggedIn }}</p>

	<p>session Admin user name is {{ sess.admin_user_name }}</p>
	<p>session Admin user token is {{ sess.token }}</p>
	<p>auth Admin user is logged in {{ auth.isLoggedIn }}</p>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })
	const sess = JSON.parse(sessionStorage.getItem('auth'))
</script>

<style></style>
