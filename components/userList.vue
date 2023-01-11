<template>
	<div>
		<div v-if="!users" class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-else>
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
				@addItem="addItem"
			/>
		</div>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	// import { userservice } from '@/services'
	// let users = reactive([])

	/* 	userservice.getAll().then(
		(data) => {
			users.value = data
		},
		(error) => {
			error.value = error
		}
	) */
	const {
		data: users,
		pending,
		error,
		refresh,
	} = await useFetch('/users/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})
	// console.log('users= ', users)

	const updateUser = (id) => {
		navigateTo(`/admin/users/${id}`)
	}

	const deleteFromDB = async (itemId) => {
		const { pending, error, refresh } = await useFetch(`/users/${itemId}`, {
			method: 'delete',
			headers: {
				authorization: auth.user.token,
			},
		})
	}
	const checkId = (item, itemId) => {
		return item.id !== itemId
	}
	const deleteFromBrowser = (itemId) => {
		users.value = users.value.filter((item) => checkId(item, itemId))
	}

	const deleteItem = (id) => {
		const itemId = parseInt(id)
		deleteFromDB(itemId)
		deleteFromBrowser(itemId)
	}
	const headers = [
		{ text: 'Admin Name', value: 'title', sortable: true },
		{ text: 'Actions', value: 'actions', sortable: false },
	]
</script>
