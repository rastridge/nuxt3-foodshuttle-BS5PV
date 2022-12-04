import { usersService } from '~~/server/services/usersService'

export default defineEventHandler((event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers

	if (headers.authorization == config.apiSecret) {
		const a = usersService.getApps()
		return a
	} else {
		return []
	}
})
