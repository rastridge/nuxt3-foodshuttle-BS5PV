<template>
	<div class="row">
		<div class="col">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-sm-offset-2 col-sm-4">
						<button
							class="btn btn-primary"
							@click.prevent="submitForm(form_state)"
						>
							Submit
						</button>
					</div>
				</div>

				<!-- Username input-->
				<div class="form-group">
					<label class="col-sm-4 control-label" for="admin_user_name"
						>Username:
					</label>
					<div class="col-sm-4">
						<input
							id="admin_user_name"
							v-model.trim="form_state.admin_user_name"
							type="text"
							class="form-control"
							autofocus
						/>
					</div>
				</div>

				<!-- pass input-->
				<div class="form-group">
					<label class="col-sm-4 control-label" for="admin_user_email"
						>Email:
					</label>
					<div class="col-sm-6">
						<input
							id="admin_user_email"
							v-model.trim="form_state.admin_user_email"
							type="email"
							class="form-control"
						/>
					</div>
				</div>

				<!-- reset password -->
				<div class="form-check">
					<div class="col-sm-4">
						<input
							id="reset"
							v-model="reset"
							type="checkbox"
							class="form-check-input"
							@input="resetPassword()"
						/>
						<label class="form-check-label" for="exampleCheck1"
							><span class="sub-headline">Change password</span></label
						>
					</div>
				</div>
				<br />

				<!-- Password new -->
				<div v-if="reset">
					<div class="form-group">
						<label class="col-sm-4 control-label" for="password"
							>New Password:
						</label>
						<div class="col-sm-4">
							<input
								id="password"
								v-model.trim="form_state.password"
								type="text"
								class="form-control"
							/>
							<span v-if="required" class="error">Password required</span>
							<p>Password ={{ form_state.password }}</p>
						</div>
					</div>

					<!-- SameAs Password input-->
					<div class="form-group">
						<label class="col-sm-4 control-label" for="repeatPass"
							>Repeat Password:
						</label>
						<div class="col-sm-4">
							<input
								id="repeatPass"
								v-model.trim="repeatPass"
								type="password"
								class="form-control"
							/>
							<span v-if="match" class="error">Password must match</span>
						</div>
					</div>
				</div>

				<!-- permissions -->
				<div class="row">
					<div class="col">
						<h5 class="text-center">Application permissions</h5>
						<div class="table-responsive">
							<table
								class="table table-sm"
								style="
									white-space: nowrap;
									background-color: rgba(255, 255, 255, 0.3);
								"
							>
								<thead>
									<tr>
										<th class="text-center">Application</th>
										<th>Manage</th>
										<th>Create</th>
										<th>View</th>
										<th>No access</th>
									</tr>
								</thead>
								<tbody v-if="form_state.perms && apps">
									<tr v-for="(item, index) in apps" :key="item.admin_app_id">
										<td class="text-end">{{ item.admin_app_name }} :</td>
										<td>
											<div class="form-check">
												<input
													class="form-check-input"
													type="radio"
													v-model="form_state.perms[index].admin_perm"
													value="3"
												/>
											</div>
										</td>
										<td>
											<div class="form-check">
												<input
													class="form-check-input"
													type="radio"
													v-model="form_state.perms[index].admin_perm"
													value="2"
												/>
											</div>
										</td>
										<td>
											<div class="form-check">
												<input
													class="form-check-input"
													type="radio"
													v-model="form_state.perms[index].admin_perm"
													value="1"
												/>
											</div>
										</td>
										<td>
											<div class="form-check">
												<input
													class="form-check-input"
													type="radio"
													v-model="form_state.perms[index].admin_perm"
													value="0"
												/>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div class="m3">
					<button
						class="btn btn-primary"
						@click.prevent="submitForm(form_state)"
					>
						Submit
					</button>

					<button class="btn btn-default" @click.prevent="cancelForm()">
						Cancel
					</button>
				</div>
			</form>
			<details>
				<summary>Form state</summary>
				<pre>{{ form_state }}</pre>
			</details>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits(['submitted'])
	const runtimeConfig = useRuntimeConfig()

	const props = defineProps({
		id: { Number, default: 0 },
	})

	const form_state = ref({
		admin_user_id: '',
		admin_user_name: '',
		admin_user_email: '',
		admin_user_pass: '',
		password: '',
		perms: null,
	})
	const apps = ref('')

	const reset = ref(false)
	const repeatPass = ref('')

	const IdToEdit = parseInt(props.id)

	const resetPassword = () => {
		reset.value = !reset
		if (reset.value) {
			form_state.value.password = ''
			repeatPass.value = ''
		}
	}
	const match = computed(() => form_state.value.password !== repeatPass.value)
	const required = computed(() => form_state.value.password === '')

	// add or edit - if edit get existing data
	if (IdToEdit !== 0) {
		const { data: form_data } = await useFetch(`/users/${IdToEdit}`, {
			method: 'get',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})

		const { data: apps_data } = await useFetch(`/users/getapps`, {
			method: 'get',
			headers: {
				firebaseapikey: runtimeConfig.apiSecret,
			},
		})

		if (form_data.value.admin_user_id < 1) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Account Not Found ' + IdToEdit,
				fatal: true,
			})
		} else {
			form_state.value.admin_user_id = form_data.value.admin_user_id
			form_state.value.admin_user_name = form_data.value.admin_user_name
			form_state.value.admin_user_email = form_data.value.admin_user_email
			form_state.value.admin_user_pass = form_data.value.admin_user_pass
			form_state.value.password = ''
			form_state.value.perms = form_data.value.perms
			apps.value = apps_data.value
		}
	}

	// form handlers
	const submitForm = (form_state) => {
		console.log('in submitForm form_state = ', form_state)
		emit('submitted', form_state)
	}
	const cancelForm = () => {
		navigateTo('/admin/users')
	}
</script>

<style>
	.error {
		color: red;
	}
</style>
