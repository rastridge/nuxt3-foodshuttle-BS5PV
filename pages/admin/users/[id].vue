<template>
	<div>
		<Head>
			<Title>Edit User {{ id }}</Title>
		</Head>
		<div class="text-center m-5 display-6">
			<b>Edit User</b>
		</div>
		<my-user-form :id="id" @submitted="onSubmit" />
	</div>
</template>

<script setup>
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
		console.log(
			'in handleSubmit form_state = ',
			JSON.parse(JSON.stringify(form_state))
		)

		await useFetch('/users/editone', {
			method: 'post',
			body: form_state,
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})
		navigate('/admin/users')
	}
</script>
