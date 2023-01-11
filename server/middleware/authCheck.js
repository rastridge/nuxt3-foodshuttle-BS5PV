import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig()

	const authorization = event.node.req.headers.authorization
	const secretKey = runtimeConfig.apiSecret
	const url = event.node.req.url
	const securedRoutes = [
		'/__nuxt_error?url=',
		'/accounts',
		'/users',
		'/news',
		'/newsletters',
	]
	const api = url.slice(url.indexOf('/'), url.lastIndexOf('/'))
	const isNuxt_error = api.search('/__nuxt_error') >= 0 ? true : false
	const isSecuredRoute = securedRoutes.includes(api)

	console.log('secretKey = ', secretKey)
	console.log('authorization = ', authorization)
	console.log('request url: ', url)
	console.log('isSecuredRoute = ', isSecuredRoute)
	console.log('isNuxt_error = ', isNuxt_error)

	if (isSecuredRoute && authorization !== 'not-needed' && !isNuxt_error) {
		await jwt.verify(authorization, secretKey, function (err, decoded) {
			// await jwt.verify(authorization, 'fsdfsd', function (err, decoded) {
			console.log('err or decoded = ', err, decoded)
			if (err) {
				throw createError({
					statusCode: 500,
					statusMessage: err,
				})
			}
		})
	}
	console.log('ALLOWED')
})
