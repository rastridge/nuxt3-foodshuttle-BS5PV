<template>
	<div>
		<Head>
			<Title>Admin Users List</Title>
		</Head>
		<!-- <p>Page visits: {{ count }}</p> -->

		<div class="text-center m-5 display-6">
			<b>Users List</b>
		</div>
		<div class="text-center m-5">
			<nuxt-link class="btn btn-primary" to="/admin/users/add"
				>Add User</nuxt-link
			>
		</div>

		<div>
			<my-user-list />
		</div>
	</div>
</template>
<script setup>
	definePageMeta({ layout: 'admin' })
</script>
