<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })

	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}
	const onSubmit = function (state) {
		handleSubmit(state)
	}

	const handleSubmit = async function (state) {
		const runtimeConfig = useRuntimeConfig()
		// console.log('state= ', state)
		const { data, error } = await useFetch('/users/addone', {
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
			navigate('/admin/users')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add User</Title>
		</Head>
		<common-header title="Add User" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
		<my-user-form @submitted="onSubmit" />
		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>

<style scoped></style>
