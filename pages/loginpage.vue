<template>
	<div id="loginpage">
		<div class="row">
			<div class="col">
				<div class="loginbox">
					<div v-if="alert.message" :class="`alert ${alert.type}`">
						{{ alert.message }}
					</div>

					<div v-if="!auth.isLoggedIn">
						<h3 class="headline">Login Admin User</h3>
						<b-form class="mb-3">
							<b-form-group
								id="username-1"
								label="Username"
								label-for="username"
							>
								<b-form-input id="username" v-model="username"> </b-form-input>
								<p v-show="submitted && !username" class="error">
									Username is required
								</p>
							</b-form-group>
							<b-form-group
								id="password-1"
								label="Password"
								label-for="password"
							>
								<b-form-input id="password" v-model="password" type="password">
								</b-form-input>
								<p v-show="submitted && !password" class="error">
									Password is required
								</p>
							</b-form-group>
						</b-form>
						<div class="center-content">
							<b-button
								size="md"
								variant="primary"
								:disabled="auth.loggingIn"
								@click.prevent="handleSubmit"
								>Login
							</b-button>
							<br />
							<nuxt-link to="/resetpassword" active-class="active"
								><a>Forgot password?</a></nuxt-link
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	// const route = useRoute()
	import { useAuthStore } from '~~/stores/auth'
	import { useAlertStore } from '@/stores/alert'
	const auth = useAuthStore()
	const alert = useAlertStore()
	const config = useRuntimeConfig()

	const username = ref('')
	const password = ref('')
	const submitted = ref(false)

	/*
						watch: {
							route(to, from) {
								// clear alert on location change
								alert.clear
							}
						}
			 */

	const handleSubmit = async (e) => {
		submitted.value = true
		if (username.value && password.value) {
			auth.login(username.value, password.value) // pinia auth store
			// alert.clear
		}
	}
</script>

<style scoped>
	.error {
		color: red;
	}
	.loginbox {
		margin: 0 auto;
		margin-bottom: 10px;
		width: 50%;
		justify-content: left;
		align-items: left;
		text-align: left;
	}
</style>
