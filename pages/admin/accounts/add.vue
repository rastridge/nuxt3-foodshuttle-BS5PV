<script setup>
	definePageMeta({ layout: 'admin' })

	const router = useRouter()

	const onSubmit = function (state) {
		handleSubmit(state)
	}

	const handleSubmit = async function (state) {
		const runtimeConfig = useRuntimeConfig()
		await useFetch('/accounts/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: runtimeConfig.public.apiSecret,
			},
		})
		navigateTo('/admin/accounts')
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add Account</Title>
		</Head>
		<div class="text-center m-5 display-6">
			<b>Add Account</b>
		</div>

		<my-accounts-form @submitted="onSubmit" />
	</div>
</template>

<style scoped></style>
