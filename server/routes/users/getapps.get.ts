import { usersService } from '~~/server/services/usersService'
const config = useRuntimeConfig()

export default defineEventHandler((event) => {
	const headers = event.req.headers
	if (headers.authorization === config.public.apiSecret) {
		const apps = usersService.getApps()
		return apps
	}
})
