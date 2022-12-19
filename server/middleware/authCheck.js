import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig()
	const authorization = event.node.req.headers.authorization
	const secretKey = runtimeConfig.apiSecret
	console.log('IN authCheck middleware secretKey = ', secretKey)
	console.log('IN authCheck middleware authorization = ', authorization)

	if (authorization) {
		console.log(' IN authCheck verify jwt ')
		const ok = await jwt.verify(
			authorization,
			secretKey,
			function (err, decoded) {
				console.log(' IN authCheck err or decoded = ', err, decoded)
			}
		)
	} else {
		// no authorization
		console.log('IN authCheck middleware NO authorization')
	}
})
