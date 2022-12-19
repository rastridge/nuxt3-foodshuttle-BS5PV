<template>
	<div>
		<div v-if="!form_state" class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-else>
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
						<span v-if="username_required" class="error"
							>Username required</span
						>
					</div>
				</div>

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
						<span v-if="email_required" class="error">Email required</span>
					</div>
				</div>

				<div v-if="!addForm" class="form-check">
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

				<div v-if="reset || addForm">
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

				<div class="row">
					<div class="col">
						<h5 class="text-center">Application permissions</h5>
						<div class="table-responsive">
							<table
								v-if="apps_data"
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
								<tbody>
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
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	const form_state = ref({})

	// password input
	const reset = ref(false)
	const repeatPass = ref('')
	const resetPassword = () => {
		reset.value = !reset
		if (reset.value) {
			form_state.value.password = ''
			repeatPass.value = ''
		}
	}
	const match = computed(() => form_state.value.password !== repeatPass.value)
	const required = computed(() => form_state.value.password === '')
	const username_required = computed(
		() => form_state.value.admin_user_name === ''
	)
	const email_required = computed(
		() => form_state.value.admin_user_email === ''
	)
	const addForm = props.id === 0

	// get app namefor access inputs
	const { data: apps_data } = await useFetch(`/users/getapps`, {
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})

	// console.log('apps_data= ', apps_data)
	// const apps = apps_data.value

	const apps = [
		{
			admin_app_id: 1,
			admin_app_name: 'settings',
		},
		{
			admin_app_id: 2,
			admin_app_name: 'sponsors',
		},
		{
			admin_app_id: 3,
			admin_app_name: 'videos',
		},
		{
			admin_app_id: 4,
			admin_app_name: 'news',
		},
		{
			admin_app_id: 5,
			admin_app_name: 'newsletters',
		},
		{
			admin_app_id: 6,
			admin_app_name: 'sms',
		},
		{
			admin_app_id: 8,
			admin_app_name: 'users',
		},
		{
			admin_app_id: 11,
			admin_app_name: 'content',
		},
		{
			admin_app_id: 12,
			admin_app_name: 'accounts',
		},
		{
			admin_app_id: 19,
			admin_app_name: 'contributions',
		},
		{
			admin_app_id: 21,
			admin_app_name: 'filemanager',
		},
		{
			admin_app_id: 26,
			admin_app_name: 'archive',
		},
		{
			admin_app_id: 29,
			admin_app_name: 'payments',
		},
		{
			admin_app_id: 31,
			admin_app_name: 'newsletters_archive',
		},
	]

	// initlaize form ////////////////////////////
	// get users id if editing
	const props = defineProps({
		id: { Number, default: 0 },
	})
	// add is zero  edit is non zero
	if (props.id !== 0) {
		// get user data
		const { data: form_data } = await useFetch(`/users/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})
		// console.log('form_data= ', form_data)

		// init form values if editing
		form_state.value.admin_user_id = form_data.value.admin_user_id
		form_state.value.admin_user_name = form_data.value.admin_user_name
		form_state.value.admin_user_email = form_data.value.admin_user_email
		form_state.value.admin_user_pass = form_data.value.admin_user_pass
		form_state.value.password = ''
		form_state.value.perms = form_data.value.perms
	} else {
		// init form values if adding
		form_state.value.admin_user_id = ''
		form_state.value.admin_user_name = ''
		form_state.value.admin_user_email = ''
		form_state.value.admin_user_pass = ''
		form_state.value.password = ''
		form_state.value.perms = [
			{
				admin_perm_id: 0,
				admin_app_id: 1,
				admin_app_name: 'settings',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 2,
				admin_app_name: 'sponsors',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 3,
				admin_app_name: 'videos',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 4,
				admin_app_name: 'news',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 5,
				admin_app_name: 'newsletters',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 6,
				admin_app_name: 'sms',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 8,
				admin_app_name: 'users',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 11,
				admin_app_name: 'content',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 12,
				admin_app_name: 'accounts',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 19,
				admin_app_name: 'contributions',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 21,
				admin_app_name: 'filemanager',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 26,
				admin_app_name: 'archive',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 29,
				admin_app_name: 'payments',
				admin_perm: 3,
				admin_user_id: 0,
			},
			{
				admin_perm_id: 0,
				admin_app_id: 31,
				admin_app_name: 'newsletters_archive',
				admin_perm: 3,
				admin_user_id: 0,
			},
		]
	}
	// form handlers ///////////////////////////////
	const emit = defineEmits(['submitted'])
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
