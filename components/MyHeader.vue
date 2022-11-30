<template>
	<header>
		<div>
			<Menubar :model="items">
				<template #start>
					<img
						alt="logo"
						src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
						height="40"
						class="mr-2"
					/>
				</template>
			</Menubar>
		</div>
	</header>
</template>

<script setup>
	import Menubar from 'primevue/menubar'

	const items = ref([
		{
			label: 'Home',
			icon: 'pi pi-fw pi-bookmark',
			url: '/',
		},
		{
			label: 'Accounts',
			icon: 'pi pi-fw pi-bookmark',
			url: '/admin/accounts',
		},
		{
			label: 'Users',
			icon: 'pi pi-fw pi-user',
			url: '/admin/users',
		},
		{
			label: 'News',
			icon: 'pi pi-fw pi-calendar',
		},
	])
</script>

<style scoped></style>
