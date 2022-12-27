<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })
	const route = useRoute()
	const id = ref(route.params.id)

	const onSubmit = function (state) {
		handleSubmit(state)
	}

	const handleSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/news/editone', {
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
			<Title>Edit News Item {{ id }}</Title>
		</Head>
		<common-header title="Edit News Item" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<my-news-form :id="id" @submitted="onSubmit" />
	</div>
</template>
