import { usersService } from '~~/server/services/usersService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers
	const body = await readBody(event)

	console.log(
		'IN AUTHENTICATE POST headers ,config.public.apiSecret = ',
		headers,
		config.public.apiSecret
	)
	/* 	if (headers.authorization == config.public.apiSecret) {
		return usersService.authenticate(body)
	}	 */

	return usersService.authenticate(body)
})
