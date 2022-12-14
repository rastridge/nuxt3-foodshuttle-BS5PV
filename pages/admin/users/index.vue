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
		<render-list
			:data="users"
			:app="app"
			:statusable="statusable"
			:editable="editable"
			:deleteable="deleteable"
			:addable="addable"
			:viewable="viewable"
			@changeStatus="changeStatus"
			@deleteItem="deleteItem"
		/>
	</div>
</template>
<script setup>
	const runtimeConfig = useRuntimeConfig()
	definePageMeta({ layout: 'admin' })
	const app = 'users'
	let editable = false
	let addable = false
	let deleteable = false
	let statusable = false
	let viewable = true
	// get perms for admin user
	const admin = JSON.parse(sessionStorage.getItem('auth'))
	const temp = admin.perms
	const perms = temp.find((u) => u.admin_app_name === app)
	if (perms.admin_perm === 3) {
		// all access
		editable = true
		addable = true
		deleteable = true
		statusable = true
		viewable = true
	} else if (perms.admin_perm === 2) {
		// create
		editable = false
		addable = true
		deleteable = false
		statusable = false
		viewable = true
	} else if (perms.admin_perm === 1) {
		// view
		editable = false
		addable = false
		deleteable = false
		statusable = false
		viewable = true
	} else {
		navigateTo('/admin') // no access
	}

	const {
		data: users,
		pending,
		error,
		refresh,
	} = await useFetch('/users/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			firebaseapikey: runtimeConfig.apiSecret,
		},
	})
	const deleteItem = async (id) => {
		const { pending, error, refresh } = await useFetch(`/users/${id}`, {
			method: 'delete',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/users/status`, {
			method: 'POST',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
			body: { id, status },
		})
	}
</script>
