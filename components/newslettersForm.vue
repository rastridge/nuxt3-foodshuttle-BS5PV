<template>
	<div class="formBox">
		<FormKit
			type="form"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
			<FormKit
				type="select"
				label="Recipient Group"
				placeholder="Select Recipient Group"
				name="newsletter_recipient_type_id"
				:options="newsletterRecipientTypeOptions"
				validation="required"
			/>

			<FormKit
				label="Newsletter subject"
				name="newsletter_subject"
				type="text"
				validation="required"
			/>
			<!-- 			<FormKit
				label="Raw newsletter_body_text"
				name="newsletter_body_text"
				type="textarea"
				v-model="state.newsletter_body_text"
			/> -->

			<div class="editor">
				<quill-editor
					ref="quillref"
					contentType="html"
					v-model:content="state.newsletter_body_html"
					toolbar="full"
					@update:content="makeChange($event)"
				></quill-editor>
			</div>
		</FormKit>
		<Button class="m-1" @click.prevent="cancelForm()"> Cancel </Button>
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'

	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	//
	// Incoming id
	//
	const props = defineProps({
		id: { Number, default: 0 },
	})
	const emit = defineEmits(['submitted'])

	//
	// Formkit initial state
	//
	const state = reactive({
		newsletter_recipient_type_id: 9,
		newsletter_id: '',
		id: '',
		newsletter_subject: '',
		title: '',
		newsletter_body_html: '',
		newsletter_body_text: '',
	})

	//
	// Editing if there is an id - Adding if not
	//
	if (props.id !== 0) {
		//
		// get newsletter data for id
		//
		const {
			data: news_data,
			pending,
			error,
			refresh,
		} = await useFetch(`/newsletters/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})
		// assign data to form
		state.newsletter_recipient_type_id = ''
		state.newsletter_id = props.id
		state.id = props.id
		state.newsletter_subject = news_data.value.newsletter_subject
		state.newsletter_body_html = news_data.value.newsletter_body_html
		state.newsletter_body_text = news_data.value.newsletter_body_text
	}
	//
	// form handlers
	//
	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/newsletters')
	}
	//
	// get newletter recipient types for Dropdown
	//
	const { data: newsletterRecipientTypes } = await useFetch(
		'/newsletters/newsletterrecipienttypes',
		{
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		}
	)
	//
	// convert for Formkit "label" "value"
	//
	const setNewsletterRecipientTypeOptions = (nltypes) => {
		let result = []
		nltypes.map((old) => {
			let n = {}
			n.label = old.newsletter_recipient_type
			n.value = old.newsletter_recipient_type_id
			result.push(n)
		})
		return result
	}
	const newsletterRecipientTypeOptions = setNewsletterRecipientTypeOptions(
		newsletterRecipientTypes.value
	)
</script>
