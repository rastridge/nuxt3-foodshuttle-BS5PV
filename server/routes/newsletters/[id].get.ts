import { newslettersService } from '~~/server/services/newslettersService'

export default defineEventHandler(async (event) => {
	const id = event.context.params.id

	console.log('got here id = ', id)
	return newslettersService.getOne(id)
})
