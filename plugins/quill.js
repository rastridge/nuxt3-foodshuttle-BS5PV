import { defineNuxtPlugin } from '#app'
import { QuillEditor, Quill } from '@vueup/vue-quill'

// 'quill/dist/quill.core.css',
import '@vueup/vue-quill/dist/vue-quill.snow.css'
// import '@vueup/vue-quill/dist/vue-quill.bubble.css'

export default defineNuxtPlugin((nuxtapp) => {
	nuxtapp.vueApp.component('QuillEditor', QuillEditor)
})
