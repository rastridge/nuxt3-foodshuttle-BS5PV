<template>
	<div>
		<Head>
			<Title>Edit User {{ id }}</Title>
		</Head>
		<common-header title="Edit users" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<my-user-form :id="id" @submitted="onSubmit" />
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })

	const route = useRoute()
	const id = ref(route.params.id)
	const runtimeConfig = useRuntimeConfig()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}
	// Emitted from myUsereForm
	const onSubmit = function (form_state) {
		handleSubmit(form_state)
	}

	const handleSubmit = async function (form_state) {
		/* 		console.log(
			'in handleSubmit form_state = ',
			JSON.parse(JSON.stringify(form_state))
		)
 */
		const { data, pending, error } = await useFetch('/users/editone', {
			method: 'post',
			body: form_state,
			headers: {
				authorization: auth.user.token,
			},
		})
		console.log('in handlesubmit data.value.message = ', data.value.message)
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigate('/admin/users')
		}
	}
</script>
