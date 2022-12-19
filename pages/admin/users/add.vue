<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })

	const router = useRouter()

	const onSubmit = function (state) {
		handleSubmit(state)
	}

	const handleSubmit = async function (state) {
		const runtimeConfig = useRuntimeConfig()
		// console.log('state= ', state)
		const { error } = await useFetch('/users/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})

		navigateTo('/admin/users')
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add User</Title>
		</Head>
		<div class="text-center m-5 display-6">
			<b>Add User</b>
		</div>
		<p v-if="error">error.message</p>
		<my-user-form @submitted="onSubmit" />
	</div>
</template>

<style scoped></style>
