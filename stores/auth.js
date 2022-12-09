import { defineStore } from 'pinia'
import { useAlertStore } from './alert'
const alert = useAlertStore()
// import { userService } from '@/services'
const runtimeConfig = useRuntimeConfig()

export const useAuthStore = defineStore('auth', {
	state: () => ({ status: { loggedIn: false }, user: {} }),
	getters: {
		loggingIn: (state) => state.status.loggingIn,
		isLoggedIn: (state) => state.status.loggedIn,
	},

	actions: {
		async login(username, password) {
			this.loginRequest(username)
			const { data: user, error } = await useFetch('/users/authenticate', {
				method: 'POST',
				body: { username, password },
				headers: {
					firebaseapikey: runtimeConfig.apiSecret,
				},
			})

			console.log('IN Actions userService.login user= ', user)

			// userService.login(username, password).then((user) => {
			// if (user.found == 'none') {
			if (user) {
				console.log('================== got here user is true')
				this.loginSuccess(user)

				alert.clear()
				alert.success('Login successful')

				sessionStorage.removeItem('auth')
				sessionStorage.setItem('auth', JSON.stringify(user))

				// how to use router in pinia store ????
				navigateTo('/admin')
			} else {
				this.loginFailure('loginFailure')
				alert.error('Login failed - try again')
			}
			// })
		},

		logout() {
			alert.clear('')
			this.status = { loggedIn: false }
			this.user = null
			sessionStorage.removeItem('auth')
			navigateTo('/')
		},

		loginRequest(user) {
			this.status = { loggingIn: true }
			this.user = user
		},
		loginSuccess(user) {
			this.status = { loggedIn: true }
			// this.user = user
		},
		loginFailure() {
			this.status = {}
			this.user = null
		},
	},
})
