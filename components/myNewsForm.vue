<template>
	<div>
		<!-- <div v-if="!news_data" class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div> -->
		<div style="background-color: beige; padding: 2rem">
			<p>dayjs.tz.guess() = {{ $dayjs.tz.guess() }}</p>
			<p>Now GMT = {{ $dayjs() }}</p>
			<!-- <p>Now local = {{ $dayjs().tz('America/New_York') }}</p> -->
			<p>Now local = {{ $dayjs.utc().local().format() }}</p>
			<p>
				Now local GMT formatted =
				{{ $dayjs($dayjs.utc().format()).format('MMM D, YYYY  HH:mm a') }}
			</p>
			<p>
				Now GMT offset 5 formatted =
				{{ $dayjs($dayjs().utcOffset(-5)).format('MMM D, YYYY HH:mm a') }}
			</p>
			<!-- <p>dayjsLocal = {{ dayjsLocal }}</p>
			<p>dayjsAmerica = {{ dayjsAmerica }}</p>
			<p>dayjsAmericaKeep = {{ dayjsAmericaKeep }}</p> -->
		</div>
		<FormKit
			type="form"
			:config="{ validationVisibility: 'live' }"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
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
				label="Raw Article"
				name="news_article_raw"
				type="textarea"
				v-model="state.news_article"
			/>
			<div class="editor">
				<h3>Body of article primevue editor</h3>
				<!-- primevue editor -->
				<Editor v-model="state.news_article" editorStyle="height: 320px" />
			</div>

			<FormKit
				type="datetime-local"
				label="Event Date"
				name="news_event_dt"
				validation="required"
				v-model="state.news_event_dt"
			/>
			<p>state.news_event_dt = {{ state.news_event_dt }}</p>
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
			<Button @click.prevent="cancelForm()"> Cancel </Button>
		</FormKit>
	</div>
	<!-- </div> -->
</template>

<script setup>
	import '@formkit/themes/genesis'

	// import Editor from 'primevue/editor'

	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	const router = useRouter()

	// testing date manipulayion
	const { $dayjs } = useNuxtApp()

	const emit = defineEmits(['submitted'])

	const props = defineProps({
		id: { Number, default: 0 },
	})
	const state = reactive({})

	// edit if there is an id - add if not
	if (props.id !== 0) {
		// get user with id
		const {
			data: news_data,
			pending,
			error,
			refresh,
		} = await useFetch(`/news/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})
		state.news_id = props.id
		state.id = props.id
		state.news_title = news_data.value.news_title
		state.news_synop = news_data.value.news_synop
		state.news_article = news_data.value.news_article
		state.news_event_dt = $dayjs(news_data.value.news_event_dt).format(
			'YYYY-MM-DD HH:mm'
		)
		state.news_release_dt = news_data.value.news_release_dt.substr(0, 16)
		state.news_expire_dt = news_data.value.news_expire_dt.substr(0, 16)
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
		// adjust date -  store local time as UTC  5 hours difference
		// game time always entered relative to Buffalo NY ????
		let alteredState = state
		// alteredState.news_event_dt = $dayjs(state.news_event_dt)
		// 	.subtract(5, 'h')
		// 	.format('YYYY-MM-DDTHH:mm')
		alteredState.news_event_dt = $dayjs(state.news_event_dt)
			.tz('America/Toronto')
			.format('YYYY-MM-DDTHH:mm')
		alteredState.news_expire_dt = $dayjs(state.news_expire_dt)
			.subtract(5, 'h')
			.format('YYYY-MM-DDTHH:mm')
		alteredState.news_release_dt = $dayjs(state.news_release_dt)
			.subtract(5, 'h')
			.format('YYYY-MM-DDTHH:mm')
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/news') // needs to be / for self register
	}
</script>

<style>
	.editor {
		width: 50%;
	}
	@media screen and (max-width: 640px) {
		.editor {
			width: 100%;
		}
	}
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
