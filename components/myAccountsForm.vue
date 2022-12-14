<template>
	<div>
		<div
			v-if="!memberTypeOptions || !memberAdminTypeOptions"
			class="spinner-border text-primary"
			role="status"
		>
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-else>
			<FormKit
				type="form"
				:config="{ validationVisibility: 'live' }"
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
					type="number"
					label="Year joined"
					name="year_joined"
					v-model="state.member_year"
					step="1"
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
					validation="required | matches:/^[0-9]{5}$/"
					v-model="state.account_addr_postal"
				/>

				<FormKit
					type="tel"
					label="Phone number"
					name="account_addr_phone"
					placeholder="1-###-###-####"
					v-model="state.account_addr_phone"
					validation="required | matches:/^[1]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
					:validation-messages="{
						matches: 'Phone number must be in the format 1-###-###-####',
					}"
				/>
				<FormKit
					type="select"
					label="Show phone?"
					name="member_show_phone"
					v-model="state.member_show_phone"
					:options="[
						{ label: 'Yes', value: 1 },
						{ label: 'No', value: 0 },
					]"
				/>

				<FormKit
					type="select"
					label="Show address?"
					name="member_show_addr"
					v-model="state.member_show_addr"
					:options="[
						{ label: 'Yes', value: 1 },
						{ label: 'No', value: 0 },
					]"
				/>

				<FormKit
					type="select"
					label="Receive newsletter?"
					name="newsletter_recipient"
					v-model="state.newsletter_recipient"
					:options="[
						{ label: 'Yes', value: 1 },
						{ label: 'No', value: 0 },
					]"
				/>

				<FormKit
					type="select"
					label="Receive US Mail?"
					name="mail_recipient"
					v-model="state.mail_recipient"
					:options="[
						{ label: 'Yes', value: 1 },
						{ label: 'No', value: 0 },
					]"
				/>

				<FormKit
					type="select"
					label="Receive SMS messages?"
					name="sms_recipient"
					v-model="state.sms_recipient"
					:options="[
						{ label: 'Yes', value: 1 },
						{ label: 'No', value: 0 },
					]"
				/>

				<FormKit
					type="select"
					label="Member type"
					name="member_type_id"
					v-model="state.member_type_id"
					:options="memberTypeOptions"
				/>

				<FormKit
					type="select"
					label="Member Admin type"
					name="member_admin_type_id"
					v-model="state.member_admin_type_id"
					:options="memberAdminTypeOptions"
				/>
			</FormKit>

			<div class="mb-3">
				<button class="btn btn-danger" @click.prevent="cancelForm()">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	const { $dayjs } = useNuxtApp()
	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}
	const emit = defineEmits(['submitted'])

	const props = defineProps({
		id: { Number, default: 0 },
	})

	// get member admin types
	const { data: memberAdminTypes } = await useFetch(
		'/accounts/memberadmintypes',
		{
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		}
	)
	// convert for formkit
	const getMemberAdminTypeOptions = (mtypes) => {
		let result = []
		mtypes.map((old) => {
			let n = {}
			n.label = old.member_admin_type
			n.value = old.member_admin_type_id
			result.push(n)
		})
		return result
	}
	const memberAdminTypeOptions = getMemberAdminTypeOptions(
		memberAdminTypes.value
	)
	// get member types
	const { data: memberTypes } = await useFetch('/accounts/membertypes', {
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})
	// convert for formkit
	const getMemberTypeOptions = (memberTypes) => {
		let result = []
		memberTypes.map((old) => {
			let n = {}
			n.label = old.member_type
			n.value = old.member_type_id
			result.push(n)
		})
		return result
	}
	const memberTypeOptions = getMemberTypeOptions(memberTypes.value)

	const state = reactive({
		account_email: 'joe@net.com',
		member_firstname: 'Joe',
		member_lastname: 'Blow',

		// member_year: this.$moment().format('YYYY'),
		member_year: $dayjs().format('YYYY'),
		account_addr_street: '12 Cherry',
		account_addr_street_ext: '',
		account_addr_city: 'Buffalo',
		account_addr_state: 'NY',
		account_addr_country: 'US',
		account_addr_postal: '14201',
		account_addr_phone: '716-833-1222',

		member_show_phone: '1',
		member_show_addr: '1',
		newsletter_recipient: '1',
		mail_recipient: '0',
		sms_recipient: '1',

		member_type_id: '9',
		member_type2_id: '',
		member_admin_type_id: '0',
		member_admin_type2_id: '0',

		account_id: '',

		// human: '',
	})

	// edit if there is an id - add if not
	if (props.id !== 0) {
		// get user with id
		const {
			data: formdata,
			pending,
			error,
			refresh,
		} = await useFetch(`/accounts/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})

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

	// form handlers
	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigate('/admin/accounts') // needs to be / for self register
	}
</script>

<style>
	.formkit-inner {
		background-color: rgba(255, 255, 255, 0.5);
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
		content: '???';
		display: block;
		padding: 0.5em;
	}
</style>
