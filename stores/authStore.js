import { defineStore } from 'pinia'
// import { useAlertStore } from '~~/stores/alert'
// const alert = useAlertStore()
// const runtimeConfig = useRuntimeConfig() // breaks the app

export const useAuthStore = defineStore('UseAuth', {
	// state: () => ({ status: runtimeConfig.public.apiSecret }),
	state: () => ({ status: 'hello tere' }),
	getters: {
		getStatus: (state) => state.status,
	},
})
