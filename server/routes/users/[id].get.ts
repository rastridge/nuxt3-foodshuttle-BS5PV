import { usersService } from '~~/server/services/usersService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers
	console.log('in get')
	const url = event.req.url
	const id = event.context.params.id
	if (headers.authorization == config.apiSecret) {
		return usersService.getOne(id)
	} else {
		return []
	}
})
