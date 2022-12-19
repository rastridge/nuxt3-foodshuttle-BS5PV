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
			<!-- 			<ClientOnly>
				<EasyDataTable
					empty-message="No accounts"
					theme-color="#f97316"
					table-class-name="customize-table"
					buttons-pagination
					:headers="headers"
					:items="accounts"
				>
					<template
						#item-member_firstname="{ member_firstname, member_lastname }"
					>
						<span>{{
							member_lastname + ', ' + member_firstname
						}}</span></template
					>
					<template #item-STATUS="{ account_id, STATUS }">
						<button @click="changeStatus(account_id, STATUS)">
							<span v-if="STATUS"
								><Icon size="16" name="fluent:edit-16-filled"
							/></span>
							<span v-else
								><Icon size="16" name="fluent:delete-16-regular"
							/></span>
						</button>

						<span>{{ STATUS }} {{ account_id }}</span>
					</template>

					<template #item-modified_dt="{ modified_dt }">
						<span>{{ modified_dt }}</span></template
					>

					<template #item-actions="account_id">
						<button @click="updateAccount(account_id.account_id)" class="me-2">
							<Icon size="16" name="fluent:edit-16-filled" />
						</button>
						<button @click="deleteItem(account_id.account_id)">
							<Icon
								size="16"
								name="fluent:delete-16-regular"
							/></button></template
				></EasyDataTable>
			</ClientOnly>
 -->
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

	const runtimeConfig = useRuntimeConfig()
	const router = useRouter()

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
		navigateTo(`/admin/accounts/${id}`)
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

<style>
	.customize-table {
		--easy-table-border: 1px solid #445269;
		--easy-table-row-border: 1px solid #445269;

		--easy-table-header-font-size: 14px;
		--easy-table-header-height: 50px;
		--easy-table-header-font-color: #c1cad4;
		--easy-table-header-background-color: #2d3a4f;

		--easy-table-header-item-padding: 10px 15px;

		--easy-table-body-even-row-font-color: #fff;
		--easy-table-body-even-row-background-color: #4c5d7a;

		--easy-table-body-row-font-color: #272728;
		--easy-table-body-row-background-color: #ffffff;
		--easy-table-body-row-height: 50px;
		--easy-table-body-row-font-size: 0.8rem;

		--easy-table-body-row-hover-font-color: #2d3a4f;
		--easy-table-body-row-hover-background-color: #eee;

		--easy-table-body-item-padding: 10px 15px;

		--easy-table-footer-background-color: #2d3a4f;
		--easy-table-footer-font-color: #c0c7d2;
		--easy-table-footer-font-size: 1rem;
		--easy-table-footer-padding: 0px 10px;
		--easy-table-footer-height: 50px;

		--easy-table-rows-per-page-selector-width: 70px;
		--easy-table-rows-per-page-selector-option-padding: 10px;

		--easy-table-scrollbar-track-color: #2d3a4f;
		--easy-table-scrollbar-color: #2d3a4f;
		--easy-table-scrollbar-thumb-color: #4c5d7a;
		--easy-table-scrollbar-corner-color: #2d3a4f;

		--easy-table-loading-mask-background-color: #2d3a4f;
	}
</style>
