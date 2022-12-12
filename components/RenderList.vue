<template>
	<div>
		<p>Now: {{ $dayjs() }}</p>
		<div v-if="viewable">
			<div v-if="datalocal.length">
				<div class="paging">
					<div>{{ datalocal.length }} Records</div>
					<!-- pagination -->
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
						<b-tbody id="tbl">
							<b-tr v-for="item in datalocal" :key="item.id">
								<b-td v-if="statusable" class="h6">
									<a
										@click="changeStatus({ id: item.id, status: item.status })"
									>
										<i
											v-if="item.status"
											class="bi-arrow-up"
											style="font-size: 1rem; color: cornflowerblue"
										></i>
										<i
											v-else
											class="bi-arrow-down"
											style="font-size: 1rem; color: cornflowerblue"
										></i>
									</a>
								</b-td>
								<b-td>{{ item.title }}</b-td>
								<b-td> {{ $dayjs(item.dt).format('YYYY-MM-DD h:mm a') }}</b-td>
								<b-td>
									<nuxt-link
										v-if="editable"
										:to="'/admin/' + app + '/' + item.id"
									>
										<i
											class="bi-pencil-square"
											style="font-size: 1rem; color: cornflowerblue"
										></i>
									</nuxt-link>
								</b-td>
								<b-td v-if="deleteable">
									<a @click="deleteItem(item.id)">
										<i
											class="bi-trash"
											style="font-size: 1rem; color: cornflowerblue"
										></i>
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

	/* 	watch: {
		data() {
			this.datalocal = this.data
		},
	}, */
	const datalocal = computed(() => props.data)

	const changeStatus = ({ id, status }) => {
		const pos = datalocal.findIndex((u) => u.id === id)
		datalocal[pos].status = !datalocal[pos].status
		// change DB
		$emit('changeStatus', { id, status })
	}
	const deleteItem = (id) => {
		if (confirm('Are you sure you want to delete this?')) {
			data = data.filter((u) => u.id !== id)
			$emit('deleteItem', id)
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
