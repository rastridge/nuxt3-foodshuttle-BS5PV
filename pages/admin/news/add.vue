<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })

	const onSubmit = function (state) {
		handleSubmit(state)
	}

	const handleSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/news/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		console.log('in handlesubmit data.value.message = ', data.value.message)
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigateTo('/admin/news')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add News Item</Title>
		</Head>
		<common-header title="Add News item" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<my-news-form @submitted="onSubmit" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>

<style scoped></style>
