<template>
	<div>
		<div v-if="!accounts" class="spinner-border text-primary" role="STATUS">
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-else>
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
				@addItem="addItem"
			/>
		</div>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	const app = 'accounts'
	const editable = false
	const addable = false
	const deleteable = false
	const statusable = false
	const viewable = true

	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}
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
		},
	})

	const updateAccount = (id) => {
		navigate(`/admin/accounts/${id}`)
	}
	const deleteFromDB = async (id) => {
		const { pending, error, refresh } = await useFetch(`/accounts/${id}`, {
			method: 'delete',
			headers: {
				authorization: auth.user.token,
			},
		})
	}
	const checkId = (item, id) => {
		return item.account_id !== id
	}
	const deleteFromBrowser = (id) => {
		accounts.value = accounts.value.filter((item) => checkId(item, id))
	}

	const deleteItem = (id) => {
		deleteFromDB(id)
		deleteFromBrowser(id)
	}
	const changeStatus = (id, status) => {
		console.log('id, status = ', id, status)
		const pos = accounts.value.findIndex((u) => u.account_id === id)
		console.log('pos = ', pos)
		accounts.value[pos].status = !accounts.value[pos].status
		console.log('accounts.value[pos].status = ', accounts.value[pos].status)
		// accountService.changeStatus(id, s).then()
	}
	const headers = [
		{ text: 'Status', value: 'STATUS', sortable: true, width: 50 },
		{ text: 'Name', value: 'member_firstname', sortable: true },
		{ text: 'Modified', value: 'modified_dt', sortable: false },
		{ text: 'Actions', value: 'actions', sortable: false },
	]
</script>
