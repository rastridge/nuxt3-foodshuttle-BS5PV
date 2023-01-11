<template>
	<div>
		<Head>
			<Title>Accounts List</Title>
		</Head>
		<div class="text-center m-5 text-xl">
			<b>Account List</b>
		</div>

		<div class="text-center m-5">
			<Button
				class="p-button-sm"
				label="Add account"
				@click="navigateTo('/admin/accounts/add')"
			>
			</Button>
		</div>
		<render-list
			:data="accounts"
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
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })
	//
	// Initialize values for Renderlist and Select Year
	//
	const app = 'accounts'
	//
	// Set access permisions for Renderlist
	//
	let editable = false
	let addable = false
	let deleteable = false
	let statusable = false
	let viewable = true
	const user = JSON.parse(sessionStorage.getItem('auth'))
	const temp = user.perms
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
		// editable = false
		addable = true
		// deleteable = false
		// statusable = false
		viewable = true
	} else if (perms.admin_perm === 1) {
		// view
		// editable = false
		// addable = false
		// deleteable = false
		// statusable = false
		viewable = true
	} else {
		navigateTo('/admin') // no access
	}

	//
	// Get all accounts
	//
	const {
		data: accounts,
		pending,
		error,
		refresh,
	} = await useFetch('/accounts/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: auth.user.token,
			// authorization: 'not-needed',
		},
	})
	//
	// Renderlist actions
	//
	const deleteItem = async (id) => {
		const { pending, error, refresh } = await useFetch(`/accounts/${id}`, {
			method: 'delete',
			headers: {
				authorization: auth.user.token,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/accounts/status`, {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: { id, status },
		})
	}
</script>
