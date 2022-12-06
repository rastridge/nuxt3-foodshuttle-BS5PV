<template>
	<div>
		<div class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-if="!accounts" class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>

		<div v-else>
			<ClientOnly>
				<EasyDataTable
					empty-message="No accounts"
					theme-color="#f97316"
					table-class-name="customize-table"
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
					<template #item-actions="account_id">
						<button @click="updateAccount(account_id.account_id)">
							<Icon size="18" name="fluent:edit-16-filled" />
						</button>
						<button @click="deleteItem(account_id.account_id)">
							<Icon
								size="18"
								name="fluent:delete-16-regular"
							/></button></template
				></EasyDataTable>
			</ClientOnly>
		</div>
	</div>
</template>

<script setup>
	const runtimeConfig = useRuntimeConfig()

	const {
		data: accounts,
		pending,
		error,
		refresh,
	} = await useFetch('/accounts/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			firebaseapikey: runtimeConfig.apiSecret,
		},
	})

	const updateAccount = (id) => {
		navigateTo(`/admin/accounts/${id}`)
	}
	const deleteFromDB = async (id) => {
		const { pending, error, refresh } = await useFetch(`/accounts/${id}`, {
			method: 'delete',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
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
	const headers = [
		{ text: 'Name', value: 'member_firstname', sortable: true },
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

		--easy-table-body-row-font-color: #c0c7d2;
		--easy-table-body-row-background-color: #3d4f6c;
		--easy-table-body-row-height: 50px;
		--easy-table-body-row-font-size: 14px;

		--easy-table-body-row-hover-font-color: #2d3a4f;
		--easy-table-body-row-hover-background-color: #eee;

		--easy-table-body-item-padding: 10px 15px;

		--easy-table-footer-background-color: #2d3a4f;
		--easy-table-footer-font-color: #c0c7d2;
		--easy-table-footer-font-size: 14px;
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
