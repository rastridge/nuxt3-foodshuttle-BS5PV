import jwt from 'jsonwebtoken'
export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig()
	if (event.node.req.headers.authorization) {
		console.log(
			' IN authCheck middleware event.node.headers.authorization ',
			event.node.req.headers.authorization
		)
		// const ok = await jwt.verify(
		// 	event.node.headers.authentication,
		// 	runtimeConfig.apiSecret
		// )
		// console.log(' IN authCheck middleware ok = ', ok)
	} else {
		// no authorization
		console.log('IN authCheck middleware no authorization')
	}
})
