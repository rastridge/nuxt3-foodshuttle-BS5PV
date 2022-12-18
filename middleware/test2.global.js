import { useAlertStore } from '~~/stores/alertStore'
import { useAuthStore } from '~~/stores/authStore'
// import { useAuthStore } from '~~/stores/authStore'

export default defineNuxtRouteMiddleware(() => {
	// const test = useTestStore()
	const alert = useAlertStore() // working
	// const auth = useAuthStore() // working
	const auth = useAuthStore() // runtimeconfig breaks it
	alert.set('its working')
	// console.log(`IN test2.global.ts Test count is now: ${test.count2}`)
	console.log(`IN test2.global.ts alert message is now: ${alert.messages}`)
	console.log(`IN test2.global.ts auth status is logged in: ${auth.isLoggedIn}`)
	// console.log(`IN test2.global.ts auth status is : ${auth.getStatus}`)
})
