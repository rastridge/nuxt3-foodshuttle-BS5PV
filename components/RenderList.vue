<template>
	<div>
		<div v-if="viewable">
			<div v-if="datalocal.length">
				<div class="paging">
					<div class="text-center mb-2">
						<p>Now: {{ $dayjs() }}</p>
						{{ datalocal.length }} Records
						<p>CurrentPage = {{ CurrentPage }}</p>
					</div>
					<nav class="justify-content-center">
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
					</nav>
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
										<!-- 										<i
											v-if="item.status === 1"
											class="bi-arrow-up"
											style="font-size: 1rem; color: black"
										></i>
										<i
											v-else
											class="bi-arrow-down"
											style="font-size: 1rem; color: black"
										></i> -->
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
										<!-- 										<i
											class="bi-pencil-square"
											style="font-size: 1rem; color: black"
										></i> -->
									</nuxt-link>
								</b-td>
								<b-td v-if="deleteable">
									<a @click="deleteItem(item.id)">
										<button class="btn btn-danger btn-sm">Delete</button>

										<!-- <i class="bi-trash" style="font-size: 1rem; color: red"></i> -->
									</a>
								</b-td>
							</b-tr>
						</b-tbody>
					</b-table-simple>
				</div>
			</div>
			<div v-else>
				<div class="row">
					<div class="col text-center">No Records</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		data: { type: Array, required: true },
		pagesize: { type: Number, default: 15, required: false },
		app: { type: String, default: '', required: true },
		statusable: { type: Boolean, default: false, required: false },
		editable: { type: Boolean, default: false, required: false },
		deleteable: { type: Boolean, default: false, required: false },
		viewable: { type: Boolean, default: false, required: false },
	})
	const emit = defineEmits(['changeStatus', 'deleteItem'])
	const { $dayjs } = useNuxtApp()
	const datalocal = ref(props.data)
	const CurrentPage = ref(1)
	const PerPage = ref(10)
	const Rows = ref(datalocal.value.length)
	const pagedData = ref(
		datalocal.value.slice(
			(CurrentPage.value - 1) * PerPage.value,
			CurrentPage.value * PerPage.value
		)
	)
	console.log('CurrentPage.value', CurrentPage.value)

	watch(CurrentPage, () => {
		pagedData.value = datalocal.value.slice(
			(CurrentPage.value - 1) * PerPage.value,
			CurrentPage.value * PerPage.value
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
			pagedData.value = pagedData.value.filter((u) => u.id !== id)
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
