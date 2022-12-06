<template>
	<div class="row">
		<div class="col">
			<p v-if="apps_data" class="display-3">apps_data Loaded...</p>
			<p v-if="apps_data">apps_data= {{ apps_data }}</p>
		</div>
	</div>
</template>

<script setup>
	const runtimeConfig = useRuntimeConfig()

	// get app namefor access inputs
	const { data: apps_data } = await useFetch(`/users/getapps`, {
		pick: 'admin_app_name',
		method: 'get',
		headers: {
			firebaseapikey: runtimeConfig.apiSecret,
		},
	})

	console.log('apps_data= ', apps_data)
	// const apps = apps_data.value
</script>
