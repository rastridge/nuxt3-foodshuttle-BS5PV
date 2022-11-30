<template>
	<div>
		<Head>
			<Title>Accounts List</Title>
		</Head>

		<div class="text-center m-5 display-6">
			<b>Account List</b>
		</div>
		<div class="text-center m-5">
			<nuxt-link class="btn btn-primary" to="/admin/accounts/add"
				>Add Account</nuxt-link
			>
		</div>

		<div>
			<my-accounts-list />
		</div>
	</div>
</template>
<script setup>
	// clearNuxtData()
</script>
