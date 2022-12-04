import { defineStore } from 'pinia'
export const useAlertStore = defineStore('alert', {
	state: () => ({
		type: null,
		message: '',
	}),
	getters: {
		messages: (state) => state.message,
		types: (state) => state.type,
	},

	actions: {
		success(message) {
			this.type = 'alert-success'
			this.message = message
			alert(this.type + ' ' + this.message)
		},
		error(message) {
			this.type = 'alert-danger'
			this.message = message
		},
		clear() {
			this.type = null
			this.message = null
		},
	},
})
