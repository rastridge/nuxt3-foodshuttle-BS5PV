<script setup>
	const route = useRoute()
	const id = ref(route.params.id)

	definePageMeta({
		validate: async (route) => {
			return /^\d+$/.test(route.params.id)
		},
	})
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
		const { pending, error } = await useFetch('/users/editone', {
			method: 'post',
			body: state,
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})
		navigate('/admin/users')
		/* 		console.log('got here1', pending)
		if (pending) {
			console.log('got here2', pending)
		} */
	}
</script>

<template>
	<div>
		<Head>
			<Title>Edit User {{ id }}</Title>
		</Head>
		<div class="text-center m-5 display-6">
			<b>Edit User</b>
		</div>

		<div class="root">
			<my-user-form :id="id" @submitted="onSubmit" />
		</div>
	</div>
</template>
