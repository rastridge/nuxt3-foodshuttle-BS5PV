<template>
	<div>
		<Head>
			<Title>Admin User Request Password Reset</Title>
		</Head>
		<div class="row">
			<div class="col-sm-6 col-sm-offset-3">
				<h3>Admin User Request Password Reset</h3>

				<div class="row">
					<div class="col">
						<p>
							In a few moments instructions to reset your password will be sent
							to you at the email address associated with this username
						</p>
						<FormKit
							type="form"
							:config="{ validationVisibility: 'live' }"
							v-model="state"
							submit-label="Submit"
							@submit="handleSubmit(state)"
						>
							<FormKit
								label="Username"
								name="username"
								type="text"
								validation="required"
								v-model="state.username"
							/>
							<details>
								<summary>Form data</summary>
								<pre>{{ state }}</pre>
							</details>
						</FormKit>

						<div class="mb-3">
							<button class="btn btn-danger" @click.prevent="cancelForm()">
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { userService } from '@/services'
	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}

	// initialize formkit state
	const state = ref({
		username: '',
	})
	const cancelForm = () => {
		navigate('/loginpage')
	}
	const handleSubmit = function (state) {
		userService.resetRequest(state.username).then((result) => {
			if (!result.error) {
				navigate('/loginpage')
			} else {
				navigate('/loginpage')

				// this.submitStatus = 'ERROR'
				// this.error = username.error
			}
		})
	}
</script>

<style scoped></style>
