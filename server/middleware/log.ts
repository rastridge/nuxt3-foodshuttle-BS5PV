export default defineEventHandler((event) => {
	console.log('==================================')
	console.log('New request: ' + event.node.req.url)
})
