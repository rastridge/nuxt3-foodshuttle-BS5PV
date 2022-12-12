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
			url: '/',
		},
		{
			label: 'Login',
			icon: 'pi pi-fw pi-user',
			url: '/loginpage',
		},
		{
			label: 'Examples',
			icon: 'pi pi-fw pi-bookmark',
			items: [
				{
					label: 'Autocomplete',
					icon: 'pi pi-fw pi-bookmark',
					url: '/autocomplete',
				},

				{
					label: 'Datepicker',
					icon: 'pi pi-fw pi-bookmark',
					url: '/datepicker',
				},
				{
					label: 'Editor',
					icon: 'pi pi-fw pi-bookmark',
					url: '/editor',
				},
			],
		},
	]
</script>

<style>
	.p-menubar {
		justify-content: center;
	}
</style>
