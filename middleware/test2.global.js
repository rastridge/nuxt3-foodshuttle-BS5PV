import { useAlertStore } from '~~/stores/alertStore'
import { useAuthStore } from '~~/stores/authStore'

export default defineNuxtRouteMiddleware((from, to) => {
	const alert = useAlertStore() // this must be inside the function
	const auth = useAuthStore()
	alert.set('its working')
	console.log(
		`IN test2.global.ts to from  fullPaths= ${to.fullPath} ${
			from.fullPath
		} logged in? ${auth.isLoggedIn} equal? ${
			to.path.slice(0, 6) === '/admin' && auth.isLoggedIn
		}`
	)
	/* 	console.log(
		`IN test2.global.ts to from  now: ${to.path.slice(0, 6)} ${from.path.slice(
			0,
			6
		)} logged in? ${auth.isLoggedIn} equal? ${
			to.path.slice(0, 6) === '/admin' && auth.isLoggedIn
		}`
	)
 */
	navigateTo('/admin/accounts')

	// if (to.path.slice(0, 6) === '/admin' && auth.isLoggedIn) {
	// 	navigateTo('/admin/accounts')
	// }
})
