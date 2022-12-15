import { usersService } from '~~/server/services/usersService'

export default defineEventHandler((event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers

	if (headers.authorization == config.public.apiSecret) {
		const a = usersService.getAll()
		return a
	} else {
		return []
	}
})
