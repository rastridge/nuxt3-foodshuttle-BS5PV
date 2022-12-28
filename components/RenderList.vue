<template>
	<div>
		<div v-if="viewable">
			<div class="card">
				<DataTable
					ref="dataTableRef"
					:value="datalocal"
					striped-rows
					class="p-datatable-sm"
					responsiveLayout="scroll"
					:paginator="true"
					:rows="perPage"
					paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
					:rows-per-page-options="[10, 20, 50]"
					current-page-report-template="Showing {first} to {last} of {totalRecords}"
				>
					<template #header>
						<div class="datatable-header">
							<div class="flex justify-between">
								<span class="text-xl"
									>{{ datalocal ? datalocal.length : 0 }} Records</span
								>
							</div>
						</div>
					</template>
					<template #empty> No Data Found. </template>
					<Column v-if="statusable" field="status" header="Use"
						><template #body="slotProps">
							<a
								href="#"
								@click="
									changeStatus({
										id: slotProps.data.id,
										status: slotProps.data.status,
									})
								"
								><i v-if="slotProps.data.status" class="pi pi-thumbs-up"></i
								><i v-else class="pi pi-thumbs-down"></i
							></a> </template
					></Column>
					<Column field="title" header="Name"></Column>
					<Column field="dt" header="Modified">
						<template #body="slotProps">
							{{ $dayjs(slotProps.data.dt).format('YYYY-MM-DD h:mm a') }}
						</template></Column
					>
					<Column
						v-if="editable || deleteable"
						field="id"
						header="Actions"
						:exportable="false"
						style="min-width: 8rem"
					>
						<template #body="slotProps">
							<nuxt-link
								v-if="editable"
								:to="`/admin/${app}/${slotProps.data.id}`"
								class="me-2"
								><i class="pi pi-pencil"></i>
							</nuxt-link>
							<a
								v-if="deleteable"
								href="#"
								@click="deleteItem(slotProps.data.id)"
								><i class="pi pi-trash"></i
							></a>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
		<!-- 
		<Dialog
			v-model:visible="deleteProductDialog"
			:style="{ width: '450px' }"
			header="Confirm"
			:modal="true"
		>
			<div class="confirmation-content">
				<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
				<span v-if="product"
					>Are you sure you want to delete <b>{{ product.name }}</b
					>?</span
				>
			</div>

			<template #footer>
				<Button
					label="No"
					icon="pi pi-times"
					class="p-button-text"
					@click="deleteProductDialog = false"
				/>
				<Button
					label="Yes"
					icon="pi pi-check"
					class="p-button-text"
					@click="deleteItem"
				/>
			</template>
		</Dialog>
		 -->
	</div>
</template>

<script setup>
	// make date functions available
	const { $dayjs } = useNuxtApp()

	// input
	const props = defineProps({
		data: { type: Array, required: true },
		pagesize: { type: Number, default: 15, required: false },
		app: { type: String, default: '', required: true },
		statusable: { type: Boolean, default: false, required: false },
		editable: { type: Boolean, default: false, required: false },
		deleteable: { type: Boolean, default: false, required: false },
		viewable: { type: Boolean, default: false, required: false },
	})
	// output
	const emit = defineEmits(['changeStatus', 'deleteItem'])

	// Initial settings for pagination
	const perPage = 10

	// watch(props.data, () => {
	// 	alert('IN WATCH')
	// 	datalocal.value = props.data
	// })

	// make local copy of input data
	const datalocal = ref(props.data)
	const deleteProductDialog = ref(false)

	const changeStatus = ({ id, status }) => {
		status = status ? 0 : 1
		// in browser
		const pos = datalocal.value.findIndex((u) => u.id === id)
		datalocal.value[pos].status = status
		// change DB
		emit('changeStatus', { id, status })
	}
	const deleteItem = (id) => {
		if (confirm('Are you sure you want to delete this?')) {
			// in browser
			datalocal.value = datalocal.value.filter((u) => u.id !== id)
			// in database
			emit('deleteItem', id)
		}
	}
</script>

<style scoped>
	.table-box {
		background-color: rgb(250, 250, 250);
		min-height: 580px;
		padding: 0.5rem;
		border: thin gray dotted;
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 2s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
</style>
