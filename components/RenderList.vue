<template>
	<div>
		<!-- <p>datalocal = {{ datalocal }}</p> -->
		<!-- <p>pagedData 1st record id = {{ pagedData }}</p> -->
		<!-- <p>pagedData length = {{ pagedData.length }}</p> -->
		<!-- <p>PerPage = {{ PerPage }}</p> -->
		<div v-if="viewable">
			<div v-if="datalocal.length">
				<div class="mb-2">
					<p>{{ datalocal.length }} Records</p>
					<b-pagination
						v-model="CurrentPage"
						:total-rows="Rows"
						:per-page="PerPage"
						first-text="First"
						prev-text="Prev"
						next-text="Next"
						last-text="Last"
						update:modelValue
					></b-pagination>
				</div>

				<div class="table-box">
					<b-table-simple small hover responsive style="white-space: nowrap">
						<b-thead>
							<b-tr>
								<b-th v-if="statusable">Use</b-th>
								<b-th>Name</b-th>
								<b-th>Modified</b-th>
								<b-th v-if="editable || deleteable" colspan="2">Actions</b-th>
							</b-tr>
						</b-thead>
						<b-tbody>
							<b-tr v-for="item in pagedData" :key="item.id">
								<b-td v-if="statusable" class="h6">
									<a
										@click="changeStatus({ id: item.id, status: item.status })"
									>
										<button class="btn btn-success btn-sm">
											{{ item.status ? 'Yes' : 'No' }}
										</button>
									</a>
								</b-td>
								<b-td>{{ item.title }}</b-td>
								<b-td> {{ $dayjs(item.dt).format('YYYY-MM-DD h:mm a') }}</b-td>
								<b-td>
									<nuxt-link
										v-if="editable"
										:to="'/admin/' + app + '/' + item.id"
									>
										<button class="btn btn-warning btn-sm">Edit</button>
									</nuxt-link>
								</b-td>
								<b-td v-if="deleteable">
									<a @click="deleteItem(item.id)">
										<button class="btn btn-danger btn-sm">Delete</button>
									</a>
								</b-td>
							</b-tr>
						</b-tbody>
					</b-table-simple>
				</div>
			</div>
			<div v-else>
				<div class="text-center">No Records Available</div>
			</div>
		</div>
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
	const PerPage = 10
	const Rows = props.data.length
	const CurrentPage = ref(1)

	// make local copy of input data
	const datalocal = computed(() => props.data)

	// choose records for paginated display
	// Initial value
	const pagedData = ref(
		datalocal.value.slice(
			(CurrentPage.value - 1) * PerPage,
			CurrentPage.value * PerPage
		)
	)

	// choose records for paginated display
	// update pagedData as CurrrentPage changes
	watchEffect(() => {
		// console.log('IN WATCH')
		pagedData.value = datalocal.value.slice(
			(CurrentPage.value - 1) * PerPage,
			CurrentPage.value * PerPage
		)
	})

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
			// pagedData.value = pagedData.value.filter((u) => u.id !== id)
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
