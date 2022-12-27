<template>
	<div>
		<!-- <div v-if="!formdata" class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-else> -->

		<pre>
	<!-- {{ state.news_event_dt }} -->
</pre>
		<!-- <FormKit
			type="form"
			:config="{ validationVisibility: 'live' }"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		> -->
		<FormKit
			label="News Title"
			name="news_title"
			type="text"
			validation="required"
			v-model="state.news_title"
		/>
		<FormKit
			label="Synopsis"
			name="news_synop"
			type="textarea"
			validation="required"
			v-model="state.news_synop"
		/>
		<FormKit
			label="Article"
			name="news_article"
			type="textarea"
			validation="required"
			v-model="state.news_article"
		/>
		<FormKit
			label="Raw Article"
			name="news_article_raw"
			type="textarea"
			v-model="state.news_article"
		/>
		<FormKit
			type="datetime-local"
			label="Event Date"
			name="news_event_dt"
			validation="required"
			v-model="state.news_event_dt"
		/>
		<p>
			{{ state.news_event_dt }}
		</p>
		<FormKit
			type="datetime-local"
			label="Release Date"
			name="news_release_dt"
			validation="required"
			v-model="state.news_release_dt"
		/>
		<p>{{ state.news_release_dt }}</p>

		<FormKit
			type="datetime-local"
			label="Expire Date"
			name="news_expire_dt"
			validation="required"
			v-model="state.news_expire_dt"
		/>
		<p>{{ state.news_expire_dt }}</p>

		<!-- </FormKit> -->

		<div class="mb-3">
			<button class="btn btn-primary me-1" @click.prevent="submitForm(state)">
				Submit
			</button>
			<button class="btn btn-danger" @click.prevent="cancelForm()">
				Cancel
			</button>
		</div>
	</div>
	<!-- </div> -->
</template>

<script setup>
	// import 'dayjs/plugin/utc'
	// import 'dayjs/plugin/timezone'
	import '@formkit/themes/genesis'
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	const { $dayjs } = useNuxtApp()
	const router = useRouter()

	const emit = defineEmits(['submitted'])

	const props = defineProps({
		id: { Number, default: 0 },
	})
	const state = reactive({})

	// edit if there is an id - add if not
	if (props.id !== 0) {
		// get user with id
		const {
			data: formdata,
			pending,
			error,
			refresh,
		} = await useFetch(`/news/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})
		state.news_id = formdata.value.news_id
		state.id = formdata.value.news_id
		state.news_title = formdata.value.news_title
		state.news_synop = formdata.value.news_synop
		state.news_article = formdata.value.news_article
		state.news_event_dt = formdata.value.news_event_dt.substr(0, 16)
		state.news_release_dt = formdata.value.news_release_dt.substr(0, 16)
		state.news_expire_dt = formdata.value.news_expire_dt.substr(0, 16)
	} else {
		state.news_id = ''
		state.id = ''
		state.news_title = 'testnews'
		state.title = 'testnews'
		state.news_article = 'a body of article dsfasdff'
		state.news_synop = 'adsf syop of asdff'
		state.news_event_dt = '2022-11-25T23:32'
		state.news_expire_dt = '2023-01-17T23:32'
		state.news_release_dt = '2022-01-17T23:32'

		// human: '',
	}

	// form handlers
	const submitForm = (state) => {
		let alteredState = state
		alteredState.news_event_dt = $dayjs(state.news_event_dt)
			.subtract(5, 'h')
			.format('YYYY-MM-DDTHH:mm')
		alteredState.news_expire_dt = $dayjs(state.news_expire_dt)
			.subtract(5, 'h')
			.format('YYYY-MM-DDTHH:mm')
		alteredState.news_release_dt = $dayjs(state.news_release_dt)
			.subtract(5, 'h')
			.format('YYYY-MM-DDTHH:mm')
		emit('submitted', alteredState)
	}

	const cancelForm = () => {
		navigateTo('/admin/news') // needs to be / for self register
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
		content: '✅';
		display: block;
		padding: 0.5em;
	}
</style>
