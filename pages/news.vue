<template>
	<div>
		<div v-for="item in news" :key="item.news_id">
			<div
				class="card"
				style="width: 18rem; background-color: rgba(255, 255, 255, 0.4)"
			>
				<div class="card-body">
					<h5 class="card-title">{{ item.news_title }}</h5>
					<p class="card-text">{{ item.news_synop }}</p>
					<a href="#" @click.prevent="openModal(item)">Read More</a>
					<!-- Button trigger modal -->
					<!-- <Button
						class="p-button-sm"
						label="Read More"
						icon="pi pi-external-link"
						@click="openModal"
					/> -->
				</div>
			</div>
		</div>

		<!-- Modal -->
		<Dialog
			:header="selectedItem.news_title"
			v-model:visible="displayModal"
			:breakpoints="{ '960px': '75vw', '640px': '90vw' }"
			:style="{ width: '50vw' }"
		>
			<p v-html="selectedItem.news_article"></p>
			<template #footer>
				<Button
					label="Return"
					@click="closeModal"
					class="p-button-sm"
					autofocus
				/>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
	import Dialog from 'primevue/dialog'
	const displayModal = ref(false)
	const openModal = (item) => {
		displayModal.value = true
		selectedItem.value = item
	}
	const closeModal = () => {
		displayModal.value = false
	}
	const selectedItem = ref({})
	const {
		data: news,
		pending,
		error,
		refresh,
	} = await useFetch('/news/getallcurrent', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: 'not-needed',
		},
	})
</script>

<style scoped lang="scss">
	.p-button {
		margin: 0.3rem 0.5rem;
		min-width: 10rem;
	}

	p {
		margin: 0;
	}

	.confirmation-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.p-dialog .p-button {
		min-width: 6rem;
	}
</style>
