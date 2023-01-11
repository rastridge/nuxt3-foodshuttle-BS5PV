import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
const CONFIG = useRuntimeConfig()

export const imageService = {
	upLoad,
}

async function upLoad(req) {
	// console.log('IN upLoad 1 req = ', req)
	let imageUrl = ''
	let oldPath = ''
	let newPath = ''

	const form = formidable({ multiples: true })

	// console.log('IN upLoad 2 req.headers ', req.headers)
	console.log('IN upLoad 2 req.file ', req.file)

	const data = await new Promise((resolve, reject) => {
		// console.log('IN upLoad 2 req ', req)
		resolve({
			status: 'error',
			message: 'Please upload a photo with name photo in the form',
		})
		// form.parse causes error - or is "reqs" the problem???
		/*  
		form.parse(req, (err, fields, files) => {
			console.log('IN upLoad 3 ')

			// resolve({
			// 	status: 'error',
			// 	message: 'Please upload a photo with name photo in the form',
			// })

			if (err) {
				reject(err)
			}
			if (!files.photo) {
				resolve({
					status: 'error',
					message: 'Please upload a photo with name photo in the form',
				})
			}

			if (files.photo.mimetype.startsWith('image/')) {
				let imageName =
					Date.now() +
					Math.round(Math.random() * 100000) +
					files.photo.originalFilename
				oldPath = files.photo.filepath
				newPath = `${path.join('public', 'uploads', imageName)}`
				imageUrl = './public/upload/' + imageName

				console.log('IN upLoad 4 ', imageUrl, oldPath, newPath)

				fs.copyFileSync(oldPath, newPath)
				resolve({
					status: 'ok',
					url: imageUrl,
				})
			} else {
				resolve({
					status: 'error',
					message: 'Please upload nothing but images.',
				})
			}
		})
*/
	})

	return data
}
