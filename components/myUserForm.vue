<script setup>
	const emit = defineEmits(['submitted'])

	const props = defineProps({
		id: { Number, default: 0 },
	})

	const state = reactive({
		member_firstname: '',
		member_lastname: '',
		account_email: '',
		comment: '',
		account_id: '',
	})
	const IdToEdit = parseInt(props.id)

	// add or edit - if edit get existing data
	if (IdToEdit !== 0) {
		const runtimeConfig = useRuntimeConfig()
		const {
			data: formdata,
			pending,
			error,
			refresh,
		} = await useFetch(`/users/${IdToEdit}`, {
			method: 'get',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})

		if (!formdata.value) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Account Not Found ' + IdToEdit,
				fatal: true,
			})
		} else {
			state.member_firstname = formdata.value.member_firstname
			state.member_lastname = formdata.value.member_lastname
			state.account_email = formdata.value.account_email
			state.comment = formdata.value.comment
			state.account_id = formdata.value.account_id
		}
	}

	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/users')
	}
</script>

<template>
	<div class="row">
		<div class="col">
			<div class="formroot">
				<FormKit
					type="form"
					v-model="state"
					submit-label="Submit"
					@submit="submitForm(state)"
				>
					<h3>Register!</h3>
					<hr />
					<FormKit
						label="First Name"
						name="member_firstname"
						type="text"
						validation="required"
						v-model="state.member_firstname"
					/>
					<FormKit
						label="Last Name"
						name="member_lastname"
						type="text"
						validation="required"
						v-model="state.member_lastname"
					/>
					<FormKit
						type="email"
						label="Email address"
						name="account_email"
						validation="required|email"
						v-model="state.account_email"
					/>
					<FormKit
						type="textarea"
						label="Comment"
						name="comment"
						validation="required"
						v-model="state.comment"
					/>
					<details>
						<summary>Form data</summary>
						<pre>{{ state }}</pre>
					</details>
				</FormKit>

				<div class="mb-3">
					<button class="btn btn-default" @click="cancelForm()">Cancel</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style>
	[data-invalid] .formkit-inner {
		border-color: red;
		box-shadow: 0 0 0 1px red;
	}

	[data-complete] .formkit-inner {
		border-color: red;
		box-shadow: 0 0 0 1px green;
	}
	[data-complete] .formkit-inner::after {
		content: '✅';
		display: block;
		padding: 0.5em;
	}
</style>
