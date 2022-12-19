import { defineStore } from 'pinia'
import { useAlertStore } from '~~/stores/alertStore'

export const useAuthStore = defineStore('auth', {
	state: () => ({ status: { loggedIn: false }, user: {} }),
	getters: {
		loggingIn: (state) => state.status.loggingIn,
		isLoggedIn: (state) => state.status.loggedIn,
		// getToken: (state) => state.status.user.token,
		getUser: (state) => state.status.user,
	},

	actions: {
		async login(username, password) {
			// const runtimeConfig = useRuntimeConfig()
			const alert = useAlertStore()
			const router = useRouter()

			alert.clear()

			this.loginRequest(username)

			const user = await $fetch('/users/authenticate', {
				headers: {
					authorization: null,
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
			} else {
				this.loginFailure()
			}
		},

		logout() {
			const router = useRouter()
			const alert = useAlertStore()

			alert.clear()
			this.status = { loggedIn: false }
			this.user = {}
			sessionStorage.removeItem('auth')
			navigateTo('/')
		},

		loginRequest(user) {
			this.status = { loggedIn: false }
			this.user = user
			const alert = useAlertStore()
			alert.attempt('Logging in . . .')
		},
		loginSuccess(user) {
			this.status = { loggedIn: true }
			this.user = user
			sessionStorage.removeItem('auth')
			sessionStorage.setItem('auth', JSON.stringify(user))
			const router = useRouter()
			navigateTo('/admin')
			const alert = useAlertStore()
			alert.success('Login successful')
		},
		loginFailure() {
			this.status = { loggedIn: false }
			this.user = {}
			const router = useRouter()
			const alert = useAlertStore()
			alert.error('Login failed - try again')
			navigateTo('/loginpage')
		},
	},
})
