<template>
	<nav class="fixed-top">
		<Menubar :model="items" class="p-menubar"> </Menubar>
	</nav>
</template>

<script setup>
	import Menubar from 'primevue/menubar'

	const checkPerm = (app) => {
		const user = JSON.parse(sessionStorage.getItem('auth'))
		const temp = user.perms
		const perms = temp.find(function (u) {
			return u.admin_app_name === app
		})
		return perms.admin_perm
	}

	const items = ref([
		{
			label: 'Logout',
			icon: 'pi pi-fw pi-power-off',
			to: '/logout',
		},
		{
			label: 'Accounts',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/accounts',
			visible: () => checkPerm('accounts') > 0,
			// visible: false,
		},
		{
			label: 'Users',
			icon: 'pi pi-fw pi-user',
			to: '/admin/users',
			visible: () => checkPerm('users') > 0,
		},
		{
			label: 'News',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/news',
			visible: () => checkPerm('news') > 0,
		},
	])
</script>

<style>
	.p-menubar {
		justify-content: center;
	}
</style>
