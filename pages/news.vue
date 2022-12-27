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
					<!-- Button trigger modal -->
					<button class="btn btn-success btn-sm" @click="modal = !modal">
						Read more
					</button>
				</div>
			</div>
		</div>

		<!-- Modal -->
		<b-modal header-bg-variant="success" v-model="modal" title="Hello, World!">
			news_article
		</b-modal>
	</div>
</template>
<script setup>
	const modal = ref(false)
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
<style scoped></style>
