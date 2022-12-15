import { accountsService } from '~~/server/services/accountsService'

export default defineEventHandler((event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers

	if (headers.authorization == config.public.apiSecret) {
		const a = accountsService.getMemberAdminTypes()
		return a
	} else {
		return []
	}
})
