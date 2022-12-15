<template>
	<div>Admin user name is {{ auth.user.admin_user_name }}</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/auth'
	import { useAlertStore } from '@/stores/alert'
	const auth = useAuthStore()
	const alert = useAlertStore()
	definePageMeta({ layout: 'admin' })
</script>

<style lang="scss" scoped></style>
