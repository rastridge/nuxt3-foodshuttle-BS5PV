export default defineNuxtConfig({
	ssr: false,
	modules: ['@formkit/nuxt', 'bootstrap-vue-3/nuxt', 'nuxt-icon'],
	css: [
		'bootstrap/dist/css/bootstrap.css',
		'primevue/resources/themes/saga-blue/theme.css',
		'primevue/resources/primevue.css',
		'primeicons/primeicons.css',
	],

	runtimeConfig: {
		// The private keys which are only
		// available within server-side
		apiSecret: process.env.API_SECRET,
		DB_HOST: process.env.DB_HOST,
		DB_USER: process.env.DB_USER,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_DATABASE: process.env.DB_DATABASE,
		ONSERVER: process.server,
		ONCLIENT: process.client,
		// Keys within public, will be also be
		// exposed to the client-side
		public: {
			firebaseApiKey: process.env.FIREBASE_API_KEY,
		},
	},
	// meta: {
	// 	charset: 'utf-8',
	// 	viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
	// 	title: 'BootStrap5',
	// },
	/*
	 */

	build: {
		transpile: ['primevue'],
	},
})
