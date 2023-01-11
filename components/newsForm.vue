<template>
	<div class="formBox">
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
			<p>state.news_synop {{ state.news_synop }}</p>

			<FormKit
				label="Raw Article"
				name="news_article_raw"
				type="textarea"
				v-model="state.news_article"
			/>
			<p>state.news_article {{ state.news_article }}</p>
			<div class="editor">
				<quill-editor
					ref="quillref"
					contentType="html"
					v-model:content="state.news_article"
					toolbar="full"
					@update:content="update($event)"
				></quill-editor>
			</div>
			<!-- </FormKit> -->

			<FormKit
				type="datetime-local"
				label="Event Date"
				name="news_event_dt"
				validation="required"
				v-model="state.news_event_dt"
			/>

			<FormKit
				type="datetime-local"
				label="Release Date"
				name="news_release_dt"
				validation="required"
				v-model="state.news_release_dt"
			/>

			<FormKit
				type="datetime-local"
				label="Expire Date"
				name="news_expire_dt"
				validation="required"
				v-model="state.news_expire_dt"
			/>
			<Button @click.prevent="cancelForm()"> Cancel </Button>
		</FormKit>
	</div>
	<!-- </div> -->
</template>

<script setup>
	import '@formkit/themes/genesis'

	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	const { $dayjs } = useNuxtApp()
	//
	// Outgoing
	//
	const emit = defineEmits(['submitted'])
	//
	// Incoming
	//
	const props = defineProps({
		id: { Number, default: 0 },
	})

	const update = (e) => {
		console.log('e', e)
		state.news_article = e
	}
	// const quillref = ref(null)
	// const hold = ref(null)
	//
	// Initialize form
	//
	const state = reactive({
		news_id: '',
		id: '',
		news_title: '',
		title: '',
		news_article: '',
		news_synop: '',
		news_event_dt: $dayjs().format('YYYY-MM-DD HH:mm'),
		news_expire_dt: $dayjs().format('YYYY-MM-DD HH:mm'),
		news_release_dt: $dayjs().format('YYYY-MM-DD HH:mm'),
	})

	//
	// edit if there is an id - add if not
	//
	if (props.id !== 0) {
		// get user with id === props.id
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

		// Adjust for local time and Format for Primevue calendar
		state.news_event_dt = $dayjs(news_data.value.news_event_dt).format(
			'YYYY-MM-DD HH:mm'
		)
		state.news_release_dt = $dayjs(news_data.value.news_release_dt).format(
			'YYYY-MM-DD HH:mm'
		)
		state.news_expire_dt = $dayjs(news_data.value.news_expire_dt).format(
			'YYYY-MM-DD HH:mm'
		)
	}

	//
	// form handlers
	//
	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/news') // needs to be / for self register
	}
</script>
