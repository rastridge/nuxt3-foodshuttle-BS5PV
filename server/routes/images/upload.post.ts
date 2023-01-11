import { imageService } from '~~/server/services/imageService'
export default defineEventHandler(async (event) => {
	const body = await readBody(event)
	const { req } = event.node

	// console.log('IN upload.post eventhandler event.node.req.headers = ', headers)
	// return body
	// return 'got here'
	return imageService.upLoad(req)
})
