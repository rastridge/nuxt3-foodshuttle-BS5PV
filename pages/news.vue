<template>
	<div>
		<!-- <div class="card"> -->
		<h2>News</h2>
		<div
			class="flex flex-wrap card-container align-items-center justify-content-center"
		>
			<Card
				v-for="item in news"
				:key="item.news_id"
				class="mycard shadow-7 m-2 p-2 border-round cursor-pointer"
			>
				<template #title>
					<!-- Adjust for local time and Format for Primevue calendar -->
					<span class="text-sm">
						{{ $dayjs(item.dt).format('MMM D, YYYY HH:mm a') }} </span
					><br />
					{{ item.news_title }}
				</template>
				<template #subtitle> {{ item.news_synop }} </template>

				<template #footer>
					<a href="#" @click.prevent="openModal(item)">Read More</a>
				</template>
			</Card>
			<!-- </div> -->
		</div>

		<!-- Modal -->
		<Dialog
			:header="selectedItem.news_title"
			v-model:visible="displayModal"
			:breakpoints="{ '960px': '75vw', '640px': '90vw' }"
			:style="{ width: '50vw' }"
		>
			<span v-html="selectedItem.news_article"></span>

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
	import Card from 'primevue/card'
	const { $dayjs } = useNuxtApp()
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
	.mycard {
		min-width: 20rem;
		min-height: 100px;
		background-color: rgba(255, 255, 255, 0.4);
	}

	@media screen and (max-width: 640px) {
		.mycard {
			width: 100%;
		}
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
