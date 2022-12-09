import { usersService } from '~~/server/services/usersService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers
	const body = await readBody(event)

	if (headers.authorization == config.apiSecret) {
		return usersService.resetRequest(body)
	}
})
