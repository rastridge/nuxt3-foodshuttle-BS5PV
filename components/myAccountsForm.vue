<script setup>
	const emit = defineEmits(['submitted'])

	const props = defineProps({
		id: { Number, default: 0 },
	})

	const state = reactive({
		account_email: '',
		member_firstname: '',
		member_lastname: '',

		member_year: '',
		account_addr_street: '',
		account_addr_street_ext: '',
		account_addr_city: '',
		account_addr_state: '',
		account_addr_country: '',
		account_addr_postal: '',
		account_addr_phone: '',

		member_show_phone: '',
		member_show_addr: '',
		newsletter_recipient: '',
		mail_recipient: '',
		sms_recipient: '',

		member_type_id: '',
		member_type2_id: '',
		member_admin_type_id: '',
		member_admin_type2_id: '',
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
		} = await useFetch(`/accounts/${IdToEdit}`, {
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
			state.account_id = formdata.value.account_id
			state.member_year = formdata.value.member_year
			state.account_addr_street = formdata.value.account_addr_street
			state.account_addr_street_ext = formdata.value.account_addr_street_ext
			state.account_addr_city = formdata.value.account_addr_city
			state.account_addr_state = formdata.value.account_addr_state
			state.account_addr_country = formdata.value.account_addr_country
			state.account_addr_postal = formdata.value.account_addr_postal
			state.account_addr_phone = formdata.value.account_addr_phone

			state.member_show_phone = formdata.value.member_show_phone
			state.member_show_addr = formdata.value.member_show_addr
			state.newsletter_recipient = formdata.value.newsletter_recipient
			state.mail_recipient = formdata.value.mail_recipient
			state.sms_recipient = formdata.value.sms_recipient

			state.member_type_id = formdata.value.member_type_id
			state.member_type2_id = formdata.value.member_type2_id
			state.member_admin_type_id = formdata.value.member_admin_type_id
			state.member_admin_type2_id = formdata.value.member_admin_type2_id
			state.member_admin_type2_id = formdata.value.member_admin_type2_id
		}
	}

	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/accounts')
	}
</script>

<template>
	<div class="row">
		<div class="col">
			hello
			<div class="formroot">
				<FormKit
					type="form"
					v-model="state"
					submit-label="Submit"
					@submit="submitForm(state)"
				>
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
						type="text"
						label="Member Year"
						name="member_year"
						validation="required"
						v-model="state.member_year"
					/>
					<FormKit
						type="text"
						label="Street"
						name="account_addr_street"
						validation="required"
						v-model="state.account_addr_street"
					/>
					<FormKit
						type="text"
						label="Street Ext"
						name="account_addr_street_ext"
						v-model="state.account_addr_street_ext"
					/>
					<FormKit
						type="text"
						label="City"
						name="account_addr_city"
						validation="required"
						v-model="state.account_addr_city"
					/>
					<FormKit
						type="text"
						label="State"
						name="account_addr_state"
						validation="required"
						v-model="state.account_addr_state"
					/>
					<FormKit
						type="text"
						label="Country"
						name="account_addr_country"
						validation="required"
						v-model="state.account_addr_country"
					/>
					<FormKit
						type="text"
						label="Postal Code"
						name="account_addr_postal"
						validation="required"
						v-model="state.account_addr_postal"
					/>
					<FormKit
						type="text"
						label="Phone"
						name="account_addr_phone"
						validation="required"
						v-model="state.account_addr_phone"
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
	.formroot {
		text-align: left;
	}
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
