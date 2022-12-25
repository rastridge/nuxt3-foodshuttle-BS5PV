import { newsService } from '~~/server/services/newsService'

export default defineEventHandler(async (event) => {
	const runtimeConfig = useRuntimeConfig()
	const authorization = event.node.req.headers.authorization
	const secretKey = runtimeConfig.apiSecret
	console.log('IN addOne secretKey = ', secretKey)
	console.log('IN addOne authorization = ', authorization)
	const body = await readBody(event)
	return newsService.addOne(body)
})
