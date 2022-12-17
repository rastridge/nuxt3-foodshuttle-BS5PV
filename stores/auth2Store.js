import { defineStore } from 'pinia'
// import { useAlertStore } from './alert'
// const alert = useAlertStore()
const runtimeConfig = useRuntimeConfig()

export const useAuth2Store = defineStore('useAuth2', {
	state: () => ({ status: { loggedIn: false }, user: {} }),
	getters: {
		// loggingIn: (state) => state.status.loggingIn,
		isLoggedIn: (state) => state.status.loggedIn,
	},

	actions: {
		async login(username, password) {
			this.loginRequest(username)

			const user = await $fetch('/users/authenticate', {
				headers: {
					authorization: runtimeConfig.public.apiSecret,
				},
				method: 'POST',
				body: { username, password },
			})

			// const { admin_user_name, match } = user
			// console.log(
			// 	'IN Actions userService.login  admin_user_name, match = ',
			// 	admin_user_name,
			// 	match
			// )
			// console.log('IN Actions userService.login user.match = ', user.match)

			if (user.match) {
				// console.log('IN Actions userService.login user is true')
				this.loginSuccess(user)

				// alert.clear()
				// alert.success('Login successful')

				sessionStorage.removeItem('auth')
				sessionStorage.setItem('auth', JSON.stringify(user))

				// how to use router in pinia store ????
				navigateTo('/admin')
			} else {
				this.loginFailure()
				// alert.error('Login failed - try again')
			}
		},

		logout() {
			// alert.clear()
			this.status = { loggedIn: false }
			this.user = {}
			sessionStorage.removeItem('auth')
			navigateTo('/')
		},

		loginRequest(user) {
			// this.status = { loggingIn: true }
			this.status = { loggedIn: false }
			this.user = user
		},
		loginSuccess(user) {
			this.status = { loggedIn: true }
			this.user = user
		},
		loginFailure() {
			this.status = { loggedIn: false }
			this.user = {}
		},
	},
})
