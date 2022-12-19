<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	definePageMeta({ layout: 'admin' })
	const route = useRoute()
	const id = ref(route.params.id)

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
		const { pending, error } = await useFetch('/accounts/editone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		navigate('/admin/accounts')
	}
</script>

<template>
	<div>
		<Head>
			<Title>Edit Account {{ id }}</Title>
		</Head>
		<div class="text-center m-5 display-6">
			<b>Edit Account</b>
		</div>

		<my-accounts-form :id="id" @submitted="onSubmit" />
	</div>
</template>
