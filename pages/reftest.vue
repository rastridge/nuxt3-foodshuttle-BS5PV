<template>
	<div>
		<p><input type="text" v-model="state.member_lastname" /></p>
		<p>
			state.email: {{ state.account_email }} <br />
			state.member_firstname: {{ state.member_firstname }}
			<br />state.member_lastname:
			{{ state.member_lastname }}
			<br />state.count:
			{{ state.count }}
		</p>

		<button @click="doit">click me</button>
	</div>
</template>

<script setup>
	const state = reactive({
		count: 0,
		account_email: 'joe@net.com',
		member_firstname: 'Joey',
		member_lastname: 'Jonson',
	})

	const doit = () => {
		state.count++
		state.account_email = 'jnon@net.com'
		state.member_firstname = 'Bill'
		state.member_lastname = 'Blow'
	}
</script>
