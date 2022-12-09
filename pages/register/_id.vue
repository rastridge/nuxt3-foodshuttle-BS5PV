<template>
	<div class="add">
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>

			<!-- accountname input-->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_firstname"
					>First name:
				</label>
				<div class="col-sm-5">
					<b-form-input
						id="member_firstname"
						v-model.trim="member_firstname"
						type="text"
						class="form-control"
						autofocus
						@input="setMember_firstname($event)"
					/>
					<span v-if="!$v.member_firstname.required" class="error"
						>First name Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_lastname"
					>Last name:
				</label>
				<div class="col-sm-5">
					<input
						id="member_lastname"
						v-model.trim="member_lastname"
						type="text"
						class="form-control"
						@input="setMember_lastname($event.target.value)"
					/>
					<span v-if="!$v.member_lastname.required" class="error"
						>Last name Field is required</span
					>
				</div>
			</div>

			<!-- email input-->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_email"
					>Email:
				</label>
				<div class="col-sm-6">
					<input
						id="account_email"
						v-model.trim="account_email"
						type="email"
						class="form-control"
						@input="setAccountEmail($event.target.value)"
					/>
					<span v-if="!$v.account_email.email" class="error"
						>Invalid email</span
					>
					<span v-if="!$v.account_email.required" class="error"
						>Email Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-sm-4 control-label" for="member_year"
					>Year Joined:
				</label>
				<div class="col-sm-4">
					<b-form-select
						v-model="member_year"
						:options="years"
						class="form-control"
						disabled-field="notEnabled"
						@change="setMemberYear($event)"
					></b-form-select>
					<span v-if="!$v.member_year.required" class="error"
						>Year Joined Field is required</span
					>
				</div>
			</div>

			<!-- street input -->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_street"
					>Street:
				</label>
				<div class="col-sm-7">
					<input
						id="account_addr_street"
						v-model.trim="account_addr_street"
						type="text"
						class="form-control"
						@input="setAccount_addr_street($event.target.value)"
					/>
					<span v-if="!$v.account_addr_street.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- street ext input -->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_street_ext"
					>Street:
				</label>
				<div class="col-sm-7">
					<input
						id="account_addr_street_ext"
						v-model.trim="account_addr_street_ext"
						type="text"
						class="form-control"
					/>
				</div>
			</div>

			<!-- city input -->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_city"
					>City:
				</label>
				<div class="col-sm-5">
					<input
						id="account_addr_city"
						v-model.trim="account_addr_city"
						type="text"
						class="form-control"
						@input="setAccount_addr_city($event.target.value)"
					/>
					<span v-if="!$v.account_addr_city.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- country input -->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_country"
					>Country:
				</label>
				<div class="col-sm-4">
					<country-select
						id="account_addr_country"
						v-model="account_addr_country"
						:country="account_addr_country"
						top-country="US"
						class="form-control"
						@input="setAccount_addr_country($event)"
					/>
					<br />
					<span v-if="!$v.account_addr_country.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- state / region input -->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_state"
					>Region / State:
				</label>
				<div class="col-sm-4">
					<region-select
						id="account_addr_state"
						v-model="account_addr_state"
						:country="account_addr_country"
						:region="account_addr_state"
						class="form-control"
						@input="setAccount_addr_state($event)"
					/>
					<br />
					<span v-if="!$v.account_addr_state.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<!-- postal input -->
			<div class="form-group">
				<label class="col-sm-4 control-label" for="account_addr_postal"
					>Postal:
				</label>
				<div class="col-sm-4">
					<input
						id="account_addr_postal"
						v-model.trim="account_addr_postal"
						type="text"
						class="form-control"
						@input="setAccount_addr_postal($event.target.value)"
					/>
					<span v-if="!$v.account_addr_postal.required" class="error"
						>Field is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-md-3 control-label" for="member_show_addr"
					>Show address:</label
				>
				<div class="col-md-3">
					<b-form-select
						id="member_show_addr"
						v-model="member_show_addr"
						class="form-control"
					>
						<option disabled value="">Yes or No</option>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</b-form-select>
				</div>
			</div>

			<div class="form-group">
				<label class="col-md-3 control-label" for="account_addr_phone"
					>Phone:
				</label>
				<div class="col-md-6">
					<MazPhoneNumberInput
						:default-phone-number="account_addr_phone"
						@update="setAccount_addr_phone($event)"
					/>
					<span v-if="!$v.account_addr_phone.required" class="error"
						>Valid Phone Number is required</span
					>
				</div>
			</div>

			<div class="form-group">
				<label class="col-md-3 control-label" for="member_show_phone"
					>Show phone:</label
				>
				<div class="col-md-3">
					<b-form-select
						id="member_show_phone"
						v-model="member_show_phone"
						class="form-control"
					>
						<option disabled value="">Yes or No</option>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</b-form-select>
				</div>
			</div>

			<div class="form-group">
				<label class="col-md-3 control-label" for="sms_recipient"
					>Text recipient:</label
				>
				<div class="col-md-3">
					<b-form-select
						id="sms_recipient"
						v-model="sms_recipient"
						class="form-control"
					>
						<option disabled value="">Yes or No</option>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</b-form-select>
				</div>
			</div>

			<!-- Newsletter recipient input-->

			<div class="form-group">
				<label class="col-sm-4 control-label" for="newsletter_recipient">
					Receive Newsletter:</label
				>
				<div class="col-sm-6">
					<b-form-select v-model="newsletter_recipient" class="form-control">
						<option disabled value="">Yes or No</option>
						<option value="1">Yes</option>
						<option value="0">No</option>
					</b-form-select>
				</div>
			</div>

			<!-- submit  -->
			<div class="form-group">
				<div class="col-sm-6 col-md-8">
					<submit-cancel :submitstatus="submitStatus" @dispose="dispose" />
				</div>
			</div>
		</form>
		<p
			v-if="submitStatus === 'ERROR'"
			:class="{ error: submitStatus === 'ERROR' }"
		>
			Please fill the form correctly.
		</p>
		<p v-if="submitStatus === 'PENDING'">Submitted...</p>
	</div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import SubmitCancel from '@/components/SubmitCancel.vue'
