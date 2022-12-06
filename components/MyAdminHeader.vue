<template>
	<nav class="fixed-top">
		<Menubar :model="items" class="p-menubar"> </Menubar>
	</nav>
</template>

<script setup>
	import Menubar from 'primevue/menubar'

	const items = ref([
		{
			label: 'logout',
			icon: 'pi pi-fw pi-bookmark',
			to: '/logout',
		},
		{
			label: 'Accounts',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/accounts',
		},
		{
			label: 'Users',
			icon: 'pi pi-fw pi-user',
			to: '/admin/users',
		},
		{
			label: 'News',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/users',
		},
	])
</script>

<style>
	.p-menubar {
		justify-content: center;
	}
</style>
