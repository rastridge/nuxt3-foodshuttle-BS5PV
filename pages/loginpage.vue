<template>
	<div id="loginpage">
		<div class="grid">
			<div class="col">
				<div class="loginbox">
					<div v-if="alert.message" :class="`alert ${alert.type}`">
						{{ alert.message }}
					</div>

					<div v-if="!auth.isLoggedIn">
						<h3 class="headline">Login Admin User</h3>

						<FormKit
							type="form"
							submit_label="Loginin"
							@submit="handleSubmit"
							#default="{ value }"
						>
							<FormKit
								type="text"
								name="username"
								label="Username"
								validate="required|length:5"
							>
							</FormKit>
							<FormKit
								type="password"
								name="password"
								label="Password"
								validate="required|length:5"
							>
							</FormKit>
							<!-- <FormKit type="submit" label="Login"> </FormKit> -->
						</FormKit>

						<div class="center-content">
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
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const auth = useAuthStore()
	const alert = useAlertStore() // used in template

	const username = ref('')
	const password = ref('')
	const submitted = ref(false)

	const handleSubmit = async (values) => {
		submitted.value = true
		if (values.username && values.password) {
			auth.login(values.username, values.password) // pinia auth store
		}
	}
</script>

<style scoped>
	.error {
		color: red;
	}
	.loginbox {
		background-color: rgba(255, 255, 255, 0.2);
		margin: 0 auto;
		padding: 2rem;
		border: thin black solid;
		width: 20rem;
		justify-content: left;
		align-items: left;
		text-align: left;
	}
	@media screen and (max-width: 640px) {
		.loginbox {
			width: 100%;
			padding: 1rem;
		}
	}
</style>
