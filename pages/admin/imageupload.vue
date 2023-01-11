<template>
	<div>
		<InputText
			label="Choose file"
			type="file"
			class="p-inputtext-sm p-input-filled"
			name="photo"
			accept="image/*"
			@change="uploadFile"
		/>
		<br />
		<Button class="p-button-raised" @click="openSendModal">SweetAlert2</Button>
	</div>
</template>

<script setup>
	import Swal from 'sweetalert2'
	// import { openSaveSendModal } from '@/helpers'
	// openSaveSendModal()

	// fn is either save and send or save
	const openSendModal = (fn) => {
		Swal.fire({
			title: 'What to do?',
			showDenyButton: true,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: `Send now`,
			denyButtonText: `Send later`,
		}).then((result) => {
			if (result.isConfirmed) {
				// fn('sendNow')
				Swal.fire('Saved and Sent', '', 'success')
			} else if (result.isDenied) {
				// fn('sendLater')
				Swal.fire('Saved', '', 'success')
			} else if (result.isDismissed) {
				// this.submitStatus = ''
			}
		})
	}

	const uploadFile = async (e) => {
		const selectedFiles = e.target.files[0]
		let formData = new FormData()
		formData.append('file', selectedFiles)
		// console.log('IN imageupload formData = ', formData)

		const { data, pending } = await useFetch('/images/upload', {
			// headers: {
			// 	authorization: 'not-needed',
			// },
			method: 'POST',
			body: formData,
		})
	}
</script>

<style lang="scss" scoped>
	@import 'sweetalert2/src/sweetalert2.scss';
</style>
