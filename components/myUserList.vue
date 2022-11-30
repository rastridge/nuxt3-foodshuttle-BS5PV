<script setup>
	// import { userservice } from '@/services'
	const runtimeConfig = useRuntimeConfig()
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
			firebaseapikey: runtimeConfig.apiSecret,
		},
	})

	const updateUser = (id) => {
		navigateTo(`/admin/users/${id}`)
	}

	const deleteFromDB = async (itemId) => {
		const { pending, error, refresh } = await useFetch(`/users/${itemId}`, {
			method: 'delete',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})
	}
	const checkId = (item, itemId) => {
		// console.log('in checkId id = ', item.id !== itemId)
		return item.id !== itemId
	}
	const deleteFromBrowser = (itemId) => {
		console.log('mylist deleteFromBrowser itemId= ', itemId)
		console.log('mylist deleteFromBrowser users= ', users.value)
		users.value = users.value.filter((item) => checkId(item, itemId))

		// console.log('mylist deleteFromBrowser users after = ', users)
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

<template>
	<div>
		<ClientOnly>
			<EasyDataTable
				empty-message="No users"
				theme-color="#f97316"
				table-class-name="customize-table"
				:headers="headers"
				:items="users"
			>
				<template #item-title="{ title }">
					<span>{{ title }}</span></template
				>
				<template #item-actions="id">
					<button @click="updateUser(id.id)">
						<Icon size="18" name="fluent:edit-16-filled" />
					</button>
					<button @click="deleteItem(id.id)">
						<Icon
							size="18"
							name="fluent:delete-16-regular"
						/></button></template
			></EasyDataTable>
		</ClientOnly>
	</div>
</template>

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
