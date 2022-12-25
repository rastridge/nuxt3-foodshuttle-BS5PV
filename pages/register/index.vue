<template>
	<div class="register">
		<common-header title="Register" />
		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<my-accounts-self-form @submitted="handleSubmit" />

		<!-- Modal -->
		<b-modal id="my-modal" button-size="sm">
			<template #modal-header>
				<h3>Thank you for considering the Food Shuttle of WNY</h3>
				<div class="w-100">
					<b-button
						variant="primary"
						size="sm"
						class="float-right"
						@click="hideModal('my-modal')"
					>
						Close
					</b-button>
				</div>
			</template>
			<template>
				<p>
					Registering is an expression of interest in being informed of Food
					Shuttle of WNY activities and does not imply any commitment. Give us a
					try and see if we're right for you.
				</p>
			</template>
			<template #modal-footer>
				<div class="w-100">
					<b-button
						variant="primary"
						size="sm"
						class="float-right"
						@click="hideModal('my-modal')"
					>
						Close
					</b-button>
				</div>
			</template>
		</b-modal>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}

	const state = reactive({
		account_email: '',
		member_firstname: '',
		member_lastname: '',
		// member_year: this.$moment().format('YYYY'),
		member_year: 2022,
		account_addr_street: '',
		account_addr_street_ext: '',
		account_addr_city: '',
		account_addr_state: '',
		account_addr_country: '',
		account_addr_postal: '',
		account_addr_phone: '',
		member_show_phone: '1',
		member_show_addr: '1',
		newsletter_recipient: '1',
		mail_recipient: '0',
		sms_recipient: '1',
		member_type_id: '9',
		member_type2_id: '',
		member_admin_type_id: '0',
		member_admin_type2_id: '0',

		human: '',
	})

	const handleSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/accounts/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: 'not-needed',
			},
		})
		console.log('in handlesubmit data.value.message = ', data.value.message)
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigate('/')
		}
	}
</script>
