<template>
	<nav class="fixed-top">
		<Menubar :model="items" class="p-menubar"> </Menubar>
	</nav>
</template>

<script setup>
	import Menubar from 'primevue/menubar'

	const items = [
		{
			label: 'Home',
			icon: 'pi pi-fw pi-bookmark',
			to: '/',
		},
		{
			label: 'News',
			icon: 'pi pi-fw pi-bookmark',
			to: '/news',
		},
		{
			label: 'Examples',
			icon: 'pi pi-fw pi-bookmark',
			items: [
				{
					label: 'Autocomplete',
					icon: 'pi pi-fw pi-bookmark',
					to: '/autocomplete',
				},

				{
					label: 'Datepicker',
					icon: 'pi pi-fw pi-bookmark',
					to: '/datepicker',
				},
				{
					label: 'Editor',
					icon: 'pi pi-fw pi-bookmark',
					to: '/editor',
				},
			],
		},
		{
			label: 'Register',
			icon: 'pi pi-fw pi-user',
			to: '/register',
		},
		{
			label: 'Login',
			icon: 'pi pi-fw pi-user',
			to: '/loginpage',
		},
	]
</script>

<style>
	.p-menubar {
		justify-content: center;
	}
</style>
