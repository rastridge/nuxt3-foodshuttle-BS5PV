export default defineNuxtConfig({
	ssr: false,
	modules: ['@formkit/nuxt', 'nuxt-icon', '@pinia/nuxt'],

	dayjs: {
		locales: ['en'],
		defaultLocale: 'en',
		defaultTimeZone: 'America/New_York',
		plugins: ['utc', 'timezone'],
	},

	// plugins: [{ src: '~plugins/nuxt-quill', ssr: false }],
	css: [
		'primevue/resources/themes/saga-blue/theme.css',
		'primevue/resources/primevue.css',
		'primeicons/primeicons.css',
		// 'quill/dist/quill.core.css',
		// 'quill/dist/quill.snow.css',
		// 'quill/dist/quill.bubble.css',
	],

	runtimeConfig: {
		// The private keys which are only
		// available within server-side
		DB_HOST: process.env.DB_HOST,
		DB_USER: process.env.DB_USER,
		DB_PASSWORD: process.env.DB_PASSWORD,
		DB_DATABASE: process.env.DB_DATABASE,
		ONSERVER: process.server,
		ONCLIENT: process.client,
		FROM: process.env.FROM,
		FROM_NAME: process.env.FROM_NAME,
		apiSecret: process.env.API_SECRET,

		// Keys within public, will be also be
		// exposed to the client-side
		public: {},
	},
	// meta: {
	// 	charset: 'utf-8',
	// 	viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
	// 	title: 'BootStrap5',
	// },
	/*
	 */
	// imports: {
	// 	dirs: ['stores'],
	// },

	build: {
		transpile: ['primevue'],
	},
})
