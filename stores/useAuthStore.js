import { defineStore } from 'pinia'
import { useAlertStore } from './alert'
import { userService } from '@/services'
const alert = useAlertStore()

export const useAuthStore = defineStore('auth', {
	state: () => ({ status: { loggedIn: false }, user: '' }),
	getters: {
		loggingIn: (state) => state.status.loggingIn,
		isLoggedIn: (state) => state.status.loggedIn,
	},

	actions: {
		login(username, password) {
			const alert = useAlertStore()
			this.loginRequest(username)

			userService
				.login(username, password)
				.then((user) => {
					// console.log('in Actions userService.login user= ', user)
					this.loginSuccess(user)

					// alert.clear()
					alert.success('Login successful')

					sessionStorage.removeItem('auth')
					sessionStorage.setItem('auth', JSON.stringify(user))

					// how to use router in pinia store ????
					navigateTo('/admin')
				})
				.catch(() => {
					this.loginFailure('loginFailure')
					alert.error('Login failed - try again')
				})
		},
		logout() {
			alert.clear('')
			this.status = {}
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
			this.user = user
		},
		loginFailure() {
			this.status = {}
			this.user = null
		},
		logoutt() {},
		updateRequest(user) {
			this.status = { loggingIn: true }
			this.user = user
		},
	},
})