import { accountService } from '@/services/'
import { MazPhoneNumberInput } from 'maz-ui'
import { createYears } from '@/helpers'

export default {
	name: 'Accountadd',
	components: {
		SubmitCancel,
		MazPhoneNumberInput,
	},
	mixins: [validationMixin],
	data() {
		return {
			id: this.$route.params.id,
			account_email: '',
			member_firstname: '',
			member_lastname: '',
			account_addr_street: '',
			account_addr_street_ext: '',
			account_addr_city: '',
			account_addr_state: '',
			account_addr_country: '',
			account_addr_postal: '',
			account_addr_phone: '',
			newsletter_recipient: '',
			sms_recipient: '',
			member_year: '',
			member_show_addr: '',
			member_show_phone: '',

			startyear: 1980,
			years: [],
			submitStatus: 'Ok',
			error: '',
		}
	},
	validations() {
		return {
			account_email: {
				required,
				email,
			},
			member_firstname: {
				required,
			},
			member_lastname: {
				required,
			},
			account_addr_street: {
				required,
			},
			account_addr_city: {
				required,
			},
			account_addr_state: {
				required,
			},
			account_addr_country: {
				required,
			},
			member_year: {
				required,
			},
			account_addr_phone: {
				required,
			},
			account_addr_postal: {
				required,
			},
		}
	},
	created() {
		accountService.getOne(this.id).then((account) => {
			this.setInfo(account)
		})
		createYears(this.startyear, this)
	},
	methods: {
		dispose(e) {
			if (e === 'submit') {
				this.handleSubmit()
			} else if (e === 'cancel') {
				this.returnToList()
			}
		},
		setInfo(u) {
			this.account_email = u.account_email
			this.member_firstname = u.member_firstname
			this.member_lastname = u.member_lastname
			this.account_addr_street = u.account_addr_street
			this.account_addr_street_ext = u.account_addr_street_ext
			this.account_addr_city = u.account_addr_city
			this.account_addr_state = u.account_addr_state
			this.account_addr_country = u.account_addr_country
			this.account_addr_postal = u.account_addr_postal
			this.account_addr_phone = u.account_addr_phone
			this.member_year = u.member_year
			this.member_show_addr = u.member_show_addr
			this.member_show_phone = u.member_show_phone
			this.newsletter_recipient = u.newsletter_recipient
			this.sms_recipient = u.sms_recipient
		},
		returnToList() {
			this.$router.push('/register/men/thankyou')
		},
		setMember_firstname(value) {
			this.member_firstname = value
			this.$v.member_firstname.$touch()
		},
		setMember_lastname(value) {
			this.member_lastname = value
			this.$v.member_lastname.$touch()
		},
		setAccountEmail(value) {
			this.account_email = value
			this.$v.account_email.$touch()
		},
		setAccount_addr_street(value) {
			this.account_addr_street = value
			this.$v.account_addr_street.$touch()
		},
		setAccount_addr_city(value) {
			this.account_addr_city = value
			this.$v.account_addr_city.$touch()
		},
		setAccount_addr_state(value) {
			this.account_addr_state = value
			this.$v.account_addr_state.$touch()
		},
		setAccount_addr_country(value) {
			this.account_addr_country = value
			this.$v.account_addr_country.$touch()
		},
		setAccount_addr_postal(value) {
			this.account_addr_postal = value
			this.$v.account_addr_postal.$touch()
		},
		setAccount_addr_phone(value) {
			if (value.isValid) {
				this.account_addr_phone = value.e164
			} else {
				this.account_addr_phone = ''
			}
			this.$v.account_addr_phone.$touch()
		},
		setPass(value) {
			this.pass = value
			this.$v.pass.$touch()
		},
		setRepeatPass(value) {
			this.repeatPass = value
			this.$v.repeatPass.$touch()
		},
		setMemberYear(value) {
			this.member_year = value
			this.$v.member_year.$touch()
		},
		handleSubmit(e) {
			this.submitStatus = ''
			this.$v.$touch()
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				// do your submit logic here
				this.submitStatus = 'PENDING'

				const {
					id,
					account_email,
					member_firstname,
					member_lastname,
					account_addr_street,
					account_addr_street_ext,

					account_addr_city,
					account_addr_state,
					account_addr_country,
					account_addr_postal,
					account_addr_phone,

					member_year,
					member_show_addr,
					member_show_phone,
					newsletter_recipient,

					sms_recipient,
				} = this
				accountService
					.editByMember(
						id,
						account_email,
						member_firstname,
						member_lastname,
						account_addr_street,
						account_addr_street_ext,

						account_addr_city,
						account_addr_state,
						account_addr_country,
						account_addr_postal,
						account_addr_phone,

						member_year,
						member_show_addr,
						member_show_phone,
						newsletter_recipient,

						sms_recipient
					)
					.then((account) => {
						if (!account.error) {
							this.returnToList()
						} else {
							this.submitStatus = 'ERROR'
							this.error = account.error
						}
					})
			}
		},
	},
}
</script>
