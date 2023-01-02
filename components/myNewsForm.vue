<template>
	<div>
		<FormKit
			type="form"
			:config="{ validationVisibility: 'live' }"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
			state.news_article {{ state.news_article }}
			<quill-editor
				contentType="html"
				:content="state.news_article"
				theme="snow"
				toolbar="full"
			></quill-editor>

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
	import '@vueup/vue-quill/dist/vue-quill.snow.css'
	import ImageUploader from 'quill-image-uploader'

	// import Editor from 'primevue/editor'

	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	// const router = useRouter()

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
	} else {
		state.news_id = ''
		state.id = ''
		state.news_title = 'testnews'
		state.title = 'testnews'
		state.news_article = 'a body of article dsfasdff'
		state.news_synop = 'adsf syop of asdff'
		state.news_event_dt = '2022-11-25 23:01'
		state.news_expire_dt = '2023-01-17 23:01'
		state.news_release_dt = '2022-01-17 23:01'

		// human: '',
	}

	// form handlers
	const submitForm = (state) => {
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
