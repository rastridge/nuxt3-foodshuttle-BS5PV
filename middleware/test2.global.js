import { useAlertStore } from '~~/stores/alertStore'
import { useAuthStore } from '~~/stores/authStore'

export default defineNuxtRouteMiddleware((from, to) => {
	const alert = useAlertStore() // this must be inside the function
	const auth = useAuthStore()
	console.log(
		`IN test2.global.ts to from  fullPath = ${to.fullPath} ${from.fullPath} `
	)

	console.log(
		'IN test2.global.ts /admin is ',
		to.path.slice(0, 6) === '/admin',
		' session = ',
		JSON.parse(sessionStorage.getItem('auth')),
		' auth.isLoggedIn = ',
		auth.isLoggedIn,
		' boolean result = ',
		to.path.slice(0, 6) === '/admin' &&
			JSON.parse(sessionStorage.getItem('auth')) &&
			!auth.user
	)

	if (
		to.path.slice(0, 6) === '/admin' &&
		JSON.parse(sessionStorage.getItem('auth')) &&
		!auth.isLoggedIn
	) {
		console.log('restore authStore after refresh?')
		auth.user = JSON.parse(sessionStorage.getItem('auth'))
	}
})
