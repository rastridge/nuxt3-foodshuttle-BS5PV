import { accountsService } from '~~/server/services/accountsService'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const headers = event.req.headers
	const body = await readBody(event)
	if (headers.authorization == config.apiSecret) {
		console.log('IN status.post body = ', body)
		return accountsService.changeStatus(body)
	}
})
